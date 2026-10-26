/**
 * AI Video Content Creation Masterclass
 * Dedicated Standalone Admin Portal Logic
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'ai_masterclass_config_v1';
  const AUTH_KEY = 'ai_admin_session_auth';
  const PASSCODE_STORAGE_KEY = 'ai_admin_passcode';
  const DEFAULT_PASSCODE = 'admin2026';

  // 1. Safe Configuration Loading
  function getBaseConfig() {
    return JSON.parse(JSON.stringify(window.COURSE_CONFIG || {}));
  }

  let currentConfig = getBaseConfig();

  // Load saved config non-destructively
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.pricing) {
        currentConfig.pricing = Object.assign({}, currentConfig.pricing, parsed.pricing);
      }
      if (parsed.countdown) {
        currentConfig.countdown = Object.assign({}, currentConfig.countdown, parsed.countdown);
      }
      if (parsed.whatsapp) {
        currentConfig.whatsapp = Object.assign({}, currentConfig.whatsapp, parsed.whatsapp);
      }
      if (parsed.accessDuration) {
        currentConfig.accessDuration = parsed.accessDuration;
      }
      if (Array.isArray(parsed.sampleVideos)) {
        parsed.sampleVideos.forEach((sv, idx) => {
          if (currentConfig.sampleVideos[idx] && sv && sv.url !== undefined) {
            currentConfig.sampleVideos[idx].url = sv.url;
          }
        });
      }
    }
  } catch (e) {
    console.warn('Could not read saved settings', e);
  }

  // DOM Elements
  const authOverlay = document.getElementById('authOverlay');
  const adminPasscode = document.getElementById('adminPasscode');
  const loginBtn = document.getElementById('loginBtn');
  const authError = document.getElementById('authError');
  const logoutBtn = document.getElementById('logoutBtn');

  // Input Fields
  const admRegularPrice = document.getElementById('admRegularPrice');
  const admOfferPrice = document.getElementById('admOfferPrice');
  const admDeadline = document.getElementById('admDeadline');
  const admCloseOnExpire = document.getElementById('admCloseOnExpire');
  const admWhatsapp = document.getElementById('admWhatsapp');
  const admVideo1 = document.getElementById('admVideo1');
  const admVideo2 = document.getElementById('admVideo2');
  const admVideo3 = document.getElementById('admVideo3');
  const admVideo4 = document.getElementById('admVideo4');
  const admDuration = document.getElementById('admDuration');

  // Actions
  const btnSaveMaster = document.getElementById('btnSaveMaster');
  const btnResetDefaults = document.getElementById('btnResetDefaults');
  const btnExportCode = document.getElementById('btnExportCode');
  const adminToast = document.getElementById('adminToast');
  const exportModal = document.getElementById('exportModal');
  const exportCodeContent = document.getElementById('exportCodeContent');
  const btnCopySnippet = document.getElementById('btnCopySnippet');
  const btnCloseExportModal = document.getElementById('btnCloseExportModal');

  // 1. Authentication Check
  function checkAuth() {
    const isAuthed = sessionStorage.getItem(AUTH_KEY);
    if (isAuthed === 'true') {
      authOverlay.style.display = 'none';
      populateForm();
    } else {
      authOverlay.style.display = 'flex';
      if (adminPasscode) adminPasscode.focus();
    }
  }

  function handleLogin() {
    const entered = adminPasscode?.value.trim();
    const storedPass = localStorage.getItem(PASSCODE_STORAGE_KEY) || DEFAULT_PASSCODE;

    if (entered === storedPass) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      authOverlay.style.display = 'none';
      authError.style.display = 'none';
      populateForm();
    } else {
      authError.style.display = 'block';
      if (adminPasscode) {
        adminPasscode.value = '';
        adminPasscode.focus();
      }
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    checkAuth();
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
  }
  if (adminPasscode) {
    adminPasscode.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleLogin();
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // 2. Populate Form with Current Configuration
  function populateForm() {
    const p = currentConfig.pricing || {};
    if (admRegularPrice) admRegularPrice.value = p.regularPrice || '';
    if (admOfferPrice) admOfferPrice.value = p.offerPrice || '';

    const cd = currentConfig.countdown || {};
    if (admDeadline && cd.deadlineISO) {
      try {
        const d = new Date(cd.deadlineISO);
        const pad = num => String(num).padStart(2, '0');
        admDeadline.value = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
      } catch (e) {}
    } else if (admDeadline) {
      admDeadline.value = '';
    }
    if (admCloseOnExpire) {
      admCloseOnExpire.checked = cd.closeEnrollmentOnExpire === true;
    }

    const wa = currentConfig.whatsapp || {};
    if (admWhatsapp) admWhatsapp.value = wa.number || '';

    const v = currentConfig.sampleVideos || [];
    if (admVideo1) admVideo1.value = v[0]?.url || '';
    if (admVideo2) admVideo2.value = v[1]?.url || '';
    if (admVideo3) admVideo3.value = v[2]?.url || '';
    if (admVideo4) admVideo4.value = v[3]?.url || '';

    if (admDuration) admDuration.value = currentConfig.accessDuration || '';
  }

  // Clean Price input: remove redundant symbols like '₦', 'N', '$', spaces
  function cleanPrice(str) {
    if (!str) return '';
    return str.replace(/^[₦N\$\s]+/, '').trim();
  }

  // 3. Save Configuration - Safe, Non-Destructive Update
  function saveConfiguration() {
    // Start with master base config so no properties are lost
    const base = getBaseConfig();

    // 1. Pricing
    base.pricing = base.pricing || {};
    base.pricing.regularPrice = cleanPrice(admRegularPrice?.value);
    base.pricing.offerPrice = cleanPrice(admOfferPrice?.value);

    // 2. Countdown & Deadline
    base.countdown = base.countdown || {};
    if (admDeadline && admDeadline.value) {
      base.countdown.deadlineISO = new Date(admDeadline.value).toISOString();
    } else {
      base.countdown.deadlineISO = '';
    }
    base.countdown.closeEnrollmentOnExpire = admCloseOnExpire ? admCloseOnExpire.checked : false;

    // 3. WhatsApp Number
    base.whatsapp = base.whatsapp || {};
    base.whatsapp.number = admWhatsapp ? admWhatsapp.value.trim().replace(/[^0-9]/g, '') : '';

    // 4. Sample Demonstration Videos (Carefully preserve all rich artwork, descriptions & scripts)
    const videoInputs = [admVideo1, admVideo2, admVideo3, admVideo4];
    base.sampleVideos = (base.sampleVideos || []).map((video, idx) => {
      const cloned = Object.assign({}, video);
      const input = videoInputs[idx];
      if (input) {
        cloned.url = input.value.trim();
      }
      return cloned;
    });

    // 5. Course Access Duration
    if (admDuration && admDuration.value.trim() !== '') {
      base.accessDuration = admDuration.value.trim();
    }

    // 6. Explicitly preserve official bank transfer details
    base.bankDetails = {
      bankName: 'FirstBank',
      accountName: 'Godsvine Tech Hub',
      accountNumber: '2048352886'
    };

    currentConfig = base;

    // Save to browser localStorage safely
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
      showToast('Settings saved successfully! Landing page is updated.');
    } catch (err) {
      showToast('Error saving to browser storage.');
    }
  }

  function resetToDefaults() {
    if (confirm('Are you sure you want to reset all configurations to default?')) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
      currentConfig = getBaseConfig();
      populateForm();
      showToast('Settings have been reset to factory defaults.');
    }
  }

  // 4. Export Code
  function exportCode() {
    const formatted = `window.COURSE_CONFIG = ${JSON.stringify(currentConfig, null, 2)};`;
    if (exportCodeContent) exportCodeContent.textContent = formatted;
    if (exportModal) exportModal.style.display = 'flex';
  }

  function copyExportSnippet() {
    if (exportCodeContent) {
      navigator.clipboard.writeText(exportCodeContent.textContent)
        .then(() => showToast('Configuration snippet copied to clipboard!'))
        .catch(() => alert('Please select and copy manually.'));
    }
  }

  // Listeners
  if (btnSaveMaster) btnSaveMaster.addEventListener('click', saveConfiguration);
  if (btnResetDefaults) btnResetDefaults.addEventListener('click', resetToDefaults);
  if (btnExportCode) btnExportCode.addEventListener('click', exportCode);
  if (btnCopySnippet) btnCopySnippet.addEventListener('click', copyExportSnippet);
  if (btnCloseExportModal) btnCloseExportModal.addEventListener('click', () => {
    if (exportModal) exportModal.style.display = 'none';
  });

  function showToast(msg) {
    if (!adminToast) return;
    adminToast.textContent = msg;
    adminToast.style.display = 'block';
    setTimeout(() => {
      adminToast.style.display = 'none';
    }, 3500);
  }

  // Initial Check
  checkAuth();
})();
