(function () {
  var LANG_KEY = 'vhpk-lang';
  var RTL = { ur: true, pa: true, sd: true, ps: true };

  var STRINGS = {
    en: {
      home: 'Home',
      excise: 'Excise services',
      licence: 'Driving licence',
      tools: 'Vehicle Tools',
      how: 'How it works',
      about: 'About us',
      contact: 'Contact',
      allTools: 'All vehicle tools',
      browseServices: 'Browse Government Portals',
      vehicleTools: 'Vehicle Tools',
      exploreTools: 'Explore Vehicle Tools',
      heroKicker: 'Official Government Portals & Free Vehicle Tools',
      heroSub: 'Independent informational directory',
      heroBody:
        'Vehicle Hub PK helps you find official vehicle, Excise, taxation and driving licence websites across Pakistan. We are not affiliated with or operated by any government department.',
      independentTitle: 'Independent Information Directory',
      independentBody:
        'Vehicle Hub PK is an independent website and is not affiliated with, endorsed by, authorized by, sponsored by, or operated by the Government of Pakistan or any provincial government department. We provide information and links to official government websites. Government services, records, payments, verification and licence processing are performed only on the respective official government websites.',
      freeTools: 'Free vehicle tools',
      freeToolsLead:
        'Plan fuel, trips, expenses, and document renewals — or decode plates and engine-tax bands — without leaving Vehicle Hub PK.',
      browseAllTools: 'Browse all Vehicle Tools →',
      proofServicesValue: '50+',
      proofServicesLabel: 'Government Service Links',
      proofToolsValue: '10+',
      proofToolsLabel: 'Free Vehicle Tools',
      proofRegionsValue: '6 regions',
      proofRegionsLabel: 'Punjab, Sindh, KPK, Balochistan, Islamabad & Gilgit',
      proofPortalsValue: 'Verified',
      proofPortalsLabel: 'Links to Government Portals',
      language: 'Language',
      fuel: 'Fuel cost calculator',
      maintenance: 'Maintenance reminder',
      mileage: 'Mileage calculator',
      trip: 'Trip cost calculator',
      plate: 'Number plate guide',
      engine: 'Engine size & tax guide',
      expenses: 'Vehicle expenses',
      documents: 'Document reminder',
      finance: 'Car finance / EMI calculator',
      toll: 'Motorway toll estimator',
      usedCar: 'Used car value estimator',
      checklist: 'Used-car buyer checklist'
    },
    ur: {
      home: 'ہوم',
      excise: 'ایکائز سروسز',
      licence: 'ڈرائیونگ لائسنس',
      tools: 'گاڑی کے ٹولز',
      how: 'کیسے کام کرتا ہے',
      about: 'ہمارے بارے میں',
      contact: 'رابطہ',
      allTools: 'تمام گاڑی ٹولز',
      browseServices: 'حکومتی پورٹلز دیکھیں',
      vehicleTools: 'گاڑی کے ٹولز',
      exploreTools: 'گاڑی کے ٹولز دیکھیں',
      heroKicker: 'سرکاری حکومتی پورٹلز اور مفت گاڑی ٹولز',
      heroSub: 'آزاد اطلاعاتی ڈائریکٹری',
      heroBody:
        'Vehicle Hub PK آپ کو پاکستان بھر میں گاڑی، ایکائز، ٹیکس اور ڈرائیونگ لائسنس کی سرکاری ویب سائٹس تلاش کرنے میں مدد دیتا ہے۔ ہم کسی حکومتی ادارے سے وابستہ نہیں۔',
      independentTitle: 'آزاد اطلاعاتی ڈائریکٹری',
      independentBody:
        'Vehicle Hub PK ایک آزاد ویب سائٹ ہے اور حکومتِ پاکستان یا کسی صوبائی محکمے سے وابستہ، منظور شدہ یا چلائی جانے والی نہیں۔ ہم سرکاری ویب سائٹس کی معلومات اور لنکس فراہم کرتے ہیں۔ خدمات صرف متعلقہ سرکاری ویب سائٹس پر ہوتی ہیں۔',
      freeTools: 'مفت گاڑی ٹولز',
      freeToolsLead:
        'ایندھن، سفر، اخراجات اور دستاویز کی یاددہانی کا حساب لگائیں — سب Vehicle Hub PK پر۔',
      browseAllTools: 'تمام گاڑی ٹولز دیکھیں ←',
      proofServicesValue: '50+',
      proofServicesLabel: 'حکومتی سروس لنکس',
      proofToolsValue: '10+',
      proofToolsLabel: 'مفت گاڑی ٹولز',
      proofRegionsValue: '6 علاقے',
      proofRegionsLabel: 'پنجاب، سندھ، کے پی کے، بلوچستان، اسلام آباد اور گلگت',
      proofPortalsValue: 'تصدیق شدہ',
      proofPortalsLabel: 'حکومتی پورٹلز کے لنکس',
      language: 'زبان',
      fuel: 'ایندھن لاگت کیلکولیٹر',
      maintenance: 'مینٹیننس یاددہانی',
      mileage: 'مائلیج کیلکولیٹر',
      trip: 'سفر لاگت کیلکولیٹر',
      plate: 'نمبر پلیٹ گائیڈ',
      engine: 'انجن سائز اور ٹیکس گائیڈ',
      expenses: 'گاڑی کے اخراجات',
      documents: 'دستاویز یاددہانی',
      finance: 'کار فنانس / قسط کیلکولیٹر',
      toll: 'موٹروے ٹول اندازہ',
      usedCar: 'استعمال شدہ گاڑی قیمت اندازہ',
      checklist: 'گاڑی خریداری چیک لسٹ'
    },
    pa: {
      home: 'ہوم',
      excise: 'ایکائز سروسز',
      licence: 'ڈرائیونگ لائسنس',
      tools: 'گاڈی ٹولز',
      how: 'کِداں کم کردا اے',
      about: 'ساڈے بارے',
      contact: 'رابطہ',
      allTools: 'سارے گاڈی ٹولز',
      browseServices: 'حکومتی پورٹل ویکھو',
      vehicleTools: 'گاڈی ٹولز',
      exploreTools: 'گاڈی ٹولز ویکھو',
      heroKicker: 'سرکاری حکومتی پورٹل تے مفت گاڈی ٹولز',
      heroSub: 'آزاد اطلاعاتی ڈائریکٹری',
      heroBody:
        'Vehicle Hub PK پاکستان وچ گاڈی، ایکائز، ٹیکس تے ڈرائیونگ لائسنس دیاں سرکاری ویب سائٹس لبھن وچ مدد کردا اے۔ اسی کسے سرکاری محکمے نال وابستہ نہیں۔',
      independentTitle: 'آزاد اطلاعاتی ڈائریکٹری',
      independentBody:
        'Vehicle Hub PK اک آزاد ویب سائٹ اے تے حکومت پاکستان یا کسے صوبائی محکمے نال وابستہ نہیں۔ اسی سرکاری ویب سائٹس دیاں معلومات تے لنک دیندے آں۔ خدمات صرف سرکاری ویب سائٹس تے ہوندیاں نیں۔',
      freeTools: 'مفت گاڈی ٹولز',
      freeToolsLead: 'ایندھن، سفر، خرچے تے دستاویز یاددہانی — Vehicle Hub PK تے۔',
      browseAllTools: 'سارے گاڈی ٹولز ویکھو ←',
      proofServicesValue: '50+',
      proofServicesLabel: 'حکومتی سروس لنک',
      proofToolsValue: '10+',
      proofToolsLabel: 'مفت گاڈی ٹولز',
      proofRegionsValue: '6 علاقے',
      proofRegionsLabel: 'پنجاب، سندھ، کے پی کے، بلوچستان، اسلام آباد تے گلگت',
      proofPortalsValue: 'تصدیق شدہ',
      proofPortalsLabel: 'حکومتی پورٹل دے لنک',
      language: 'بولی',
      fuel: 'ایندھن لاگت کیلکولیٹر',
      maintenance: 'مینٹیننس یاددہانی',
      mileage: 'مائلیج کیلکولیٹر',
      trip: 'سفر لاگت کیلکولیٹر',
      plate: 'نمبر پلیٹ گائیڈ',
      engine: 'انجن سائز تے ٹیکس گائیڈ',
      expenses: 'گاڈی دے خرچے',
      documents: 'دستاویز یاددہانی',
      finance: 'کار فنانس / قسط کیلکولیٹر',
      toll: 'موٹروے ٹول اندازہ',
      usedCar: 'ورتی ہوئی گاڈی قیمت',
      checklist: 'خریداری چیک لسٹ'
    },
    sd: {
      home: 'گهر',
      excise: 'ايڪسائيز سروسز',
      licence: 'ڊرائيونگ لائسنس',
      tools: 'گاڏي جا اوزار',
      how: 'ڪيئن ڪم ڪري ٿو',
      about: 'اسان بابت',
      contact: 'رابطو',
      allTools: 'سڀ گاڏي اوزار',
      browseServices: 'حڪومتي پورٽل ڏسو',
      vehicleTools: 'گاڏي جا اوزار',
      exploreTools: 'گاڏي اوزار ڏسو',
      heroKicker: 'سرڪاري حڪومتي پورٽل ۽ مفت گاڏي اوزار',
      heroSub: 'آزاد معلوماتي ڊائريڪٽري',
      heroBody:
        'Vehicle Hub PK پاڪستان ۾ گاڏي، ايڪسائيز، ٽيڪس ۽ ڊرائيونگ لائسنس جون سرڪاري ويب سائيٽون ڳولڻ ۾ مدد ڪري ٿو. اسان ڪنهن سرڪاري کاتي سان لاڳاپيل نه آهيون.',
      independentTitle: 'آزاد معلوماتي ڊائريڪٽري',
      independentBody:
        'Vehicle Hub PK هڪ آزاد ويب سائيٽ آهي ۽ پاڪستان جي حڪومت يا ڪنهن صوبائي کاتي سان لاڳاپيل نه آهي. اسان سرڪاري ويب سائيٽن جا لنڪ ڏيون ٿا. خدمتون صرف سرڪاري ويب سائيٽن تي ٿين ٿيون.',
      freeTools: 'مفت گاڏي اوزار',
      freeToolsLead: 'اينڌن، سفر، خرچ ۽ دستاويز ياد ڏياريون — Vehicle Hub PK تي۔',
      browseAllTools: 'سڀ گاڏي اوزار ڏسو ←',
      proofServicesValue: '50+',
      proofServicesLabel: 'حڪومتي سروس لنڪ',
      proofToolsValue: '10+',
      proofToolsLabel: 'مفت گاڏي اوزار',
      proofRegionsValue: '6 علائقا',
      proofRegionsLabel: 'پنجاب، سنڌ، ڪي پي ڪي، بلوچستان، اسلام آباد ۽ گلگت',
      proofPortalsValue: 'تصديق ٿيل',
      proofPortalsLabel: 'حڪومتي پورٽل جا لنڪ',
      language: 'ٻولي',
      fuel: 'اينڌن لاڳت ڪيلكوليٽر',
      maintenance: 'مينٽيننس يادگيري',
      mileage: 'مائليج ڪيلكوليٽر',
      trip: 'سفر لاڳت ڪيلكوليٽر',
      plate: 'نمبر پليٽ گائيڊ',
      engine: 'انجڻ سائيز ۽ ٽيڪس گائيڊ',
      expenses: 'گاڏي جا خرچ',
      documents: 'دستاويز يادگيري',
      finance: 'ڪار فنانس / قسط ڪيلكوليٽر',
      toll: 'موٽر وي ٽول اندازو',
      usedCar: 'استعمال ٿيل گاڏي قيمت',
      checklist: 'خريداري چيڪ لسٽ'
    },
    ps: {
      home: 'کور',
      excise: 'اکسائز خدمتونه',
      licence: 'ډرایور لایسنس',
      tools: 'موټر اوزار',
      how: 'څنګه کار کوي',
      about: 'زموږ په اړه',
      contact: 'اړیکه',
      allTools: 'ټول موټر اوزار',
      browseServices: 'حکومتي پورټلونه وګورئ',
      vehicleTools: 'موټر اوزار',
      exploreTools: 'موټر اوزار وپلټئ',
      heroKicker: 'رسمي حکومتي پورټلونه او وړیا موټر اوزار',
      heroSub: 'خپلواکه معلوماتي لارښود',
      heroBody:
        'Vehicle Hub PK تاسو سره په ټول پاکستان کې د موټر، اکسائز، مالیه او ډرایور لایسنس رسمي ویب پاڼې موندلو کې مرسته کوي. موږ له کوم حکومتي اداره سره تړاو نه لرو.',
      independentTitle: 'خپلواکه معلوماتي لارښود',
      independentBody:
        'Vehicle Hub PK یوه خپلواکه ویب پاڼه ده او د پاکستان حکومت یا کوم ولایتي اداره سره تړاو نه لري. موږ د رسمي حکومتي ویب پاڼو معلومات او لینکونه وړاندې کوو. خدمتونه یوازې په رسمي ویب پاڼو کې ترسره کیږي.',
      freeTools: 'وړیا موټر اوزار',
      freeToolsLead: 'سوند، سفر، لګښتونه او اسناد یادښتونه — په Vehicle Hub PK کې.',
      browseAllTools: 'ټول موټر اوزار وګورئ ←',
      proofServicesValue: '50+',
      proofServicesLabel: 'حکومتي خدمت لینکونه',
      proofToolsValue: '10+',
      proofToolsLabel: 'وړیا موټر اوزار',
      proofRegionsValue: '۶ سیمې',
      proofRegionsLabel: 'پنجاب، سند، کے‌پي‌کي، بلوچستان، اسلام‌آباد او ګلګت',
      proofPortalsValue: 'تایید شوي',
      proofPortalsLabel: 'د حکومت پورټل لینکونه',
      language: 'ژبه',
      fuel: 'د سوند لګښت حساب',
      maintenance: 'ساتنې یادښت',
      mileage: 'مائلیج حساب',
      trip: 'د سفر لګښت حساب',
      plate: 'نمبر پلیټ لارښود',
      engine: 'انجن اندازه او مالیه',
      expenses: 'د موټر لګښتونه',
      documents: 'د اسنادو یادښت',
      finance: 'کار فاینانس / قسط حساب',
      toll: 'موټروی ټول اټکل',
      usedCar: 'کارول شوي موټر ارزښت',
      checklist: 'پیرود چک لست'
    }
  };

  var LANGS = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'ur', label: 'Urdu', native: 'اردو' },
    { code: 'pa', label: 'Punjabi', native: 'پنجابی' },
    { code: 'sd', label: 'Sindhi', native: 'سنڌي' },
    { code: 'ps', label: 'Pashto', native: 'پښتو' }
  ];

  function currentLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved && STRINGS[saved]) return saved;
    } catch (e) {}
    return 'en';
  }

  function setLang(code) {
    if (!STRINGS[code]) code = 'en';
    try {
      localStorage.setItem(LANG_KEY, code);
    } catch (e) {}
    applyLang(code);
  }

  function t(key, lang) {
    var pack = STRINGS[lang] || STRINGS.en;
    return pack[key] || STRINGS.en[key] || key;
  }

  function applyLang(lang) {
    var html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', RTL[lang] ? 'rtl' : 'ltr');
    html.classList.toggle('is-rtl', !!RTL[lang]);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (!key) return;
      var value = t(key, lang);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', value);
      } else {
        el.textContent = value;
      }
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (key) el.innerHTML = t(key, lang);
    });

    var select = document.getElementById('lang-switch');
    if (select) select.value = lang;

    document.querySelectorAll('.lang-switch-btn').forEach(function (btn) {
      var active = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function buildSwitcher() {
    var actions = document.querySelector('.header-actions');
    if (!actions || document.getElementById('lang-switch-wrap')) return;

    var wrap = document.createElement('div');
    wrap.id = 'lang-switch-wrap';
    wrap.className = 'lang-switch-wrap';
    wrap.innerHTML =
      '<label class="lang-switch-label" for="lang-switch"><span data-i18n="language">Language</span></label>' +
      '<select id="lang-switch" class="lang-switch" aria-label="Language">' +
      LANGS.map(function (l) {
        return (
          '<option value="' +
          l.code +
          '">' +
          l.native +
          '</option>'
        );
      }).join('') +
      '</select>';

    var toggle = actions.querySelector('.theme-toggle');
    if (toggle) actions.insertBefore(wrap, toggle);
    else actions.insertBefore(wrap, actions.firstChild);

    var select = wrap.querySelector('#lang-switch');
    select.value = currentLang();
    select.addEventListener('change', function () {
      setLang(select.value);
    });
  }

  function boot() {
    buildSwitcher();
    applyLang(currentLang());
  }

  window.VHPK_I18N = {
    setLang: setLang,
    currentLang: currentLang,
    t: t,
    langs: LANGS
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
