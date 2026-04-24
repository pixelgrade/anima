/**
 * Reveal Choreographer
 *
 * Coordinates when intro-animation reveals are allowed to fire. Producers
 * (the IntersectionObserver / slide-change flows) request a reveal and list
 * the "gates" it depends on. Integrations (page transitions, Slick carousels,
 * etc.) close and open those gates in response to blocking animations.
 *
 * Semantics:
 *  - A gate is OPEN by default. Only integrations close it.
 *  - While any gate a request depends on is closed, the request queues and
 *    its target stays in its pre-reveal state.
 *  - openGate(name, { settle }) keeps the gate logically closed for `settle`
 *    ms after the blocking animation ends, then flushes queued reveals.
 *    closeGate(name) called during a pending settle cancels that settle.
 *  - Every request has a timeout safety net (default 3s). If a gate it
 *    depends on never opens, the reveal force-fires so the user never sees
 *    permanently-hidden content.
 *  - When prefersReducedMotion() returns true, requests bypass gates
 *    entirely and fire immediately.
 *
 * The module is pure: no DOM queries, no CSS knowledge. The actual reveal
 * (adding a class, running a keyframe, whatever) is the caller's onReveal
 * callback.
 */
function createRevealChoreographer({
  window: win = typeof window !== 'undefined' ? window : null,
  prefersReducedMotion = () => false,
  onReveal = () => {},
  defaultTimeout = 3000,
} = {}) {
  const closedGates = new Set();
  // Request queue, keyed by the element so a repeat requestReveal() for the
  // same target cancels the previous one instead of stacking up.
  const queue = new Map();
  // Pending "settle" timers keyed by gate name. If the gate is re-closed
  // before settle elapses, we cancel the timer and stay closed.
  const pendingOpens = new Map();

  function setTimer(fn, ms) {
    if (win && typeof win.setTimeout === 'function') {
      return win.setTimeout(fn, ms);
    }
    return null;
  }

  function clearTimer(handle) {
    if (handle == null) return;
    if (win && typeof win.clearTimeout === 'function') {
      win.clearTimeout(handle);
    }
  }

  function isRequestReady(req) {
    for (const gate of req.waitFor) {
      if (closedGates.has(gate)) return false;
    }
    return true;
  }

  function cleanupRequest(req) {
    clearTimer(req.timeoutHandle);
    queue.delete(req.el);
  }

  function fireReveal(req) {
    cleanupRequest(req);
    // Caller-provided reveal. Try/catch so a throw in one reveal doesn't
    // leave the queue in an inconsistent state.
    try {
      onReveal(req.el);
    } catch (_) {
      /* no-op */
    }
  }

  function flushReadyRequests() {
    // Collect first so we're not mutating queue during iteration.
    const ready = [];
    for (const req of queue.values()) {
      if (isRequestReady(req)) ready.push(req);
    }
    ready.forEach(fireReveal);
  }

  return {
    /**
     * Ask for an element to be revealed.
     *
     * @param {Element} el The target.
     * @param {{ waitFor?: string[], timeout?: number }} [opts]
     *   waitFor: gate names to wait on. Empty = fire immediately.
     *   timeout: force-reveal after this many ms (default 3000).
     */
    requestReveal(el, opts = {}) {
      if (!el) return;

      // Reduced-motion short-circuit: fire now, skip the whole machinery.
      if (typeof prefersReducedMotion === 'function' && prefersReducedMotion()) {
        try { onReveal(el); } catch (_) { /* no-op */ }
        return;
      }

      const waitFor = Array.isArray(opts.waitFor) ? opts.waitFor.slice() : [];
      const timeout = typeof opts.timeout === 'number' ? opts.timeout : defaultTimeout;

      // Cancel any previous request for the same element.
      const previous = queue.get(el);
      if (previous) cleanupRequest(previous);

      const req = { el, waitFor, timeoutHandle: null };

      if (waitFor.length === 0 || isRequestReady(req)) {
        try { onReveal(el); } catch (_) { /* no-op */ }
        return;
      }

      // Queue it and arm the timeout safety net.
      queue.set(el, req);
      if (timeout > 0) {
        req.timeoutHandle = setTimer(() => { fireReveal(req); }, timeout);
      }
    },

    /**
     * Mark a gate as closed. Cancels any pending settle timer for this gate.
     */
    closeGate(name) {
      closedGates.add(name);
      if (pendingOpens.has(name)) {
        clearTimer(pendingOpens.get(name));
        pendingOpens.delete(name);
      }
    },

    /**
     * Mark a gate as open. With settle > 0, the gate stays logically closed
     * for `settle` ms first — requests queued during that window flush when
     * the timer fires. Useful for letting a blocking animation finish its
     * last frame of motion before the next one starts.
     */
    openGate(name, opts = {}) {
      const settle = typeof opts.settle === 'number' ? opts.settle : 0;

      const actuallyOpen = () => {
        closedGates.delete(name);
        pendingOpens.delete(name);
        flushReadyRequests();
      };

      if (settle <= 0) {
        actuallyOpen();
        return;
      }

      // Cancel any previous pending open so a later openGate with a
      // different settle resets the timer.
      if (pendingOpens.has(name)) {
        clearTimer(pendingOpens.get(name));
      }
      const handle = setTimer(actuallyOpen, settle);
      pendingOpens.set(name, handle);
    },

    /** True iff the gate is not currently in the closed set. */
    isGateOpen(name) {
      return !closedGates.has(name);
    },

    /**
     * For instrumentation/tests only — returns the current number of
     * queued (not-yet-fired) requests.
     */
    queuedCount() {
      return queue.size;
    },

    /**
     * Tear down: cancel every pending timer and flush state.
     * Used before re-initializing (e.g., on Barba re-init).
     */
    disconnect({ preserveGates = false } = {}) {
      for (const req of queue.values()) {
        clearTimer(req.timeoutHandle);
      }
      queue.clear();
      if (!preserveGates) {
        for (const handle of pendingOpens.values()) {
          clearTimer(handle);
        }
        pendingOpens.clear();
        closedGates.clear();
      }
    },
  };
}

module.exports = {
  createRevealChoreographer,
};
