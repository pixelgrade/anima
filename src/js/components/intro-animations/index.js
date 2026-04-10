const {
  createIntroAnimationsRuntime,
} = require('./runtime.js');

const runtime = createIntroAnimationsRuntime();

module.exports = {
  initialize(root) {
    return runtime.initialize(root);
  },
  bind() {
    return runtime.bind();
  },
  disconnect() {
    return runtime.disconnect();
  },
};
