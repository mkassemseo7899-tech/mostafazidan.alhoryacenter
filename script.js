/* ============================================================
   FREEDOM CENTER — script.js
   Medical Professional Website — Full JavaScript
============================================================ */

'use strict';

/* ============================================================
   1. NAVBAR SCROLL EFFECT
============================================================ */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ============================================================
   2. SMOOTH SCROLL (fallback for older browsers)
============================================================ */
document.querySelectorAll("a[href^='#']").forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navH = document.getElementById('navbar')?.offsetHeight || 72;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   3. MOBILE MENU
============================================================ */
function toggleMobile() {
  const hb = document.getElementById('hamburger');
  const mm = document.getElementById('mobileMenu');
  if (!hb || !mm) return;
  const isOpen = mm.classList.toggle('open');
  hb.classList.toggle('active', isOpen);
  hb.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMobile() {
  const hb = document.getElementById('hamburger');
  const mm = document.getElementById('mobileMenu');
  if (!hb || !mm) return;
  mm.classList.remove('open');
  hb.classList.remove('active');
  hb.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

// Close mobile menu when clicking outside
document.addEventListener('click', function (e) {
  const mm = document.getElementById('mobileMenu');
  const hb = document.getElementById('hamburger');
  if (mm && mm.classList.contains('open')) {
    if (!mm.contains(e.target) && !hb.contains(e.target)) {
      closeMobile();
    }
  }
});

/* ============================================================
   4. SCROLL REVEAL
============================================================ */
(function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ============================================================
   5. COUNTER ANIMATION
============================================================ */
(function () {
  let animated = false;

  function animateCounter(el, target, suffix) {
    let start = 0;
    const duration = 1800;
    const steps = Math.ceil(duration / 16);
    const increment = target / steps;
    const timer = setInterval(() => {
      start = Math.min(start + increment, target);
      el.textContent = (suffix === '+' ? '+' : '') + Math.floor(start) + (suffix === '%' ? '%' : '');
      if (start >= target) {
        el.textContent = (suffix === '+' ? '+' : '') + target + (suffix === '%' ? '%' : '');
        clearInterval(timer);
      }
    }, 16);
  }

  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        const n1 = document.getElementById('sn1');
        const n2 = document.getElementById('sn2');
        if (n1) animateCounter(n1, 35, '+');
        if (n2) animateCounter(n2, 5000, '+');
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statsObserver.observe(statsSection);
})();

/* ============================================================
   6. LIGHTBOX
============================================================ */
const allImages = [
  'images/481208565_982530583943323_2070410701486645143_n.jpg',
  'images/481309693_982530547276660_3909875205002575542_n.jpg',
  'images/481267441_982530577276657_5600000461170856558_n.jpg',
  'images/481494145_982530513943330_3349579923987577908_n.jpg',
  'images/481267426_982530593943322_1928659961414372851_n.jpg',
  'images/481070746_982532030609845_5264102730663406475_n.jpg',
  'images/481203698_982532077276507_3179570028505893609_n.jpg',
  'images/481206569_982531977276517_9107347447206093160_n.jpg',
  'images/481217637_982532167276498_5541788592528585080_n.jpg',
  'images/481279469_982532163943165_5014427139886589180_n.jpg',
  'images/481665760_982532020609846_2043430363508349158_n.jpg',
  'images/481948360_982530597276655_2503726545194271369_n.jpg',
];

let currentLbIndex = 0;

function openLightbox(idx) {
  currentLbIndex = idx;
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!lb || !img) return;
  img.src = allImages[idx];
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (!lb) return;
  lb.classList.remove('open');
  document.body.style.overflow = '';
  // Clear src after transition to free memory
  setTimeout(() => {
    const img = document.getElementById('lightboxImg');
    if (img && !lb.classList.contains('open')) img.src = '';
  }, 400);
}

function prevLightbox() {
  currentLbIndex = (currentLbIndex - 1 + allImages.length) % allImages.length;
  const img = document.getElementById('lightboxImg');
  if (img) img.src = allImages[currentLbIndex];
}

function nextLightbox() {
  currentLbIndex = (currentLbIndex + 1) % allImages.length;
  const img = document.getElementById('lightboxImg');
  if (img) img.src = allImages[currentLbIndex];
}

// Bind lightbox events after DOM ready
(function () {
  const lb    = document.getElementById('lightbox');
  const close = document.getElementById('lightboxClose');
  const prev  = document.getElementById('lightboxPrev');
  const next  = document.getElementById('lightboxNext');

  if (close) close.addEventListener('click', closeLightbox);
  if (prev)  prev.addEventListener('click', prevLightbox);
  if (next)  next.addEventListener('click', nextLightbox);

  // Close on backdrop click
  if (lb) {
    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   (document.dir === 'rtl') ? nextLightbox() : prevLightbox();
    if (e.key === 'ArrowRight')  (document.dir === 'rtl') ? prevLightbox() : nextLightbox();
  });

  // Touch/swipe support
  let touchStartX = 0;
  if (lb) {
    lb.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lb.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? nextLightbox() : prevLightbox();
      }
    }, { passive: true });
  }

  // Keyboard accessibility for gallery items
  document.querySelectorAll('.gallery-item, .activity-item').forEach(item => {
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
})();

