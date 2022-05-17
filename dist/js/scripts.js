/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external "jQuery"
const external_jQuery_namespaceObject = jQuery;
var external_jQuery_default = /*#__PURE__*/__webpack_require__.n(external_jQuery_namespaceObject);
;// CONCATENATED MODULE: ./src/js/utils.js



const debounce = (func, wait) => {
  let timeout = null;
  return function () {
    const context = this;
    const args = arguments;

    const later = () => {
      func.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
const hasTouchScreen = function () {
  var hasTouchScreen = false;

  if ('maxTouchPoints' in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ('msMaxTouchPoints' in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    var mQ = window.matchMedia && matchMedia('(pointer:coarse)');

    if (mQ && mQ.media === '(pointer:coarse)') {
      hasTouchScreen = !!mQ.matches;
    } else if ('orientation' in window) {
      hasTouchScreen = true;
    } else {
      var UA = navigator.userAgent;
      hasTouchScreen = /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) || /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
    }
  }

  return hasTouchScreen;
};
function setAndResetElementStyles(element) {
  let props = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const $element = external_jQuery_default()(element);
  $element.css(props);
  Object.keys(props).forEach(key => {
    props[key] = '';
  });

  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      $element.css(props);
    });
  } else {
    setTimeout(() => {
      $element.css(props);
    }, 0);
  }
}
const getColorSetClasses = element => {
  const classAttr = element === null || element === void 0 ? void 0 : element.getAttribute('class');

  if (!classAttr) {
    return [];
  }

  const classes = classAttr.split(/\s+/);
  return classes.filter(classname => {
    return classname.search('sm-palette-') !== -1 || classname.search('sm-variation-') !== -1;
  });
};
const addClass = (element, classes) => {
  const classesArray = classes.split(/\s+/).filter(x => x.trim().length);

  if (classesArray.length) {
    element.classList.add(...classesArray);
  }
};
const removeClass = (element, classes) => {
  const classesArray = classes.split(/\s+/).filter(x => x.trim().length);

  if (classesArray.length) {
    element.classList.remove(...classesArray);
  }
};
const hasClass = (element, className) => {
  return element.classList.contains(className);
};
const toggleClasses = function (element) {
  let classesToAdd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  const prefixes = ['sm-palette-', 'sm-variation-', 'sm-color-signal-'];
  const classesToRemove = Array.from(element.classList).filter(classname => {
    return prefixes.some(prefix => classname.indexOf(prefix) > -1);
  });
  element.classList.remove(...classesToRemove);
  addClass(element, classesToAdd);
};
function getFirstChild(el) {
  var firstChild = el.firstChild;

  while (firstChild != null && firstChild.nodeType === 3) {
    // skip TextNodes
    firstChild = firstChild.nextSibling;
  }

  return firstChild;
}
const getFirstBlock = element => {
  if (!element || !element.children.length) {
    return element;
  }

  const firstBlock = element.children[0];

  if (hasClass(firstBlock, 'nb-sidecar')) {
    const content = firstBlock.querySelector('.nb-sidecar-area--content');

    if (content && content.children.length) {
      return getFirstBlock(content);
    }
  }

  return firstBlock;
};
;// CONCATENATED MODULE: ./src/js/components/globalService.js



class GlobalService {
  constructor() {
    this.props = {};
    this.newProps = {};
    this.renderCallbacks = [];
    this.resizeCallbacks = [];
    this.debouncedResizeCallbacks = [];
    this.observeCallbacks = [];
    this.scrollCallbacks = [];
    this.currentMutationList = [];
    this.frameRendered = true;
    this.useOrientation = hasTouchScreen() && 'orientation' in window;

    this._init();
  }

  _init() {
    const $window = external_jQuery_default()(window);

    const updateProps = this._updateProps.bind(this);

    const renderLoop = this._renderLoop.bind(this);

    this._debouncedResizeCallback = debounce(this._resizeCallbackToBeDebounced.bind(this), 100); // now

    updateProps(); // on document ready

    external_jQuery_default()(updateProps);

    this._bindOnResize();

    this._bindOnScroll();

    this._bindOnLoad();

    this._bindObserver();

    this._bindCustomizer();

    requestAnimationFrame(renderLoop);
  }

