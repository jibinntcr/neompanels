/**
 * NEOM Panels — Accessible Progressive Enhancement Script
 * All core content and form submission remain usable without JavaScript.
 * Follows Sections 14, 16.3, 17.4 & 17.6 of the NEOM Panels Brief.
 */
(function () {
  'use strict';

  /**
   * Privacy-preserving, non-personal event hook (Section 17.6).
   * Never attaches personal data, free-text requirements or file names.
   */
  function trackEvent(eventName, safeMeta) {
    if (typeof window.neomAnalyticsHook === 'function') {
      try {
        window.neomAnalyticsHook({
          event: eventName,
          meta: safeMeta || {},
          timestamp: new Date().toISOString(),
        });
      } catch (_) {
        // Ignore analytics hook errors
      }
    }
  }

  /* 1. Mobile Navigation Drawer & Accessible Dropdowns */
  function initNavigation() {
    var mobileBtn = document.querySelector('[data-mobile-menu-toggle]');
    var mobileDrawer = document.getElementById('mobile-nav-drawer');

    if (mobileBtn && mobileDrawer) {
      mobileBtn.addEventListener('click', function () {
        var expanded = mobileBtn.getAttribute('aria-expanded') === 'true';
        var nextState = !expanded;
        mobileBtn.setAttribute('aria-expanded', String(nextState));
        mobileDrawer.classList.toggle('is-open', nextState);
        var labelSpan = mobileBtn.querySelector('[data-menu-label]');
        if (labelSpan) {
          labelSpan.textContent = nextState ? 'Close' : 'Menu';
        }
      });
    }

    var dropdownItems = document.querySelectorAll('.nav-item--has-dropdown');
    dropdownItems.forEach(function (item) {
      var trigger = item.querySelector('.nav-dropdown-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = item.classList.contains('is-open');
        dropdownItems.forEach(function (other) {
          other.classList.remove('is-open');
          var t = other.querySelector('.nav-dropdown-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          item.classList.add('is-open');
          trigger.setAttribute('aria-expanded', 'true');
        }
      });
    });

    document.addEventListener('click', function (e) {
      dropdownItems.forEach(function (item) {
        if (!item.contains(e.target)) {
          item.classList.remove('is-open');
          var t = item.querySelector('.nav-dropdown-trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        dropdownItems.forEach(function (item) {
          if (item.classList.contains('is-open')) {
            item.classList.remove('is-open');
            var t = item.querySelector('.nav-dropdown-trigger');
            if (t) {
              t.setAttribute('aria-expanded', 'false');
              t.focus();
            }
          }
        });
        if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
          mobileDrawer.classList.remove('is-open');
          if (mobileBtn) {
            mobileBtn.setAttribute('aria-expanded', 'false');
            var labelSpan = mobileBtn.querySelector('[data-menu-label]');
            if (labelSpan) labelSpan.textContent = 'Menu';
            mobileBtn.focus();
          }
        }
      }
    });
  }

  /* 2. Restrained Desktop Hero Pointer Response (Section 16.1) */
  function initHeroStage() {
    var stage = document.querySelector('[data-hero-stage]');
    if (!stage) return;

    var reducedMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var coarsePointer =
      window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

    if (reducedMotion || coarsePointer) return;

    stage.addEventListener('mousemove', function (e) {
      var rect = stage.getBoundingClientRect();
      var xRatio = (e.clientX - rect.left) / rect.width - 0.5;
      var yRatio = (e.clientY - rect.top) / rect.height - 0.5;
      var tiltX = (xRatio * 2.2).toFixed(2) + 'deg';
      var tiltY = (-yRatio * 1.8).toFixed(2) + 'deg';
      stage.style.setProperty('--tilt-x', tiltX);
      stage.style.setProperty('--tilt-y', tiltY);
    });

    stage.addEventListener('mouseleave', function () {
      stage.style.setProperty('--tilt-x', '0deg');
      stage.style.setProperty('--tilt-y', '0deg');
    });
  }

  /* 3. Accessible Gallery Lightbox (Section 12.3 & 17.4) */
  function initGalleryLightbox() {
    var dialog = document.getElementById('gallery-lightbox');
    if (!dialog) return;

    var triggers = Array.prototype.slice.call(
      document.querySelectorAll('[data-gallery-trigger]')
    );
    var imgEl = dialog.querySelector('[data-lightbox-img]');
    var titleEl = dialog.querySelector('[data-lightbox-title]');
    var captionEl = dialog.querySelector('[data-lightbox-caption]');
    var roleEl = dialog.querySelector('[data-lightbox-role]');
    var closeBtn = dialog.querySelector('[data-lightbox-close]');
    var prevBtn = dialog.querySelector('[data-lightbox-prev]');
    var nextBtn = dialog.querySelector('[data-lightbox-next]');
    var currentIndex = 0;
    var lastActiveTrigger = null;

    function showSlide(index) {
      if (!triggers.length) return;
      currentIndex = (index + triggers.length) % triggers.length;
      var btn = triggers[currentIndex];
      if (imgEl) {
        imgEl.src = btn.getAttribute('data-src') || '';
        imgEl.alt = btn.getAttribute('data-alt') || '';
      }
      if (titleEl) titleEl.textContent = btn.getAttribute('data-title') || '';
      if (captionEl)
        captionEl.textContent = btn.getAttribute('data-caption') || '';
      if (roleEl) roleEl.textContent = btn.getAttribute('data-role') || '';
    }

    triggers.forEach(function (btn, idx) {
      btn.addEventListener('click', function () {
        lastActiveTrigger = btn;
        showSlide(idx);
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
          if (closeBtn) closeBtn.focus();
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        dialog.close();
        if (lastActiveTrigger) lastActiveTrigger.focus();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        showSlide(currentIndex - 1);
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        showSlide(currentIndex + 1);
      });
    }

    dialog.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') showSlide(currentIndex - 1);
      if (e.key === 'ArrowRight') showSlide(currentIndex + 1);
    });
  }

  /* 4. Downloads Filter on /resources/downloads */
  function initDocumentFilter() {
    var filterButtons = document.querySelectorAll('[data-doc-filter]');
    var docItems = document.querySelectorAll('[data-doc-category]');
    if (!filterButtons.length || !docItems.length) return;

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var cat = btn.getAttribute('data-doc-filter');
        filterButtons.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('btn--primary', active);
          b.classList.toggle('btn--quiet', !active);
          b.setAttribute('aria-pressed', String(active));
        });
        docItems.forEach(function (item) {
          var itemCat = item.getAttribute('data-doc-category');
          item.style.display = cat === 'All' || itemCat === cat ? '' : 'none';
        });
      });
    });
  }

  /* 5. Two-Step Business Enquiry Form (Section 14) */
  function initEnquiryForm() {
    var form = document.getElementById('neom-enquiry-form');
    if (!form) return;

    var startedTracked = false;
    form.addEventListener(
      'focusin',
      function () {
        if (!startedTracked) {
          startedTracked = true;
          trackEvent('enquiry_started', { page: window.location.pathname });
        }
      },
      { once: true }
    );

    var typeRadios = form.querySelectorAll('input[name="enquiry_type"]');
    var radioCards = form.querySelectorAll('.radio-card');
    var conditionalBlocks = form.querySelectorAll('[data-conditional-scope]');
    var step1Pill = document.querySelector('[data-step-pill="1"]');
    var step2Pill = document.querySelector('[data-step-pill="2"]');

    function updateEnquiryTypeUI() {
      var selectedValue = '';
      typeRadios.forEach(function (r) {
        var card = r.closest('.radio-card');
        if (card) card.classList.toggle('is-selected', r.checked);
        if (r.checked) selectedValue = r.value;
      });

      conditionalBlocks.forEach(function (block) {
        var scopes = (block.getAttribute('data-conditional-scope') || '').split(
          '|'
        );
        var shouldShow =
          scopes.indexOf('all') !== -1 || scopes.indexOf(selectedValue) !== -1;
        block.hidden = !shouldShow;
      });
    }

    typeRadios.forEach(function (r) {
      r.addEventListener('change', updateEnquiryTypeUI);
    });
    updateEnquiryTypeUI();

    /* Preferred contact method toggle */
    var contactMethodRadios = form.querySelectorAll(
      'input[name="preferred_contact_method"]'
    );
    var emailReqBadge = document.getElementById('email-required-badge');
    var phoneReqBadge = document.getElementById('phone-required-badge');
    var emailInput = document.getElementById('field-email');
    var phoneInput = document.getElementById('field-phone');

    function updateContactMethodUI() {
      var method = 'Email';
      contactMethodRadios.forEach(function (r) {
        if (r.checked) method = r.value;
      });
      if (emailReqBadge && phoneReqBadge && emailInput && phoneInput) {
        if (method === 'Email') {
          emailReqBadge.textContent = '*';
          emailReqBadge.className = 'form-required';
          phoneReqBadge.textContent = '(Optional)';
          phoneReqBadge.className = 'form-optional';
          emailInput.required = true;
          phoneInput.required = false;
        } else {
          phoneReqBadge.textContent = '*';
          phoneReqBadge.className = 'form-required';
          emailReqBadge.textContent = '(Optional)';
          emailReqBadge.className = 'form-optional';
          phoneInput.required = true;
          emailInput.required = false;
        }
      }
    }

    contactMethodRadios.forEach(function (r) {
      r.addEventListener('change', updateContactMethodUI);
    });
    updateContactMethodUI();

    /* Quick helper chips for Organisation field */
    var orgQuickBtns = form.querySelectorAll('[data-org-preset]');
    var orgInput = document.getElementById('field-organisation');
    orgQuickBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (orgInput) {
          orgInput.value = btn.getAttribute('data-org-preset') || '';
          orgInput.focus();
        }
      });
    });

    /* Step pill highlight based on focus */
    var step2Fieldset = document.getElementById('fieldset-step-2');
    if (step2Fieldset && step1Pill && step2Pill) {
      form.addEventListener('focusin', function (e) {
        var inStep2 = step2Fieldset.contains(e.target);
        step1Pill.classList.toggle('is-active', !inStep2);
        step2Pill.classList.toggle('is-active', inStep2);
      });
    }

    /* Form Submission with Durable Server Persistence */
    var submitBtn = document.getElementById('enquiry-submit-btn');
    var statusRegion = document.getElementById('enquiry-status-region');
    var successPanel = document.getElementById('enquiry-success-panel');
    var referenceSpan = document.getElementById('enquiry-reference-code');

    function clearErrors() {
      if (statusRegion) {
        statusRegion.innerHTML = '';
        statusRegion.hidden = true;
      }
      var invalidControls = form.querySelectorAll('[aria-invalid="true"]');
      invalidControls.forEach(function (el) {
        el.removeAttribute('aria-invalid');
      });
      var fieldErrors = form.querySelectorAll('.field-error');
      fieldErrors.forEach(function (err) {
        err.remove();
      });
    }

    function showFieldError(fieldName, message) {
      var input =
        form.querySelector('[name="' + fieldName + '"]') ||
        document.getElementById('field-' + fieldName);
      if (!input) return;
      input.setAttribute('aria-invalid', 'true');
      var container = input.closest('.form-group') || input.parentElement;
      if (container) {
        var span = document.createElement('span');
        span.className = 'field-error';
        span.textContent = message;
        container.appendChild(span);
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();

      var originalBtnText = submitBtn
        ? submitBtn.textContent
        : 'Submit Business Enquiry';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending your enquiry…';
      }

      var formData = new FormData(form);

      fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      })
        .then(function (res) {
          return res.json().then(function (data) {
            return { status: res.status, ok: res.ok, data: data };
          });
        })
        .then(function (result) {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }

          if (result.ok && result.data && result.data.public_reference) {
            trackEvent('enquiry_saved', {
              enquiry_type: result.data.enquiry_type || 'general',
            });
            form.hidden = true;
            if (referenceSpan) {
              referenceSpan.textContent = result.data.public_reference;
            }
            if (successPanel) {
              successPanel.hidden = false;
              successPanel.focus();
            }
            return;
          }

          trackEvent('enquiry_failed', { reason: 'validation_or_server' });

          var errSummary =
            (result.data && result.data.message) ||
            'Please check the highlighted fields.';
          if (statusRegion) {
            statusRegion.hidden = false;
            statusRegion.innerHTML =
              '<div class="alert-box alert-box--error" role="alert"><strong>' +
              errSummary +
              '</strong></div>';
          }

          if (result.data && result.data.errors) {
            Object.keys(result.data.errors).forEach(function (fieldKey) {
              showFieldError(fieldKey, result.data.errors[fieldKey]);
            });
          }
          if (statusRegion) {
            statusRegion.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        })
        .catch(function () {
          trackEvent('enquiry_failed', { reason: 'network' });
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
          if (statusRegion) {
            statusRegion.hidden = false;
            statusRegion.innerHTML =
              '<div class="alert-box alert-box--error" role="alert"><strong>Your enquiry could not be submitted. Your entries are still available here. Please try again or use the contact details below.</strong></div>';
            statusRegion.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        });
    });
  }

  /* 6. Non-Personal Event Hooks for Outbound Brand & Document Links */
  function initSafeTelemetry() {
    document.querySelectorAll('[data-track-brand]').forEach(function (el) {
      el.addEventListener('click', function () {
        trackEvent('brand_visit', {
          brand: el.getAttribute('data-track-brand'),
        });
      });
    });
    document.querySelectorAll('[data-track-doc]').forEach(function (el) {
      el.addEventListener('click', function () {
        trackEvent('document_opened', {
          doc: el.getAttribute('data-track-doc'),
        });
      });
    });
    document.querySelectorAll('[data-track-contact]').forEach(function (el) {
      el.addEventListener('click', function () {
        trackEvent('contact_clicked', {
          route: el.getAttribute('data-track-contact'),
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initHeroStage();
    initGalleryLightbox();
    initDocumentFilter();
    initEnquiryForm();
    initSafeTelemetry();
  });
})();
