const {
  MOTION_PREVIEW_SETTING_IDS,
} = require('./customizer-motion-preview-state.js');

function attachMotionPreviewSync(customizeApi, onChange) {
  if (typeof customizeApi !== 'function' || typeof onChange !== 'function') {
    return;
  }

  if (typeof customizeApi.section === 'function') {
    customizeApi.section('sm_motion_section', (section) => {
      if (!section || !section.expanded) {
        return;
      }

      onChange({
        type: 'section',
        value: section.expanded.get(),
      });

      section.expanded.bind((value) => {
        onChange({
          type: 'section',
          value,
        });
      });
    });
  }

  MOTION_PREVIEW_SETTING_IDS.forEach((settingId) => {
    customizeApi(settingId, (setting) => {
      onChange({
        type: 'setting',
        id: settingId,
        value: setting.get(),
      });

      setting.bind((value) => {
        onChange({
          type: 'setting',
          id: settingId,
          value,
        });
      });
    });
  });
}

module.exports = {
  MOTION_PREVIEW_SETTING_IDS,
  attachMotionPreviewSync,
};
