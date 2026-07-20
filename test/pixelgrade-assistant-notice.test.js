const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');

const noticeSource = fs.readFileSync(
  path.join(__dirname, '../inc/admin/assistant-notice/notice.js'),
  'utf8'
);

function createElement({width = 240} = {}) {
  const classes = new Set();
  const handlers = new Map();
  let html = '';

  return {
    0: {
      getBoundingClientRect() {
        return {left: 0, right: width};
      },
    },
    length: 1,
    addClass(className) {
      classes.add(className);
      return this;
    },
    css() {
      return this;
    },
    find() {
      return createEmptyElement();
    },
    html(value) {
      if (typeof value === 'undefined') {
        return html;
      }

      html = value;
      return this;
    },
    on(eventName, selectorOrHandler, handler) {
      handlers.set(eventName, handler || selectorOrHandler);
      return this;
    },
    parent() {
      return {
        width() {
          return width;
        },
      };
    },
    prop() {
      return this;
    },
    removeClass(classNames) {
      classNames.split(' ').forEach((className) => classes.delete(className));
      return this;
    },
    trigger(eventName) {
      handlers.get(eventName)?.();
    },
    val() {
      return '';
    },
  };
}

function createEmptyElement() {
  const element = createElement();
  element.length = 0;
  return element;
}

function createRequest() {
  const callbacks = {
    always: [],
    done: [],
    fail: [],
  };

  return {
    always(callback) {
      callbacks.always.push(callback);
      return this;
    },
    done(callback) {
      callbacks.done.push(callback);
      return this;
    },
    fail(callback) {
      callbacks.fail.push(callback);
      return this;
    },
    resolve(response) {
      callbacks.done.forEach((callback) => callback(response));
      callbacks.always.forEach((callback) => callback(response));
    },
    reject(response) {
      callbacks.fail.forEach((callback) => callback(response));
      callbacks.always.forEach((callback) => callback(response));
    },
  };
}

function createHarness({
  activationSucceeds = true,
  initialLock = false,
  status: pluginStatus = 'missing',
  supportsAjaxActivation = true,
} = {}) {
  const button = createElement();
  const text = createElement();
  const status = createElement();
  const container = createElement();
  const activationRequests = [];
  const installRequests = [];
  const postRequests = [];
  const timers = [];
  let activeInstall;

  container.find = function (selector) {
    if (selector === '.js-handle-pixassist') {
      return button;
    }
    if (selector === '.pixassist-notice-button__text') {
      return text;
    }
    if (selector === '.js-plugin-message') {
      return status;
    }

    return createEmptyElement();
  };

  function jQuery(argument) {
    if (typeof argument === 'function') {
      argument();
      return undefined;
    }
    if (argument === '.pixassist-notice__container') {
      return container;
    }

    return createEmptyElement();
  }

  jQuery.ajax = function () {};
  jQuery.post = function (url, data) {
    postRequests.push({url, data});
    return createRequest();
  };

  const updates = {
    ajaxLocked: initialLock,
    ajaxNonce: 'updates-nonce',
    queue: [],
    installPlugin(options) {
      if (updates.ajaxLocked) {
        updates.queue.push({action: 'install-plugin', data: options});
        return createRequest();
      }

      const request = createRequest();
      updates.ajaxLocked = true;
      activeInstall = {options, request};
      installRequests.push(options);
      return request;
    },
  };

  if (supportsAjaxActivation) {
    updates.activatePlugin = function (options) {
      if (updates.ajaxLocked) {
        updates.queue.push({action: 'activate-plugin', data: options});
        return createRequest();
      }

      activationRequests.push(options);
      updates.ajaxLocked = true;

      const response = {
        plugin: 'pixelgrade-assistant/pixelgrade-assistant.php',
        pluginName: 'Pixelgrade Assistant',
        slug: 'pixelgrade-assistant',
      };

      if (activationSucceeds) {
        options.success(response);
      } else {
        options.error({
          errorCode: 'activation_failed',
          errorMessage: 'The plugin could not be activated.',
          ...response,
        });
      }

      updates.ajaxLocked = false;
      return createRequest();
    };
  }

  const wp = {
    a11y: {
      speak() {},
    },
    updates,
  };
  const window = {
    ajaxurl: '/wp-admin/admin-ajax.php',
    location: {href: ''},
    pixassistNotice: {
      i18n: {
        btnActivating: 'Activating Pixelgrade Assistant...',
        btnError: 'Something went wrong',
        btnInstalling: 'Installing Pixelgrade Assistant...',
        btnOpeningSetup: 'Opening setup...',
        error: 'Please reload and try again.',
        installedSuccessfully: 'Pixelgrade Assistant installed successfully.',
        redirectingToSetup: 'Redirecting to setup.',
      },
      name: 'Pixelgrade Assistant',
      plugin: 'pixelgrade-assistant/pixelgrade-assistant.php',
      activateUrl: '/wp-admin/plugins.php?action=activate&plugin=pixelgrade-assistant%2Fpixelgrade-assistant.php&_wpnonce=legacy',
      setupUrl: '/wp-admin/admin.php?page=pixelgrade_assistant_setup',
      slug: 'pixelgrade-assistant',
      status: pluginStatus,
    },
    wp,
  };

  vm.runInNewContext(noticeSource, {
    jQuery,
    setTimeout(callback, delay) {
      timers.push({callback, delay});
      return timers.length;
    },
    window,
    wp,
  });

  function runQueueChecker() {
    if (updates.ajaxLocked || !updates.queue.length) {
      return;
    }

    const job = updates.queue.shift();

    if (job.action === 'install-plugin') {
      updates.installPlugin(job.data);
    } else if (job.action === 'update-plugin') {
      updates.ajaxLocked = true;
    }
    // WordPress core drops unsupported queue actions such as activate-plugin.
  }

  function finishInstall(response, succeeded) {
    if (!activeInstall) {
      throw new Error('No active install request to settle.');
    }

    const {options, request} = activeInstall;
    activeInstall = undefined;

    if (succeeded) {
      options.success(response);
    } else {
      options.error(response);
    }

    // This mirrors wp.updates.ajaxAlways(): unlock, synchronously start the
    // next supported queue job, then let later promise callbacks run.
    updates.ajaxLocked = false;
    runQueueChecker();

    if (succeeded) {
      request.resolve(response);
    } else {
      request.reject(response);
    }
  }

  return {
    activationRequests,
    button,
    flushTimers() {
      let remainingSafetyChecks = 1000;

      while (timers.length && remainingSafetyChecks > 0) {
        timers.shift().callback();
        remainingSafetyChecks -= 1;
      }

      if (remainingSafetyChecks === 0) {
        throw new Error('Timer queue did not settle.');
      }
    },
    installRequests,
    postRequests,
    queueUpdate() {
      updates.queue.push({action: 'update-plugin', data: {slug: 'another-plugin'}});
    },
    releaseCoreUpdate() {
      updates.ajaxLocked = false;
      runQueueChecker();
    },
    settleInstallWithError(response) {
      finishInstall(response, false);
    },
    settleInstallWithSuccess(response) {
      finishInstall(response, true);
    },
    text,
    updates,
    window,
  };
}

