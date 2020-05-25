(function ($) {
  $(function () {
    var temp_url = wp.ajax.settings.url,
      $noticeContainer = $('.pixcare-notice__container'),
      $button = $noticeContainer.find('.js-handle-pixcare'),
      $text = $noticeContainer.find('.pixcare-notice-button__text'),
      $status = $noticeContainer.find('.js-plugin-message'),
      buttonBox

    if ($button.length) {
      buttonBox = $button[0].getBoundingClientRect()
      $button.css('width', buttonBox.right - buttonBox.left)
    }

    $button.on('click', function () {
      let installedSuccessfully = -1,
        activatedSuccessfully = -1,
        activatedAlready = -1,
        noActionTaken = -1,
        folderAlreadyExists = -1

      /*
       * We need to determine what to do first, install, activate, or start the setup.
       */
      if (pixcareNotice.status === 'missing') {
        $text.html(pixcareNotice.i18n.btnInstalling)
        wp.ajax.settings.url = pixcareNotice.installUrl

        // Put the button in a loading state
        $button.css('width', $button.parent().width())
        $button.addClass('state--plugin-installing').prop('disabled', true)
      } else if (pixcareNotice.status === 'installed') {
        $text.html(pixcareNotice.i18n.btnActivating)
        wp.ajax.settings.url = pixcareNotice.activateUrl

        // Put the button in a loading state
        $button.css('width', $button.parent().width())
        $button.addClass('state--plugin-activating').prop('disabled', true)
      } else if (pixcareNotice.status === 'active') {
        $text.html(pixcareNotice.i18n.btnOpeningSetup)

        // Put the button in a loading state
        $button.css('width', $button.parent().width())
        $button.addClass('state--plugin-redirecting').prop('disabled', true)
        setTimeout(function () {
          window.location.href = pixcareNotice.pixcareSetupUrl
        }, 1000)
        return
      }

      wp.a11y.speak($text.html())

      wp.ajax.send({type: 'GET'}).always(function (response) {
        installedSuccessfully = -1
        activatedSuccessfully = -1
        activatedAlready = -1
        noActionTaken = -1
        folderAlreadyExists = -1

        if (typeof response === 'string') {
          installedSuccessfully = response.indexOf('<p>' + pixcareNotice.i18n.installedSuccessfully + '</p>')
          activatedSuccessfully = response.indexOf('<div id="message" class="updated"><p>')
          noActionTaken = response.indexOf('<div id="message" class="error"><p>No action taken.')
          folderAlreadyExists = response.indexOf('<p>' + pixcareNotice.i18n.folderAlreadyExists + '</p>')
        }

        if (installedSuccessfully !== -1) {
          wp.a11y.speak(pixcareNotice.i18n.installedSuccessfully)

          /*
           * We need to activate the plugin
           */

          $text.html(pixcareNotice.i18n.btnActivating)
          wp.a11y.speak(pixcareNotice.i18n.btnActivating)

          wp.ajax.settings.url = pixcareNotice.activateUrl

          $button.removeClass('state--plugin-installing').addClass('state--plugin-activating')

          wp.ajax.send({type: 'GET'}).always(function (response) {
            activatedSuccessfully = -1
            noActionTaken = -1

            if (typeof response === 'string') {
              activatedSuccessfully = response.indexOf('<div id="message" class="updated"><p>')
              noActionTaken = response.indexOf('<div id="message" class="error"><p>No action taken.')
            }

            if (activatedSuccessfully !== -1 || noActionTaken !== -1) {
              wp.a11y.speak(pixcareNotice.i18n.activatedSuccessfully)

              $text.html(pixcareNotice.i18n.btnRedirectingToSetup)
              wp.a11y.speak(pixcareNotice.i18n.redirectingToSetup)

              $button.removeClass('state--plugin-activating').addClass('state--plugin-redirecting')

              setTimeout(function () {
                window.location.href = pixcareNotice.pixcareSetupUrl
              }, 2000)
            } else {
              $button.removeClass('state--plugin-activating').addClass('state--plugin-invalidated')
              $text.html(pixcareNotice.i18n.btnError)

              $status.html(pixcareNotice.i18n.error)

              wp.a11y.speak(pixcareNotice.i18n.error)
            }

            wp.ajax.settings.url = temp_url
          })

        } else if (folderAlreadyExists !== -1 || activatedSuccessfully !== -1 || noActionTaken !== -1) {
          wp.a11y.speak(pixcareNotice.i18n.activatedSuccessfully)

          $text.html(pixcareNotice.i18n.btnRedirectingToSetup)
          wp.a11y.speak(pixcareNotice.i18n.redirectingToSetup)
          setTimeout(function () {
            window.location.href = pixcareNotice.pixcareSetupUrl
          }, 2000)
        } else {
          $button.removeClass('state--plugin-activating').addClass('state--plugin-invalidated')
          $text.html(pixcareNotice.i18n.btnError)

          $status.html(pixcareNotice.i18n.error)

          wp.a11y.speak(pixcareNotice.i18n.error)
        }

        wp.ajax.settings.url = temp_url
      })
      wp.ajax.settings.url = temp_url
    })

    // Send ajax on click of dismiss icon
    $noticeContainer.on('click', '.notice-dismiss', function () {
      ajaxDismiss($(this))
    })

    // Send ajax
    function ajaxDismiss (dismissElement) {
      $.ajax({
        url: pixcareNotice.ajaxurl,
        type: 'post',
        data: {
          action: 'pixcare_install_dismiss_admin_notice',
          nonce_dismiss: $noticeContainer.find('#nonce-pixcare_install-dismiss').val()
        }
      })
    }
  })
})(jQuery)
