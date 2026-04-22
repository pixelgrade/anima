const {
  createSiteFrameRuntime,
} = require('./runtime.js');

class SiteFrame {
  constructor({
    window: win = typeof window !== 'undefined' ? window : null,
    runtime = createSiteFrameRuntime(),
  } = {}) {
    this.window = win;
    this.runtime = runtime;
    this.onResize = this.onResize.bind(this);

    this.runtime.sync();

    if (this.window && typeof this.window.addEventListener === 'function') {
      this.window.addEventListener('resize', this.onResize);
    }
  }

  onResize() {
    this.runtime.sync();
  }
}

module.exports = SiteFrame;