  _bindOnResize() {
    const $window = external_jQuery_default()(window);

    const updateProps = this._updateProps.bind(this);

    if (this.useOrientation) {
      $window.on('orientationchange', () => {
        $window.one('resize', updateProps);
      });
    } else {
      $window.on('resize', updateProps);
    }
  }

  _bindOnScroll() {
    external_jQuery_default()(window).on('scroll', this._updateScroll.bind(this));
  }

  _bindOnLoad() {
    external_jQuery_default()(window).on('load', this._updateProps.bind(this));
  }

  _bindObserver() {
    const self = this;

    const observeCallback = this._observeCallback.bind(this);

    const observeAndUpdateProps = () => {
      observeCallback();
      self.currentMutationList = [];
    };

    const debouncedObserveCallback = debounce(observeAndUpdateProps, 300);

    if (!window.MutationObserver) {
      return;
    }

    const observer = new MutationObserver(function (mutationList) {
      self.currentMutationList = self.currentMutationList.concat(mutationList);
      debouncedObserveCallback();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  _bindCustomizer() {
    if (typeof wp !== 'undefined' && typeof wp.customize !== 'undefined') {
      if (typeof wp.customize.selectiveRefresh !== 'undefined') {
        wp.customize.selectiveRefresh.bind('partial-content-rendered', this._updateProps.bind(this));
      }

      wp.customize.bind('change', debounce(this._updateProps.bind(this), 100));
    }
  }

  _updateProps() {
    let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    this._updateSize(force);

    this._updateScroll(force);
  }

  _observeCallback() {
    const mutationList = this.currentMutationList;
    external_jQuery_default().each(this.observeCallbacks, function (i, fn) {
      fn(mutationList);
    });
  }

  _renderLoop() {
    if (!this.frameRendered) {
      this._renderCallback();

      this.frameRendered = true;
    }

    window.requestAnimationFrame(this._renderLoop.bind(this));
  }

  _renderCallback() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.renderCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }

  _resizeCallback() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.resizeCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }

  _resizeCallbackToBeDebounced() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.debouncedResizeCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }

  _scrollCallback() {
    const passedArguments = arguments;
    external_jQuery_default().each(this.scrollCallbacks, function (i, fn) {
      fn(...passedArguments);
    });
  }

  _updateScroll() {
    let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    this.newProps = Object.assign({}, this.newProps, {
      scrollY: window.pageYOffset,
      scrollX: window.pageXOffset
    });

    this._shouldUpdate(this._scrollCallback.bind(this));
  }

  _updateSize() {
    let force = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const body = document.body;
    const html = document.documentElement;
    const bodyScrollHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight);
    const htmlScrollHeight = Math.max(html.scrollHeight, html.offsetHeight);
    this.newProps = Object.assign({}, this.newProps, {
      scrollHeight: Math.max(bodyScrollHeight, htmlScrollHeight),
      adminBarHeight: this.getAdminBarHeight(),
      windowWidth: this.useOrientation && window.screen && window.screen.availWidth || window.innerWidth,
      windowHeight: this.useOrientation && window.screen && window.screen.availHeight || window.innerHeight
    });

    this._shouldUpdate(() => {
      this._resizeCallback();

      this._debouncedResizeCallback();
    });
  }

  _shouldUpdate(callback) {
    let force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (this._hasNewProps() || force) {
      this.props = Object.assign({}, this.props, this.newProps);
      this.newProps = {};
      this.frameRendered = false;

      if (typeof callback === 'function') {
        callback();
      }
    }
  }

  _hasNewProps() {
    return Object.keys(this.newProps).some(key => {
      return this.newProps[key] !== this.props[key];
    });
  }

  getAdminBarHeight() {
    const adminBar = document.getElementById('wpadminbar');

    if (adminBar) {
      const box = adminBar.getBoundingClientRect();
      return box.height;
    }

    return 0;
  }

  registerOnResize(fn) {
    if (typeof fn === 'function' && this.resizeCallbacks.indexOf(fn) < 0) {
      this.resizeCallbacks.push(fn);
    }
  }

  registerOnDeouncedResize(fn) {
    if (typeof fn === 'function' && this.resizeCallbacks.indexOf(fn) < 0) {
      this.debouncedResizeCallbacks.push(fn);
    }
  }

  registerOnScroll(fn) {
    if (typeof fn === 'function' && this.scrollCallbacks.indexOf(fn) < 0) {
      this.scrollCallbacks.push(fn);
    }
  }

  registerObserverCallback(fn) {
    if (typeof fn === 'function' && this.observeCallbacks.indexOf(fn) < 0) {
      this.observeCallbacks.push(fn);
    }
  }

  registerRender(fn) {
    if (typeof fn === 'function' && this.renderCallbacks.indexOf(fn) < 0) {
      this.renderCallbacks.push(fn);
    }
  }

  getProps() {
    return this.props;
  }

}