/* ============================================================
   7. LANGUAGE SYSTEM
============================================================ */
let currentLang = 'ar';

const translations = {
  ar: {
    logoSub:      'مركز الحرية لعلاج الإدمان',
    heroBadge:    'منذ 1989 — الرائد في علاج الإدمان',
    heroTitle:    'أفضل مركز لعلاج الإدمان في مصر',
    heroSubTitle: 'بسرية تامة واحترافية عالية',
    heroSubtitle: 'مركز الحرية وادي النطرون — نقدم رعاية طبية متكاملة وبرامج علاج الإدمان والصحة النفسية بأعلى معايير الخصوصية والاحترافية',
    btnWAText:  'واتساب',
    btnCallText:'اتصل الآن',
    stat1:'سنة خبرة', stat2:'حالة تعافي ناجحة', stat3:'نسبة رضا العملاء', stat4:'إشراف طبي متواصل',
    servLabel:'خدماتنا المتخصصة', servTitle:'برامج العلاج والرعاية',
    s1t:'علاج الإدمان',      s1d:'برامج علاجية متكاملة لجميع أنواع الإدمان بأحدث الأساليب الطبية والنفسية تحت إشراف متخصصين.',
    s2t:'الصحة النفسية',     s2d:'علاج الاضطرابات النفسية والاكتئاب والقلق وغيرها من الحالات بأفضل المعايير العلمية.',
    s3t:'إزالة السموم',      s3d:'مرحلة إزالة السموم تحت إشراف طبي مستمر وبيئة آمنة ومريحة لضمان أقصى درجات السلامة.',
    s4t:'العلاج الأسري',     s4d:'برامج متخصصة تشمل الأسرة في رحلة التعافي لضمان دعم اجتماعي قوي ومستدام.',
    s5t:'التأهيل البدني',    s5d:'أنشطة رياضية وترفيهية متنوعة لإعادة بناء الجسم والروح خلال فترة التعافي.',
    s6t:'سرية تامة',         s6d:'نضمن خصوصية مطلقة لجميع مرضانا وذويهم — بيانات المريض في أمان تام ولا يطلع عليها أحد.',
    gallLabel:'معرض المركز',          gallTitle:'شاهد مرافقنا المتكاملة',
    actLabel:'الأنشطة والفعاليات',    actTitle:'حياة متوازنة داخل المركز',
    act1Tag:'رياضة', act2Tag:'تمارين', act3Tag:'فريق', act4Tag:'ترفيه', act5Tag:'مجموعة', act6Tag:'جلسات',
    whyLabel:'لماذا تختارنا', whyTitle:'الخبرة والجودة في خدمتك',
    wf1t:'أعلى نسبة تعافي في مصر',   wf1d:'سجلنا أعلى نسب تعافي موثقة بين مراكز علاج الإدمان في جمهورية مصر العربية',
    wf2t:'فريق طبي متخصص',            wf2d:'أطباء وأخصائيون نفسيون ومعالجون معتمدون ذوو خبرة عالية في مجال الإدمان',
    wf3t:'بيئة علاجية فريدة',         wf3d:'موقع متميز في وادي النطرون بعيداً عن ضغوط المدينة وسط طبيعة هادئة',
    wf4t:'برامج علاجية مخصصة',        wf4d:'كل مريض يحظى ببرنامج علاجي شخصي يناسب حالته ويلبي احتياجاته الفردية',
    aboutLabel:'من نحن', aboutTitle:'مركز الحرية — رائد التعافي في مصر',
    aboutP1:'تأسس مركز الحرية للطب النفسي وعلاج الإدمان عام 1989 ليكون أول مركز متخصص في مجال علاج الإدمان والحالات النفسية في مصر. على مدار أكثر من ثلاثة عقود، أثبتنا كفاءتنا وتميزنا في تقديم خدمات علاجية عالية الجودة.',
    aboutP2:'يقع مركزنا في وادي النطرون، حيث توفر البيئة الهادئة والطبيعة الخلابة أفضل الظروف للتعافي. نؤمن بأن التعافي رحلة شاملة تحتاج إلى رعاية طبية ونفسية واجتماعية متكاملة.',
    aboutP3:'فريقنا المتخصص يضم أطباء نفسيين وإدمان، أخصائيي علاج نفسي، معالجين جماعيين، ومتخصصي التأهيل. نعمل معاً لنضمن لكل مريض رحلة تعافي آمنة وناجحة.',
    contLabel:'تواصل معنا', contTitle:'نحن هنا لمساعدتك',
    cc1t:'اتصل بنا', cc2t:'واتساب', cc3t:'الموقع', cc3p:'وادي النطرون، محافظة البحيرة، مصر',
    formTitle:'أرسل رسالتك', fl1:'الاسم الكامل', fl2:'رقم الهاتف', fl3:'الرسالة',
    fi1:'أدخل اسمك', fi2:'01x xxxx xxxx', fi3:'كيف يمكننا مساعدتك؟',
    submitBtn:'إرسال الرسالة',
    langLabel:'EN', langFlag:'🇬🇧',
    ticker:['سرية تامة','إشراف طبي متخصص','برامج علاج حديثة','خبرة أكثر من 35 سنة',
            'بيئة علاجية آمنة','فريق متعدد التخصصات','نسبة تعافي عالية','متابعة مستمرة بعد العلاج']
  },
  en: {
    logoSub:      'Freedom Addiction Treatment Center',
    heroBadge:    'Since 1989 — Pioneer in Addiction Treatment',
    heroTitle:    'The Best Addiction Treatment Center in Egypt',
    heroSubTitle: 'With Full Privacy & Professional Excellence',
    heroSubtitle: 'Freedom Center, Wadi El Natrun — Comprehensive medical care and addiction & mental health treatment programs with the highest standards of privacy and professionalism.',
    btnWAText:  'WhatsApp',
    btnCallText:'Call Now',
    stat1:'Years of Experience', stat2:'Successful Recoveries', stat3:'Client Satisfaction', stat4:'24/7 Medical Supervision',
    servLabel:'Our Specialized Services', servTitle:'Treatment & Care Programs',
    s1t:'Addiction Treatment',    s1d:'Comprehensive treatment programs for all types of addiction using the latest medical and psychological methods under specialist supervision.',
    s2t:'Mental Health',          s2d:'Treatment of psychological disorders, depression, anxiety, and other conditions according to the best scientific standards.',
    s3t:'Detoxification',         s3d:'Detox phase under continuous medical supervision in a safe and comfortable environment to ensure maximum safety.',
    s4t:'Family Therapy',         s4d:'Specialized programs that include the family in the recovery journey to ensure strong and sustainable social support.',
    s5t:'Physical Rehabilitation',s5d:'Various sports and recreational activities to rebuild body and spirit during the recovery period.',
    s6t:'Full Confidentiality',   s6d:'We guarantee absolute privacy for all our patients and their families — patient data is completely safe and confidential.',
    gallLabel:'Center Gallery',        gallTitle:'See Our Comprehensive Facilities',
    actLabel:'Activities & Events',    actTitle:'A Balanced Life Inside the Center',
    act1Tag:'Sports', act2Tag:'Exercise', act3Tag:'Team', act4Tag:'Recreation', act5Tag:'Group', act6Tag:'Sessions',
    whyLabel:'Why Choose Us', whyTitle:'Experience & Quality at Your Service',
    wf1t:'Highest Recovery Rate in Egypt',   wf1d:'We have recorded the highest documented recovery rates among addiction treatment centers in Egypt.',
    wf2t:'Specialized Medical Team',          wf2d:'Certified psychiatrists, psychologists, and therapists with extensive experience in addiction treatment.',
    wf3t:'Unique Therapeutic Environment',    wf3d:'A distinctive location in Wadi El Natrun away from city stress, surrounded by peaceful nature.',
    wf4t:'Personalized Treatment Programs',   wf4d:'Every patient receives a personalized treatment plan that suits their condition and meets their individual needs.',
    aboutLabel:'About Us', aboutTitle:"Freedom Center — Egypt's Recovery Pioneer",
    aboutP1:'Freedom Center for Psychiatry and Addiction Treatment was founded in 1989 as the first specialized center for addiction and mental health treatment in Egypt. Over more than three decades, we have proven our efficiency and excellence in providing high-quality therapeutic services.',
    aboutP2:'Our center is located in Wadi El Natrun, where the peaceful environment and stunning nature provide the best conditions for recovery. We believe recovery is a comprehensive journey requiring integrated medical, psychological, and social care.',
    aboutP3:'Our specialized team includes addiction psychiatrists, psychotherapists, group therapists, and rehabilitation specialists. We work together to ensure every patient has a safe and successful recovery journey.',
    contLabel:'Contact Us', contTitle:'We Are Here to Help You',
    cc1t:'Call Us', cc2t:'WhatsApp', cc3t:'Location', cc3p:'Wadi El Natrun, Beheira Governorate, Egypt',
    formTitle:'Send Your Message', fl1:'Full Name', fl2:'Phone Number', fl3:'Message',
    fi1:'Enter your name', fi2:'+20 1x xxxx xxxx', fi3:'How can we help you?',
    submitBtn:'Send Message',
    langLabel:'عر', langFlag:'🇪🇬',
    ticker:['Full Confidentiality','Specialist Medical Supervision','Modern Treatment Programs','35+ Years of Experience',
            'Safe Therapeutic Environment','Multidisciplinary Team','High Recovery Rate','Continuous Post-Treatment Follow-up']
  }
};

