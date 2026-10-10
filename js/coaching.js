/**
 * Career Coaching — config and payment CTA behaviour.
 *
 * Edit the constants below when ready:
 *   COACHING_PRICE  — display price (single fee)
 *   PAYMENT_URL     — payment provider checkout URL (empty = placeholder)
 *   INTEREST_URL    — where "Register interest" goes while payments are closed
 *   SHOW_TESTIMONIALS — toggle visibility of the testimonials section
 *   SHOW_REFUND_FAQ   — toggle visibility of the refund FAQ
 */
(function () {
  "use strict";

  var COACHING_PRICE = "£495";

  // Leave empty to show the "Payments opening soon. Register interest" placeholder.
  var PAYMENT_URL = "https://monzo.com/pay/r/bisonel-ltd_O6y4Yf0pHAddZX";

  var INTEREST_URL = "https://linktr.ee/ofotun";

  // Client quote approvals confirmed by Fikayo on 2026-10-10. Set false to hide testimonials without removing markup.
  var SHOW_TESTIMONIALS = true;

  var SHOW_REFUND_FAQ = true;

  document.querySelectorAll("[data-coaching-price]").forEach(function (el) {
    el.textContent = COACHING_PRICE;
  });

  var testimonialsSection = document.getElementById("coaching-testimonials");
  if (testimonialsSection && !SHOW_TESTIMONIALS) {
    testimonialsSection.remove();
  }

  var refundFaq = document.getElementById("coaching-refund-faq");
  if (refundFaq && !SHOW_REFUND_FAQ) {
    refundFaq.remove();
  }

  var modal = document.getElementById("payment-modal");
  var bookBtns = document.querySelectorAll("[data-book-pay]");
  var closeBtns = document.querySelectorAll("[data-modal-close]");
  var modalTitle = modal ? modal.querySelector("[data-payment-title]") : null;
  var livePaymentEls = modal ? modal.querySelectorAll("[data-payment-live]") : [];
  var fallbackEls = modal ? modal.querySelectorAll("[data-payment-fallback]") : [];
  var paymentConsent = modal ? modal.querySelector("[data-payment-consent]") : null;
  var paymentContinue = modal ? modal.querySelector("[data-payment-continue]") : null;
  var lastFocus = null;

  function setPaymentMode() {
    if (!modal) return;
    var hasPaymentUrl = Boolean(PAYMENT_URL);
    if (modalTitle) {
      modalTitle.textContent = hasPaymentUrl ? "Before you pay" : "Payments opening soon";
    }
    livePaymentEls.forEach(function (el) {
      el.hidden = !hasPaymentUrl;
    });
    fallbackEls.forEach(function (el) {
      el.hidden = hasPaymentUrl;
    });
    if (paymentConsent) {
      paymentConsent.checked = false;
      paymentConsent.disabled = !hasPaymentUrl;
    }
    if (paymentContinue) {
      paymentContinue.hidden = !hasPaymentUrl;
      paymentContinue.disabled = true;
    }
  }

  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    setPaymentMode();
    modal.hidden = false;
    document.body.classList.add("modal-open");
    var focusTarget =
      (PAYMENT_URL && paymentConsent) ||
      modal.querySelector("[data-modal-primary]:not([hidden])") ||
      modal.querySelector("button, [href]");
    if (focusTarget) focusTarget.focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  bookBtns.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      event.preventDefault();
      openModal();
    });
  });

  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });

  if (modal) {
    setPaymentMode();

    if (paymentConsent && paymentContinue) {
      paymentConsent.addEventListener("change", function () {
        paymentContinue.disabled = !paymentConsent.checked;
      });
    }

    if (paymentContinue) {
      paymentContinue.addEventListener("click", function () {
        if (!PAYMENT_URL || paymentContinue.disabled) return;
        window.open(PAYMENT_URL, "_blank", "noopener,noreferrer");
      });
    }

    modal.addEventListener("click", function (event) {
      if (event.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !modal.hidden) {
        closeModal();
      }
    });

    // Trap focus inside the open modal for keyboard users.
    modal.addEventListener("keydown", function (event) {
      if (event.key !== "Tab" || modal.hidden) return;
      var focusable = Array.prototype.filter.call(
        modal.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ),
        function (el) {
          return !el.hidden && el.offsetParent !== null;
        }
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  // Expose for later tooling / sanity checks in the console.
  window.COACHING_CONFIG = {
    price: COACHING_PRICE,
    paymentUrl: PAYMENT_URL,
    interestUrl: INTEREST_URL,
    showTestimonials: SHOW_TESTIMONIALS,
    showRefundFaq: SHOW_REFUND_FAQ,
  };
})();
