(function () {
  var initializedForms = new WeakSet();
  var modal = null;
  var modalForm = null;
  var lastActiveElement = null;
  var attributionKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "gbraid",
    "wbraid"
  ];

  function getAttribution() {
    var params = new URLSearchParams(window.location.search);
    var attribution = {};

    attributionKeys.forEach(function (key) {
      var value = params.get(key);
      if (value) attribution[key] = value;
    });

    return attribution;
  }

  function applyAttribution(form) {
    var attribution = getAttribution();

    Object.keys(attribution).forEach(function (key) {
      var field = form.querySelector('input[name="' + key + '"]');
      if (field) field.value = attribution[key];
    });
  }

  function markPendingLead(form) {
    var leadId = "lead-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
    var payload = {
      id: leadId,
      source: "google_ads_lead_funnel",
      submittedAt: new Date().toISOString()
    };

    try {
      window.sessionStorage.setItem("webpeak_lead_submission_pending", JSON.stringify(payload));
    } catch (error) {}

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "webpeak_lead_form_submit",
      lead_id: leadId,
      form_name: form.getAttribute("aria-label") || "Kostenlosen Website-Entwurf anfragen",
      form_location: form.classList.contains("is-modal-form") ? "modal" : "page"
    });
  }

  function initLeadForm(form) {
    if (!form || initializedForms.has(form)) return;

    var submit = form.querySelector(".webpeak-lead-submit");
    if (!submit) return;

    var requiredFields = Array.prototype.slice.call(
      form.querySelectorAll("input[required], textarea[required], select[required]")
    );
    var hasTriedSubmit = false;

    initializedForms.add(form);
    form.setAttribute("novalidate", "novalidate");
    applyAttribution(form);

    function fieldIsValid(field) {
      if (field.type === "checkbox" || field.type === "radio") {
        return field.checked;
      }

      return field.value.trim() !== "" && field.checkValidity();
    }

    function setFieldError(field, showError) {
      var label = field.closest("label");
      field.classList.toggle("is-error", showError);
      if (label) {
        label.classList.toggle("is-error", showError);
      }
      field.setAttribute("aria-invalid", String(showError));
    }

    function updateFieldState(field) {
      if (!hasTriedSubmit) return;
      setFieldError(field, !fieldIsValid(field));
    }

    function validateForm() {
      var firstInvalidField = null;

      requiredFields.forEach(function (field) {
        var isValid = fieldIsValid(field);
        setFieldError(field, !isValid);
        if (!isValid && !firstInvalidField) {
          firstInvalidField = field;
        }
      });

      if (firstInvalidField) {
        firstInvalidField.focus({ preventScroll: true });
        firstInvalidField.scrollIntoView({ behavior: "smooth", block: "center" });
        return false;
      }

      return true;
    }

    requiredFields.forEach(function (field) {
      field.addEventListener("input", function () {
        updateFieldState(field);
      });
      field.addEventListener("change", function () {
        updateFieldState(field);
      });
      field.addEventListener("blur", function () {
        updateFieldState(field);
      });
    });

    form.addEventListener("submit", function (event) {
      hasTriedSubmit = true;

      if (!validateForm()) {
        event.preventDefault();
        return;
      }

      markPendingLead(form);
    });
  }

  function closeModal() {
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    document.documentElement.classList.remove("webpeak-modal-open");

    if (lastActiveElement && typeof lastActiveElement.focus === "function") {
      lastActiveElement.focus({ preventScroll: true });
    }
  }

  function buildModal(sourceForm) {
    modal = document.createElement("div");
    modal.className = "webpeak-lead-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "webpeak-lead-modal-title");

    modal.innerHTML =
      '<div class="webpeak-lead-modal_backdrop" data-close-lead-modal></div>' +
      '<div class="webpeak-lead-modal_panel">' +
        '<button class="webpeak-lead-modal_close" type="button" aria-label="Popup schliessen" data-close-lead-modal>×</button>' +
        '<div class="webpeak-lead-modal_header">' +
          '<div class="tag">Kostenlos anfragen</div>' +
          '<h2 id="webpeak-lead-modal-title">Kostenlosen Website-Entwurf anfragen</h2>' +
          '<p>Füllen Sie kurz die Angaben aus. Wir melden uns persönlich bei Ihnen.</p>' +
        '</div>' +
        '<div class="webpeak-lead-modal_form"></div>' +
      '</div>';

    modalForm = sourceForm.cloneNode(true);
    modalForm.classList.add("is-modal-form");
    modalForm.querySelectorAll("input, textarea, select").forEach(function (field) {
      if (field.type !== "hidden" && !field.classList.contains("webpeak-lead-honey")) {
        field.value = "";
        field.classList.remove("is-error");
        field.setAttribute("aria-invalid", "false");
      }
      var label = field.closest("label");
      if (label) {
        label.classList.remove("is-error");
      }
    });

    modal.querySelector(".webpeak-lead-modal_form").appendChild(modalForm);
    document.body.appendChild(modal);
    initLeadForm(modalForm);

    modal.addEventListener("click", function (event) {
      if (event.target.closest("[data-close-lead-modal]")) {
        closeModal();
      }
    });
  }

  function openModal(sourceForm, trigger) {
    lastActiveElement = trigger || document.activeElement;

    if (!modal) {
      buildModal(sourceForm);
    }

    modal.hidden = false;
    document.documentElement.classList.add("webpeak-modal-open");

    var firstField = modal.querySelector("input:not([type='hidden']):not(.webpeak-lead-honey)");
    if (firstField) {
      setTimeout(function () {
        firstField.focus({ preventScroll: true });
      }, 50);
    }
  }

  function handleModalTrigger(event, sourceForm, trigger) {
    event.preventDefault();
    event.stopPropagation();
    openModal(sourceForm, trigger);
  }

  function initLeadModal() {
    var sourceForm = document.querySelector(".webpeak-lead-form");
    if (!sourceForm) return;

    window.WebpeakLeadModalOpen = function (event, trigger) {
      handleModalTrigger(event, sourceForm, trigger);
    };

    document.querySelectorAll("[data-open-lead-modal], .webpeak-footer-cta-button").forEach(function (trigger) {
      trigger.addEventListener("click", function (event) {
        handleModalTrigger(event, sourceForm, trigger);
      });
    });

    document.addEventListener("click", function (event) {
      var trigger = event.target && event.target.closest
        ? event.target.closest("[data-open-lead-modal], .webpeak-footer-cta-button")
        : null;
      if (trigger) {
        handleModalTrigger(event, sourceForm, trigger);
      }
    }, true);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeModal();
      }
    });
  }

  function init() {
    document.querySelectorAll(".webpeak-lead-form").forEach(initLeadForm);
    initLeadModal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