function toggleLang() {
  const overlay = document.getElementById('langOverlay');
  if (overlay) overlay.classList.add('active');
  setTimeout(() => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    applyLang(currentLang);
    if (overlay) overlay.classList.remove('active');
  }, 280);
}

function applyLang(lang) {
  const t = translations[lang];
  const html = document.documentElement;
  html.lang = lang;
  html.dir  = lang === 'ar' ? 'rtl' : 'ltr';

  // Text content IDs
  const ids = [
    'logoSub','heroBadge','heroTitle','heroSubTitle','heroSubtitle',
    'btnWAText','btnCallText',
    'stat1','stat2','stat3','stat4',
    'servLabel','servTitle',
    's1t','s1d','s2t','s2d','s3t','s3d','s4t','s4d','s5t','s5d','s6t','s6d',
    'gallLabel','gallTitle',
    'actLabel','actTitle','act1Tag','act2Tag','act3Tag','act4Tag','act5Tag','act6Tag',
    'whyLabel','whyTitle','wf1t','wf1d','wf2t','wf2d','wf3t','wf3d','wf4t','wf4d',
    'aboutLabel','aboutTitle','aboutP1','aboutP2','aboutP3',
    'contLabel','contTitle','cc1t','cc2t','cc3t','cc3p',
    'formTitle','fl1','fl2','fl3','submitBtn','langLabel','langFlag'
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el && t[id] !== undefined) el.textContent = t[id];
  });

  // Placeholders
  ['fi1','fi2','fi3'].forEach(id => {
    const el = document.getElementById(id);
    if (el && t[id]) el.placeholder = t[id];
  });

  // data-ar / data-en links
  document.querySelectorAll('[data-ar]').forEach(el => {
    el.textContent = lang === 'ar' ? el.dataset.ar : el.dataset.en;
  });

  // Ticker
  updateTicker(t.ticker);
}