/* harmony default export */ const globalService = (new GlobalService());
;// CONCATENATED MODULE: ./src/js/components/hero.js

class Hero {
  constructor(element) {
    this.element = element;
    this.progress = 0;
    this.timeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        this.paused = true;
      }
    });
    this.pieces = this.getMarkupPieces();
    this.paused = false;
    this.offset = 0;
    this.reduceMotion = false;
    this.update();
    this.updateOnScroll();
    this.init();
  }

  init() {
    globalService.registerOnScroll(() => {
      this.update();
    });
    globalService.registerRender(() => {
      this.updateOnScroll();
    });
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addListener(() => {
      this.reduceMotion = mediaQuery.matches;
      this.updateOnScroll();
    });
    this.reduceMotion = mediaQuery.matches;
    this.addIntroToTimeline();
    this.timeline.addLabel('middle');
    this.addOutroToTimeline();
    this.timeline.addLabel('end');
    this.pauseTimelineOnScroll();

    if (this.reduceMotion) {
      const middleTime = this.labels.middle;
      const endTime = this.labels.end;
      const minTlProgress = middleTime / endTime;
      this.paused = true;
      this.timeline.progress(minTlProgress);
    } else {
      this.timeline.play();
    }
  }

  update() {
    const {
      scrollY
    } = globalService.getProps();
    this.box = this.element.getBoundingClientRect();
    this.view = {
      left: this.box.left,
      top: this.box.top + scrollY,
      width: this.box.width,
      height: this.box.height
    };
  }

  updateOnScroll() {
    const {
      scrollY,
      scrollHeight,
      windowHeight
    } = globalService.getProps(); // used to calculate animation progress

    const length = windowHeight * 0.5;
    const middleMin = 0;
    const middleMax = scrollHeight - windowHeight - length * 0.5;
    const middle = this.view.top + (this.box.height - windowHeight) * 0.5;
    const middleMid = Math.max(middleMin, Math.min(middle, middleMax));
    this.start = middleMid - length * 0.5;
    this.end = this.start + length;
    this.progress = (scrollY - this.start) / (this.end - this.start);

    if (this.reduceMotion) {
      const middleTime = this.timeline.labels.middle;
      const endTime = this.timeline.labels.end;
      const minTlProgress = middleTime / endTime;
      this.progress = minTlProgress;
    }

    this.updateTimelineOnScroll();
  }

  updateTimelineOnScroll() {
    if (!this.paused) {
      return;
    }

    const currentProgress = this.timeline.progress();
    const middleTime = this.timeline.labels.middle;
    const endTime = this.timeline.labels.end;
    const minTlProgress = middleTime / endTime;
    let newTlProgress = (this.progress - 0.5) * 2 * (1 - minTlProgress) + minTlProgress;
    newTlProgress = Math.min(Math.max(minTlProgress, newTlProgress), 1);

    if (currentProgress === newTlProgress) {
      return;
    }

    this.timeline.progress(newTlProgress);
  }

  getMarkupPieces() {
    const container = jQuery(this.element).find('.novablocks-hero__inner-container, .nb-supernova-item__inner-container');
    const headline = container.children().filter('.c-headline').first();
    const title = headline.find('.c-headline__primary');
    const subtitle = headline.find('.c-headline__secondary');
    const separator = headline.next('.wp-block-separator');
    const sepFlower = separator.find('.c-separator__symbol');
    const sepLine = separator.find('.c-separator__line');
    const sepArrow = separator.find('.c-separator__arrow');
    const othersBefore = headline.prevAll();
    const othersAfter = headline.length ? headline.nextAll().not(separator).not('.nb-scroll-indicator') : container.children().not('.nb-scroll-indicator');
    return {
      headline,
      title,
      subtitle,
      separator,
      sepFlower,
      sepLine,
      sepArrow,
      othersBefore,
      othersAfter
    };
  }

  addIntroToTimeline() {
    const timeline = this.timeline;
    const {
      windowWidth
    } = globalService.getProps();
    const {
      headline,
      title,
      subtitle,
      separator,
      sepFlower,
      sepLine,
      sepArrow,
      othersBefore,
      othersAfter
    } = this.pieces;

    if (title.length && title.text().trim().length) {
      this.splitTitle = new SplitText(title, {
        wordsClass: 'c-headline__word'
      });
      this.splitTitle.lines.forEach(line => {
        const words = Array.from(line.children);
        const letters = [];
        words.forEach(word => {
          letters.push(...word.children);
        });
        letters.forEach(letter => {
          const box = letter.getBoundingClientRect();
          const width = letter.offsetWidth;
          const offset = box.x - windowWidth / 2;
          const offsetPercent = 2 * offset / windowWidth;
          const move = 400 * letters.length * offsetPercent;
          timeline.from(letter, {
            duration: 0.72,
            x: move,
            ease: 'power.out'
          }, 0);
        });
      });
      timeline.fromTo(title, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.89,
        ease: 'power.out'
      }, 0); // aici era title dar facea un glitch ciudat

      timeline.fromTo(headline, {
        'y': 30
      }, {
        'y': 0,
        duration: 1,
        ease: 'power.out'
      }, 0);
    }

    if (subtitle.length) {
      timeline.fromTo(subtitle, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.65,
        ease: 'power4.out'
      }, '-=0.65');
      timeline.fromTo(subtitle, {
        y: 30
      }, {
        y: 0,
        duration: 0.9,
        ease: 'power4.out'
      }, '-=0.65');
    }

    if (separator.length) {
      if (sepFlower.length) {
        timeline.fromTo(sepFlower, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.15,
          ease: 'power4.out'
        }, '-=0.6');
        timeline.fromTo(sepFlower, {
          rotation: -270
        }, {
          rotation: 0,
          duration: 0.55,
          ease: 'back.out'
        }, '-=0.5');
      }

      if (sepLine.length) {
        timeline.fromTo(sepLine, {
          width: 0
        }, {
          width: '42%',
          opacity: 1,
          duration: 0.6,
          ease: 'power4.out'
        }, '-=0.55');
        timeline.fromTo(separator, {
          width: 0
        }, {
          width: '100%',
          opacity: 1,
          duration: 0.6,
          ease: 'power4.out'
        }, '-=0.6');
      }

      if (sepArrow.length) {
        timeline.fromTo(sepArrow, {
          opacity: 0
        }, {
          opacity: 1,
          duration: 0.2,
          ease: 'power4.out'
        }, '-=0.27');
      }
    }

    if (othersAfter.length) {
      timeline.fromTo(othersAfter, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.5,
        ease: 'power4.out'
      }, '-=0.28');
      timeline.fromTo(othersAfter, {
        y: -20
      }, {
        y: 0,
        duration: 0.75
      }, '-=0.5');
    }

    if (othersBefore.length) {
      timeline.fromTo(othersBefore, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.5,
        ease: 'power4.out'
      }, '-=0.75');
      timeline.fromTo(othersBefore, {
        y: 20
      }, {
        y: 0,
        duration: 0.75
      }, '-=0.75');
    }

    this.timeline = timeline;
  }

  addOutroToTimeline() {
    const {
      title,
      subtitle,
      othersBefore,
      othersAfter,
      separator,
      sepLine,
      sepFlower,
      sepArrow
    } = this.pieces;
    const timeline = this.timeline;

    if (title.length) {
      timeline.fromTo(title, {
        y: 0
      }, {
        opacity: 0,
        y: -60,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }

    if (subtitle.length) {
      timeline.to(subtitle, {
        opacity: 0,
        y: -90,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }

    if (othersBefore.length) {
      timeline.to(othersBefore, {
        y: 60,
        opacity: 0,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }

    if (othersAfter.length) {
      timeline.to(othersAfter, {
        y: 60,
        opacity: 0,
        duration: 1.08,
        ease: 'power1.in'
      }, 'middle');
    }

    if (sepLine.length) {
      timeline.to(sepLine, {
        width: '0%',
        opacity: 0,
        duration: 0.86,
        ease: 'power1.in'
      }, '-=0.94');
    }

    if (separator.length) {
      timeline.to(separator, {
        width: '0%',
        opacity: 0,
        duration: 0.86,
        ease: 'power1.in'
      }, '-=0.86');
    }

    if (sepFlower.length) {
      timeline.to(sepFlower, {
        rotation: 180,
        duration: 1
      }, '-=1.08');
    }

    if (sepFlower.length) {
      timeline.to(sepFlower, {
        opacity: 0,
        duration: 0.11
      }, '-=0.03');
    }

    if (sepArrow.length) {
      timeline.to(sepArrow, {
        opacity: 0,
        duration: 0.14
      }, '-=1.08');
    }

    this.timeline = timeline;
  }

  revertTitle() {
    if (typeof this.splitTitle !== 'undefined') {
      this.splitTitle.revert();
    }
  }

  pauseTimelineOnScroll() {
    const middleTime = this.timeline.labels.middle;
    const endTime = this.timeline.labels.end;
    this.timeline.eventCallback('onUpdate', tl => {
      const time = this.timeline.time(); // calculate the current timeline progress relative to middle and end labels
      // in such a way that timelineProgress is 0.5 for middle and 1 for end
      // because we don't want the animation to be stopped before the middle label

      const tlProgress = (time - middleTime) / (endTime - middleTime);
      const pastMiddle = time > middleTime;
      const pastScroll = tlProgress * 0.5 + 0.5 >= this.progress;

      if (pastMiddle && pastScroll) {
        this.timeline.pause();
        this.revertTitle();
        this.timeline.eventCallback('onUpdate', null);
        this.paused = true;
      }
    }, ['{self}']);
  }

}
;// CONCATENATED MODULE: ./src/js/components/commentsArea.js

class CommentsArea {
  constructor(element) {
    this.$element = external_jQuery_default()(element);
    this.$checkbox = this.$element.find('.c-comments-toggle__checkbox');
    this.$content = this.$element.find('.comments-area__content');
    this.$contentWrap = this.$element.find('.comments-area__wrap'); // overwrite CSS that hides the comments area content

    this.$contentWrap.css('display', 'block');
    this.$checkbox.on('change', this.onChange.bind(this));
    this.checkWindowLocationComments();
  }

  onChange() {
    this.toggle(false);
  }

  toggle() {
    let instant = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    const $contentWrap = this.$contentWrap;
    const isChecked = this.$checkbox.prop('checked');
    const newHeight = isChecked ? this.$content.outerHeight() : 0;

    if (instant) {
      $contentWrap.css('height', newHeight);
    } else {
      gsap.to($contentWrap, {
        duration: 0.4,
        height: newHeight,
        onComplete: function () {
          if (isChecked) {
            $contentWrap.css('height', '');
          }
        }
      });
    }
  }

  checkWindowLocationComments() {
    if (window.location.href.indexOf('#comment') === -1) {
      this.$checkbox.prop('checked', false);
      this.toggle(true);
    }
  }

}
;// CONCATENATED MODULE: ./src/js/components/mqService.js


class mqService {
  constructor() {
    this.breakpoints = {
      mobile: '480px',
      tablet: '768px',
      lap: '1024px',
      desktop: '1440px'
    };
    this.above = {};
    this.below = {};
    globalService.registerOnDeouncedResize(this.onResize.bind(this));
    this.onResize();
  }

  onResize() {
    Object.keys(this.breakpoints).forEach(key => {
      const breakpoint = this.breakpoints[key];
      this.above[key] = !!window.matchMedia(`not screen and (min-width: ${breakpoint})`).matches;
      this.below[key] = !!window.matchMedia(`not screen and (min-width: ${breakpoint})`).matches;
    });
  }

}

/* harmony default export */ const components_mqService = (new mqService());
;// CONCATENATED MODULE: ./src/js/components/navbar.js



const MENU_ITEM = '.menu-item, .page_item';
const MENU_ITEM_WITH_CHILDREN = '.menu-item-has-children, .page_item_has_children';
const SUBMENU = '.sub-menu, .children';
const SUBMENU_LEFT_CLASS = 'has-submenu-left';
const HOVER_CLASS = 'hover';
class Navbar {
  constructor() {
    this.$menuItems = external_jQuery_default()(MENU_ITEM);
    this.$menuItemsWithChildren = this.$menuItems.filter(MENU_ITEM_WITH_CHILDREN).removeClass(HOVER_CLASS);
    this.$menuItemsWithChildrenLinks = this.$menuItemsWithChildren.children('a');
    this.initialize();
  }

  initialize() {
    this.onResize();
    this.initialized = true;
    globalService.registerOnDeouncedResize(this.onResize.bind(this));
  }

  onResize() {
    // we are on desktop
    if (!components_mqService.below.lap) {
      this.addSubMenusLeftClass();

      if (this.initialized && !this.desktop) {
        this.unbindClick();
      }

      if (!this.initialized || !this.desktop) {
        this.bindHoverIntent();
      }

      this.desktop = true;
      return;
    }

    this.removeSubMenusLeftClass();

    if (this.initialized && this.desktop) {
      this.unbindHoverIntent();
    }

    if (!this.initialized || this.desktop) {
      this.bindClick();
    }

    this.desktop = false;
  }

  addSubMenusLeftClass() {
    const {
      windowWidth
    } = globalService.getProps();
    this.$menuItemsWithChildren.each(function (index, obj) {
      const $obj = external_jQuery_default()(obj);
      const $subMenu = $obj.children(SUBMENU),
            subMenuWidth = $subMenu.outerWidth(),
            subMenuOffSet = $subMenu.offset(),
            availableSpace = windowWidth - subMenuOffSet.left;

      if (availableSpace < subMenuWidth) {
        $obj.addClass(SUBMENU_LEFT_CLASS);
      }
    });
  }

  removeSubMenusLeftClass() {
    this.$menuItemsWithChildren.removeClass(SUBMENU_LEFT_CLASS);
  }

  onClickMobile(event) {
    const $link = external_jQuery_default()(this);
    const $siblings = $link.parent().siblings().not($link);

    if ($link.is('.active')) {
      return;
    }

    event.preventDefault();
    $link.addClass('active').parent().addClass(HOVER_CLASS);
    $siblings.removeClass(HOVER_CLASS);
    $siblings.find('.active').removeClass('active');
  }

  bindClick() {
    this.$menuItemsWithChildrenLinks.on('click', this.onClickMobile);
  }

  unbindClick() {
    this.$menuItemsWithChildrenLinks.off('click', this.onClickMobile);
  }

  bindHoverIntent() {
    this.$menuItems.hoverIntent({
      out: function () {
        external_jQuery_default()(this).removeClass(HOVER_CLASS);
      },
      over: function () {
        external_jQuery_default()(this).addClass(HOVER_CLASS);
      },
      timeout: 200
    });
  }

  unbindHoverIntent() {
    this.$menuItems.off('mousemove.hoverIntent mouseenter.hoverIntent mouseleave.hoverIntent');
    delete this.$menuItems.hoverIntent_t;
    delete this.$menuItems.hoverIntent_s;
  }

}
;// CONCATENATED MODULE: ./src/js/components/base-component.js


class BaseComponent {
  constructor() {
    globalService.registerOnResize(this.onResize.bind(this));
    globalService.registerOnDeouncedResize(this.onDebouncedResize.bind(this));
  }

  onResize() {}

  onDebouncedResize() {}

}

/* harmony default export */ const base_component = (BaseComponent);
;// CONCATENATED MODULE: ./src/js/components/search-overlay.js



const SEARCH_OVERLAY_OPEN_CLASS = 'has-search-overlay';
const ESC_KEY_CODE = 27;

class SearchOverlay extends base_component {
  constructor() {
    super();
    this.$searchOverlay = external_jQuery_default()('.c-search-overlay');
    this.initialize();
    this.onDebouncedResize();
  }

  initialize() {
    external_jQuery_default()(document).on('click', '.menu-item--search a', this.openSearchOverlay);
    external_jQuery_default()(document).on('click', '.c-search-overlay__cancel', this.closeSearchOverlay);
    external_jQuery_default()(document).on('keydown', this.closeSearchOverlayOnEsc);
  }

  onDebouncedResize() {
    setAndResetElementStyles(this.$searchOverlay, {
      transition: 'none'
    });
  }

  openSearchOverlay(e) {
    e.preventDefault();
    external_jQuery_default()('body').toggleClass(SEARCH_OVERLAY_OPEN_CLASS);
    external_jQuery_default()('.c-search-overlay__form .search-field').focus();
  }

  closeSearchOverlayOnEsc(e) {
    if (e.keyCode === ESC_KEY_CODE) {
      external_jQuery_default()('body').removeClass(SEARCH_OVERLAY_OPEN_CLASS);
      external_jQuery_default()('.c-search-overlay__form .search-field').blur();
    }
  }

  closeSearchOverlay(e) {
    e.preventDefault();
    external_jQuery_default()('body').removeClass(SEARCH_OVERLAY_OPEN_CLASS);
  }

}

/* harmony default export */ const search_overlay = (SearchOverlay);
;// CONCATENATED MODULE: ./src/js/components/app.js







class App {
  constructor() {
    this.initializeHero();
    this.navbar = new Navbar();
    this.searchOverlay = new search_overlay();
    this.initializeImages();
    this.initializeCommentsArea();
    this.initializeReservationForm();
  }

  initializeImages() {
    const showLoadedImages = this.showLoadedImages.bind(this);
    showLoadedImages();
    globalService.registerObserverCallback(function (mutationList) {
      external_jQuery_default().each(mutationList, (i, mutationRecord) => {
        external_jQuery_default().each(mutationRecord.addedNodes, (j, node) => {
          const nodeName = node.nodeName && node.nodeName.toLowerCase();

          if ('img' === nodeName || node.childNodes.length) {
            showLoadedImages(node);
          }
        });
      });
    });
  }

  initializeReservationForm() {
    globalService.registerObserverCallback(function (mutationList) {
      external_jQuery_default().each(mutationList, (i, mutationRecord) => {
        external_jQuery_default().each(mutationRecord.addedNodes, (j, node) => {
          const $node = external_jQuery_default()(node);

          if ($node.is('#ot-reservation-widget')) {
            $node.closest('.novablocks-opentable').addClass('is-loaded');
          }
        });
      });
    });
  }

  showLoadedImages() {
    let container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document.body;
    const $images = external_jQuery_default()(container).find('img').not('[srcset], .is-loaded, .is-broken');
    $images.imagesLoaded().progress((instance, image) => {
      const className = image.isLoaded ? 'is-loaded' : 'is-broken';
      external_jQuery_default()(image.img).addClass(className);
    });
  }

  initializeHero() {
    const newHeroesSelector = '.nb-supernova--card-layout-stacked.nb-supernova--1-columns.nb-supernova--align-full';
    const oldHeroesSelector = '.novablocks-hero';
    const heroesSelector = `${newHeroesSelector}, ${oldHeroesSelector}`;
    const heroElements = document.querySelectorAll(heroesSelector);
    const heroElementsArray = Array.from(heroElements);
    this.HeroCollection = heroElementsArray.map(element => new Hero(element));
    this.firstHero = heroElementsArray[0];
  }

  initializeCommentsArea() {
    const $commentsArea = external_jQuery_default()('.comments-area');

    if ($commentsArea.length) {
      this.commentsArea = new CommentsArea($commentsArea.get(0));
    }
  }

}
;// CONCATENATED MODULE: ./src/js/scripts.js



function initialize() {
  new App();
}

external_jQuery_default()(function () {
  const $window = external_jQuery_default()(window);
  const $html = external_jQuery_default()('html');

  if ($html.is('.wf-active')) {
    initialize();
  } else {
    $window.on('wf-active', initialize);
  }
});
/******/ })()
;