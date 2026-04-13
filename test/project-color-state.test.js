const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getProjectColorDescription,
  shouldAutoSuggestProjectColor,
  shouldRefreshAutoProjectColor,
} = require('../src/js/admin/project-color-state.js');

test('project color description reflects supported accents when contextual entry colors are enabled', () => {
  assert.equal(
    getProjectColorDescription(true),
    'Color used for supported reading and transition accents.'
  );
});

test('project color description explains the global Tweak Board dependency when contextual entry colors are disabled', () => {
  assert.equal(
    getProjectColorDescription(false),
    'Contextual entry colors are disabled in Tweak Board. Saved colors will stay here until you enable the feature.'
  );
});

test('project color auto-suggestion only runs when the feature is enabled and no color exists yet', () => {
  assert.equal(
    shouldAutoSuggestProjectColor({
      isEnabled: true,
      manualColor: '',
      autoColor: '',
      featuredImageId: 42,
    }),
    true
  );

  assert.equal(
    shouldAutoSuggestProjectColor({
      isEnabled: false,
      manualColor: '',
      autoColor: '',
      featuredImageId: 42,
    }),
    false
  );
});

test('featured-image auto refresh is suppressed when contextual entry colors are disabled', () => {
  assert.equal(
    shouldRefreshAutoProjectColor({
      isEnabled: false,
      manualColor: '',
      featuredImageId: 24,
      previousFeaturedImageId: 12,
    }),
    false
  );

  assert.equal(
    shouldRefreshAutoProjectColor({
      isEnabled: true,
      manualColor: '',
      featuredImageId: 24,
      previousFeaturedImageId: 12,
    }),
    true
  );
});
