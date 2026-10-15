(() => {
  'use strict';

  // Kustomisasi caption/nama file foto di bagian ini. Foto yang belum tersedia otomatis menjadi placeholder.
  const galleryItems = [
    { src: 'assets/images/allya-01.jpg', caption: 'A little moment with you', alt: 'Foto kenangan pertama bersama Allya' },
    { src: 'assets/images/allya-02.jpg', caption: 'One of my favorite days', alt: 'Foto kenangan kedua bersama Allya' },
    { src: 'assets/images/allya-03.jpg', caption: 'A memory to keep', alt: 'Foto kenangan ketiga bersama Allya' }
  ];

  const wishes = [
    'Semoga selalu sehat.', 'Semoga hatimu selalu tenang.', 'Semoga banyak kebahagiaan datang kepadamu.',
    'Semoga impianmu perlahan menjadi nyata.', 'Semoga kamu selalu percaya pada dirimu sendiri.', 'Semoga langkahmu dimudahkan.',
    'Semoga kamu dikelilingi orang-orang yang tulus.', 'Semoga kamu selalu punya alasan untuk tersenyum.', 'Semoga kamu semakin mencintai dirimu sendiri.',
    'Semoga usahamu membawa hasil yang baik.', 'Semoga kamu diberi kekuatan saat menghadapi kesulitan.', 'Semoga hari-harimu dipenuhi hal-hal sederhana yang membahagiakan.',
    'Semoga kamu selalu merasa dihargai.', 'Semoga kamu mendapatkan banyak kesempatan baik.', 'Semoga kamu terus berkembang menjadi dirimu yang terbaik.',
    'Semoga kamu tidak kehilangan semangat mengejar impianmu.', 'Semoga kamu selalu menemukan alasan untuk bersyukur.', 'Semoga ada banyak kenangan indah yang bisa kita buat bersama.',
    'Semoga kita semakin pandai memahami satu sama lain.', 'Semoga kita terus saling mendukung dan tumbuh bersama.', 'Semoga usia barumu menjadi awal dari banyak cerita indah.'
  ];

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toast = $('#toast');
  let toastTimer;
  let openedWishes = new Set();
  let activeGalleryIndex = 0;
  let lastFocusedElement = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3200);
  }

  function scrollToElement(element) {
    if (!element) return;
    element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }

  // Opening screen
  const opening = $('#opening');
  $('#openGift')?.addEventListener('click', () => {
    opening?.classList.add('is-leaving');
    window.setTimeout(() => { if (opening) { opening.hidden = true; opening.classList.remove('is-leaving'); } }, reducedMotion ? 20 : 850);
    $('#siteHeader')?.classList.add('scrolled');
  });

  // Home portrait: use the uploaded personal photo when present; otherwise keep the bouquet illustration.
  const homePhoto = $('#allyaHomePhoto');
  const homeArtFrame = $('.art-frame');
  if (homePhoto) {
    const enableHomePhoto = () => { if (homePhoto.naturalWidth > 0) { homePhoto.classList.add('is-loaded'); homeArtFrame?.classList.add('has-photo'); } };
    homePhoto.addEventListener('load', enableHomePhoto);
    homePhoto.addEventListener('error', () => { homePhoto.classList.remove('is-loaded'); homeArtFrame?.classList.remove('has-photo'); });
    if (homePhoto.complete) enableHomePhoto();
  }

  // Sticky header, active section and mobile navigation
  const header = $('#siteHeader');
  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');
  const closeMenu = () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Buka menu navigasi');
    mainNav?.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };
  menuToggle?.addEventListener('click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    mainNav?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });
  $$('#mainNav a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
  const navLinks = $$('#mainNav a');
  const observedSections = ['home', 'letter', 'wishes', 'memories', 'dateInvite', 'surprise'].map(id => document.getElementById(id)).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
    observedSections.forEach(section => sectionObserver.observe(section));
  }
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 20 || opening?.hidden === false);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // Reveal elements
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealItems.forEach(item => revealObserver.observe(item));
  } else revealItems.forEach(item => item.classList.add('is-visible'));

  // Letter open/read again
  const letterClosed = $('#letterClosed');
  const letterContent = $('#letterContent');
  const letterCard = $('#letterCard');
  const showLetter = () => {
    if (letterClosed) letterClosed.hidden = true;
    if (letterContent) letterContent.hidden = false;
    letterCard?.classList.add('letter-is-open');
  };
  $('#openLetter')?.addEventListener('click', showLetter);
  $('#readAgain')?.addEventListener('click', () => {
    if (letterClosed) letterClosed.hidden = false;
    if (letterContent) letterContent.hidden = true;
    letterCard?.classList.remove('letter-is-open');
    scrollToElement(letterCard);
    $('#openLetter')?.focus({ preventScroll: true });
  });

  // 21 wishes
  const wishesGrid = $('#wishesGrid');
  const progressText = $('#wishProgressText');
  const progressBar = $('#wishProgressBar');
  const wishesLoveReveal = $('#wishesLoveReveal');
  const wishesPhoto = $('#allyaWishesPhoto');
  const wishesPhotoFallback = $('#wishesPhotoFallback');
  wishesPhoto?.addEventListener('error', () => { if (wishesPhotoFallback) wishesPhotoFallback.hidden = false; if (wishesPhoto) wishesPhoto.hidden = true; });
  wishesPhoto?.addEventListener('load', () => { if (wishesPhotoFallback) wishesPhotoFallback.hidden = true; });
  if (wishesPhoto?.complete && !wishesPhoto.naturalWidth && wishesPhotoFallback) wishesPhotoFallback.hidden = false;
  function updateWishProgress() {
    if (progressText) progressText.textContent = `${openedWishes.size} dari 21 harapan dibuka`;
    if (progressBar) progressBar.style.width = `${openedWishes.size / wishes.length * 100}%`;
    if (wishesLoveReveal) {
      const allOpened = openedWishes.size === wishes.length;
      wishesLoveReveal.hidden = !allOpened;
      if (allOpened) window.setTimeout(() => scrollToElement(wishesLoveReveal), reducedMotion ? 0 : 180);
    }
  }
  wishes.forEach((wish, index) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'wish-card';
    card.setAttribute('aria-pressed', 'false');
    card.setAttribute('aria-label', `Harapan ${index + 1}. Sentuh untuk membuka.`);
    const number = document.createElement('span'); number.className = 'wish-number'; number.textContent = String(index + 1).padStart(2, '0');
    const prompt = document.createElement('span'); prompt.className = 'wish-prompt'; prompt.textContent = 'Satu harapan untukmu ♡';
    card.append(number, prompt);
    card.addEventListener('click', () => {
      const isOpen = card.classList.toggle('is-open');
      card.setAttribute('aria-pressed', String(isOpen));
      prompt.textContent = isOpen ? wish : 'Satu harapan untukmu ♡';
      card.setAttribute('aria-label', isOpen ? `Harapan ${index + 1}: ${wish} Sentuh untuk menutup.` : `Harapan ${index + 1}. Sentuh untuk membuka.`);
      if (isOpen) openedWishes.add(index); else openedWishes.delete(index);
      updateWishProgress();
    });
    wishesGrid?.appendChild(card);
  });
  updateWishProgress();

  // Gallery and graceful missing-image fallback
  const galleryGrid = $('#galleryGrid');
  const usableGallery = [];
  galleryItems.forEach((item, index) => {
    const card = document.createElement('button');
    card.type = 'button'; card.className = 'gallery-card';
    card.setAttribute('aria-label', `Buka foto: ${item.caption}`);
    const img = document.createElement('img'); img.src = item.src; img.alt = item.alt; img.loading = 'lazy'; img.decoding = 'async';
    const caption = document.createElement('span'); caption.className = 'gallery-caption'; caption.textContent = item.caption;
    const placeholder = document.createElement('span'); placeholder.className = 'gallery-placeholder';
    const symbol = document.createElement('span'); symbol.setAttribute('aria-hidden', 'true'); symbol.textContent = '♡';
    const title = document.createElement('strong'); title.textContent = `Kenangan ${String(index + 1).padStart(2, '0')}`;
    const hint = document.createElement('small'); hint.textContent = 'Tambahkan foto di assets/images';
    placeholder.append(symbol, title, hint);
    img.addEventListener('error', () => { img.remove(); caption.remove(); card.replaceChildren(placeholder); card.classList.add('is-placeholder'); card.setAttribute('aria-label', `Placeholder foto ${index + 1}. Tambahkan ${item.src}`); }, { once: true });
    card.append(img, caption);
    card.addEventListener('click', () => {
      const currentImage = $('img', card);
      if (!currentImage || !currentImage.complete || !currentImage.naturalWidth) {
        showToast(`Tambahkan foto ${item.src} untuk mengaktifkan kenangan ini.`); return;
      }
      usableGallery.length = 0;
      $$('.gallery-card', galleryGrid).forEach((other, otherIndex) => {
        const otherImage = $('img', other);
        if (otherImage?.complete && otherImage.naturalWidth) usableGallery.push({ elementIndex: otherIndex, src: otherImage.src, alt: otherImage.alt, caption: $('.gallery-caption', other)?.textContent || '' });
      });
      activeGalleryIndex = usableGallery.findIndex(entry => entry.elementIndex === index);
      if (activeGalleryIndex >= 0) openLightbox(activeGalleryIndex);
    });
    galleryGrid?.appendChild(card);
  });

  // Lightbox controls and keyboard support
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCaption = $('#lightboxCaption');
  function openLightbox(index) {
    if (!usableGallery.length || !lightbox) return;
    activeGalleryIndex = (index + usableGallery.length) % usableGallery.length;
    const item = usableGallery[activeGalleryIndex];
    lightboxImage.src = item.src; lightboxImage.alt = item.alt; lightboxCaption.textContent = item.caption;
    lastFocusedElement = document.activeElement;
    lightbox.hidden = false; document.body.classList.add('lightbox-open');
    $('#lightboxClose')?.focus();
  }
  function closeLightbox() {
    if (!lightbox || lightbox.hidden) return;
    lightbox.hidden = true; document.body.classList.remove('lightbox-open');
    lightboxImage.removeAttribute('src');
    lastFocusedElement?.focus?.();
  }
  function moveLightbox(direction) { if (usableGallery.length) openLightbox(activeGalleryIndex + direction); }
  $('#lightboxClose')?.addEventListener('click', closeLightbox);
  $('#lightboxPrev')?.addEventListener('click', () => moveLightbox(-1));
  $('#lightboxNext')?.addEventListener('click', () => moveLightbox(1));
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', event => {
    if (lightbox?.hidden === false) {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft') moveLightbox(-1);
      if (event.key === 'ArrowRight') moveLightbox(1);
    }
  });

  // Surprise gift: the flowers and ring are revealed only after Open Your Surprise is clicked.
  const presentWrap = $('#presentWrap');
  const surpriseMessage = $('#surpriseMessage');
  const hugResponse = $('#hugResponse');
  const surpriseGiftsIntro = $('#surpriseGiftsIntro');
  const surpriseGiftGrid = $('#surpriseGiftGrid');
  const surpriseGentleNote = $('#surpriseGentleNote');
  function openSurprise() {
    presentWrap?.classList.add('opened');
    presentWrap?.setAttribute('aria-label', 'Kotak hadiah terbuka');
    if (surpriseGiftsIntro) surpriseGiftsIntro.hidden = false;
    if (surpriseGiftGrid) { surpriseGiftGrid.hidden = false; $$('.surprise-gift-grid .reveal').forEach(card => card.classList.add('is-visible')); }
    if (surpriseGentleNote) surpriseGentleNote.hidden = false;
    if (surpriseMessage) surpriseMessage.hidden = false;
    const button = $('#openSurprise');
    if (button) { button.textContent = 'Kejutan sudah terbuka ♡'; button.disabled = true; }
    showToast('Bunga, cincin, dan pesan spesial untuk Sayang sudah terbuka ❤️');
    window.setTimeout(() => scrollToElement(surpriseGiftsIntro || surpriseMessage), reducedMotion ? 0 : 150);
  }
  $('#openSurprise')?.addEventListener('click', openSurprise);
  $('#hugButton')?.addEventListener('click', () => {
    if (hugResponse) hugResponse.hidden = false;
    showToast('Peluk hangat terkirim dari Mas ♡');
    createHearts();
  });
  function createHearts() {
    if (reducedMotion || !surpriseMessage) return;
    const symbols = ['♡', '♥', '✦'];
    for (let i = 0; i < 9; i++) {
      const heart = document.createElement('span');
      heart.textContent = symbols[i % symbols.length];
      Object.assign(heart.style, { position: 'fixed', zIndex: '1100', left: `${35 + Math.random() * 30}%`, top: `${45 + Math.random() * 20}%`, color: i % 2 ? '#d9859a' : '#d6b675', fontSize: `${16 + Math.random() * 16}px`, pointerEvents: 'none', transition: 'transform 1.3s ease, opacity 1.3s ease' });
      document.body.appendChild(heart);
      requestAnimationFrame(() => { heart.style.transform = `translate(${Math.random() * 160 - 80}px, ${-80 - Math.random() * 130}px) rotate(${Math.random() * 90 - 45}deg)`; heart.style.opacity = '0'; });
      window.setTimeout(() => heart.remove(), 1450);
    }
  }

  // Date invitation: playful "Tidak" button and WhatsApp confirmation
  const dateForm = $('#dateForm');
  const dateYes = $('#dateYes');
  const dateNo = $('#dateNo');
  const dateNoResponse = $('#dateNoResponse');
  const dateAnswerActions = $('#dateAnswerActions');
  const dateChoice = $('#dateChoice');
  if (dateChoice) {
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateChoice.min = localToday;
  }
  dateYes?.addEventListener('click', () => {
    if (dateForm) dateForm.hidden = false;
    if (dateNoResponse) dateNoResponse.hidden = true;
    dateYes.setAttribute('aria-pressed', 'true');
    dateForm?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'nearest' });
  });
  const dodgeNoButton = () => {
    if (!dateNo || !dateAnswerActions) return;
    dateNo.classList.add('is-running');
    const bounds = dateAnswerActions.getBoundingClientRect();
    const maxX = Math.max(0, Math.min(160, bounds.width / 2 - dateNo.offsetWidth / 2));
    const maxY = 48;
    const x = (Math.random() * 2 - 1) * maxX;
    const y = (Math.random() * 2 - 1) * maxY;
    dateNo.style.transform = `translate(${x}px, ${y}px)`;
    if (dateNoResponse) dateNoResponse.hidden = false;
  };
  dateNo?.addEventListener('pointerenter', dodgeNoButton);
  dateNo?.addEventListener('focus', dodgeNoButton);
  dateNo?.addEventListener('click', (event) => { event.preventDefault(); dodgeNoButton(); });
  dateNo?.addEventListener('touchstart', (event) => { event.preventDefault(); dodgeNoButton(); }, { passive: false });
  dateForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!dateForm.reportValidity()) return;
    const formData = new FormData(dateForm);
    const activity = String(formData.get('activity') || '');
    const date = String(formData.get('date') || '');
    const time = String(formData.get('time') || '');
    const note = String(formData.get('note') || '').trim();
    const [year, month, day] = date.split('-').map(Number);
    const formattedDate = new Date(year, month - 1, day).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    const message = [
      'Hai Mas ❤️',
      'Allya mau date sama Mas! 🥰',
      'I love you, sayangnya Mas yang cantikkk bangetttt ❤️',
      '',
      `Kegiatan pilihan: ${activity}`,
      `Tanggal: ${formattedDate}`,
      `Jam: ${time} WIB`,
      ...(note ? [`Catatan dari Allya: ${note}`] : []),
      '',
      'Yuk, kita atur detailnya bareng ya. ❤️'
    ].join('\n');
    const whatsappUrl = `https://wa.me/6287721031868?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    showToast('Pesan sudah disiapkan di WhatsApp. Tekan Kirim untuk mengonfirmasi. ❤️');
  });

  // Repeat: reset relevant state and return to opening without reloading the page
  $('#repeatSurprise')?.addEventListener('click', () => {
    if (opening) { opening.hidden = false; opening.classList.remove('is-leaving'); }
    if (presentWrap) { presentWrap.classList.remove('opened'); presentWrap.setAttribute('aria-label', 'Kotak hadiah tertutup'); }
    if (surpriseMessage) surpriseMessage.hidden = true;
    if (surpriseGiftsIntro) surpriseGiftsIntro.hidden = true;
    if (surpriseGiftGrid) surpriseGiftGrid.hidden = true;
    if (surpriseGentleNote) surpriseGentleNote.hidden = true;
    if (hugResponse) hugResponse.hidden = true;
    const surpriseButton = $('#openSurprise');
    if (surpriseButton) { surpriseButton.disabled = false; surpriseButton.textContent = 'Open Your Surprise ♡'; }
    closeMenu(); closeLightbox();
    if (letterClosed) letterClosed.hidden = false;
    if (letterContent) letterContent.hidden = true;
    letterCard?.classList.remove('letter-is-open');
    openedWishes = new Set();
    $$('.wish-card').forEach((card, index) => { card.classList.remove('is-open'); card.setAttribute('aria-pressed', 'false'); card.setAttribute('aria-label', `Harapan ${index + 1}. Sentuh untuk membuka.`); const prompt = $('.wish-prompt', card); if (prompt) prompt.textContent = 'Satu harapan untukmu ♡'; });
    updateWishProgress();
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    $('#openGift')?.focus({ preventScroll: true });
    updateHeader();
  });

  // Optional local audio. Playback is only attempted after a deliberate click.
  const audio = $('#backgroundMusic');
  const musicToggle = $('#musicToggle');
  const musicStatus = $('.music-status', musicToggle || document);
  function updateMusicUI(playing) {
    musicToggle?.classList.toggle('is-playing', playing);
    musicToggle?.setAttribute('aria-label', playing ? 'Jeda musik latar' : 'Putar musik latar');
    if (musicStatus) musicStatus.textContent = playing ? 'Musik: hidup' : 'Musik: mati';
  }
  musicToggle?.addEventListener('click', async () => {
    if (!audio) return;
    if (!audio.paused) { audio.pause(); updateMusicUI(false); return; }
    try {
      await audio.play(); updateMusicUI(true);
    } catch (error) {
      updateMusicUI(false);
      showToast('Musik belum tersedia. Tambahkan file assets/audio/background-music.mp3.');
    }
  });
  audio?.addEventListener('error', () => { updateMusicUI(false); });
  audio?.addEventListener('pause', () => updateMusicUI(false));
  audio?.addEventListener('play', () => updateMusicUI(true));

  // Smooth in-page links fallback and opening status
  $$('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    if (opening && !opening.hidden && !opening.classList.contains('is-leaving')) {
      opening.classList.add('is-leaving');
      window.setTimeout(() => { opening.hidden = true; scrollToElement(target); updateHeader(); }, reducedMotion ? 20 : 850);
    } else scrollToElement(target);
  }));
})();
