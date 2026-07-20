/**
 * Pixelgrade Assistant install notice.
 *
 * Drives install + activate of the WordPress.org-hosted `pixelgrade-assistant`
 * plugin through WordPress core (`wp.updates`). No TGMPA, no HTML scraping, and
 * no remote endpoints — the exact same flow works for both the commercial and
 * the WordPress.org build of the theme.
 */
(function ($) {
  $(function () {
    var data = window.pixassistNotice || {}
    var i18n = data.i18n || {}

    var $noticeContainer = $('.pixassist-notice__container')
    var $button = $noticeContainer.find('.js-handle-pixassist')
    var $text = $noticeContainer.find('.pixassist-notice-button__text')
    var $status = $noticeContainer.find('.js-plugin-message')
    var updatesIdlePollDelay = 100
    var updatesIdleMaxAttempts = 300

    if (!$button.length) {
      return
    }

    // Lock the button width so the loading states don't make it jump around.
    var buttonBox = $button[0].getBoundingClientRect()
    $button.css('width', buttonBox.right - buttonBox.left)

    function setButtonState (state) {
      $button
        .removeClass('state--plugin-installing state--plugin-activating state--plugin-redirecting state--plugin-invalidated state--error')
        .css('width', $button.parent().width())
      if (state) {
        $button.addClass(state)
      }
    }

    function speak (message) {
      if (window.wp && wp.a11y && typeof wp.a11y.speak === 'function') {
        wp.a11y.speak(message)
      }
    }

    function setLabel (message) {
      $text.html(message)
      speak(message)
    }

    function goToSetup () {
      setLabel(i18n.btnOpeningSetup)
      speak(i18n.redirectingToSetup)
      setButtonState('state--plugin-redirecting')
      $button.prop('disabled', true)
      setTimeout(function () {
        window.location.href = data.setupUrl
      }, 1200)
    }

    function fail () {
      setButtonState('state--plugin-invalidated')
      setLabel(i18n.btnError)
      $status.html(i18n.error)
      $button.prop('disabled', true)
    }

    function runWhenUpdatesIdle (callback, remainingAttempts) {
      var updates = window.wp && wp.updates
      var hasQueuedUpdates = updates && updates.queue && updates.queue.length

      if (!updates || (!updates.ajaxLocked && !hasQueuedUpdates)) {
        callback()
        return
      }

      if (remainingAttempts <= 0) {
        fail()
        return
      }

      setTimeout(function () {
        runWhenUpdatesIdle(callback, remainingAttempts - 1)
      }, updatesIdlePollDelay)
    }

    function whenUpdatesIdle (callback) {
      runWhenUpdatesIdle(callback, updatesIdleMaxAttempts)
    }

    function activatePlugin (activateUrl) {
      setLabel(i18n.btnActivating)
      setButtonState('state--plugin-activating')
      $button.prop('disabled', true)

      whenUpdatesIdle(function () {
        // AJAX activation landed in WordPress 6.5. Use the nonce-protected
        // plugins.php activation URL on older supported WordPress versions.
        if (window.wp && wp.updates && typeof wp.updates.activatePlugin === 'function') {
          wp.updates.activatePlugin({
            // Core's activate-plugin AJAX handler requires name + slug + plugin.
            name: data.name,
            plugin: data.plugin,
            slug: data.slug,
            success: function () {
              // "Plugin is already active" is reported as success by core.
              goToSetup()
            },
            error: function (response) {
              // Already-active plugins surface as an error in some flows; treat as success.
              if (response && response.errorMessage && /already active/i.test(response.errorMessage)) {
                goToSetup()
                return
              }
              fail()
            }
          })
          return
        }

        if (activateUrl) {
          window.location.href = activateUrl
          return
        }

        fail()
      })
    }

    $button.on('click', function () {
      var status = data.status

      if (status === 'active') {
        goToSetup()
        return
      }

      if (status === 'installed') {
        activatePlugin(data.activateUrl)
        return
      }

      // status === 'missing' → install, then activate.
      if (!window.wp || !wp.updates || typeof wp.updates.installPlugin !== 'function') {
        fail()
        return
      }

      setLabel(i18n.btnInstalling)
      setButtonState('state--plugin-installing')
      $button.prop('disabled', true)

      whenUpdatesIdle(function () {
        var shouldActivate = false
        var activateUrl = data.activateUrl

        // Keep the outcome callbacks focused on the install result. Activation
        // must wait for core's ajaxAlways callback to release the updates lock;
        // otherwise core queues and silently drops the activate-plugin job.
        var installRequest = wp.updates.installPlugin({
          slug: data.slug,
          success: function (response) {
            speak(i18n.installedSuccessfully)
            shouldActivate = true
            activateUrl = (response && response.activateUrl) || activateUrl
          },
          error: function (response) {
            // "Destination folder already exists" means the plugin files are
            // there; we can move straight to activation.
            if (response && response.errorCode === 'folder_exists') {
              shouldActivate = true
              return
            }
            fail()
          }
        })

        // wp.updates.ajax() registers its queue handler before returning this
        // promise. activatePlugin() then waits if that handler starts another job.
        installRequest.always(function () {
          if (shouldActivate) {
            activatePlugin(activateUrl)
          }
        })
      })
    })

    // Dismiss via the core dismiss icon.
    $noticeContainer.on('click', '.notice-dismiss', function () {
      $.ajax({
        url: window.ajaxurl,
        type: 'post',
        data: {
          action: 'pixassist_install_dismiss_admin_notice',
          nonce_dismiss: $noticeContainer.find('#nonce-pixassist_install-dismiss').val()
        }
      })
    })
  })
})(jQuery)
