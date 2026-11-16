importScripts('engine.js?v=1.6.2');

self.onmessage = ({ data: { state, from } }) => {
  self.postMessage(state.rows.map((_, index) =>
    PasjansEngine.selectionPlan(state, from, { group: 'rows', index })));
};