test('continues from a successful first-run install to activation after WordPress releases its update lock', () => {
  const harness = createHarness();

  harness.button.trigger('click');
  harness.settleInstallWithSuccess({
    activateUrl: '/wp-admin/plugins.php?action=activate&plugin=pixelgrade-assistant',
    pluginName: 'Pixelgrade Assistant',
    slug: 'pixelgrade-assistant',
  });

  assert.equal(harness.activationRequests.length, 1);
  assert.equal(harness.text.html(), 'Opening setup...');
});

test('continues to activation when installation reports that the plugin folder already exists', () => {
  const harness = createHarness();

  harness.button.trigger('click');
  harness.settleInstallWithError({
    errorCode: 'folder_exists',
    errorMessage: 'Destination folder already exists.',
    slug: 'pixelgrade-assistant',
  });

  assert.equal(harness.activationRequests.length, 1);
  assert.equal(harness.text.html(), 'Opening setup...');
});

test('waits to install when another WordPress update request already holds the lock', () => {
  const harness = createHarness({initialLock: true});

  harness.button.trigger('click');
  harness.releaseCoreUpdate();
  harness.flushTimers();
  harness.settleInstallWithSuccess({
    activateUrl: '/wp-admin/plugins.php?action=activate&plugin=pixelgrade-assistant',
    pluginName: 'Pixelgrade Assistant',
    slug: 'pixelgrade-assistant',
  });
  harness.flushTimers();

  assert.equal(harness.installRequests.length, 1);
  assert.equal(harness.activationRequests.length, 1);
});

test('shows a terminal error state when the WordPress update queue never becomes idle', () => {
  const harness = createHarness({initialLock: true});

  harness.button.trigger('click');
  harness.flushTimers();

  assert.equal(harness.installRequests.length, 0);
  assert.equal(harness.text.html(), 'Something went wrong');
});

test('waits to activate when a queued update starts as the install request unlocks', () => {
  const harness = createHarness();

  harness.button.trigger('click');
  harness.queueUpdate();
  harness.settleInstallWithSuccess({
    activateUrl: '/wp-admin/plugins.php?action=activate&plugin=pixelgrade-assistant',
    pluginName: 'Pixelgrade Assistant',
    slug: 'pixelgrade-assistant',
  });

  assert.equal(harness.activationRequests.length, 0);

  harness.releaseCoreUpdate();
  harness.flushTimers();

  assert.equal(harness.activationRequests.length, 1);
});

test('uses the nonce-protected activation URL on WordPress versions without AJAX activation', () => {
  const harness = createHarness({
    status: 'installed',
    supportsAjaxActivation: false,
  });

  harness.button.trigger('click');

  assert.equal(harness.postRequests.length, 0);
  assert.equal(
    harness.window.location.href,
    '/wp-admin/plugins.php?action=activate&plugin=pixelgrade-assistant%2Fpixelgrade-assistant.php&_wpnonce=legacy'
  );
});

test('uses the install response activation URL for a first-run install on legacy WordPress', () => {
  const harness = createHarness({supportsAjaxActivation: false});

  harness.button.trigger('click');
  harness.settleInstallWithSuccess({
    activateUrl: '/wp-admin/plugins.php?action=activate&plugin=pixelgrade-assistant&_wpnonce=install-response',
    pluginName: 'Pixelgrade Assistant',
    slug: 'pixelgrade-assistant',
  });

  assert.equal(
    harness.window.location.href,
    '/wp-admin/plugins.php?action=activate&plugin=pixelgrade-assistant&_wpnonce=install-response'
  );
});

test('shows a terminal error state when plugin installation fails', () => {
  const harness = createHarness();

  harness.button.trigger('click');
  harness.settleInstallWithError({
    errorCode: 'download_failed',
    errorMessage: 'The plugin package could not be downloaded.',
    slug: 'pixelgrade-assistant',
  });

  assert.equal(harness.activationRequests.length, 0);
  assert.equal(harness.text.html(), 'Something went wrong');
});

test('shows a terminal error state when plugin activation fails', () => {
  const harness = createHarness({
    activationSucceeds: false,
    status: 'installed',
  });

  harness.button.trigger('click');

  assert.equal(harness.activationRequests.length, 1);
  assert.equal(harness.text.html(), 'Something went wrong');
});
