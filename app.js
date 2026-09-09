(() => {
  'use strict';

  const tg = window.Telegram?.WebApp || null;

  if (tg) {
    tg.ready();
    tg.expand();

    try {
      tg.setHeaderColor('#090b0f');
      tg.setBackgroundColor('#090b0f');
      tg.enableClosingConfirmation();
    } catch (_) {}
  }

  const lessons = [
    {
      id: '1',
      chinese: '最近怎么样？',
      pinyin: 'Zuìjìn zěnmeyàng?',
      translation: 'Вақтҳои охир чӣ хелӣ?',
      context: 'casual',
      level: 'A1',
      premium: false,
      note: 'Гуфтугӯи оддӣ бо дӯст ё шинос.'
    },
    {
      id: '2',
      chinese: '你吃了吗？',
      pinyin: 'Nǐ chī le ma?',
      translation: 'Хӯрок хӯрдӣ?',
      context: 'daily',
      level: 'A1',
      premium: false,
      note: 'Дар гуфтугӯи ҳаррӯза бисёр истифода мешавад.'
    },
    {
      id: '3',
      chinese: '真的假的？',
      pinyin: 'Zhēn de jiǎ de?',
      translation: 'Ростӣ? Ҷиддӣ?',
      context: 'casual',
      level: 'A2',
      premium: true,
      note: 'Барои вақте ки аз хабар ҳайрон мешавӣ.'
    },
    {
      id: '4',
      chinese: '太牛了！',
      pinyin: 'Tài niú le!',
      translation: 'Вой, хеле зӯр!',
      context: 'slang',
      level: 'A2',
      premium: true,
      note: '牛 дар гуфтори ғайрирасмӣ метавонад “хеле зӯр” маъно диҳад.'
    },
    {
      id: '5',
      chinese: '最近忙不忙？',
      pinyin: 'Zuìjìn máng bù máng?',
      translation: 'Вақтҳои охир бандӣ?',
      context: 'casual',
      level: 'A1',
      premium: false,
      note: 'Саволи табиӣ барои оғози суҳбат.'
    },
    {
      id: '6',
      chinese: '笑死我了',
      pinyin: 'Xiào sǐ wǒ le',
      translation: 'Аз ханда мурдам 😂',
      context: 'slang',
      level: 'A2',
      premium: true,
      note: 'Ибораи маъмули интернетӣ барои хандаи зиёд.'
    },
    {
      id: '7',
      chinese: '真的是，我不信。',
      pinyin: 'Zhēn de shì, wǒ bù xìn.',
      translation: 'Ростӣ? Ман бовар намекунам.',
      context: 'chat',
      level: 'A2',
      premium: true,
      note: 'Дар чат ё суҳбати дӯстона табиӣ садо медиҳад.'
    },
    {
      id: '8',
      chinese: '没事儿。',
      pinyin: 'Méi shìr.',
      translation: 'Ҳеҷ гап нест.',
      context: 'daily',
      level: 'A1',
      premium: false,
      note: 'Ҷавоби кӯтоҳу бисёр маъмул дар гуфтугӯ.'
    }
  ];

  const plans = [
    {
      id: 'day',
      title: '1 рӯз',
      price: '4 сомонӣ',
      days: 1,
      desc: 'Барои санҷиши Premium',
      badge: ''
    },
    {
      id: 'week',
      title: '1 ҳафта',
      price: '25 сомонӣ',
      days: 7,
      desc: 'Барои омӯзиши ҳаррӯза',
      badge: 'МАЪМУЛ'
    },
    {
      id: 'month',
      title: '1 моҳ',
      price: '100 сомонӣ',
      days: 30,
      desc: 'Барои пешрафти ҷиддӣ',
      badge: 'БЕҲТАРИН'
    },
    {
      id: 'year',
      title: '1 сол',
      price: '1199 сомонӣ',
      days: 365,
      desc: 'Барои омӯзиши дарозмуддат',
      badge: 'VALUE'
    }
  ];

  const PAYMENT_NUMBER = '+992 985 38 78 83';

  const state = {
    page: 'home',
    premium: localStorage.getItem('cs_premium') === '1',
    learned: Number(localStorage.getItem('cs_learned') || 0),
    selectedPlan: null,
    receipt: null,
    user: tg?.initDataUnsafe?.user || null
  };

  const app = document.getElementById('app');
  const modal = document.getElementById('premiumModal');
  const cameraModal = document.getElementById('cameraModal');
  const cameraVideo = document.getElementById('cameraVideo');
  const cameraStatus = document.getElementById('cameraStatus');
  const canvas = document.getElementById('receiptCanvas');

  let cameraStream = null;
  let receiptUrl = null;

  function escapeHtml(value) {
    return String(value).replace(
      /[&<>'"]/g,
      char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[char])
    );
  }

  function getName() {
    return state.user?.first_name || 'Дӯст';
  }

  function initials() {
    return (getName().trim()[0] || 'Д').toUpperCase();
  }

  function avatarMarkup(className = '') {
    const photo = state.user?.photo_url;
    const cls = className ? ` class="${className}"` : '';

    if (photo) {
      return `
        <img
          ${cls}
          src="${escapeHtml(photo)}"
          alt="Telegram avatar"
          referrerpolicy="no-referrer"
          loading="eager"
        >
      `;
    }
    return escapeHtml(initials());
  }

  function updateNavAvatar() {
    const navAvatar = document.getElementById('navAvatar');
    if (!navAvatar) return;

    const photo = state.user?.photo_url;

    if (photo) {
      navAvatar.className = 'nav-avatar has-photo';
      navAvatar.innerHTML = `
        <img
          src="${escapeHtml(photo)}"
          alt=""
          referrerpolicy="no-referrer"
          loading="eager"
        >
      `;
    } else {
      navAvatar.className = 'nav-avatar';
      navAvatar.textContent = initials();
    }
  }

  function lockedCard() {
    return `
      <article class="lesson-card locked-card">
        <div class="lesson-top">
          <span class="tag premium-tag">◆ PREMIUM</span>
          <span class="lock-label">Қулф</span>
        </div>
        <div class="locked-art">
          <span>中</span>
          <div>
            <b>Premium дарс</b>
            <small>Ибора ва талаффуз пас аз фаъолсозӣ кушода мешавад.</small>
          </div>
        </div>
        <button class="unlock-btn" data-open-premium>
          Кушодани Premium <span>›</span>
        </button>
      </article>
    `;
  }

  function lessonCard(lesson) {
    if (lesson.premium && !state.premium) {
      return lockedCard();
    }

    return `
      <article class="lesson-card">
        <div class="lesson-top">
          <span class="tag">${escapeHtml(lesson.context)}</span>
          <span class="tag">${escapeHtml(lesson.level)}</span>
        </div>
        <div class="chinese">${escapeHtml(lesson.chinese)}</div>
        <div class="pinyin">${escapeHtml(lesson.pinyin)}</div>
        <div class="translation">${escapeHtml(lesson.translation)}</div>
        <div class="note">${escapeHtml(lesson.note)}</div>
        <div class="lesson-actions">
          <button class="secondary-btn" data-speak="${escapeHtml(lesson.chinese)}">
            🔊 Гӯш кардан
          </button>
          <button class="primary-btn" data-lesson="${lesson.id}">
            ✓ Омӯхтам
          </button>
        </div>
      </article>
    `;
  }

  function render() {
    document.querySelectorAll('.nav-btn').forEach(button => {
      button.classList.toggle('active', button.dataset.page === state.page);
    });

    if (state.page === 'home') renderHome();
    if (state.page === 'lessons') renderLessons();
    if (state.page === 'profile') renderProfile();

    bindDynamic();
    updateNavAvatar();
  }

  function renderHome() {
    const freeLessons = lessons.filter(lesson => !lesson.premium).slice(0, 3);

    app.innerHTML = `
      <section class="hero">
        <div class="eyebrow">中国 · STREET CHINESE</div>
        <h1>Чиниро тавре омӯз, ки одамони воқеӣ гап мезананд.</h1>
        <p>Ибораҳои ҳаррӯза, гуфтори табиӣ ва slang — бо шарҳи оддӣ ба тоҷикӣ.</p>
        <button class="primary-btn" id="startLessons">🚀 Оғози омӯзиш</button>
      </section>
      <div class="stats">
        <div class="stat"><b>${state.learned}</b><span>Омӯхта</span></div>
        <div class="stat"><b>${lessons.length}</b><span>Дарс</span></div>
        <div class="stat"><b>${state.premium ? 'PREMIUM' : 'FREE'}</b><span>Тариф</span></div>
      </div>
      <div class="section-title">
        <h2>Имрӯз омӯз</h2>
        <span>3 ибора</span>
      </div>
      <div class="lesson-grid">
        ${freeLessons.map(lessonCard).join('')}
      </div>
    `;
  }

  function renderLessons() {
    app.innerHTML = `
      <div class="section-title">
        <h2>Дарсҳо</h2>
        <span>${lessons.length} дарс</span>
      </div>
      <div class="lesson-grid">
        ${lessons.map(lessonCard).join('')}
      </div>
    `;
  }

  function renderProfile() {
    const connected = !!state.user;

    app.innerHTML = `
      <section class="profile-card">
        <div class="profile-head">
          <div class="avatar">
            ${avatarMarkup()}
          </div>
          <div class="profile-main">
            <h2>${escapeHtml(getName())}</h2>
            <div class="profile-status ${connected ? 'ok' : ''}">
              ${connected ? '✓ Telegram аккаунт пайваст аст' : 'Telegram Mini App-ро аз бот кушо'}
            </div>
          </div>
        </div>
        <div class="stats">
          <div class="stat"><b>${state.learned}</b><span>Омӯхта</span></div>
          <div class="stat"><b>${lessons.length}</b><span>Дарс</span></div>
          <div class="stat"><b>${state.premium ? 'PREMIUM' : 'FREE'}</b><span>Тариф</span></div>
        </div>
        ${
          state.premium
            ? `
              <div class="premium-active">
                <div class="active-icon">✓</div>
                <div>
                  <b>Premium фаъол аст</b>
                  <p>Ҳамаи дарсҳои Premium барои ту кушодаанд.</p>
                </div>
              </div>
            `
            : `
              <div class="premium-card">
                <div class="premium-card-top">
                  <span class="diamond">◆</span>
                  <span class="mini-badge">PREMIUM</span>
                </div>
                <h3>Версияи Premium</h3>
                <p>Ҳамаи ибораҳои Premium, гуфтори табиӣ ва slang-ҳои бештарро кушо.</p>
                <button class="buy-profile" id="openPremium">
                  Интихоби Premium <span>→</span>
                </button>
              </div>
            `
        }
      </section>
    `;
  }

  function bindDynamic() {
    document.getElementById('startLessons')?.addEventListener('click', () => {
      state.page = 'lessons';
      render();
    });

    document.getElementById('openPremium')?.addEventListener('click', openPremium);

    document.querySelectorAll('[data-open-premium]').forEach(button => {
      button.addEventListener('click', openPremium);
    });

    document.querySelectorAll('[data-lesson]').forEach(button => {
      button.addEventListener('click', () => {
        const lesson = lessons.find(item => item.id === button.dataset.lesson);
        if (!lesson) return;
        state.learned++;
        localStorage.setItem('cs_learned', state.learned);
        render();
      });
    });

    document.querySelectorAll('[data-speak]').forEach(button => {
      button.addEventListener('click', () => speak(button.dataset.speak));
    });
  }

  let cachedVoices = [];
  let audioPlayer = null;

  function loadVoices() {
    if (!('speechSynthesis' in window)) return;
    cachedVoices = speechSynthesis.getVoices() || [];
  }

  loadVoices();

  if ('speechSynthesis' in window) {
    speechSynthesis.addEventListener('voiceschanged', loadVoices);
  }

  function findChineseVoice() {
    const voices = cachedVoices.length ? cachedVoices : speechSynthesis.getVoices();
    return voices.find(voice => /^zh(-|_|$)/i.test(voice.lang)) ||
           voices.find(voice => /chinese|mandarin|中文|普通话/i.test(voice.name));
  }

  function playTtsFallback(text) {
    const url = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=zh-CN&q=' + encodeURIComponent(text);
    try {
      if (audioPlayer) {
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
      }
      audioPlayer = new Audio(url);
      audioPlayer.preload = 'auto';
      audioPlayer.volume = 1;
      const promise = audioPlayer.play();
      if (promise && promise.catch) {
        promise.catch(() => {
          if ('speechSynthesis' in window) {
            speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            utterance.rate = 0.82;
            speechSynthesis.speak(utterance);
          }
        });
      }
    } catch (_) {}
  }

  function speak(text) {
    const isTelegram = !!window.Telegram?.WebApp?.initData;
    const voice = 'speechSynthesis' in window ? findChineseVoice() : null;

    if (isTelegram && !voice) {
      playTtsFallback(text);
      return;
    }

    if ('speechSynthesis' in window && voice) {
      try {
        speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.lang = voice.lang || 'zh-CN';
        utterance.rate = 0.82;
        utterance.pitch = 1;
        speechSynthesis.resume();
        speechSynthesis.speak(utterance);
        return;
      } catch (_) {}
    }
    playTtsFallback(text);
  }

  function openPremium() {
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');

    document.getElementById('paymentNumber').textContent = PAYMENT_NUMBER;
    document.getElementById('plans').innerHTML = plans.map(plan => `
      <button class="plan ${state.selectedPlan?.id === plan.id ? 'selected' : ''}" data-plan="${plan.id}">
        <div class="plan-copy">
          <div class="plan-name-row">
            <b>${plan.title}</b>
            ${plan.badge ? `<em>${plan.badge}</em>` : ''}
          </div>
          <span>${plan.desc}</span>
          <small>${plan.days} рӯз · дастрасии пурра</small>
        </div>
        <strong>${plan.price}</strong>
      </button>
    `).join('');

    document.querySelectorAll('[data-plan]').forEach(button => {
      button.addEventListener('click', () => selectPlan(button.dataset.plan));
    });

    if (state.selectedPlan) {
      showCheckout();
    }
  }

  function selectPlan(id) {
    state.selectedPlan = plans.find(plan => plan.id === id) || null;
    openPremium();
  }

  function showCheckout() {
    const checkout = document.getElementById('checkout');
    checkout.classList.remove('hidden');
    document.getElementById('checkoutPlan').textContent = `${state.selectedPlan.title} · ${state.selectedPlan.price}`;
    setTimeout(() => {
      checkout.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 20);
  }

  document.querySelectorAll('[data-close-modal]').forEach(element => {
    element.addEventListener('click', closePremium);
  });

  function closePremium() {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    stopCamera();
  }

  document.getElementById('copyPayment').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(PAYMENT_NUMBER);
    } catch (_) {}

    const button = document.getElementById('copyPayment');
    button.textContent = '✓ Нусха шуд';
    setTimeout(() => {
      button.textContent = 'Нусха';
    }, 1400);
  });

  async function openCamera() {
    cameraModal.classList.remove('hidden');
    cameraModal.setAttribute('aria-hidden', 'false');
    cameraStatus.textContent = 'Камера кушода мешавад...';

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('unsupported');
      }

      cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      cameraVideo.srcObject = cameraStream;
      cameraStatus.textContent = 'Чекро дар чорчӯба гузор ва тугмаи зардро пахш кун.';
    } catch (_) {
      cameraStatus.textContent = 'Камера дастрас нест. Mini App бояд бо HTTPS кушода шавад ва иҷозаи камера дода шавад.';
      stopCamera();
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
    cameraVideo.srcObject = null;
  }

  function closeCamera() {
    stopCamera();
    cameraModal.classList.add('hidden');
    cameraModal.setAttribute('aria-hidden', 'true');
  }

  async function captureReceipt() {
    if (!cameraStream || !cameraVideo.videoWidth) return;

    const max = 1600;
    const scale = Math.min(1, max / cameraVideo.videoWidth);

    canvas.width = Math.round(cameraVideo.videoWidth * scale);
    canvas.height = Math.round(cameraVideo.videoHeight * scale);

    canvas.getContext('2d').drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(blob => {
      if (!blob) return;

      state.receipt = new File([blob], `receipt-${Date.now()}.jpg`, { type: 'image/jpeg' });

      if (receiptUrl) {
        URL.revokeObjectURL(receiptUrl);
      }

      receiptUrl = URL.createObjectURL(blob);
      document.getElementById('receiptPreviewImg').src = receiptUrl;
      document.getElementById('photoPreview').classList.remove('hidden');
      document.getElementById('sendRequest').disabled = false;
      document.getElementById('requestStatus').textContent = '';

      closeCamera();
    }, 'image/jpeg', 0.92);
  }

  document.getElementById('openCamera').addEventListener('click', openCamera);
  document.getElementById('takePhoto').addEventListener('click', captureReceipt);
  document.getElementById('closeCamera').addEventListener('click', closeCamera);
  document.getElementById('closeCameraBtn').addEventListener('click', closeCamera);

  document.getElementById('removePhoto').addEventListener('click', () => {
    state.receipt = null;
    if (receiptUrl) {
      URL.revokeObjectURL(receiptUrl);
    }
    receiptUrl = null;
    document.getElementById('photoPreview').classList.add('hidden');
    document.getElementById('sendRequest').disabled = true;
  });

  document.getElementById('sendRequest').addEventListener('click', () => {
    if (!state.receipt || !state.selectedPlan) return;

    const payload = {
      type: 'premium_request',
      planId: state.selectedPlan.id,
      planTitle: state.selectedPlan.title,
      price: state.selectedPlan.price,
      receiptName: state.receipt.name
    };

    let sent = false;
    if (tg) {
      try {
        tg.sendData(JSON.stringify(payload));
        sent = true;
      } catch (_) {}
    }

    document.getElementById('requestStatus').textContent =
      sent ? '✓ Заявка фиристода шуд. Админ чекро месанҷад.' : 'Барномаро аз Telegram кушо, то заявка фиристода шавад.';
  });

  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button.disabled || button.classList.contains('shutter')) return;

    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.left = `${event.clientX - rect.left - 9}px`;
    ripple.style.top = `${event.clientY - rect.top - 9}px`;
    button.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });

  document.getElementById('tgClose').addEventListener('click', () => {
    if (tg) tg.close();
  });

  document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click', () => {
      state.page = button.dataset.page;
      render();
    });
  });

  render();

})();
