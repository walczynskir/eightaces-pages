(() => {
  const engine = PasjansEngine;
  const scoring = PasjansResults;
  const i18n = DominoI18n;
  const byId = id => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const key = 'pasjans.v1';
  const themes = {
    classic: 'Classic', garden: 'Garden', tropics: 'Tropics', beach: 'Beach', porcelain: 'Porcelain', ink: 'Ink & paper', sage: 'Sage', studio: 'Studio',
    forma: 'Forma', energy: 'Energy', tangerine: 'Tangerine', ukraine: 'Ukraine',
    copper: 'Copper & Patina', 'night-sky': 'Navy', 'starry-sky': 'Night sky', 'orange-grove': 'Orange Grove'
  };
  const gardenLabels = {
    pl: 'Ogród', en: 'Garden', es: 'Jardín',
    de: 'Garten', 'zh-Hans': '花园', hi: 'बगीचा',
    fr: 'Jardin', ar: 'الحديقة', it: 'Giardino',
    uk: 'Сад'
  };
  const contrastLabels = {
    pl: 'Kontrast', en: 'Contrast', es: 'Contraste', de: 'Kontrast', 'zh-Hans': '对比度',
    hi: 'कंट्रास्ट', fr: 'Contraste', ar: 'التباين', it: 'Contrasto', uk: 'Контраст'
  };
  const classicLabels = {
    pl: 'Klasyczny', en: 'Classic', es: 'Clásico', de: 'Klassisch', 'zh-Hans': '经典',
    hi: 'क्लासिक', fr: 'Classique', ar: 'كلاسيكي', it: 'Classico', uk: 'Класичний'
  };
  const tropicsLabels = {
    pl: 'Tropiki', en: 'Tropics', es: 'Trópicos', de: 'Tropen', 'zh-Hans': '热带',
    hi: 'उष्णकटिबंध', fr: 'Tropiques', ar: 'المناطق الاستوائية', it: 'Tropici', uk: 'Тропіки'
  };
  const beachLabels = {
    pl: 'Plaża', en: 'Beach', es: 'Playa', de: 'Strand', 'zh-Hans': '海滩',
    hi: 'समुद्र तट', fr: 'Plage', ar: 'الشاطئ', it: 'Spiaggia', uk: 'Пляж'
  };
  const copperLabels = {
    pl: 'Miedź i patyna', en: 'Copper & Patina', es: 'Cobre y pátina', de: 'Kupfer und Patina',
    'zh-Hans': '铜与铜绿', hi: 'तांबा और पटीना', fr: 'Cuivre et patine', ar: 'النحاس والزنجار',
    it: 'Rame e patina', uk: 'Мідь і патина'
  };
  const customThemeLabels = { garden: gardenLabels, classic: classicLabels, tropics: tropicsLabels, beach: beachLabels, copper: copperLabels };
  const featuredThemes = ['classic', 'garden', 'tropics', 'beach'];
  const prefs = { language: 'pl', theme: 'classic', contrast: false, large: false, sameSuit: false, recycle: false, kingsOnly: true, showCounts: false, showUndo: false };
  const rewardWins = { 'orange-grove': 3, copper: 5, 'starry-sky': 10 };
  const gallery = byId('theme-gallery');
  const galleryCopy = {
    pl: ['Więcej motywów…', 'Za osiągnięcia', 'Zamknij', 'Pomarańczowy gaj', 'wygranych', 'Zablokowany', 'Aktywny'],
    en: ['More themes…', 'Achievement themes', 'Close', 'Orange Grove', 'wins', 'Locked', 'Active'],
    de: ['Weitere Designs…', 'Belohnungsdesigns', 'Schließen', 'Orangenhain', 'Siege', 'Gesperrt', 'Aktiv'],
    es: ['Más temas…', 'Temas por logros', 'Cerrar', 'Naranjal', 'victorias', 'Bloqueado', 'Activo'],
    fr: ['Plus de thèmes…', 'Thèmes de récompense', 'Fermer', 'Orangeraie', 'victoires', 'Verrouillé', 'Actif'],
    it: ['Altri temi…', 'Temi premio', 'Chiudi', 'Aranceto', 'vittorie', 'Bloccato', 'Attivo'],
    uk: ['Більше тем…', 'Теми за досягнення', 'Закрити', 'Апельсиновий гай', 'перемог', 'Заблоковано', 'Активна'],
    ar: ['المزيد من السمات…', 'سمات الإنجازات', 'إغلاق', 'بستان البرتقال', 'انتصارات', 'مقفل', 'نشط'],
    hi: ['और थीम…', 'उपलब्धि की थीम', 'बंद करें', 'संतरे का बाग', 'जीत', 'बंद', 'सक्रिय'],
    'zh-Hans': ['更多主题…', '成就主题', '关闭', '橙园', '胜场', '未解锁', '当前']
  };
  const galleryLabels = () => galleryCopy[prefs.language] ?? galleryCopy.en;
  function themeName(value) {
    if (value === 'night-sky') {
      const navy = { pl: 'Granat', de: 'Marineblau', es: 'Azul marino', fr: 'Bleu marine',
        it: 'Blu navy', uk: 'Темно-синій', ar: 'أزرق داكن', hi: 'गहरा नीला', 'zh-Hans': '藏青色' };
      return navy[prefs.language] ?? 'Navy';
    }
    if (value === 'orange-grove') return galleryLabels()[3];
    const labels = customThemeLabels[value];
    return labels ? labels[prefs.language] ?? labels.en : tr(themes[value]);
  }
  function applyTheme(value) {
    prefs.theme = value;
    prefs.contrast = false;
    save();
    render();
  }
  function openGallery() {
    const [title, rewards, close, , winsLabel, lockedLabel, activeLabel] = galleryLabels();
    byId('gallery-title').textContent = title;
    byId('gallery-rewards-title').textContent = rewards;
    byId('gallery-close').textContent = close;
    const ordinary = byId('gallery-ordinary');
    const achievement = byId('gallery-rewards');
    ordinary.replaceChildren();
    achievement.replaceChildren();
    const extraThemes = Object.keys(themes)
      .filter(value => !featuredThemes.includes(value))
      .sort((left, right) => (rewardWins[left] ?? 0) - (rewardWins[right] ?? 0));
    for (const value of [...featuredThemes, ...extraThemes]) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.disabled = themeLocked(value);
      if (prefs.theme === value) button.setAttribute('aria-current', 'true');
      const thumbnail = document.createElement('span');
      thumbnail.className = 'theme-thumbnail';
      thumbnail.setAttribute('aria-hidden', 'true');
      const frame = document.createElement('iframe');
      frame.src = '?' + new URLSearchParams({ miniatura: value, jezyk: prefs.language, rev: '1.5.2' });
      frame.title = themeName(value);
      frame.setAttribute('scrolling', 'no');
      frame.tabIndex = -1;
      frame.loading = 'lazy';
      frame.inert = true;
      frame.setAttribute('sandbox', 'allow-scripts');
      thumbnail.append(frame);
      button.append(thumbnail);
      const name = document.createElement('strong');
      name.textContent = themeName(value);
      button.append(name);
      if (rewardWins[value] || prefs.theme === value) {
        const details = document.createElement('small');
        const threshold = rewardWins[value];
        details.textContent = threshold
          ? (button.disabled ? wins + '/' : '') + threshold + ' ' + winsLabel
          : activeLabel;
        if (button.disabled) details.textContent += ' · ' + lockedLabel;
        button.append(details);
      }
      button.onclick = () => {
        gallery.close();
        applyTheme(value);
        byId('theme').focus();
      };
      item.append(button);
      (rewardWins[value] ? achievement : ordinary).append(item);
    }
    gallery.showModal();
  }
  const requestedThumbnail = params.get('miniatura');
  const thumbnailTheme = Object.hasOwn(themes, requestedThumbnail) ? requestedThumbnail : null;
  let wins = 0;
  let legacyCopper = false;
  let unlockedThemes = [];
  let rewarded = false;
  let state;
  let loadedSave;
  let pendingNewGame;
  let transitioning = false;
  let history = [];
  let future = [];
  let selected;
  const drawnRef = { group: 'drawn' };
  let saved = true;
  try {
    const stored = thumbnailTheme ? null : JSON.parse(localStorage.getItem(key));
    Object.assign(prefs, stored?.prefs);
    wins = stored?.wins ?? 0;
    legacyCopper = stored?.legacyCopper ?? (wins >= 3);
    if (prefs.theme === 'andromeda') prefs.theme = 'starry-sky';
    if (prefs.theme === 'tangerine-grove') prefs.theme = 'orange-grove';
    unlockedThemes = Array.isArray(stored?.unlockedThemes) ? stored.unlockedThemes.filter(id => Object.hasOwn(rewardWins, id)) : [];
    rewarded = stored?.rewarded === true;
    if (stored?.state?.rows?.length === 8 && stored?.state?.goals?.length === 8 && scoring.valid(stored)) {
      state = stored.state;
      loadedSave = stored;
      history = stored.history ?? [];
      future = stored.future ?? [];
    }
  } catch { /* Start with a fresh deal if storage cannot be read. */ }
  if (thumbnailTheme) {
    document.documentElement.classList.add('theme-thumbnail-page');
    prefs.theme = thumbnailTheme;
    prefs.language = i18n.languages.includes(params.get('jezyk')) ? params.get('jezyk') : 'pl';
    let seed = 731;
    state = engine.deal(prefs, () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    });
  }
  state ??= engine.deal(prefs);
  function newSession() {
    const id = crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint8Array(16)),
      byte => byte.toString(16).padStart(2, '0')).join('');
    return { id, started: true };
  }
  let { results, session } = loadedSave
    ? scoring.read(loadedSave)
    : { results: { baseWins: wins, records: {} }, session: newSession() };
  wins = scoring.winCount(results);
  if (engine.won(state)) {
    scoring.finish(results, session, 'win', 'completed');
    wins = scoring.winCount(results);
    rewarded = true;
  }
  state.kingsOnly ??= prefs.kingsOnly;
  const rewardThreshold = theme => theme === 'copper' && legacyCopper ? 3 : (rewardWins[theme] ?? 0);
  const themeLocked = theme => !unlockedThemes.includes(theme) && wins < rewardThreshold(theme);
  const earnedThemes = () => Object.keys(rewardWins).filter(id => !themeLocked(id));
  if (!thumbnailTheme && (themeLocked(prefs.theme) || !Object.hasOwn(themes, prefs.theme))) prefs.theme = 'classic';
  const newGameLabels = ['Nowy pasjans', 'New solitaire', 'Nuevo solitario', 'Neue Patience',
    '新接龙', 'नया सॉलिटेयर', 'Nouveau solitaire', 'سوليتير جديد', 'Nuovo solitario', 'Новий пасьянс'];

  const suits = ['♠', '♥', '♣', '♦'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const tr = text => i18n.text(text, prefs.language);
  const refKey = ref => ref.group + (ref.index ?? '') + (ref.count > 1 ? '-' + ref.count : '');

  const saveValue = () => ({ prefs, state, history, future, wins, rewarded, legacyCopper, unlockedThemes: earnedThemes(), results, session });
  const serializeSave = () => JSON.stringify(saveValue());
  const lost = () => results.records[session.id]?.outcome === 'loss';

  function save() {
    if (thumbnailTheme) return;
    try {
      localStorage.setItem(key, serializeSave());
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

  let lastCollectTap;

  let routeSearch;

  function updateRouteSearch() {
    if (routeSearch?.state === state && routeSearch.from === selected) return;
    routeSearch?.worker?.terminate();
    routeSearch = undefined;
    if ((selected?.count ?? 1) <= 1) return;

    const search = { state, from: selected, plans: [] };
    routeSearch = search;
    const complete = plans => {
      if (routeSearch !== search) return;
      search.worker?.terminate();
      search.worker = undefined;
      search.plans = plans;
      render();
    };
    const fallback = () => {
      search.worker?.terminate();
      search.worker = undefined;
      setTimeout(() => {
        if (routeSearch !== search) return;
        complete(search.state.rows.map((_, index) =>
          engine.selectionPlan(search.state, search.from, { group: 'rows', index })));
      }, 0);
    };
    try {
      search.worker = new Worker('move-worker.js?v=duplicate-faces-1');
      search.worker.onmessage = event => complete(event.data);
      search.worker.onerror = fallback;
      search.worker.onmessageerror = fallback;
      search.worker.postMessage({ state, from: selected });
    } catch {
      fallback();
    }
  }

  function planTo(ref) {
    if (!selected || ref.count) return [];
    if (selected.count > 1) return ref.group === 'rows' ? routeSearch?.plans[ref.index] ?? [] : [];
    return engine.selectionPlan(state, selected, ref);
  }

  async function action(apply, nextSelection) {
    if (lost()) return;
    lastCollectTap = undefined;
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
      save();
      render();
      await animateFinish(plan);
    }
    if (engine.won(state)) {
      scoring.finish(results, session, 'win', 'completed');
      wins = scoring.winCount(results);
      rewarded = true;
    }
    save();
    render();
  }

  function choose(ref, event) {
    if (lost() || engine.won(state)) return;
    const previousTap = lastCollectTap;
    lastCollectTap = undefined;
    const card = engine.top(engine.pile(state, ref));
    const canCollect = ref.group === 'rows' || ref.group === 'waste'
      || ref.group === 'drawn';
    const collectTap = event.detail > 0 && canCollect && !ref.count && card !== undefined;
    const now = performance.now();
    if (collectTap && previousTap?.key === refKey(ref) && previousTap.card === card && now - previousTap.time <= 400) {
      const rtl = document.documentElement.dir === "rtl";
      action(() => engine.collectToFoundation(state, ref, rtl));
      return;
    }
    const plan = planTo(ref);
    if (plan.length) {
      action(() => engine.applySelectionPlan(state, plan));
      return;
    }
    if (collectTap) lastCollectTap = { key: refKey(ref), card, time: now };
    if (state.drawn.length) return;
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
    const element = ref ? button('', event => choose(ref, event)) : document.createElement('span');
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
      const legal = planTo(ref).length > 0;
      element.classList.toggle('legal', legal);
      if (state.drawn.length && ref.group !== 'drawn') element.disabled = !legal;
    }
    return element;
  }

  function section(className) {
    const element = document.createElement('div');
    element.className = className;
    return element;
  }

  const scenicBarColors = {
    classic: '#174b35',
    garden: '#263a22',
    tropics: '#184e77',
    beach: '#07586a',
    'orange-grove': '#ffab00',
    copper: '#3a241d',
    'starry-sky': '#131d33'
  };
  const themeColor = document.querySelector('meta[name="theme-color"]');
  let renderedBarTheme;
  function updateThemeColor(root) {
    const theme = prefs.contrast ? 'contrast' : prefs.theme;
    if (!themeColor || theme === renderedBarTheme) return;
    const color = scenicBarColors[theme] ?? getComputedStyle(root).getPropertyValue('--bg').trim();
    if (color) themeColor.content = color;
    renderedBarTheme = theme;
  }

  function currentStatistics() {
    const losses = Object.values(results.records).filter(record => record.outcome === 'loss').length;
    return { wins, losses };
  }

  const statisticsReset = createStatisticsReset('eight-aces-statistics-baseline-v1', '#progress-dialog',
    currentStatistics, renderProgress);

  function renderProgress() {
    if (thumbnailTheme) return;
    const next = Object.keys(rewardWins).find(themeLocked);
    const reward = next && { name: themeName(next), count: wins, goal: rewardThreshold(next), wins: true };
    const shownWins = statisticsReset.count('wins', wins);
    GamesChestProgressBar(prefs.language, shownWins, reward, () => {
      const copy = progressTransferStrings[prefs.language] ?? progressTransferStrings.en;
      const losses = statisticsReset.count('losses', currentStatistics().losses);
      return [[statisticsReset.recordedLabel, shownWins + losses], [copy[9], shownWins], [copy[10], losses]];
    });
  }

  function render() {
    if (state.drawn.length) selected = drawnRef;
    updateRouteSearch();
    const activeCard = document.activeElement?.dataset.card;
    const activeAction = document.activeElement?.dataset.action;
    const [undo, draw, , stock, drawn, waste, row, goal, empty, victory, instructions,
      , sameSuit, recycle] = solitaireStrings[prefs.language] ?? solitaireStrings.pl;
    const garden = prefs.theme === 'garden' && !prefs.contrast;
    const grove = prefs.theme === 'orange-grove' && !prefs.contrast;
    const root = document.documentElement;
    root.dataset.theme = prefs.contrast ? 'contrast' : garden ? 'sage' : grove ? 'tangerine' : prefs.theme === 'starry-sky' ? 'night-sky' : prefs.theme;
    root.dataset.scenicReward = prefs.contrast ? '' : prefs.theme;
    root.classList.toggle('tangerine-grove-theme', grove);
    root.classList.toggle('garden-theme', garden);
    updateThemeColor(root);
    document.body.classList.toggle('large', prefs.large);
    byId('contrast').textContent = '◐ ' + (contrastLabels[prefs.language] ?? contrastLabels.en);
    byId('contrast').setAttribute('aria-label', tr('High contrast'));
    byId('contrast').setAttribute('aria-pressed', prefs.contrast);
    byId('large-label').textContent = 'A+';
    byId('large').setAttribute('aria-label', tr('Larger text'));
    const help = prefs.language === 'pl' ? 'Jak grać?' : tr('How to play');
    byId('help-button').querySelector('.help-button-label').textContent = help;
    byId('help-button').setAttribute('aria-label', help);
    byId('help-button').title = help;
    byId('help-title').textContent = help;
    const newGameLabel = newGameLabels[i18n.languages.indexOf(prefs.language)] ?? newGameLabels[0];
    byId('new-game').querySelector('.new-game-label').textContent = newGameLabel;
    byId('new-game').setAttribute('aria-label', newGameLabel);
    byId('new-game').title = newGameLabel;
    byId('language-label').textContent = tr('Language');
    byId('theme-label').textContent = tr('Appearance');
    const visibleThemes = featuredThemes.includes(prefs.theme) ? featuredThemes : [...featuredThemes, prefs.theme];
    themeSelect.replaceChildren(
      ...visibleThemes.map(value => new Option(themeName(value), value)),
      new Option(galleryLabels()[0], 'more')
    );
    themeSelect.value = prefs.theme;
    byId('undo').querySelector('.history-label').textContent = undo;
    byId('undo').setAttribute('aria-label', undo);
    byId('undo').title = undo;
    byId('undo').hidden = !prefs.showUndo;
    byId('undo').disabled = lost() || history.length === 0;
    byId('same-label').textContent = sameSuit;
    byId('recycle-label').textContent = recycle;
    const [kingLabel, kingNote] = solitaireKingOption[prefs.language] ?? solitaireKingOption.pl;
    SolitaireHelp(byId('rules'), prefs.language, state.kingsOnly);
    byId('kingsOnly-label').textContent = kingLabel;
    byId('kingsOnly-note').textContent = kingNote;
    const [sameNote, recycleNote] = solitaireOptionNotes[prefs.language] ?? solitaireOptionNotes.pl;
    byId('sameSuit-note').textContent = sameNote;
    byId('recycle-note').textContent = recycleNote;
    byId('save-note').textContent = saved ? '' : tr('Could not save the game. Browser storage may be blocked.');
    const [countsLabel, countsNote, undoLabel, undoNote, redo] = solitaireDisplayOptions[prefs.language] ?? solitaireDisplayOptions.pl;
    byId('showCounts-label').textContent = countsLabel;
    byId('showCounts-note').textContent = countsNote;
    byId('showUndo-label').textContent = undoLabel;
    byId('showUndo-note').textContent = undoNote;
    byId('redo').querySelector('.history-label').textContent = redo;
    byId('redo').setAttribute('aria-label', redo);
    byId('redo').title = redo;
    byId('redo').hidden = !prefs.showUndo;
    byId('redo').disabled = lost() || future.length === 0;
    const pileLabel = (label, count) => prefs.showCounts ? label + ' · ' + count : label;
    const count = state.goals.reduce((total, pile) => total + pile.length, 0);
    const finished = engine.won(state);
    byId("tableau").closest(".game").classList.toggle("game-won", finished);
    GameVictory(finished, victory);
    const blocked = !finished && !lost() && !engine.hasAvailableMove(state);
    const gameStatus = lost() ? tr('Game lost.') : finished ? victory : blocked ? tr('No available moves.') : instructions;
    byId('status').textContent = gameStatus + ' · ' + count + '/104';
    byId('end-blocked-game').hidden = !blocked;
    byId('end-blocked-game').textContent = tr('End game');
    const [full, exit] = solitaireTableLabels[prefs.language] ?? solitaireTableLabels.pl;
    const fullscreen = byId('fullscreen');
    const fullscreenLabel = document.body.classList.contains('table-only') ? exit : full;
    fullscreen.querySelector('.fullscreen-label').textContent = fullscreenLabel;
    fullscreen.setAttribute('aria-label', fullscreenLabel);
    fullscreen.title = fullscreenLabel;

    function supplySlot(content, count) {
      const slot = section('supply-slot');
      slot.append(content);
      if (prefs.showCounts) {
        const badge = document.createElement('span');
        badge.className = 'supply-count';
        badge.setAttribute('aria-hidden', 'true');
        badge.textContent = count;
        slot.append(badge);
      }
      return slot;
    }
    const drawCount = state.stock.length || (state.recycle ? state.waste.length : 0);
    const wasteRef = { group: 'waste' };
    const drawnTop = engine.top(state.drawn);
    const stockCard = drawnTop === undefined
      ? button('', () => {
          action(() => engine.draw(state), drawnRef);
          document.querySelector('[data-card="drawn"]')?.focus();
        }, !drawCount)
      : cardNode(drawnTop, pileLabel(drawn, state.stock.length), empty, drawnRef);
    if (drawnTop === undefined) {
      stockCard.dataset.action = 'draw';
      stockCard.className = 'playing-card stock-card';
      stockCard.setAttribute('aria-label', draw + ' · ' + pileLabel(stock, state.stock.length));
      stockCard.title = draw;
      stockCard.classList.toggle('has-stock', drawCount > 0);
    }
    const stockPile = section('stock-pile');
    stockPile.classList.toggle('single-stock-card', (drawnTop === undefined ? drawCount : state.stock.length) === 1);
    stockPile.classList.toggle('revealed-on-stock', drawnTop !== undefined && state.stock.length > 0);
    stockPile.append(stockCard);
    const wasteCard = cardNode(engine.top(state.waste), pileLabel(waste, state.waste.length), empty, wasteRef);
    wasteCard.disabled = !state.drawn.length && !state.waste.length;
    byId('supply').replaceChildren(
      supplySlot(stockPile, state.stock.length),
      supplySlot(wasteCard, state.waste.length)
    );
    const left = section('card-rows left-rows');
    const right = section('card-rows');
    const goals = section('goals');
    state.rows.forEach((pile, index) => {
      const line = section('card-row');
      line.style.setProperty('--covered-count', Math.max(1, pile.length - 1));
      const movable = state.drawn.length ? 1 : engine.sequenceLength(state, index);
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
    renderSettings();
    renderProgress();
    i18n.apply(document.body, prefs.language);
    document.title = gameName();
    document.querySelector(".brand-name").textContent = document.title;
    fitHeader();
    fitToolbar();
  }

  function renderSettings() {
    const labels = settingsDialogStrings[prefs.language] ?? settingsDialogStrings.en;
    renderPreferencesTransfer();
    byId('settings-title').textContent = tr('Settings');
    byId('settings-rules-heading').textContent = labels.rules;
    byId('settings-display-heading').textContent = labels.display;
    byId('next-rules').textContent = labels.autosave;
    const close = tr('Close');
    byId('settings-dismiss').setAttribute('aria-label', close);
    byId('settings-dismiss').title = close;
    const error = byId('settings-save-error');
    const newError = !saved && error.hidden;
    error.hidden = saved;
    if (newError) byId('settings').querySelector('.settings-body').scrollTop = 0;
    byId('settings-save-error-text').textContent = labels.error;
    byId('settings-save-retry').textContent = labels.retry;
    for (const timing of byId('settings').querySelectorAll('[data-setting-applies]')) {
      timing.textContent = labels[timing.dataset.settingApplies];
    }
    for (const button of byId('settings').querySelectorAll('.setting-info')) {
      const label = button.closest('.setting-item').querySelector('.setting-name').textContent;
      button.setAttribute('aria-label', labels.about + label);
    }
  }

  function gameName() {
    return tr('Eight Aces');
  }

  i18n.addLanguages(byId('language'));
  byId('language').value = prefs.language;
  const themeSelect = byId('theme');
  themeSelect.translate = false;
  themeSelect.onchange = () => {
    const value = themeSelect.value;
    if (value === 'more') {
      themeSelect.value = prefs.theme;
      openGallery();
    } else if (Object.hasOwn(themes, value) && !themeLocked(value)) {
      applyTheme(value);
    }
  };
  for (const name of ['language', 'large', 'sameSuit', 'recycle', 'kingsOnly', 'showCounts', 'showUndo']) {
    const control = byId(name);
    if (control.type === 'checkbox') control.checked = prefs[name];
    control.onchange = () => {
      prefs[name] = control.type === 'checkbox' ? control.checked : control.value;
      if (name === 'kingsOnly') {
        state.kingsOnly = prefs.kingsOnly;
        selected = undefined;
      }
      save();
      render();
    };
  }
  byId('contrast').onclick = () => {
    prefs.contrast = !prefs.contrast;
    save();
    render();
  };
  const replacementCopy = {
    pl: 'Rozpoczęcie nowego pasjansa zaliczy bieżącą partię jako przegraną.',
    en: 'Starting a new solitaire will count the current game as a loss.',
    es: 'Empezar un nuevo solitario contará la partida actual como una derrota.',
    de: 'Eine neue Patience zählt die aktuelle Partie als Niederlage.',
    'zh-Hans': '开始新牌局会将当前牌局记为失败。',
    hi: 'नया सॉलिटेयर शुरू करने पर मौजूदा खेल हार के रूप में दर्ज होगा।',
    fr: 'Commencer un nouveau solitaire comptera la partie en cours comme une défaite.',
    ar: 'بدء سوليتير جديد سيُسجّل اللعبة الحالية كخسارة.',
    it: 'Iniziare un nuovo solitario conterà la partita attuale come una sconfitta.',
    uk: 'Початок нового пасьянсу зарахує поточну партію як поразку.'
  };
  const newGameDialog = byId('confirm-new-game');
  byId('new-game').onclick = () => {
    if (!Object.hasOwn(results.records, session.id)) {
      pendingNewGame = session.id;
      byId('confirm-new-title').textContent = tr('Start a new game?');
      byId('confirm-new-description').textContent = replacementCopy[prefs.language] ?? replacementCopy.en;
      byId('cancel-new').textContent = tr('Return to game');
      byId('accept-new').textContent = byId('new-game').querySelector('.new-game-label').textContent;
      newGameDialog.returnValue = 'cancel';
      newGameDialog.showModal();
      return;
    }
    startNewGame();
  };
  newGameDialog.querySelector('form').onsubmit = event => {
    event.preventDefault();
    const confirmed = event.submitter?.value === 'start' && pendingNewGame === session.id;
    pendingNewGame = undefined;
    newGameDialog.close(confirmed ? 'start' : 'cancel');
    if (confirmed) startNewGame();
  };
  newGameDialog.oncancel = () => { pendingNewGame = undefined; };
  newGameDialog.onclose = () => {
    // A queued close may belong to an earlier opening of this dialog.
    if (!newGameDialog.open) pendingNewGame = undefined;
  };

  function startNewGame() {
    if (transitioning) return;
    transitioning = true;
    try {
      const nextResults = structuredClone(results);
      scoring.finish(nextResults, session, 'loss', 'replaced');
      const nextState = engine.deal(prefs);
      const nextSession = newSession();
      const nextSave = { ...saveValue(), results: nextResults, session: nextSession,
        state: nextState, history: [], future: [], rewarded: false };
      // Persist the result and replacement together before changing the visible game.
      localStorage.setItem(key, JSON.stringify(nextSave));
      results = nextResults;
      session = nextSession;
      state = nextState;
      lastCollectTap = undefined;
      rewarded = false;
      history = [];
      future = [];
      selected = undefined;
      saved = true;
    } catch {
      saved = false;
    } finally {
      transitioning = false;
    }
    render();
  }
  function stepHistory(from, to) {
    if (lost() || !prefs.showUndo || !from.length) return;
    lastCollectTap = undefined;
    to.push(state);
    const activeKingsOnly = state.kingsOnly;
    state = from.pop();
    state.kingsOnly = activeKingsOnly;
    selected = undefined;
    save();
    render();
  }
  byId('undo').onclick = () => stepHistory(history, future);
  byId('redo').onclick = () => stepHistory(future, history);
  byId('end-blocked-game').onclick = () => {
    if (transitioning || lost() || engine.won(state) || engine.hasAvailableMove(state)) return;
    const nextResults = structuredClone(results);
    if (!scoring.finish(nextResults, session, 'loss', 'completed')) return;
    try {
      localStorage.setItem(key, JSON.stringify({ ...saveValue(), results: nextResults }));
      results = nextResults;
      selected = undefined;
      saved = true;
    } catch {
      saved = false;
    }
    render();
    if (saved) byId('status').focus();
  };
  byId('help-button').onclick = () => byId('help').showModal();
  for (const button of byId('settings').querySelectorAll('.setting-info')) {
    const description = byId(button.getAttribute('aria-controls'));
    button.onclick = () => {
      description.hidden = !description.hidden;
      button.setAttribute('aria-expanded', String(!description.hidden));
    };
  }
  const preferenceFiles = GamesChestBackup;
  const progressBackup = PasjansProgressBackup;
  const preferenceSchema = { game: 'eight-aces', languages: i18n.languages,
    options: Object.fromEntries(['sameSuit', 'recycle', 'kingsOnly', 'showCounts', 'showUndo']
      .map(name => [name, value => typeof value === 'boolean'])) };
  preferenceSchema.validProgress = progressBackup.validProgress;
  preferenceSchema.readLegacy = value => progressBackup.readLegacy(value, prefs, i18n.languages);
  const currentProgress = () => ({ results, legacyCopper, unlockedThemes: earnedThemes() });
  let preferenceMessage;
  let pendingPreferences;
  let preferenceRead = 0;
  function renderPreferencesTransfer() {
    const copy = preferencesTransferStrings[prefs.language] ?? preferencesTransferStrings.en;
    const progressCopy = progressTransferStrings[prefs.language] ?? progressTransferStrings.en;
    byId('preferences-file-heading').textContent = progressCopy[0];
    byId('export-preferences').textContent = progressCopy[1];
    byId('import-preferences').textContent = progressCopy[2];
    byId('preferences-file-scope').textContent = progressCopy[3];
    const codes = { success: 5, locked: 6, unavailable: 7, invalid: 8, game: 9,
      version: 10, read: 11, write: 12, export: 13 };
    byId('preferences-status').textContent = (preferenceMessage ?? []).map(code => code === 'success' ? progressCopy[4] : copy[codes[code]]).join(' ');
    byId('retry-preferences').hidden = !pendingPreferences;
    byId('retry-preferences').textContent = (settingsDialogStrings[prefs.language] ?? settingsDialogStrings.en).retry;
  }
  function planProgress(candidate) {
    const merged = progressBackup.merge(currentProgress(), candidate);
    const total = scoring.winCount(merged.results);
    const imported = GamesChestPreferences.resolveTheme(candidate.preferences, prefs.theme,
      id => Object.hasOwn(themes, id), id => merged.unlockedThemes.includes(id)
        || total >= (id === 'copper' && merged.legacyCopper ? 3 : rewardWins[id] ?? 0));
    return { merged, imported };
  }
  function showProgressConfirmation(candidate) {
    pendingPreferences = candidate;
    const copy = progressTransferStrings[prefs.language] ?? progressTransferStrings.en;
    const plan = planProgress(candidate), before = progressBackup.summary(currentProgress()), after = progressBackup.summary(plan.merged);
    byId('progress-import-title').textContent = copy[5];
    byId('progress-import-description').textContent = copy[6];
    byId('progress-import-stats').textContent = copy[12] + ': ' +
      [copy[9] + ' ' + before.wins + ' / ' + after.wins, copy[10] + ' ' + before.losses + ' / ' + after.losses,
        copy[11] + ' ' + before.unlocked + ' / ' + after.unlocked].join(' · ');
    byId('progress-import-note').textContent = [candidate.legacy ? copy[13] : '',
      candidate.progress.results.baseWins || results.baseWins ? copy[14] : ''].filter(Boolean).join(' ');
    byId('cancel-progress').textContent = copy[7];
    byId('restore-progress').textContent = copy[8];
    byId('progress-import-error').hidden = true;
    byId('confirm-progress').showModal();
  }
  function importPreferences(candidate) {
    const { merged, imported } = planProgress(candidate);
    const nextPrefs = { ...prefs, ...imported.preferences };
    // Restore durable data only: the active board, its rules, history and session remain local.
    const nextSave = { ...saveValue(), prefs: nextPrefs, results: merged.results,
      legacyCopper: merged.legacyCopper, unlockedThemes: merged.unlockedThemes,
      wins: scoring.winCount(merged.results) };
    try { localStorage.setItem(key, JSON.stringify(nextSave)); }
    catch {
      byId('progress-import-error').textContent = (preferencesTransferStrings[prefs.language] ?? preferencesTransferStrings.en)[12];
      byId('progress-import-error').hidden = false;
      return;
    }
    results = merged.results;
    wins = nextSave.wins;
    legacyCopper = merged.legacyCopper;
    unlockedThemes = merged.unlockedThemes;
    pendingPreferences = undefined;
    preferenceMessage = ['success', ...(imported.skipped ? [imported.skipped] : [])];
    Object.assign(prefs, nextPrefs);
    selected = undefined;
    lastCollectTap = undefined;
    saved = true;
    for (const name of ['language', 'large', 'sameSuit', 'recycle', 'kingsOnly', 'showCounts', 'showUndo']) {
      const control = byId(name);
      if (control.type === 'checkbox') control.checked = prefs[name]; else control.value = prefs[name];
    }
    byId('confirm-progress').close('restored');
    render();
  }
  const settings = byId('settings');
  byId('export-preferences').onclick = () => {
    try {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(new Blob([preferenceFiles.stringify(prefs, currentProgress(), preferenceSchema)], { type: 'application/json' }));
      link.download = 'eight-aces-backup.json';
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(link.href), 30_000);
    } catch {
      preferenceMessage = ['export'];
      renderPreferencesTransfer();
    }
  };
  byId('import-preferences').onclick = () => byId('preferences-file').click();
  byId('preferences-file').onchange = async () => {
    const input = byId('preferences-file');
    const [file] = input.files;
    input.value = '';
    if (!file) return;
    const reading = ++preferenceRead;
    pendingPreferences = undefined;
    preferenceMessage = undefined;
    byId('import-preferences').disabled = true;
    renderPreferencesTransfer();
    try {
      if (file.size > preferenceFiles.maxBytes) throw Object.assign(Error('invalid'), { code: 'invalid' });
      let text;
      try { text = await file.text(); } catch { throw Object.assign(Error('read'), { code: 'read' }); }
      if (reading !== preferenceRead || !settings.open) return;
      showProgressConfirmation(preferenceFiles.parse(text, preferenceSchema));
    } catch (error) {
      if (reading !== preferenceRead || !settings.open) return;
      preferenceMessage = [['invalid', 'game', 'version', 'read'].includes(error.code) ? error.code : 'invalid'];
      renderPreferencesTransfer();
    } finally {
      if (reading === preferenceRead) byId('import-preferences').disabled = false;
    }
  };
  byId('retry-preferences').onclick = () => { if (pendingPreferences) showProgressConfirmation(pendingPreferences); };
  byId('restore-progress').onclick = () => { if (pendingPreferences) importPreferences(pendingPreferences); };
  byId('confirm-progress').addEventListener('close', () => {
    if (byId('confirm-progress').open) return;
    pendingPreferences = undefined;
    byId('import-preferences').focus();
    renderPreferencesTransfer();
  });

  settings.addEventListener('close', () => {
    if (settings.open) return;
    byId('settings-button').focus({ preventScroll: true });
    preferenceRead++;
    pendingPreferences = undefined;
    preferenceMessage = undefined;
    byId('import-preferences').disabled = false;
    renderPreferencesTransfer();
  });
  byId('settings-button').onclick = () => {
    settings.showModal();
  };
  byId('settings-save-retry').onclick = () => {
    save();
    render();
  };
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
  const toolbar = document.querySelector('.game-toolbar');
  const header = document.querySelector('header');
  document.querySelector('#game-picker-button').addEventListener('game-picker-label-change', fitToolbar);
  function fitToolbar() {
    toolbar.classList.remove('compact-utilities', 'compact-history', 'compact-new', 'toolbar-picker-icon', 'toolbar-overflow');
    const styles = getComputedStyle(toolbar);
    const available = toolbar.clientWidth - parseFloat(styles.paddingInlineStart) - parseFloat(styles.paddingInlineEnd);
    const required = () => Math.ceil(byId('new-game').getBoundingClientRect().width
      + toolbar.querySelector('.game-tools').getBoundingClientRect().width + parseFloat(styles.columnGap));
    if (required() > available) toolbar.classList.add('compact-utilities');
    if (required() > available) toolbar.classList.add('compact-history');
    if (required() > available) toolbar.classList.add('compact-new');
    if (required() > available) toolbar.classList.add('toolbar-picker-icon');
    if (required() > available) toolbar.classList.add('toolbar-overflow');
  }
  function fitHeader() {
    header.classList.remove('stacked-controls');
    const styles = getComputedStyle(header);
    const available = header.clientWidth - parseFloat(styles.paddingInlineStart) - parseFloat(styles.paddingInlineEnd);
    const required = header.querySelector('.brand').scrollWidth
      + header.querySelector('.accessibility-controls').offsetWidth + parseFloat(styles.columnGap);
    if (required > available) header.classList.add('stacked-controls');
  }
  const controlsObserver = new ResizeObserver(() => {
    fitHeader();
    fitToolbar();
  });
  controlsObserver.observe(toolbar);
  controlsObserver.observe(header);
  save();
  render();
})();
