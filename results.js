(function (root) {
  'use strict';

  // Results belong to the save, never to an undoable board snapshot.
  function legacyId(save) {
    const first = save.history?.[0] ?? save.state;
    const text = JSON.stringify([first.rows, first.goals, first.stock, first.drawn, first.waste]);
    let left = 2166136261;
    let right = 5381;
    for (const character of text) {
      left = Math.imul(left ^ character.charCodeAt(0), 16777619) >>> 0;
      right = (Math.imul(right, 33) ^ character.charCodeAt(0)) >>> 0;
    }
    return 'legacy-' + left.toString(16) + '-' + right.toString(16);
  }

  function started(save) {
    const state = save.state;
    return Boolean(save.history?.length || save.future?.length || state.drawn.length
      || state.waste.length || state.stock.length !== 64 || state.goals.some(pile => pile.length)
      || state.rows.some(pile => pile.length !== 5));
  }

  const winCount = results => results.baseWins
    + Object.values(results.records).filter(record => record.outcome === 'win' && record.counted).length;

  function read(save) {
    const results = save.results ? structuredClone(save.results)
      : { baseWins: save.wins ?? 0, records: {} };
    const session = save.session ? { ...save.session }
      : { id: legacyId(save), started: started(save) };
    if (save.rewarded && !Object.hasOwn(results.records, session.id)) {
      results.records = { ...results.records, [session.id]: { outcome: 'win', reason: 'completed', counted: false } };
    }
    return { results, session };
  }

  function finish(results, session, outcome, reason) {
    if (Object.hasOwn(results.records, session.id)) return false;
    results.records = { ...results.records, [session.id]: { outcome, reason, counted: outcome === 'win' } };
    return true;
  }

  function merge(left, right) {
    const records = { ...right.records, ...left.records };
    return { baseWins: Math.max(left.baseWins, right.baseWins), records };
  }

  function importSave(value, current) {
    const incoming = read(value);
    const existing = read(current);
    // A legacy counter already includes wins recorded since its export.
    // Preserve the higher counter without counting those wins twice.
    if (!value.results) {
      incoming.results.baseWins = Math.max(0, (value.wins ?? 0)
        - (winCount(existing.results) - existing.results.baseWins));
    }
    const results = merge(existing.results, incoming.results);
    return { ...value, results, session: incoming.session,
      wins: winCount(results), legacyCopper: Boolean(current.legacyCopper || value.legacyCopper),
      rewarded: results.records[incoming.session.id]?.outcome === 'win' };
  }

  function valid(value) {
    if (value.session !== undefined && (!value.session || typeof value.session.id !== 'string'
      || !value.session.id.length || value.session.id.length > 200
      || typeof value.session.started !== 'boolean')) return false;
    if (value.results === undefined) return true;
    const results = value.results;
    return Boolean(results && Number.isSafeInteger(results.baseWins) && results.baseWins >= 0
      && results.records && typeof results.records === 'object' && !Array.isArray(results.records)
      && Object.entries(results.records).every(([id, record]) => id.length > 0 && id.length <= 200
        && record && ['win', 'loss'].includes(record.outcome)
        && ['completed', 'replaced'].includes(record.reason) && typeof record.counted === 'boolean'));
  }

  const api = { read, started, finish, merge, importSave, valid, winCount };
  if (typeof module !== 'undefined') module.exports = api;
  root.PasjansResults = api;
})(globalThis);
