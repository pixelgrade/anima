function getMotionControl(customizeApi, controlId) {
  if (!customizeApi || typeof customizeApi.control !== 'function') {
    return null;
  }

  return customizeApi.control(`${controlId}_control`) || customizeApi.control(controlId) || null;
}

module.exports = {
  getMotionControl,
};
