(() => {
  const sections = {
    pl: [
      ['Cel gry', 'Z dwóch talii rozdajemy po pięć odkrytych kart w ośmiu rzędach. Wygraj, przenosząc wszystkie 104 karty na osiem środkowych stosów. Każdy zaczyna się od asa i rośnie do króla w jednym kolorze.'],
      ['Ruchy w rzędach', 'Kliknij dostępną kartę na końcu rzędu, a potem podświetlony cel. W rzędzie kładź kartę o jedno oczko niższą, np. 7 na 8. Opcja tego samego koloru ogranicza ruch np. do 7♥ na 8♥. Ze środkowego stosu można zdjąć wierzchnią kartę z powrotem do rzędu.'],
      ['Talia i odrzucone', 'Kliknij zakrytą talię. Odkryta karta jest od razu zaznaczona. Kliknij pasujący rząd, środkowy stos albo stos odrzuconych. Z odrzuconych można zagrać tylko wierzchnią kartę. Domyślnie masz jedno przejście przez talię. Opcja ponownego użycia odrzuconych pozwala odwrócić ich stos bez tasowania.'],
      ['Sekwencje i końcówka', 'Kliknij pierwszą kartę sekwencji, a potem rząd docelowy. Gra wykona przeniesienie, jeśli znajdzie legalne pojedyncze ruchy przez inne rzędy lub środkowe stosy i może odtworzyć ich układ. Gdy wszystkie pozostałe karty są w rzędach i można je od razu zebrać, gra dokończy układanie.']
    ],
    en: [
      ['Goal', 'Two decks are used. Five face-up cards are dealt to each of eight rows. Win by moving all 104 cards to the eight central foundations, each built from ace to king in the same suit.'],
      ['Playing to rows', 'Select the available end card, then a highlighted destination. Build rows one rank down, such as 7 on 8. The same-suit option requires a match, such as 7♥ on 8♥. A foundation’s top card can return to a row.'],
      ['Stock and waste', 'Click the face-down stock to reveal and select one card. Click a legal row, foundation or the waste. Only the top waste card is playable. By default, the stock is used once. Recycling turns the waste over without shuffling.'],
      ['Sequences and finishing', 'Select the first card of a sequence and its destination row. The game moves it if it finds legal single-card moves through other rows or foundations and can restore them. Once all remaining cards are in the rows and can go straight to the foundations, the game collects them.']
    ],
    es: [
      ['Objetivo', 'Se usan dos barajas y se reparten cinco cartas boca arriba en cada una de ocho filas. Gana llevando las 104 cartas a las ocho bases centrales, del as al rey y del mismo palo.'],
      ['Movimientos en las filas', 'Elige la última carta disponible y luego un destino resaltado. Coloca una carta de valor inmediatamente inferior, como un 7 sobre un 8. La opción de mismo palo exige, por ejemplo, 7♥ sobre 8♥. La carta superior de una base puede volver a una fila.'],
      ['Mazo y descarte', 'Pulsa el mazo boca abajo para descubrir y seleccionar una carta. Elige una fila, una base válida o el descarte. Solo se juega la carta superior del descarte. Por defecto hay una pasada. La opción de reutilizar permite voltear el descarte sin barajarlo.'],
      ['Secuencias y final', 'Selecciona el inicio de una secuencia y la fila de destino. El juego la mueve si encuentra jugadas individuales legales usando otras filas o bases y puede restaurarlas. Si todas las cartas restantes están en las filas y pueden ir directamente a las bases, el juego las recoge.']
    ],
    de: [
      ['Spielziel', 'Zwei Kartenspiele werden verwendet. In jede der acht Reihen kommen fünf offene Karten. Bringe alle 104 Karten auf die acht Zielstapel in der Mitte, jeweils vom Ass bis zum König in derselben Kartenfarbe.'],
      ['Züge in den Reihen', 'Wähle die freie Endkarte und dann ein markiertes Ziel. Lege immer einen Rang niedriger, etwa 7 auf 8. Mit der Farboption muss auch die Kartenfarbe passen, etwa 7♥ auf 8♥. Die oberste Karte eines Zielstapels darf zurück in eine Reihe.'],
      ['Talon und Ablage', 'Klicke auf den verdeckten Talon, um eine Karte aufzudecken und auszuwählen. Wähle eine passende Reihe, einen Zielstapel oder die Ablage. Nur die oberste Ablagekarte ist spielbar. Standardmäßig gibt es einen Durchgang. Die Wiederverwendung dreht die Ablage ohne Mischen um.'],
      ['Folgen und Spielende', 'Wähle den Anfang einer Folge und die Zielreihe. Das Spiel verschiebt sie, wenn es legale Einzelzüge über andere Reihen oder Zielstapel findet und diese wiederherstellen kann. Liegen alle übrigen Karten in den Reihen und können direkt abgelegt werden, sammelt das Spiel sie ein.']
    ],
    'zh-Hans': [
      ['游戏目标', '使用两副牌，八列各发五张明牌。将全部 104 张牌移到中央八个目标堆即可获胜。每堆同花色从 A 排到 K。'],
      ['牌列操作', '选择牌列末端可用的牌，再点选高亮目标。牌列按点数递减，例如把 7 放在 8 上。同花色选项开启后，只能把 7♥ 放在 8♥ 上之类的同花色牌上。目标堆的顶牌也可以移回牌列。'],
      ['牌库和弃牌堆', '点击背面朝上的牌库，翻开并选中一张牌，再点选合法牌列、目标堆或弃牌堆。弃牌堆只有顶牌可用。默认只能抽一轮。开启循环后可直接翻转弃牌堆，无须洗牌。'],
      ['移动序列与收尾', '选择序列的第一张牌和目标牌列。如果游戏能借助其他牌列或目标堆逐张合法移动并恢复辅助牌堆，就会移动整个序列。如果剩余牌都在牌列中且可直接收集，游戏会自动完成。']
    ],
    hi: [
      ['खेल का लक्ष्य', 'दो गड्डियों से आठ पंक्तियों में पाँच-पाँच खुले पत्ते बाँटे जाते हैं। जीतने के लिए सभी 104 पत्ते बीच के आठ लक्ष्य ढेरों में रखें। हर ढेर में एक ही सूट के पत्ते इक्के से बादशाह तक जाएँ।'],
      ['पंक्तियों में चालें', 'पंक्ति का आखिरी उपलब्ध पत्ता चुनें, फिर हाइलाइट किया गया लक्ष्य चुनें। एक अंक छोटा पत्ता रखें, जैसे 8 पर 7। एक ही सूट का विकल्प चाल को 8♥ पर 7♥ जैसे मेल तक सीमित करता है। लक्ष्य ढेर का सबसे ऊपर वाला पत्ता पंक्ति में वापस रखा जा सकता है।'],
      ['गड्डी और छोड़े हुए पत्ते', 'बंद गड्डी पर क्लिक करके एक पत्ता खोलें और चुनें। फिर उपयुक्त पंक्ति, लक्ष्य ढेर या छोड़े हुए पत्तों का ढेर चुनें। छोड़े हुए ढेर से केवल ऊपर वाला पत्ता खेल सकते हैं। सामान्यतः गड्डी एक बार चलती है। दोबारा इस्तेमाल का विकल्प ढेर को बिना फेंटे पलटता है।'],
      ['क्रम और खेल का अंत', 'क्रम का पहला पत्ता और लक्ष्य पंक्ति चुनें। खेल तभी क्रम को चलाता है जब वह दूसरे ढेरों के सहारे वैध एकल चालें ढूँढकर उन ढेरों को वापस पहले जैसा कर सके। जब बचे हुए सभी पत्ते पंक्तियों से सीधे लक्ष्य ढेरों में जा सकते हैं, खेल उन्हें अपने आप जमा करता है।']
    ],
    fr: [
      ['But du jeu', 'Deux jeux sont utilisés. Huit rangées reçoivent cinq cartes visibles chacune. Placez les 104 cartes sur les huit fondations centrales, chacune de l’as au roi dans la même enseigne.'],
      ['Jouer dans les rangées', 'Choisissez la dernière carte disponible, puis une destination surlignée. Posez une carte de rang immédiatement inférieur, comme un 7 sur un 8. L’option de même enseigne impose par exemple 7♥ sur 8♥. La carte du dessus d’une fondation peut revenir dans une rangée.'],
      ['Pioche et défausse', 'Cliquez sur la pioche pour retourner et sélectionner une carte. Choisissez une rangée ou une fondation compatible, ou la défausse. Seule la carte du dessus de la défausse est jouable. Par défaut, un seul passage est permis. Le recyclage retourne la défausse sans la mélanger.'],
      ['Suites et fin de partie', 'Choisissez le début d’une suite et sa rangée cible. Le jeu la déplace s’il trouve des coups individuels légaux via d’autres rangées ou fondations et peut les rétablir. Si toutes les cartes restantes peuvent aller directement des rangées aux fondations, le jeu les collecte.']
    ],
    ar: [
      ['هدف اللعبة', 'تُستخدم رزمتان، وتوزع خمس بطاقات مكشوفة في كل صف من الصفوف الثمانية. للفوز، انقل البطاقات الـ104 إلى كومات الهدف الثماني في الوسط، من الآس إلى الملك ومن النوع نفسه في كل كومة.'],
      ['اللعب في الصفوف', 'اختر البطاقة المتاحة في نهاية الصف ثم اختر وجهة مميزة. ضع بطاقة أقل بدرجة واحدة، مثل 7 فوق 8. يفرض خيار النوع نفسه تطابق النوع، مثل 7♥ فوق 8♥. يمكن إعادة أعلى بطاقة من كومة الهدف إلى صف.'],
      ['الرزمة والبطاقات المستبعدة', 'انقر على الرزمة المغطاة لكشف بطاقة وتحديدها، ثم اختر صفًا أو كومة هدف صالحة أو كومة المستبعدة. يمكنك لعب البطاقة العليا فقط من المستبعدة. يسمح افتراضيًا بمرور واحد. يتيح خيار إعادة الاستخدام قلب الكومة دون خلط.'],
      ['التسلسلات ونهاية اللعبة', 'اختر بداية التسلسل والصف المستهدف. تنقل اللعبة التسلسل إذا وجدت حركات فردية قانونية عبر صفوف أو كومات هدف أخرى وأمكنها إعادتها لحالتها. تجمع اللعبة البطاقات المتبقية تلقائيًا إذا أمكن نقلها مباشرة من الصفوف إلى كومات الهدف.']
    ],
    it: [
      ['Obiettivo', 'Si usano due mazzi. Si distribuiscono cinque carte scoperte in ciascuna delle otto file. Vinci portando tutte le 104 carte sulle otto basi centrali, dall’asso al re dello stesso seme.'],
      ['Giocare nelle file', 'Scegli l’ultima carta disponibile e poi una destinazione evidenziata. Posa una carta di un valore inferiore, per esempio un 7 su un 8. L’opzione dello stesso seme richiede per esempio 7♥ su 8♥. La cima di una base può tornare in una fila.'],
      ['Mazzo e scarti', 'Fai clic sul mazzo coperto per scoprire e selezionare una carta. Scegli una fila o una base compatibile, oppure gli scarti. Puoi giocare solo la carta in cima agli scarti. Di norma è consentito un passaggio. Il riuso gira gli scarti senza mescolarli.'],
      ['Sequenze e fine', 'Scegli l’inizio di una sequenza e la fila di destinazione. Il gioco la sposta se trova mosse singole legali attraverso altre file o basi e può ripristinarle. Se tutte le carte rimanenti possono andare direttamente dalle file alle basi, il gioco le raccoglie.']
    ],
    uk: [
      ['Мета гри', 'Використовуються дві колоди. У кожному з восьми рядів роздають по п’ять відкритих карт. Для перемоги перенесіть усі 104 карти у вісім центральних стопок від туза до короля однієї масті.'],
      ['Ходи в рядах', 'Виберіть доступну крайню карту, а потім підсвічену ціль. Кладіть карту на один ранг нижчу, наприклад 7 на 8. Опція однієї масті вимагає відповідності, наприклад 7♥ на 8♥. Верхню карту цільової стопки можна повернути в ряд.'],
      ['Колода й скинуті карти', 'Натисніть на закриту колоду, щоб відкрити й вибрати карту. Виберіть відповідний ряд, цільову стопку або стопку скинутих. Із неї доступна лише верхня карта. Типово дозволено один прохід. Повторне використання перевертає скинуті карти без тасування.'],
      ['Послідовності й завершення', 'Виберіть початок послідовності й цільовий ряд. Гра перенесе її, якщо знайде законні окремі ходи через інші ряди або цільові стопки й відновить їх. Коли всі решта карт можуть одразу перейти з рядів до цільових стопок, гра збере їх автоматично.']
    ]
  };

  const emptyRow = {
    pl: ['Pusty rząd przyjmuje dowolną kartę poza asem.', 'Pusty rząd przyjmuje tylko króla.'],
    en: ['Any card except an ace can fill an empty row.', 'Only a king can fill an empty row.'],
    es: ['Una fila vacía admite cualquier carta excepto un as.', 'Una fila vacía solo admite un rey.'],
    de: ['In eine leere Reihe passt jede Karte außer einem Ass.', 'In eine leere Reihe passt nur ein König.'],
    'zh-Hans': ['空列可放除 A 以外的任意牌。', '空列只能放 K。'],
    hi: ['खाली पंक्ति में इक्के को छोड़कर कोई भी पत्ता रख सकते हैं।', 'खाली पंक्ति में सिर्फ़ बादशाह रख सकते हैं।'],
    fr: ['Une rangée vide accepte toute carte sauf un as.', 'Une rangée vide accepte seulement un roi.'],
    ar: ['يقبل الصف الفارغ أي بطاقة عدا الآس.', 'لا يقبل الصف الفارغ إلا ملكًا.'],
    it: ['Una fila vuota accetta qualsiasi carta tranne l’asso.', 'Una fila vuota accetta solo un re.'],
    uk: ['Порожній ряд приймає будь-яку карту, крім туза.', 'Порожній ряд приймає лише короля.']
  };

  const shortcuts = {
    pl: 'Kliknij dwukrotnie kartę na końcu rzędu lub stuknij ją szybko dwa razy. Gra zbierze z tego rzędu kolejne pasujące karty na jeden środkowy stos.',
    en: 'Double-click or quickly double-tap the end card to collect consecutive fitting cards from that row onto one foundation.',
    es: 'Haz doble clic o toca dos veces la última carta para llevar las cartas consecutivas compatibles de esa fila a una base.',
    de: 'Klicke oder tippe zweimal schnell auf die Endkarte, um passende aufeinanderfolgende Karten dieser Reihe auf einen Zielstapel zu legen.',
    'zh-Hans': '双击或快速点按两次末端牌，可将该列连续符合条件的牌移到同一个目标堆。',
    hi: 'पंक्ति के आखिरी पत्ते पर दो बार जल्दी क्लिक या टैप करें। लगातार मेल खाने वाले पत्ते एक ही लक्ष्य ढेर में चले जाएँगे।',
    fr: 'Double-cliquez ou touchez rapidement deux fois la dernière carte pour envoyer les cartes consécutives compatibles sur une même fondation.',
    ar: 'انقر أو المس بطاقة نهاية الصف مرتين بسرعة لنقل البطاقات المتتالية المطابقة من الصف إلى كومة هدف واحدة.',
    it: 'Fai doppio clic o tocca rapidamente due volte l’ultima carta per raccogliere su una sola base le carte consecutive compatibili della fila.',
    uk: 'Двічі швидко натисніть крайню карту, щоб зібрати послідовні відповідні карти ряду на одну цільову стопку.'
  };

  window.SolitaireHelp = (container, language, kingsOnly) => {
    const copy = sections[language] ?? sections.pl;
    const vacancy = (emptyRow[language] ?? emptyRow.pl)[Number(Boolean(kingsOnly))];
    container.replaceChildren(...copy.map(([title, text], index) => {
      const section = document.createElement('section');
      const heading = document.createElement('h3');
      heading.textContent = title;
      const paragraph = document.createElement('p');
      paragraph.textContent = index === 1 ? text + ' ' + vacancy + ' ' + (shortcuts[language] ?? shortcuts.pl) : text;
      section.append(heading, paragraph);
      return section;
    }));
  };
})();