function updateTicker(items) {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const doubled = [...items, ...items];
  track.innerHTML = doubled.map(item =>
    `<div class="ticker-item"><div class="ticker-dot"></div><span>${item}</span></div>`
  ).join('');
}

/* ============================================================
   8. CONTACT FORM → WHATSAPP
============================================================ */
function submitForm() {
  const nameEl  = document.getElementById('fi1');
  const phoneEl = document.getElementById('fi2');
  const msgEl   = document.getElementById('fi3');

  const name  = nameEl  ? nameEl.value.trim()  : '';
  const phone = phoneEl ? phoneEl.value.trim() : '';
  const msg   = msgEl   ? msgEl.value.trim()   : '';

  if (!name || !phone) {
    alert(currentLang === 'ar'
      ? 'يرجى تعبئة الاسم ورقم الهاتف'
      : 'Please enter your name and phone number');
    return;
  }

  const text = currentLang === 'ar'
    ? `الاسم: ${name}\nالهاتف: ${phone}\nالرسالة: ${msg || '—'}`
    : `Name: ${name}\nPhone: ${phone}\nMessage: ${msg || '—'}`;

  window.open(`https://wa.me/201211117075?text=${encodeURIComponent(text)}`, '_blank');
}

/* ============================================================
   9. INIT on DOM ready
============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Apply initial language (Arabic is default)
  applyLang('ar');
});
