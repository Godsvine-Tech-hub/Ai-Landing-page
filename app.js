/**
 * AI VIDEO CONTENT CREATION MASTERCLASS
 * Main Application Logic & Automation
 */

(function () {
  'use strict';

  // 1. Storage & Config Initialization
  const STORAGE_KEY = 'ai_masterclass_config_v1';

  function loadConfig() {
    // Clone baseline configuration so all rich assets (images, descriptions, scripts) are permanently preserved
    const base = JSON.parse(JSON.stringify(window.COURSE_CONFIG || {}));
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.pricing) {
          base.pricing = Object.assign({}, base.pricing, parsed.pricing);
        }
        if (parsed.countdown) {
          base.countdown = Object.assign({}, base.countdown, parsed.countdown);
        }
        if (parsed.whatsapp) {
          base.whatsapp = Object.assign({}, base.whatsapp, parsed.whatsapp);
        }
        if (parsed.accessDuration) {
          base.accessDuration = parsed.accessDuration;
        }
        if (Array.isArray(parsed.sampleVideos)) {
          parsed.sampleVideos.forEach((sv, idx) => {
            if (base.sampleVideos[idx] && sv && sv.url !== undefined) {
              base.sampleVideos[idx].url = sv.url;
            }
          });
        }
      }
    } catch (err) {
      console.warn('Could not read saved admin settings from localStorage', err);
    }
    return base;
  }

  let activeConfig = loadConfig();

  // 2. DOM Elements Cache
  const els = {
    // Pricing
    regularPriceContainer: document.getElementById('regularPriceContainer'),
    regularPriceDisplay: document.getElementById('regularPriceDisplay'),
    offerPriceDisplay: document.getElementById('offerPriceDisplay'),
    priceCurrencySymbol: document.getElementById('priceCurrencySymbol'),
    priceNumericValue: document.getElementById('priceNumericValue'),
    stepFeeAmount: document.getElementById('stepFeeAmount'),
    stickyFeeVal: document.getElementById('stickyFeeVal'),

    // Bank Details
    bankNameDisplay: document.getElementById('bankNameDisplay'),
    accountNameDisplay: document.getElementById('accountNameDisplay'),
    accountNumberDisplay: document.getElementById('accountNumberDisplay'),
    copyAccountBtn: document.getElementById('copyAccountBtn'),
    copyBtnText: document.getElementById('copyBtnText'),
    copyFeedback: document.getElementById('copyFeedback'),
    stickyCopyAccountBtn: document.getElementById('stickyCopyAccountBtn'),

    // Countdown
    daysVal: document.getElementById('daysVal'),
    hoursVal: document.getElementById('hoursVal'),
    minutesVal: document.getElementById('minutesVal'),
    secondsVal: document.getElementById('secondsVal'),
    deadlineDisplayPlaceholder: document.getElementById('deadlineDisplayPlaceholder'),
    registrationClosedBanner: document.getElementById('registrationClosedBanner'),
    timerGrid: document.getElementById('timerGrid'),
    enrollBtns: document.querySelectorAll('a[href="#paymentSection"], .btn-enroll-action'),

    // WhatsApp Form & Preview
    studentFullName: document.getElementById('studentFullName'),
    studentWhatsapp: document.getElementById('studentWhatsapp'),
    studentEmail: document.getElementById('studentEmail'),
    studentAmount: document.getElementById('studentAmount'),
    paymentDate: document.getElementById('paymentDate'),
    paymentRef: document.getElementById('paymentRef'),
    whatsappMessagePreview: document.getElementById('whatsappMessagePreview'),
    btnConfirmPayment: document.getElementById('btnConfirmPayment'),

    // FAQ Access Duration
    faqAccessDurationAnswer: document.getElementById('faqAccessDurationAnswer'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer'),

    // Video Modal
    videoModalOverlay: document.getElementById('videoModalOverlay'),
    closeVideoModalBtn: document.getElementById('closeVideoModalBtn'),
    modalVideoViewport: document.getElementById('modalVideoViewport'),
    modalVideoTitle: document.getElementById('modalVideoTitle'),
    modalVideoDesc: document.getElementById('modalVideoDesc'),

    // Copyright
    currentYearSpan: document.getElementById('currentYearSpan')
  };

  // 3. Render Initial State from Configuration
  function renderAll() {
    renderCopyrightYear();
    renderPricing();
    renderBankDetails();
    renderFaqAccessDuration();
    updateWhatsAppPreview();
    initCountdownTimer();
  }

  function renderCopyrightYear() {
    if (els.currentYearSpan) {
      els.currentYearSpan.textContent = new Date().getFullYear();
    }
  }

  function cleanPrice(str) {
    if (!str) return '';
    return String(str).replace(/^[₦N\$\s]+/, '').trim();
  }

  function renderPricing() {
    const pricing = activeConfig.pricing || {};
    const sym = pricing.currencySymbol || '₦';

    const cleanRegular = cleanPrice(pricing.regularPrice);
    const cleanOffer = cleanPrice(pricing.offerPrice);

    // Regular Price - only display if set, otherwise cleanly hide to avoid scattering layout
    if (cleanRegular !== '' && !cleanRegular.includes('[')) {
      if (els.regularPriceContainer) els.regularPriceContainer.style.display = 'flex';
      if (els.regularPriceDisplay) {
        els.regularPriceDisplay.textContent = `${sym} ${cleanRegular}`;
      }
    } else {
      if (els.regularPriceContainer) {
        els.regularPriceContainer.style.display = 'none';
      }
    }

    // Offer Price
    if (cleanOffer !== '' && !cleanOffer.includes('[')) {
      if (els.priceNumericValue) els.priceNumericValue.textContent = cleanOffer;
      if (els.stepFeeAmount) els.stepFeeAmount.textContent = `${sym} ${cleanOffer}`;
      if (els.stickyFeeVal) els.stickyFeeVal.textContent = `${sym} ${cleanOffer}`;
      if (els.studentAmount && (!els.studentAmount.value || els.studentAmount.value.startsWith('₦') || els.studentAmount.value.includes('['))) {
        els.studentAmount.value = `${sym} ${cleanOffer}`;
      }
    } else {
      if (els.priceNumericValue) els.priceNumericValue.textContent = 'Cohort Tuition';
      if (els.stepFeeAmount) els.stepFeeAmount.textContent = 'Published Cohort Fee';
      if (els.stickyFeeVal) els.stickyFeeVal.textContent = 'Open Enrollment';
    }
  }

  function renderBankDetails() {
    const bank = activeConfig.bankDetails || {
      bankName: 'FirstBank',
      accountName: 'Godsvine Tech Hub',
      accountNumber: '2048352886'
    };

    if (els.bankNameDisplay) els.bankNameDisplay.textContent = bank.bankName;
    if (els.accountNameDisplay) els.accountNameDisplay.textContent = bank.accountName;
    if (els.accountNumberDisplay) els.accountNumberDisplay.textContent = bank.accountNumber;
  }

  function renderFaqAccessDuration() {
    if (els.faqAccessDurationAnswer) {
      const dur = activeConfig.accessDuration || '[ENTER COURSE ACCESS DURATION e.g. 6 Months Access]';
      els.faqAccessDurationAnswer.textContent = `Course access duration: ${dur}. Lessons and community materials are accessible according to the published duration established by the administrator.`;
    }
  }

  // 4. One-Click Copy Account Number Automation
  function handleCopyAccountNumber() {
    const bank = activeConfig.bankDetails || {};
    const accountNumber = bank.accountNumber || '2048352886';

    const fallbackCopy = (text) => {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        triggerCopySuccess();
      } catch (err) {
        showToast('Please copy manually: ' + text, 'warning');
      }
      document.body.removeChild(textArea);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(accountNumber)
        .then(() => triggerCopySuccess())
        .catch(() => fallbackCopy(accountNumber));
    } else {
      fallbackCopy(accountNumber);
    }
  }

  function triggerCopySuccess() {
    if (els.copyFeedback) {
      els.copyFeedback.style.display = 'flex';
    }
    if (els.copyBtnText) {
      els.copyBtnText.textContent = 'COPIED!';
    }
    const bank = activeConfig.bankDetails || {};
    const accountNumber = bank.accountNumber || '2048352886';
    showToast(`Account number copied successfully: ${accountNumber}`, 'success');

    setTimeout(() => {
      if (els.copyFeedback) {
        els.copyFeedback.style.display = 'none';
      }
      if (els.copyBtnText) {
        els.copyBtnText.textContent = 'COPY ACCOUNT NUMBER';
      }
    }, 3200);
  }

  if (els.copyAccountBtn) {
    els.copyAccountBtn.addEventListener('click', handleCopyAccountNumber);
  }
  if (els.stickyCopyAccountBtn) {
    els.stickyCopyAccountBtn.addEventListener('click', handleCopyAccountNumber);
  }

  // Quick Copy Account Button in Hero Direct Pay Card
  const btnQuickCopyAcc = document.getElementById('btnQuickCopyAcc');
  const quickCopyText = document.getElementById('quickCopyText');
  if (btnQuickCopyAcc) {
    btnQuickCopyAcc.addEventListener('click', () => {
      const bank = activeConfig.bankDetails || {};
      const accountNumber = bank.accountNumber || '2048352886';
      
      const onSuccess = () => {
        if (quickCopyText) quickCopyText.textContent = 'COPIED TO CLIPBOARD!';
        btnQuickCopyAcc.style.backgroundColor = '#ecfdf5';
        btnQuickCopyAcc.style.borderColor = '#10b981';
        btnQuickCopyAcc.style.color = '#047857';
        showToast(`FirstBank account ${accountNumber} copied!`, 'success');
        setTimeout(() => {
          if (quickCopyText) quickCopyText.textContent = `Copy ${accountNumber}`;
          btnQuickCopyAcc.style.backgroundColor = '';
          btnQuickCopyAcc.style.borderColor = '';
          btnQuickCopyAcc.style.color = '';
        }, 2800);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(accountNumber).then(onSuccess).catch(() => {
          handleCopyAccountNumber();
        });
      } else {
        handleCopyAccountNumber();
      }
    });
  }

  // 5. Countdown Timer Automation (Evergreen Rolling Countdown)
  let timerInterval = null;

  function initCountdownTimer() {
    if (timerInterval) clearInterval(timerInterval);

    const countdownConfig = activeConfig.countdown || {};
    let targetDate = null;

    // Explicit custom deadline if specified in admin settings
    if (countdownConfig.deadlineISO && countdownConfig.deadlineISO.trim() !== '') {
      const parsedTime = new Date(countdownConfig.deadlineISO).getTime();
      if (!isNaN(parsedTime) && parsedTime > Date.now()) {
        targetDate = parsedTime;
      }
    }

    // Evergreen Rolling Countdown: Starts from 1 day and 24 hours (approx 48 hours: 1d 23h 59m 59s)
    // Ensures the timer NEVER finishes, always displaying an active urgent countdown
    const EVERGREEN_DURATION_MS = (1 * 24 * 3600 + 23 * 3600 + 59 * 60 + 59) * 1000;

    if (!targetDate) {
      let storedDeadline = null;
      try {
        storedDeadline = sessionStorage.getItem('godsvine_evergreen_deadline');
      } catch (e) {}

      let parsedStored = Number(storedDeadline);
      const now = Date.now();

      // If stored within current session and still active (more than 15 mins remaining), keep ticking
      if (storedDeadline && !isNaN(parsedStored) && parsedStored > now && (parsedStored - now) > 15 * 60 * 1000) {
        targetDate = parsedStored;
      } else {
        // Start fresh: 1 day, 23 hours, 59 minutes, 59 seconds from now
        targetDate = now + EVERGREEN_DURATION_MS;
        try {
          sessionStorage.setItem('godsvine_evergreen_deadline', targetDate.toString());
        } catch (e) {}
      }
    }

    // Format registration deadline note
    function updateDeadlineDisplay() {
      if (!els.deadlineDisplayPlaceholder) return;
      els.deadlineDisplayPlaceholder.textContent = 'SOON';
    }

    updateDeadlineDisplay();

    // Keep enrollment active unconditionally
    enableEnrollment();

    function updateTick() {
      const now = Date.now();
      let distance = targetDate - now;

      // When timer reaches zero or less, automatically loop/refresh so it NEVER finishes
      if (distance <= 0) {
        targetDate = now + EVERGREEN_DURATION_MS;
        try {
          sessionStorage.setItem('godsvine_evergreen_deadline', targetDate.toString());
        } catch (e) {}
        updateDeadlineDisplay();
        distance = targetDate - now;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (els.daysVal) els.daysVal.textContent = String(Math.max(0, days)).padStart(2, '0');
      if (els.hoursVal) els.hoursVal.textContent = String(Math.max(0, hours)).padStart(2, '0');
      if (els.minutesVal) els.minutesVal.textContent = String(Math.max(0, minutes)).padStart(2, '0');
      if (els.secondsVal) els.secondsVal.textContent = String(Math.max(0, seconds)).padStart(2, '0');
    }

    updateTick();
    timerInterval = setInterval(updateTick, 1000);
  }

  function enableEnrollment() {
    if (els.registrationClosedBanner) {
      els.registrationClosedBanner.style.display = 'none';
    }
    if (els.enrollBtns) {
      els.enrollBtns.forEach(btn => {
        btn.removeAttribute('aria-disabled');
        btn.classList.remove('btn-disabled');
        btn.style.pointerEvents = '';
        btn.style.opacity = '';
        const sp = btn.querySelector('span');
        if (sp && sp.textContent === 'REGISTRATION CLOSED') {
          sp.textContent = 'Enroll Now';
        }
      });
    }
  }

  function disableEnrollment() {
    if (els.enrollBtns) {
      els.enrollBtns.forEach(btn => {
        btn.setAttribute('aria-disabled', 'true');
        btn.classList.add('btn-disabled');
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.6';
        const sp = btn.querySelector('span');
        if (sp) {
          sp.textContent = 'REGISTRATION CLOSED';
        }
      });
    }
  }

  // 6. WhatsApp Payment Confirmation Automation
  // Set default payment date to today
  if (els.paymentDate) {
    const today = new Date().toISOString().split('T')[0];
    els.paymentDate.value = today;
  }

  function getFormattedWhatsAppMessage() {
    const name = els.studentFullName && els.studentFullName.value.trim() ? els.studentFullName.value.trim() : '[Your Full Name]';
    const phone = els.studentWhatsapp && els.studentWhatsapp.value.trim() ? els.studentWhatsapp.value.trim() : '[Your WhatsApp Phone]';
    const email = els.studentEmail && els.studentEmail.value.trim() ? els.studentEmail.value.trim() : '[Your Email Address]';
    const amount = els.studentAmount && els.studentAmount.value.trim() ? els.studentAmount.value.trim() : (activeConfig.pricing?.offerPrice ? '₦ ' + activeConfig.pricing.offerPrice : '[Amount Paid]');
    const date = els.paymentDate && els.paymentDate.value ? els.paymentDate.value : '[Date of Payment]';
    const ref = els.paymentRef && els.paymentRef.value.trim() ? els.paymentRef.value.trim() : '[Payment Reference / Transaction ID]';

    const bank = activeConfig.bankDetails || {};
    const bankName = bank.bankName || 'FirstBank';

    return `Hello, I have made payment for the AI Video Content Creation Masterclass.

My details are:

Full Name: ${name}
WhatsApp Number: ${phone}
Email Address: ${email}
Amount Paid: ${amount}
Date of Payment: ${date}
Payment Reference: ${ref}

I have made the transfer to the official ${bankName} account.

Please verify my payment and send me the private Telegram course access invitation.

Thank you.`;
  }

  function updateWhatsAppPreview() {
    if (els.whatsappMessagePreview) {
      els.whatsappMessagePreview.textContent = getFormattedWhatsAppMessage();
    }
  }

  // Attach live input listeners to form
  const formInputs = [els.studentFullName, els.studentWhatsapp, els.studentEmail, els.studentAmount, els.paymentDate, els.paymentRef];
  formInputs.forEach(input => {
    if (input) {
      input.addEventListener('input', updateWhatsAppPreview);
      input.addEventListener('change', updateWhatsAppPreview);
    }
  });

  // Handle WhatsApp Confirmation Click
  if (els.btnConfirmPayment) {
    els.btnConfirmPayment.addEventListener('click', function () {
      // Validate form fields
      const name = els.studentFullName?.value.trim();
      const phone = els.studentWhatsapp?.value.trim();
      const email = els.studentEmail?.value.trim();
      const amount = els.studentAmount?.value.trim();
      const ref = els.paymentRef?.value.trim();

      if (!name || !phone || !email || !amount || !ref) {
        showToast('Please fill in all payment details so your verification is fast and accurate.', 'warning');
        if (!name && els.studentFullName) els.studentFullName.focus();
        else if (!phone && els.studentWhatsapp) els.studentWhatsapp.focus();
        else if (!email && els.studentEmail) els.studentEmail.focus();
        else if (!amount && els.studentAmount) els.studentAmount.focus();
        else if (!ref && els.paymentRef) els.paymentRef.focus();
        return;
      }

      const message = getFormattedWhatsAppMessage();
      const whatsappNumber = activeConfig.whatsapp?.number ? activeConfig.whatsapp.number.replace(/[^0-9]/g, '') : '';

      if (!whatsappNumber) {
        showToast('Payment confirmation message copied to your clipboard!', 'success');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(message);
        }
        return;
      }

      const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      showToast('Opening WhatsApp with your prefilled verification details...', 'success');
    });
  }

  // 7. Sample Video Modal Automation
  function openVideoModal(videoIndex) {
    const videos = activeConfig.sampleVideos || [];
    const video = videos[videoIndex] || {
      title: 'AI Video Masterclass Demo',
      description: 'Discover how to generate creative images and videos using AI.',
      url: ''
    };

    if (els.modalVideoTitle) els.modalVideoTitle.textContent = video.title;
    if (els.modalVideoDesc) els.modalVideoDesc.textContent = video.description;

    if (els.modalVideoViewport) {
      els.modalVideoViewport.innerHTML = '';

      if (video.url && video.url.trim() !== '') {
        // URL provided: YouTube embed or Direct MP4 video
        if (video.url.includes('youtube.com') || video.url.includes('youtu.be') || video.url.includes('vimeo.com')) {
          let embedUrl = video.url;
          if (video.url.includes('watch?v=')) {
            embedUrl = video.url.replace('watch?v=', 'embed/');
          } else if (video.url.includes('youtu.be/')) {
            embedUrl = video.url.replace('youtu.be/', 'www.youtube.com/embed/');
          }
          const iframe = document.createElement('iframe');
          iframe.src = embedUrl + (embedUrl.includes('?') ? '&autoplay=1' : '?autoplay=1');
          iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
          iframe.allowFullscreen = true;
          els.modalVideoViewport.appendChild(iframe);
        } else {
          // Direct video link (e.g. mp4)
          const vid = document.createElement('video');
          vid.src = video.url;
          vid.controls = true;
          vid.autoplay = true;
          vid.style.width = '100%';
          vid.style.height = '100%';
          els.modalVideoViewport.appendChild(vid);
        }
      } else if (videoIndex === 1) {
        // Showcase 2: Interactive Television News Commercial Broadcast
        els.modalVideoViewport.innerHTML = `
          <div class="broadcast-video-container" style="position: relative; width: 100%; aspect-ratio: 16/9; background: #000; overflow: hidden; display: flex; align-items: center; justify-content: center;">
            <img src="${video.image}" alt="Godsvine Advert Live Broadcast" style="width: 100%; height: 100%; object-fit: cover;">
            
            <!-- Live Broadcast Badges -->
            <div style="position: absolute; top: 1rem; left: 1.25rem; display: flex; align-items: center; gap: 0.6rem; z-index: 5;">
              <span style="background: #ef4444; color: #fff; font-weight: 800; font-size: 0.72rem; padding: 0.25rem 0.65rem; border-radius: 4px; letter-spacing: 0.08em; display: flex; align-items: center; gap: 0.35rem;">
                <span style="width: 7px; height: 7px; border-radius: 50%; background: #fff; display: inline-block;"></span> LIVE
              </span>
              <span style="background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(6px); color: #fff; font-weight: 750; font-size: 0.72rem; padding: 0.25rem 0.65rem; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2);">
                GODSVINE NEWS 4K
              </span>
            </div>

            <!-- Resolution Watermark -->
            <div style="position: absolute; top: 1rem; right: 1.25rem; z-index: 5;">
              <span style="background: rgba(91, 54, 245, 0.9); color: #fff; font-size: 0.7rem; font-weight: 800; padding: 0.2rem 0.6rem; border-radius: 4px;">
                GOOGLE FLOW + CAPCUT
              </span>
            </div>

            <!-- Play Dialogue Action Overlay -->
            <button type="button" id="modalAdvertPlayBtn" style="position: absolute; width: 72px; height: 72px; border-radius: 50%; background: rgba(91, 54, 245, 0.9); color: #fff; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 6; box-shadow: 0 8px 24px rgba(0,0,0,0.5); transition: transform 0.2s;" title="Play / Pause Advert Audio">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
            </button>

            <!-- Lower Third News Graphic -->
            <div style="position: absolute; bottom: 2.2rem; left: 0; right: 0; padding: 0 1.25rem; z-index: 5;">
              <div style="background: linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 27, 75, 0.95) 100%); border-left: 5px solid #5b36f5; padding: 0.65rem 1rem; border-radius: 6px; box-shadow: 0 4px 15px rgba(0,0,0,0.4); border-top: 1px solid rgba(255,255,255,0.15);">
                <div style="display: flex; align-items: center; justify-content: space-between;">
                  <span style="color: #38bdf8; font-size: 0.72rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;">SPECIAL REPORT • AI ADVERTISING MASTERCLASS</span>
                  <span style="color: #c4b5fd; font-size: 0.68rem; font-weight: 700;">ALEX & LEO CO-HOSTS</span>
                </div>
                <div id="modalDialogueLine" style="color: #ffffff; font-size: 0.88rem; font-weight: 600; margin-top: 0.2rem; min-height: 1.4em;">
                  Click play to hear Alex & Leo deliver the live commercial broadcast!
                </div>
              </div>
            </div>

            <!-- Scrolling Breaking News Ticker -->
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 2rem; background: #0b0f19; border-top: 1px solid rgba(255,255,255,0.15); display: flex; align-items: center; overflow: hidden; z-index: 5;">
              <div style="background: #ef4444; color: #fff; font-weight: 800; font-size: 0.68rem; padding: 0 0.75rem; height: 100%; display: flex; align-items: center; letter-spacing: 0.05em; flex-shrink: 0;">
                BREAKING NEWS
              </div>
              <div style="white-space: nowrap; animation: ticker-scroll 22s linear infinite; font-size: 0.76rem; color: #e2e8f0; font-weight: 600; padding-left: 1rem;">
                GODSVINE TECH HUB MASTERCLASS: MASTER AI VIDEO GENERATION WITH GOOGLE FLOW • MULTI-TRACK CAPCUT EDITING • VIRAL AD CREATION • COHORT ENROLLMENT OPEN NOW • 
              </div>
            </div>
          </div>
        `;

        const modalPlay = document.getElementById('modalAdvertPlayBtn');
        if (modalPlay) {
          modalPlay.addEventListener('click', function () {
            playAdvertAudio();
          });
        }
      } else if (video.image && video.image.trim() !== '') {
        // High-resolution showcase image & dialogue script view
        els.modalVideoViewport.innerHTML = `
          <div style="width: 100%; min-height: 480px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #090d16; padding: 1.5rem; overflow-y: auto;">
            <img src="${video.image}" alt="${video.title}" style="max-width: 100%; max-height: 60vh; border-radius: 12px; object-fit: contain; box-shadow: 0 10px 30px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.15);">
          </div>
        `;
      } else {
        // High-tech preview placeholder state
        els.modalVideoViewport.innerHTML = `
          <div class="modal-placeholder-preview">
            <div class="placeholder-pulse-icon">&#9658;</div>
            <h3 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 0.5rem;">${video.title}</h3>
            <p style="font-size: 0.92rem; color: #cbd5e1; max-width: 520px; margin-bottom: 1.25rem;">
              ${video.description}
            </p>
          </div>
        `;
      }
    }

    if (els.videoModalOverlay) {
      els.videoModalOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeVideoModal() {
    stopAdvertAudio();
    if (els.videoModalOverlay) {
      els.videoModalOverlay.classList.remove('open');
      document.body.style.overflow = '';
      if (els.modalVideoViewport) {
        els.modalVideoViewport.innerHTML = '';
      }
    }
  }

  // Attach video card play click listeners
  document.querySelectorAll('[data-play-index], .video-media-wrapper').forEach(trigger => {
    trigger.addEventListener('click', function (e) {
      const card = this.closest('.video-card');
      const idx = card ? parseInt(card.getAttribute('data-video-index'), 10) : 0;
      openVideoModal(isNaN(idx) ? 0 : idx);
    });
  });

  if (els.closeVideoModalBtn) {
    els.closeVideoModalBtn.addEventListener('click', closeVideoModal);
  }
  if (els.videoModalOverlay) {
    els.videoModalOverlay.addEventListener('click', function (e) {
      if (e.target === els.videoModalOverlay) {
        closeVideoModal();
      }
    });
  }

  // 7. Interactive Broadcast Advert Audio Player
  let advertSpeechActive = false;

  function stopAdvertAudio() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    advertSpeechActive = false;
    const playBtn = document.getElementById('btnPlayAdvertAudio');
    if (playBtn) {
      playBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
      `;
    }
    const prog = document.getElementById('advertAudioProgress');
    if (prog) prog.style.width = '0%';
    const alexLine = document.getElementById('speakerAlexLine');
    const leoLine = document.getElementById('speakerLeoLine');
    if (alexLine) alexLine.style.background = '';
    if (leoLine) leoLine.style.background = '';
    const modalLine = document.getElementById('modalDialogueLine');
    if (modalLine) modalLine.textContent = 'Click play to hear Alex & Leo deliver the live commercial broadcast!';
  }

  function playAdvertAudio() {
    if (advertSpeechActive) {
      stopAdvertAudio();
      return;
    }

    const playBtn = document.getElementById('btnPlayAdvertAudio');
    const prog = document.getElementById('advertAudioProgress');
    const alexLine = document.getElementById('speakerAlexLine');
    const leoLine = document.getElementById('speakerLeoLine');
    const modalLine = document.getElementById('modalDialogueLine');

    advertSpeechActive = true;
    if (playBtn) {
      playBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      `;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const uAlex = new SpeechSynthesisUtterance("Welcome to Godsvine Tech Hub! Today we're showing you how anyone can create viral AI video ads in under 10 minutes.");
      uAlex.rate = 1.05;
      uAlex.pitch = 0.95;

      const uLeo = new SpeechSynthesisUtterance("That's right, Alex! From realistic presenters to 3D characters like me — all generated with Google Flow and edited in CapCut!");
      uLeo.rate = 1.1;
      uLeo.pitch = 1.35;

      uAlex.onstart = () => {
        if (alexLine) alexLine.style.background = 'rgba(91, 54, 245, 0.12)';
        if (leoLine) leoLine.style.background = '';
        if (prog) prog.style.width = '45%';
        if (modalLine) modalLine.textContent = 'Alex: "Welcome to Godsvine Tech Hub! Today we\'re showing you how anyone can create viral AI video ads in under 10 minutes."';
      };

      uAlex.onend = () => {
        if (alexLine) alexLine.style.background = '';
      };

      uLeo.onstart = () => {
        if (leoLine) leoLine.style.background = 'rgba(245, 158, 11, 0.15)';
        if (prog) prog.style.width = '95%';
        if (modalLine) modalLine.textContent = 'Leo: "That\'s right, Alex! From realistic presenters to 3D characters like me — all generated with Google Flow and edited in CapCut!"';
      };

      uLeo.onend = () => {
        if (leoLine) leoLine.style.background = '';
        if (prog) prog.style.width = '100%';
        if (modalLine) modalLine.textContent = 'Commercial broadcast complete! Enroll below to start creating.';
        setTimeout(() => {
          stopAdvertAudio();
        }, 1200);
      };

      uAlex.onerror = uLeo.onerror = () => {
        stopAdvertAudio();
      };

      window.speechSynthesis.speak(uAlex);
      window.speechSynthesis.speak(uLeo);
    } else {
      if (alexLine) alexLine.style.background = 'rgba(91, 54, 245, 0.12)';
      if (prog) prog.style.width = '50%';
      setTimeout(() => {
        if (!advertSpeechActive) return;
        if (alexLine) alexLine.style.background = '';
        if (leoLine) leoLine.style.background = 'rgba(245, 158, 11, 0.15)';
        if (prog) prog.style.width = '100%';
        setTimeout(() => {
          stopAdvertAudio();
        }, 3000);
      }, 3000);
    }
  }

  const btnPlayAdvert = document.getElementById('btnPlayAdvertAudio');
  if (btnPlayAdvert) {
    btnPlayAdvert.addEventListener('click', playAdvertAudio);
  }

  // 8. Style Studio Filter Pills & Copy Buttons
  const styleFilterPills = document.querySelectorAll('.style-filter-pill');
  const styleCards = document.querySelectorAll('.style-card');

  styleFilterPills.forEach(pill => {
    pill.addEventListener('click', function () {
      styleFilterPills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      const filter = this.getAttribute('data-filter');

      styleCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-style') === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  document.querySelectorAll('.btn-copy-prompt').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      const promptText = this.getAttribute('data-prompt');
      if (navigator.clipboard && promptText) {
        navigator.clipboard.writeText(promptText).then(() => {
          const originalHTML = this.innerHTML;
          this.innerHTML = `
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Copied!</span>
          `;
          this.style.background = '#10b981';
          this.style.color = '#ffffff';
          showToast('AI prompt copied! Ready to paste into Google Flow or ChatGPT.', 'success');
          setTimeout(() => {
            this.innerHTML = originalHTML;
            this.style.background = '';
            this.style.color = '';
          }, 2000);
        });
      }
    });
  });

  // Click on style image to open high-res lightbox preview
  document.querySelectorAll('.style-img-wrapper').forEach(wrapper => {
    wrapper.addEventListener('click', function () {
      const card = this.closest('.style-card');
      if (!card) return;
      const img = card.querySelector('.style-card-img, .style-img');
      const title = card.querySelector('.style-title')?.textContent || 'AI Style Preview';
      const badge = card.querySelector('.style-badge-pill, .style-badge')?.textContent || 'AI Style';
      const promptBtn = card.querySelector('.btn-copy-prompt');
      const promptText = promptBtn?.getAttribute('data-prompt') || '';

      if (els.modalVideoTitle) els.modalVideoTitle.textContent = title;
      if (els.modalVideoDesc) els.modalVideoDesc.textContent = `Model & Engine: ${badge}`;

      if (els.modalVideoViewport) {
        els.modalVideoViewport.innerHTML = `
          <div style="position: relative; width: 100%; max-height: 70vh; background: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; border-radius: 12px; border: 1px solid var(--color-border, #ede8f7);">
            <img src="${img ? img.getAttribute('src') : ''}" alt="${title}" style="max-width: 100%; max-height: 50vh; object-fit: contain; border-radius: 8px; margin: 0.75rem 0;">
            <div style="padding: 1rem 1.25rem; width: 100%; background: #ffffff; border-top: 1px solid var(--color-border, #ede8f7); display: flex; flex-direction: column; gap: 0.5rem;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;">
                <span style="font-size: 0.72rem; font-weight: 750; color: #5b36f5; letter-spacing: 0.05em; text-transform: uppercase;">Exact Generation Prompt</span>
                <button type="button" class="btn-copy-prompt" data-prompt="${escapeHtml(promptText)}" style="background: #5b36f5; color: #fff; border: none; padding: 0.35rem 0.85rem; border-radius: 20px; font-size: 0.74rem; font-weight: 700; cursor: pointer;">Copy Prompt</button>
              </div>
              <p style="font-size: 0.78rem; color: #334155; line-height: 1.5; margin: 0; font-family: monospace; background: #f4f0ff; padding: 0.6rem 0.85rem; border-radius: 8px; border: 1px solid rgba(91, 54, 245, 0.15);">
                ${escapeHtml(promptText)}
              </p>
            </div>
          </div>
        `;

        const modalCopyBtn = els.modalVideoViewport.querySelector('.btn-copy-prompt');
        if (modalCopyBtn) {
          modalCopyBtn.addEventListener('click', function () {
            if (navigator.clipboard && promptText) {
              navigator.clipboard.writeText(promptText).then(() => {
                this.textContent = 'Copied!';
                this.style.background = '#10b981';
                showToast('Prompt copied to clipboard!', 'success');
                setTimeout(() => {
                  this.textContent = 'Copy Prompt';
                  this.style.background = '#582cd4';
                }, 2000);
              });
            }
          });
        }
      }

      if (els.videoModalOverlay) {
        els.videoModalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });


  // 8. FAQ Accordion Automation
  const faqButtons = document.querySelectorAll('.faq-question-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const parentItem = this.closest('.faq-item');
      const isOpen = parentItem.classList.contains('active');

      // Close all other FAQ items for a clean accordion effect
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== parentItem) {
          item.classList.remove('active');
          const otherBtn = item.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        parentItem.classList.remove('active');
        this.setAttribute('aria-expanded', 'false');
      } else {
        parentItem.classList.add('active');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Global Keyboard listener: Escape to close modals
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeVideoModal();
    }
  });

  // 10. Toast Notification System
  function showToast(message, type = 'info') {
    if (!els.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'success') {
      toast.style.borderLeftColor = '#10b981';
    } else if (type === 'warning') {
      toast.style.borderLeftColor = '#f59e0b';
    }

    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: ${type === 'success' ? '#10b981' : (type === 'warning' ? '#f59e0b' : '#38bdf8')};">
        ${type === 'success' ? '<polyline points="20 6 9 17 4 12"></polyline>' : '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'}
      </svg>
      <span>${escapeHtml(message)}</span>
    `;

    els.toastContainer.appendChild(toast);

    // Trigger animation in next frame
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Live Cross-Tab Synchronization with Admin Dashboard
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) {
      activeConfig = loadConfig();
      renderAll();
    }
  });

  // Run initial render
  renderAll();

})();
