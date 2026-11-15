(() => {
  const engine = PasjansEngine;
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
  let rewarded = false;
  let state;
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
    rewarded = stored?.rewarded === true;
    if (stored?.state?.rows?.length === 8 && stored?.state?.goals?.length === 8) {
      state = stored.state;
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
  state.kingsOnly = prefs.kingsOnly;
  const rewardThreshold = theme => theme === 'copper' && legacyCopper ? 3 : (rewardWins[theme] ?? 0);
  const themeLocked = theme => wins < rewardThreshold(theme);
  if (!thumbnailTheme && (themeLocked(prefs.theme) || !Object.hasOwn(themes, prefs.theme))) prefs.theme = 'classic';
  const newGameLabels = ['Nowy pasjans', 'New solitaire', 'Nuevo solitario', 'Neue Patience',
    '新接龙', 'नया सॉलिटेयर', 'Nouveau solitaire', 'سوليتير جديد', 'Nuovo solitario', 'Новий пасьянс'];

  const suits = ['♠', '♥', '♣', '♦'];
  const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  const tr = text => i18n.text(text, prefs.language);
  const refKey = ref => ref.group + (ref.index ?? '') + (ref.count > 1 ? '-' + ref.count : '');

  const serializeSave = () => JSON.stringify({ prefs, state, history, future, wins, rewarded, legacyCopper });

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

  async function action(apply, nextSelection) {
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

  function choose(ref, event) {
    if (engine.won(state)) return;
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
    if (!ref.count && selected && engine.canMoveSelection(state, selected, ref)) {
      action(() => engine.moveSelection(state, selected, ref));
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
      const legal = Boolean(!ref.count && selected && engine.canMoveSelection(state, selected, ref));
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

  function render() {
    if (state.drawn.length) selected = drawnRef;
    const activeCard = document.activeElement?.dataset.card;
    const activeAction = document.activeElement?.dataset.action;
    const [undo, draw, , stock, drawn, waste, row, goal, empty, victory, instructions,
      nextRules, sameSuit, recycle] = solitaireStrings[prefs.language] ?? solitaireStrings.pl;
    const garden = prefs.theme === 'garden' && !prefs.contrast;
    const grove = prefs.theme === 'orange-grove' && !prefs.contrast;
    const root = document.documentElement;
    root.dataset.theme = prefs.contrast ? 'contrast' : garden ? 'sage' : grove ? 'tangerine' : prefs.theme === 'starry-sky' ? 'night-sky' : prefs.theme;
    root.dataset.scenicReward = prefs.contrast ? '' : prefs.theme;
    root.classList.toggle('tangerine-grove-theme', grove);
    root.classList.toggle('garden-theme', garden);
    updateThemeColor(root);
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
    byId('redo').querySelector('.history-label').textContent = redo;
    byId('redo').setAttribute('aria-label', redo);
    byId('redo').title = redo;
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
    const canDraw = state.stock.length || (state.recycle && state.waste.length);
    const wasteRef = { group: 'waste' };
    const drawnTop = engine.top(state.drawn);
    const stockCard = drawnTop === undefined
      ? button('', () => {
          action(() => engine.draw(state), drawnRef);
          document.querySelector('[data-card="drawn"]')?.focus();
        }, !canDraw)
      : cardNode(drawnTop, pileLabel(drawn, state.stock.length), empty, drawnRef);
    if (drawnTop === undefined) {
      stockCard.dataset.action = 'draw';
      stockCard.className = 'playing-card stock-card';
      stockCard.setAttribute('aria-label', draw + ' · ' + pileLabel(stock, state.stock.length));
      stockCard.title = draw;
      stockCard.classList.toggle('has-stock', Boolean(canDraw));
    }
    const stockPile = section('stock-pile');
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
  const newGameDialog = byId('confirm-new-game');
  byId('new-game').onclick = () => {
    if (!engine.won(state) && (history.length || future.length)) {
      byId('confirm-new-title').textContent = tr('Start a new game?');
      byId('confirm-new-description').textContent = tr('This replaces your current game. Your statistics will be kept.');
      byId('cancel-new').textContent = tr('Return to game');
      byId('accept-new').textContent = byId('new-game').textContent;
      newGameDialog.returnValue = 'cancel';
      newGameDialog.showModal();
      return;
    }
    startNewGame();
  };
  newGameDialog.onclose = () => {
    if (newGameDialog.returnValue === 'start') startNewGame();
  };

  function startNewGame() {
    lastCollectTap = undefined;
    state = engine.deal(prefs);
    rewarded = false;
    history = [];
    future = [];
    selected = undefined;
    save();
    render();
  }
  function stepHistory(from, to) {
    if (!prefs.showUndo || !from.length) return;
    lastCollectTap = undefined;
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
  const backupLabels = {
    pl: ['Eksportuj zapis', 'Importuj zapis', 'Zastąp zapis', 'Import zastąpi bieżącą partię, ustawienia i postęp.', 'Nie udało się odczytać poprawnego zapisu Ośmiu Asów.', 'Nie udało się zapisać danych na urządzeniu.', 'Anuluj'],
    en: ['Export save', 'Import save', 'Replace save', 'The file is ready. It will replace your current game, settings and progress.', 'Could not read a valid Eight Aces save.', 'Could not save the data on this device.', 'Cancel'],
    es: ['Exportar partida', 'Importar partida', 'Reemplazar partida', 'El archivo está listo. Reemplazará la partida, los ajustes y el progreso actuales.', 'El archivo no contiene un guardado válido de Ocho Ases.', 'No se pudieron guardar los datos en el dispositivo.', 'Cancelar'],
    de: ['Spielstand exportieren', 'Spielstand importieren', 'Spielstand ersetzen', 'Die Datei ist bereit. Sie ersetzt Partie, Einstellungen und Fortschritt.', 'Die Datei enthält keinen gültigen Spielstand für Acht Asse.', 'Die Daten konnten nicht auf dem Gerät gespeichert werden.', 'Abbrechen'],
    'zh-Hans': ['导出存档', '导入存档', '替换存档', '文件已就绪，将替换当前牌局、设置和进度。', '无法读取有效的八张王牌存档。', '无法在此设备上保存数据。', '取消'],
    hi: ['सेव निर्यात करें', 'सेव आयात करें', 'सेव बदलें', 'फ़ाइल तैयार है। यह मौजूदा खेल, सेटिंग और प्रगति बदल देगी।', 'मान्य एट एसेस सेव पढ़ा नहीं जा सका।', 'इस डिवाइस पर डेटा सेव नहीं हो सका।', 'रद्द करें'],
    fr: ['Exporter la sauvegarde', 'Importer la sauvegarde', 'Remplacer la sauvegarde', 'Le fichier est prêt. Il remplacera la partie, les réglages et la progression.', 'Impossible de lire une sauvegarde valide de Huit As.', 'Impossible d’enregistrer les données sur cet appareil.', 'Annuler'],
    ar: ['تصدير الحفظ', 'استيراد الحفظ', 'استبدال الحفظ', 'الملف جاهز وسيستبدل اللعبة والإعدادات والتقدم الحالي.', 'تعذّرت قراءة ملف حفظ صالح للعبة الآسات الثمانية.', 'تعذّر حفظ البيانات على هذا الجهاز.', 'إلغاء'],
    it: ['Esporta salvataggio', 'Importa salvataggio', 'Sostituisci salvataggio', 'Il file è pronto. Sostituirà partita, impostazioni e progressi attuali.', 'Impossibile leggere un salvataggio valido di Otto Assi.', 'Impossibile salvare i dati sul dispositivo.', 'Annulla'],
    uk: ['Експортувати збереження', 'Імпортувати збереження', 'Замінити збереження', 'Файл готовий. Він замінить поточну партію, налаштування й прогрес.', 'Не вдалося прочитати дійсне збереження «Вісім тузів».', 'Не вдалося зберегти дані на цьому пристрої.', 'Скасувати']
  };
  const backupCopy = () => backupLabels[prefs.language] ?? backupLabels.en;
  const settings = byId('settings');
  const saveFile = byId('save-file');
  const restore = byId('restore-save');
  const confirmImport = byId('confirm-import');
  const importError = byId('import-error');
  const status = byId('backup-status');
  let pendingSave;

  function validDeal(deal) {
    if (deal?.rows?.length !== 8 || deal?.goals?.length !== 8
      || !Array.isArray(deal.rows) || !Array.isArray(deal.goals)) return false;
    const piles = [...deal.rows, ...deal.goals, deal.stock, deal.drawn, deal.waste];
    if (!piles.every(Array.isArray) || deal.drawn.length > 1) return false;
    const cards = piles.flat();
    return cards.length === 104 && new Set(cards).size === 104
      && cards.every(card => Number.isInteger(card) && card >= 0 && card < 104)
      && deal.goals.every(pile => pile.every((card, index) =>
        engine.rank(card) === index + 1 && engine.suit(card) === engine.suit(pile[0])));
  }

  function readBackup(value) {
    if (!validDeal(value?.state) || !Number.isSafeInteger(value.wins) || value.wins < 0) throw Error('Invalid save');
    const { history = [], future = [] } = value;
    if (![history, future].every(list => Array.isArray(list) && list.every(validDeal))) throw Error('Invalid history');
    const preferences = {};
    for (const [name, current] of Object.entries(prefs)) {
      const candidate = value.prefs?.[name];
      if (typeof candidate === typeof current) preferences[name] = candidate;
    }
    if (!i18n.languages.includes(preferences.language)) preferences.language = 'pl';
    return JSON.stringify({
      prefs: preferences, state: value.state, history, future, wins: value.wins,
      rewarded: value.rewarded === true, legacyCopper: value.legacyCopper ?? value.wins >= 3
    });
  }

  byId('export-save').onclick = () => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([serializeSave()], { type: 'application/json' }));
    link.download = 'osiem-asow-zapis.json';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 30_000);
  };
  byId('import-save').onclick = () => saveFile.click();
  saveFile.onchange = async () => {
    const [file] = saveFile.files;
    saveFile.value = '';
    if (!file) return;
    pendingSave = undefined;
    status.textContent = '';
    byId('import-save').disabled = true;
    try {
      const backup = readBackup(JSON.parse(await file.text()));
      if (!settings.open) return;
      pendingSave = backup;
      const [, importLabel, restoreLabel, description, , , cancelLabel] = backupCopy();
      byId('import-title').textContent = importLabel;
      byId('import-description').textContent = description;
      byId('cancel-import').textContent = cancelLabel;
      restore.textContent = restoreLabel;
      importError.hidden = true;
      confirmImport.showModal();
    } catch {
      status.textContent = backupCopy()[4];
    } finally {
      byId('import-save').disabled = false;
    }
  };
  restore.onclick = () => {
    if (!pendingSave) return;
    try {
      localStorage.setItem(key, pendingSave);
    } catch {
      importError.textContent = backupCopy()[5];
      importError.hidden = false;
      return;
    }
    location.reload();
  };
  confirmImport.addEventListener('close', () => {
    if (confirmImport.open) return;
    pendingSave = undefined;
    byId('import-save').focus();
  });
  settings.addEventListener('close', () => {
    pendingSave = undefined;
    status.textContent = '';
  });
  byId('settings-button').onclick = () => {
    const [exportLabel, importLabel] = backupCopy();
    byId('export-save').textContent = exportLabel;
    byId('import-save').textContent = importLabel;
    settings.showModal();
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
  save();
  render();
})();
