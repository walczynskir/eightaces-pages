(function (root) {
  const rank = card => card % 13 + 1;
  const suit = card => Math.floor(card / 13) % 4;
  const top = pile => pile.at(-1);

  function deal({ sameSuit = false, recycle = false } = {}, random = Math.random) {
    const deck = Array.from({ length: 104 }, (_, index) => index);
    for (let index = deck.length - 1; index > 0; index--) {
      const other = Math.floor(random() * (index + 1));
      [deck[index], deck[other]] = [deck[other], deck[index]];
    }
    return {
      rows: Array.from({ length: 8 }, () => deck.splice(0, 5)),
      goals: Array.from({ length: 8 }, () => []),
      stock: deck, drawn: [], waste: [], sameSuit, recycle
    };
  }

  function pile(state, ref) {
    return ref.group === 'rows' || ref.group === 'goals'
      ? state[ref.group][ref.index]
      : state[ref.group];
  }

  function canMove(state, from, to) {
    if (from.group === "stock") return false;
    const source = pile(state, from);
    const target = pile(state, to);
    const card = top(source);
    const last = top(target);
    if (card === undefined || source === target) return false;
    switch (to.group) {
      case 'rows':
        if (rank(card) === 1) return false;
        return last === undefined || (
          rank(card) + 1 === rank(last) && (!state.sameSuit || suit(card) === suit(last))
        );
      case 'goals':
        return from.group !== 'goals' && (last === undefined
          ? rank(card) === 1
          : rank(card) === rank(last) + 1 && suit(card) === suit(last));
      case 'waste':
        return from.group === 'drawn';
      default:
        return false;
    }
  }

  function move(state, from, to) {
    if (!canMove(state, from, to)) return false;
    pile(state, to).push(pile(state, from).pop());
    return true;
  }

  function sequenceLength(state, index) {
    const row = state.rows[index];
    let count = Math.min(1, row.length);
    if (rank(top(row)) === 1) return count;
    while (count < row.length) {
      const lower = row.at(-count);
      const higher = row.at(-count - 1);
      if (rank(lower) + 1 !== rank(higher) || (state.sameSuit && suit(lower) !== suit(higher))) break;
      count++;
    }
    return count;
  }

  function spareRows(state, from, to) {
    return state.rows.flatMap((row, index) => row.length || index === from || index === to ? [] : [index]);
  }

  function assistedPlan(state, from, to, count) {
    const refs = [...state.rows.map((_, index) => ({ group: 'rows', index })),
      ...state.goals.map((_, index) => ({ group: 'goals', index }))];
    const initial = [...state.rows, ...state.goals];
    const expected = initial.slice();
    expected[from.index] = initial[from.index].slice(0, -count);
    expected[to.index] = initial[to.index].concat(initial[from.index].slice(-count));
    const keyOf = piles => piles.map(cards => cards.join(',')).join('|');
    const expectedKey = keyOf(expected);
    const distance = piles => piles.reduce((total, cards, index) => {
      const goal = expected[index];
      let prefix = 0;
      while (prefix < cards.length && cards[prefix] === goal[prefix]) prefix++;
      return total + cards.length - prefix;
    }, 0);

    // Best-first search is bounded so highlighting remains responsive.
    const pending = new Map();
    const visited = new Map([[keyOf(initial), 0]]);
    const enqueue = (node, score) => {
      if (!pending.has(score)) pending.set(score, []);
      pending.get(score).push(node);
    };
    enqueue({ piles: initial, depth: 0 }, 0);
    for (let expanded = 0; expanded < 1600 && pending.size; expanded++) {
      const score = Math.min(...pending.keys());
      const bucket = pending.get(score);
      const node = bucket.pop();
      if (!bucket.length) pending.delete(score);
      if (node.depth >= 16) continue;
      const trial = { ...state, rows: node.piles.slice(0, state.rows.length), goals: node.piles.slice(state.rows.length) };
      for (const [sourceIndex, source] of refs.entries()) {
        if (!node.piles[sourceIndex].length) continue;
        for (const [targetIndex, target] of refs.entries()) {
          if (!canMove(trial, source, target)) continue;
          const piles = node.piles.slice();
          const sourceCards = piles[sourceIndex];
          piles[sourceIndex] = sourceCards.slice(0, -1);
          piles[targetIndex] = piles[targetIndex].concat(top(sourceCards));
          const key = keyOf(piles);
          const depth = node.depth + 1;
          if ((visited.get(key) ?? Infinity) <= depth) continue;
          const next = { piles, depth, parent: node, step: { from: source, to: target } };
          if (key === expectedKey) {
            const steps = [];
            for (let current = next; current.step; current = current.parent) steps.push(current.step);
            return steps.reverse();
          }
          visited.set(key, depth);
          enqueue(next, depth + 3 * distance(piles));
        }
      }
    }
    return [];
  }

  function selectionPlan(state, from, to) {
    const count = from.count ?? 1;
    if (count === 1) return canMove(state, from, to) ? [{ from, to }] : [];
    if (from.group !== 'rows' || to.group !== 'rows' || from.index === to.index) return [];
    if (count > sequenceLength(state, from.index)) return [];
    const card = state.rows[from.index].at(-count);
    const last = top(state.rows[to.index]);
    if (last !== undefined && (rank(card) + 1 !== rank(last) || (state.sameSuit && suit(card) !== suit(last)))) return [];
    const free = spareRows(state, from.index, to.index);
    if (count > 2 ** free.length) return assistedPlan(state, from, to, count);

    const steps = [];
    function transfer(source, target, size, freeRows) {
      if (size === 1) {
        steps.push({ from: { group: 'rows', index: source }, to: { group: 'rows', index: target } });
        return;
      }
      const [temporary, ...remaining] = freeRows;
      const parked = Math.min(size - 1, 2 ** remaining.length);
      transfer(source, temporary, parked, remaining);
      transfer(source, target, size - parked, remaining);
      transfer(temporary, target, parked, remaining);
    }
    transfer(from.index, to.index, count, free);
    return steps;
  }

  const canMoveSelection = (state, from, to) => selectionPlan(state, from, to).length > 0;

  function moveSelection(state, from, to) {
    const steps = selectionPlan(state, from, to);
    if (steps.length < 2) return steps.length === 1 && move(state, steps[0].from, steps[0].to);
    const trial = structuredClone(state);
    if (!steps.every(step => move(trial, step.from, step.to))) return false;
    state.rows = trial.rows;
    state.goals = trial.goals;
    return true;
  }

  function finishPlan(state) {
    if (state.stock.length || state.drawn.length || state.waste.length || won(state)) return [];
    const plan = [];
    const trial = structuredClone(state);
    let changed;
    do {
      changed = false;
      trial.rows.forEach((row, index) => {
        const from = { group: 'rows', index };
        const target = trial.goals.findIndex((_, index) => canMove(trial, from, { group: 'goals', index }));
        if (target < 0) return;
        const to = { group: 'goals', index: target };
        move(trial, from, to);
        plan.push({ from, to });
        changed = true;
      });
    } while (changed);
    return won(trial) ? plan : [];
  }

  function finish(state) {
    const plan = finishPlan(state);
    for (const { from, to } of plan) move(state, from, to);
    return plan.length > 0;
  }

  function draw(state) {
    if (!state.stock.length && (!state.recycle || !state.waste.length)) return false;
    if (state.drawn.length) state.waste.push(state.drawn.pop());
    if (!state.stock.length) state.stock = state.waste.splice(0).reverse();
    state.drawn.push(state.stock.pop());
    return true;
  }

  const won = state => state.goals.every(goal => goal.length === 13);
  const engine = { deal, rank, suit, top, pile, canMove, move, sequenceLength, canMoveSelection, moveSelection, finishPlan, finish, draw, won };
  if (typeof module !== 'undefined') module.exports = engine;
  else root.PasjansEngine = engine;
})(globalThis);
