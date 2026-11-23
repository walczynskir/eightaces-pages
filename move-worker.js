importScripts('engine.js?v=slow-search-1');

self.onmessage = ({ data: { state, from } }) => {
  if (!from) {
    self.postMessage(!PasjansEngine.hasAvailableMove(state));
    return;
  }
  for (const index of state.rows.keys()) {
    const plan = PasjansEngine.selectionPlan(state, from, { group: 'rows', index });
    if (plan.length) self.postMessage({ index, plan });
  }
  self.postMessage({ done: true });
};
