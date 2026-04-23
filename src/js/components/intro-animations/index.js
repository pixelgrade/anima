const {
  createIntroAnimationsRuntime,
} = require('./runtime.js');
const {
  attachPageTransitionGate,
  PAGE_TRANSITION_GATE,
} = require('./integrations/page-transition-gate.js');
const {
  attachSlickGate,
  getSlickGateName,
} = require('./integrations/slick-gate.js');

// Compose the runtime with the production gate resolver.
// - Every target waits on the global page-transition gate. On first page
//   load the gate is open (never closed) so this is a no-op. During a
//   Barba soft-nav the integration closes it during the transition and
//   opens it with settle after, giving the loader a clean exit.
// - Targets inside a Slick carousel also wait on that carousel's
//   slick:{id} gate, so the word-curtain cascade only starts after the
//   slide transform finishes.
function resolveGates(target) {
  const gates = [PAGE_TRANSITION_GATE];
  const slickGate = getSlickGateName(target);
  if (slickGate) gates.push(slickGate);
  return gates;
}

const runtime = createIntroAnimationsRuntime({ resolveGates });

// Integrations attach their listeners BEFORE runtime.bind() so that on a
// 'anima:page-transition-complete' dispatch the gate's openGate (with
// settle) runs before runtime.initialize() — queued requests from
// initialize then actually wait the settle window before firing.
if (typeof window !== 'undefined') {
  attachPageTransitionGate({
    window,
    choreographer: runtime.choreographer,
  });
  attachSlickGate({
    window,
    document,
    jQuery: window.jQuery || window.$,
    choreographer: runtime.choreographer,
  });
}

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
