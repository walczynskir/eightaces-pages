/* Progress presentation. Game adapters supply their existing counters. */
(() => {
  const labels = {
  "pl": [
    "Moje postępy",
    "Następna nagroda",
    "Ukończone partie",
    "Zamknij",
    "Wygrane partie"
  ],
  "en": [
    "My progress",
    "Next reward",
    "Completed games",
    "Close",
    "Games won"
  ],
  "es": [
    "Mi progreso",
    "Próxima recompensa",
    "Partidas completadas",
    "Cerrar",
    "Partidas ganadas"
  ],
  "de": [
    "Mein Fortschritt",
    "Nächste Belohnung",
    "Abgeschlossene Partien",
    "Schließen",
    "Gewonnene Spiele"
  ],
  "zh-Hans": [
    "我的进度",
    "下一项奖励",
    "已完成的对局",
    "关闭",
    "获胜局数"
  ],
  "hi": [
    "मेरी प्रगति",
    "अगला इनाम",
    "पूरे हुए खेल",
    "बंद करें",
    "जीते गए खेल"
  ],
  "fr": [
    "Ma progression",
    "Prochaine récompense",
    "Parties terminées",
    "Fermer",
    "Parties gagnées"
  ],
  "ar": [
    "تقدّمي",
    "المكافأة التالية",
    "المباريات المكتملة",
    "إغلاق",
    "المباريات الفائزة"
  ],
  "it": [
    "I miei progressi",
    "Prossima ricompensa",
    "Partite completate",
    "Chiudi",
    "Partite vinte"
  ],
  "uk": [
    "Мій прогрес",
    "Наступна нагорода",
    "Завершені партії",
    "Закрити",
    "Виграні партії"
  ]
};
  const get = id => document.getElementById(id);
  const button = get('my-progress');
  const dialog = get('progress-dialog');
  let paintMetrics = () => {};
  button.addEventListener('click', () => {
    paintMetrics();
    dialog.showModal();
  });
  dialog.addEventListener('close', () => button.focus());
  window.GamesChestProgressBar = function render(language, wins, reward, metrics) {
    const [title, next, completed, close, won] = labels[language] ?? labels.en;
    const number = new Intl.NumberFormat(language);
    get('progress-name').textContent = get('progress-title').textContent = title;
    get('progress-close').setAttribute('aria-label', close);
    get('progress-wins').textContent = number.format(wins);
    get('progress-next').hidden = get('progress-reward-detail').hidden = !reward;
    const accessible = [title, won + ': ' + number.format(wins)];
    if (reward) {
      const fraction = number.format(reward.count) + '/' + number.format(reward.goal);
      const detail = next + ': ' + reward.name + ' · ' + fraction + ' · ' + (reward.wins ? won : completed);
      get('progress-next-count').textContent = fraction;
      get('progress-reward-detail').textContent = detail;
      accessible.push(detail);
    }
    button.setAttribute('aria-label', accessible.join(' · '));
    paintMetrics = () => get('progress-metrics').replaceChildren(...metrics().map(([label, count]) => {
      const pair = document.createElement('div');
      pair.className = 'stat';
      const term = document.createElement('dt');
      const value = document.createElement('dd');
      term.textContent = label || completed;
      value.textContent = number.format(count);
      pair.append(term, value);
      return pair;
    }));
    if (dialog.open) paintMetrics();
  };
})();
