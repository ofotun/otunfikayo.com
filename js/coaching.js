/**
 * Career Coaching — config and payment CTA behaviour.
 *
 * Edit the constants below when ready:
 *   COACHING_PRICE  — display price (single fee)
 *   PAYMENT_URL     — Stripe Payment Link / Checkout URL (empty = placeholder)
 *   INTEREST_URL    — where "Register interest" goes while payments are closed
 *   SHOW_TESTIMONIALS — toggle visibility of the testimonials section
 *   SHOW_REFUND_FAQ   — set true when refund terms are confirmed for publication
 */
(function () {
  "use strict";

  // TODO(Fikayo): Confirm this price before treating it as final.
  // <!-- Proposed placeholder: £495 — change COACHING_PRICE below to update the page. -->
  var COACHING_PRICE = "£495";

  // TODO(Fikayo): Drop your Stripe Payment Link / Checkout URL here when payments go live.
  // Leave empty to show the "Payments opening soon. Register interest" placeholder.
  var PAYMENT_URL = "";

  var INTEREST_URL = "https://linktr.ee/ofotun";

  // TODO: Client quote approvals confirmed by Fikayo on 2026-10-10. Set false to hide testimonials without removing markup.
  var SHOW_TESTIMONIALS = true;

  // TODO(Fikayo): Replace placeholder refund policy with confirmed terms before setting true.
  var SHOW_REFUND_FAQ = false;

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
  var lastFocus = null;

  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    var focusTarget =
      modal.querySelector("[data-modal-primary]") ||
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
      if (PAYMENT_URL) {
        // Live payment link — open Stripe (or other) checkout.
        window.open(PAYMENT_URL, "_blank", "noopener,noreferrer");
        return;
      }
      event.preventDefault();
      openModal();
    });
  });

  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", closeModal);
  });

  if (modal) {
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
      var focusable = modal.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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
