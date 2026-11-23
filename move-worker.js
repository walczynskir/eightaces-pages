importScripts('engine.js?v=duplicate-faces-1');

self.onmessage = ({ data: { state, from } }) => {
  self.postMessage(state.rows.map((_, index) =>
    PasjansEngine.selectionPlan(state, from, { group: 'rows', index })));
};
