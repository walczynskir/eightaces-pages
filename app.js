(() => {
  const engine = PasjansEngine;
  const i18n = DominoI18n;
  const byId = id => document.getElementById(id);
  const key = 'pasjans.v1';
  const themes = {
    porcelain: 'Porcelain', ink: 'Ink & paper', sage: 'Sage', studio: 'Studio',
    forma: 'Forma', energy: 'Energy', tangerine: 'Tangerine', ukraine: 'Ukraine',
    copper: 'Copper', 'night-sky': 'Night sky'
  };
  const prefs = { language: 'pl', theme: 'porcelain', contrast: false, large: false, sameSuit: false, recycle: false, kingsOnly: true, showCounts: false, showUndo: false };
  const rewardWins = { copper: 3, 'night-sky': 10 };
  let wins = 0;
  let rewarded = false;
  let state;
  let history = [];
  let future = [];
  let selected;
  let saved = true;
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    Object.assign(prefs, stored?.prefs);
    wins = stored?.wins ?? 0;
    rewarded = stored?.rewarded === true;
    if (stored?.state?.rows?.length === 8 && stored?.state?.goals?.length === 8) {
      state = stored.state;
      history = stored.history ?? [];
      future = stored.future ?? [];
    }
  } catch { /* Start with a fresh deal if storage cannot be read. */ }
  state ??= engine.deal(prefs);
  state.kingsOnly = prefs.kingsOnly;
  const themeLocked = theme => wins < (rewardWins[theme] ?? 0);
  if (themeLocked(prefs.theme)) prefs.theme = 'porcelain';
  const newGameLabels = ['Nowy pasjans', 'New solitaire', 'Nuevo solitario', 'Neue Patience',
    '新接龙', 'नया सॉलिटेयर', 'Nouveau solitaire', 'سوليتير جديد', 'Nuovo solitario', 'Новий пасьянс'];

  const suits = ['♠', '♥', '♣', '♦'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const tr = text => i18n.text(text, prefs.language);
  const refKey = ref => ref.group + (ref.index ?? '') + (ref.count > 1 ? '-' + ref.count : '');

  function save() {
    try {
      localStorage.setItem(key, JSON.stringify({ prefs, state, history, future, wins, rewarded }));
      saved = true;
    } catch { saved = false; }
  }

  async function animateFinish(plan) {
    const table = byId('tableau').closest('main');
    const skipAnimation = matchMedia('(prefers-reduced-motion: reduce)').matches;
    table.inert = true;
    try {
      for (const { from, to } of plan) {
        const source = document.querySelector('[data-card="' + refKey(from) + '"]');
        const target = document.querySelector('[data-card="' + refKey(to) + '"]');
        if (!skipAnimation && source && target && typeof source.animate === 'function') {
          const start = source.getBoundingClientRect();
          const end = target.getBoundingClientRect();
          source.style.zIndex = '10';
          const flight = source.animate([
            { transform: 'translate(0, 0)' },
            { transform: 'translate(' + (end.left - start.left) + 'px, ' + (end.top - start.top) + 'px)' }
          ], { duration: 165, easing: 'ease-in-out', fill: 'forwards' });
          await flight.finished.catch(() => {});
        }
        engine.move(state, from, to);
        if (!skipAnimation) render();
      }
    } finally {
      table.inert = false;
    }
  }

  async function action(apply, nextSelection) {
    const previous = structuredClone(state);
    if (!apply()) {
      render();
      return;
    }
    history.push(previous);
    future = [];
    selected = nextSelection;
    const plan = engine.finishPlan(state);
    if (plan.length) {
      render();
      await animateFinish(plan);
    }
    if (!rewarded && engine.won(state)) {
      wins++;
      rewarded = true;
    }
    save();
    render();
  }

  function choose(ref) {
    if (engine.won(state)) return;
    if (!ref.count && selected && engine.canMoveSelection(state, selected, ref)) {
      action(() => engine.moveSelection(state, selected, ref));
      return;
    }
    selected = engine.pile(state, ref).length && refKey(ref) !== (selected && refKey(selected))
      ? ref : undefined;
    render();
  }

  function button(label, run, disabled = false) {
    const element = document.createElement('button');
    element.type = 'button';
    element.textContent = label;
    element.onclick = run;
    element.disabled = disabled;
    return element;
  }

  function cardNode(card, label, empty, ref) {
    const rank = ranks[engine.rank(card) - 1];
    const suit = suits[engine.suit(card)];
    const face = card === undefined ? '' : rank + suit;
    const element = ref ? button('', () => choose(ref)) : document.createElement('span');
    if (face) {
      const value = document.createElement('span');
      value.className = 'card-rank';
      value.textContent = rank;
      const symbol = document.createElement('span');
      symbol.className = 'card-suit';
      symbol.textContent = suit;
      element.append(value, symbol);
    } else {
      element.textContent = '·';
    }
    element.className = 'playing-card';
    if (card === undefined) element.classList.add('empty');
    if ([1, 3].includes(engine.suit(card))) element.classList.add('red');
    if (ref) {
      const active = Boolean(selected && refKey(selected) === refKey(ref));
      element.dataset.card = refKey(ref);
      element.setAttribute('aria-label', label + ' · ' + (face || empty));
      element.setAttribute('aria-pressed', active);
      element.classList.toggle('selected', active);
      element.classList.toggle('legal', Boolean(!ref.count && selected && engine.canMoveSelection(state, selected, ref)));
    }
    return element;
  }

  function section(className) {
    const element = document.createElement('div');
    element.className = className;
    return element;
  }

  function render() {
    const activeCard = document.activeElement?.dataset.card;
    const activeAction = document.activeElement?.dataset.action;
    const [undo, draw, , stock, drawn, waste, row, goal, empty, victory, instructions,
      nextRules, sameSuit, recycle] = solitaireStrings[prefs.language] ?? solitaireStrings.pl;
    document.documentElement.dataset.theme = prefs.contrast ? 'contrast' : prefs.theme;
    document.body.classList.toggle('large', prefs.large);
    byId('contrast').textContent = prefs.language === 'pl' ? '◐ Kontrast' : tr('◐ Contrast');
    byId('contrast').setAttribute('aria-pressed', prefs.contrast);
    byId('large-label').textContent = 'A+';
    byId('large').setAttribute('aria-label', tr('Larger text'));
    const help = prefs.language === 'pl' ? 'Jak grać?' : tr('How to play');
    byId('help-button').textContent = help;
    byId('help-title').textContent = help;
    byId('new-game').textContent = newGameLabels[i18n.languages.indexOf(prefs.language)] ?? newGameLabels[0];
    byId('language-label').textContent = tr('Language');
    byId('theme-label').textContent = tr('Appearance');
    for (const option of byId('theme').options) {
      option.disabled = themeLocked(option.value);
      const progress = option.disabled ? ' · ' + wins + '/' + rewardWins[option.value] : '';
      option.textContent = tr(themes[option.value]) + progress;
    }
    byId('theme').value = prefs.theme;
    byId('undo').textContent = undo;
    byId('undo').hidden = !prefs.showUndo;
    byId('undo').disabled = history.length === 0;
    byId('next-rules').textContent = nextRules;
    byId('same-label').textContent = sameSuit;
    byId('recycle-label').textContent = recycle;
    const [kingLabel, kingNote] = solitaireKingOption[prefs.language] ?? solitaireKingOption.pl;
    SolitaireHelp(byId('rules'), prefs.language, state.kingsOnly);
    byId('kingsOnly-label').textContent = kingLabel;
    byId('kingsOnly-note').textContent = kingNote;
    const [sameNote, recycleNote] = solitaireOptionNotes[prefs.language] ?? solitaireOptionNotes.pl;
    byId('sameSuit-note').textContent = sameNote;
    byId('recycle-note').textContent = recycleNote;
    byId('save-note').textContent = tr(saved ? 'Automatically saved on this device' : 'Could not save the game. Browser storage may be blocked.');
    const [countsLabel, countsNote, undoLabel, undoNote, redo] = solitaireDisplayOptions[prefs.language] ?? solitaireDisplayOptions.pl;
    byId('showCounts-label').textContent = countsLabel;
    byId('showCounts-note').textContent = countsNote;
    byId('showUndo-label').textContent = undoLabel;
    byId('showUndo-note').textContent = undoNote;
    byId('redo').textContent = redo;
    byId('redo').hidden = !prefs.showUndo;
    byId('redo').disabled = future.length === 0;
    const pileLabel = (label, count) => prefs.showCounts ? label + ' · ' + count : label;
    const count = state.goals.reduce((total, pile) => total + pile.length, 0);
    const finished = engine.won(state);
    byId("tableau").closest(".game").classList.toggle("game-won", finished);
    GameVictory(finished, victory);
    byId('status').textContent = finished ? victory + ' · 104/104' : instructions + ' · ' + count + '/104';
    const [full, exit] = solitaireTableLabels[prefs.language] ?? solitaireTableLabels.pl;
    const fullscreen = byId('fullscreen');
    const fullscreenLabel = document.body.classList.contains('table-only') ? exit : full;
    fullscreen.querySelector('.fullscreen-label').textContent = fullscreenLabel;
    fullscreen.setAttribute('aria-label', fullscreenLabel);
    fullscreen.title = fullscreenLabel;

    function supplySlot(label, content) {
      const slot = section('supply-slot');
      const title = document.createElement('span');
      title.textContent = label;
      slot.append(title, content);
      return slot;
    }
    const canDraw = state.stock.length || (state.recycle && state.waste.length);
    const drawnRef = { group: 'drawn' };
    const wasteRef = { group: 'waste' };
    const drawnTop = engine.top(state.drawn);
    const stockCard = drawnTop === undefined
      ? button('', () => {
          action(() => engine.draw(state), drawnRef);
          document.querySelector('[data-card="drawn"]')?.focus();
        }, !canDraw)
      : cardNode(drawnTop, drawn, empty, drawnRef);
    if (drawnTop === undefined) {
      stockCard.dataset.action = 'draw';
      stockCard.className = 'playing-card stock-card';
      stockCard.setAttribute('aria-label', pileLabel(draw, state.stock.length));
      stockCard.title = draw;
      stockCard.classList.toggle('has-stock', Boolean(canDraw));
    }
    const stockPile = section('stock-pile');
    stockPile.classList.toggle('revealed-on-stock', drawnTop !== undefined && state.stock.length > 0);
    stockPile.append(stockCard);
    const wasteCard = cardNode(engine.top(state.waste), waste, empty, wasteRef);
    wasteCard.disabled = !state.waste.length && selected?.group !== 'drawn';
    byId('supply').replaceChildren(
      supplySlot(pileLabel(stock, state.stock.length), stockPile),
      supplySlot(pileLabel(waste, state.waste.length), wasteCard)
    );
    const left = section('card-rows left-rows');
    const right = section('card-rows');
    const goals = section('goals');
    state.rows.forEach((pile, index) => {
      const line = section('card-row');
      line.style.setProperty('--covered-count', Math.max(1, pile.length - 1));
      const movable = engine.sequenceLength(state, index);
      for (let position = 0; position < pile.length - 1; position++) {
        const count = pile.length - position;
        const ref = count <= movable ? { group: 'rows', index, count } : undefined;
        const covered = cardNode(pile[position], row + ' ' + (index + 1) + ' · ×' + count, empty, ref);
        covered.classList.add('covered');
        line.append(covered);
      }
      line.append(cardNode(engine.top(pile), row + ' ' + (index + 1), empty, { group: 'rows', index }));
      (index < 4 ? left : right).append(line);
    });
    state.goals.forEach((pile, index) => {
      goals.append(cardNode(engine.top(pile), goal + ' ' + (index + 1), empty, { group: 'goals', index }));
    });
    const tableau = byId('tableau');
    tableau.style.setProperty('--max-covered-count', Math.max(1, ...state.rows.map(pile => pile.length - 1)));
    tableau.replaceChildren(left, goals, right);
    if (activeCard) (document.querySelector('[data-card="' + activeCard + '"]:not(:disabled)') ?? stockCard).focus();
    if (activeAction) (document.querySelector('[data-action="' + activeAction + '"]:not(:disabled)') ?? stockCard).focus();
    i18n.apply(document.body, prefs.language);
    document.title = gameName();
    const supportText = tr("Domino is free. If you wish, support people affected by the war in Ukraine or dogs and cats in Gdynia, Poland.");
    document.querySelector(".support-causes > p").textContent = supportText.replace(/^[^.!?。！？।]*[.!?。！？।]\s*/u, "");
    document.querySelector(".brand-name").textContent = document.title;
  }

  function gameName() {
    return prefs.language === 'pl' ? 'Osiem Asów' : 'Eight Aces';
  }

  i18n.addLanguages(byId('language'));
  byId('language').value = prefs.language;
  for (const value of Object.keys(themes)) {
    const option = document.createElement('option');
    option.value = value;
    option.translate = false;
    byId('theme').append(option);
  }
  for (const name of ['language', 'theme', 'large', 'sameSuit', 'recycle', 'kingsOnly', 'showCounts', 'showUndo']) {
    const control = byId(name);
    if (control.type === 'checkbox') control.checked = prefs[name];
    control.onchange = () => {
      prefs[name] = control.type === 'checkbox' ? control.checked : control.value;
      if (name === 'kingsOnly') {
        state.kingsOnly = prefs.kingsOnly;
        selected = undefined;
      }
      if (name === 'theme') prefs.contrast = false;
      save();
      render();
    };
  }
  byId('contrast').onclick = () => {
    prefs.contrast = !prefs.contrast;
    save();
    render();
  };
  byId('new-game').onclick = () => {
    if (!engine.won(state) && history.length && !confirm(tr('Start a new game?'))) return;
    state = engine.deal(prefs);
    rewarded = false;
    history = [];
    future = [];
    selected = undefined;
    save();
    render();
  };
  function stepHistory(from, to) {
    if (!prefs.showUndo || !from.length) return;
    to.push(state);
    state = from.pop();
    state.kingsOnly = prefs.kingsOnly;
    selected = undefined;
    save();
    render();
  }
  byId('undo').onclick = () => stepHistory(history, future);
  byId('redo').onclick = () => stepHistory(future, history);
  byId('help-button').onclick = () => byId('help').showModal();
  for (const button of byId('settings').querySelectorAll('.setting-info')) {
    const description = byId(button.getAttribute('aria-controls'));
    button.onclick = () => {
      description.hidden = !description.hidden;
      button.setAttribute('aria-expanded', String(!description.hidden));
    };
  }
  byId('settings-button').onclick = () => byId('settings').showModal();
  const fullscreenButton = byId('fullscreen');
  const tableOnly = open => {
    document.body.classList.toggle('table-only', open);
    fullscreenButton.setAttribute('aria-pressed', String(open));
    render();
  };
  fullscreenButton.onclick = async () => {
    if (document.body.classList.contains('table-only')) {
      if (document.fullscreenElement) await document.exitFullscreen();
      tableOnly(false);
      return;
    }
    tableOnly(true);
    try {
      await document.documentElement.requestFullscreen();
      await screen.orientation?.lock?.('landscape');
    } catch { /* The expanded table works without native fullscreen or orientation lock. */ }
  };
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) tableOnly(false);
  });
  save();
  render();
})();
