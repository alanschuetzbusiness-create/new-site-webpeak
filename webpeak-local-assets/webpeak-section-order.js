(function () {
  "use strict";

  function updateHeroCopy() {
    var titleLines = document.querySelectorAll(".hero-header_content .hero-title-line");
    var description = document.querySelector(".hero-header_content .text-size-medium");

    if (titleLines.length >= 2) {
      titleLines[0].textContent = "Wir erstellen Ihre neue Startseite.";
      titleLines[1].textContent = "Kostenlos und unverbindlich.";
    }

    if (description) {
      description.innerHTML = "Für seriöse Unternehmen und Projekte.<br>Persönlich gestaltet in der Schweiz.";
    }
  }

  function updateJourneyCopy() {
    var journey = document.querySelector("#webpeak-journey");
    if (!journey) return;

    var kicker = journey.querySelector(".timeline_content-left .tag");
    var title = journey.querySelector(".timeline_content-left h2");
    var description = journey.querySelector(".timeline_content-left > p");

    if (kicker) kicker.textContent = "Unser Prozess";
    if (title) title.textContent = "Vom kostenlosen Erstdesign zur fertigen Website";
    if (description) {
      description.textContent = "Sie sehen zuerst, wie Ihre neue Startseite aussehen kann. Erst wenn Sie überzeugt sind, entscheiden Sie über die Umsetzung. Anschliessend erstellen wir Ihren professionellen Webauftritt innerhalb weniger Wochen.";
    }
  }

  function updateFitCopy() {
    var fitSection = document.querySelector(".webpeak-fit-section");
    if (!fitSection) return;

    var kicker = fitSection.querySelector(".layout-list_left .tag");
    var title = fitSection.querySelector(".layout-list_left h2");
    var intro = fitSection.querySelector(".webpeak-fit-intro");

    if (kicker) kicker.textContent = "Geeignete Projekte";

    if (title && !intro) {
      intro = document.createElement("p");
      intro.className = "webpeak-fit-intro text-size-medium text-color-black-transaprent";
      title.insertAdjacentElement("afterend", intro);
    }

    if (intro) {
      intro.textContent = "Unsere Offerte richtet sich an Unternehmen und Projekte, die einen professionellen Webauftritt anstreben.";
    }
  }

  function updatePersonDetails() {
    var contact = document.querySelector("#kontakt-direkt .webpeak-person-contact");
    if (!contact || contact.querySelector(".webpeak-person-name")) return;

    var name = document.createElement("div");
    name.className = "webpeak-person-name";
    name.textContent = "Alan Schütz, Gründer";
    contact.insertAdjacentElement("afterbegin", name);
  }

  function updateFunnelUrls() {
    var sourceUrl = document.querySelector('.webpeak-lead-form input[name="_url"]');
    var thankYouUrl = document.querySelector('.webpeak-lead-form input[name="_next"]');

    if (sourceUrl) sourceUrl.value = "https://webpeak.ch/design";
    if (thankYouUrl) thankYouUrl.value = "https://webpeak.ch/design/danke";
  }

  function moveSections() {
    var journeySection = document.querySelector("#webpeak-journey");
    var fitComponent = document.querySelector(".webpeak-fit-section");
    var fitSection = fitComponent && fitComponent.closest("section.section");
    var stackComponent = document.querySelector(".webpeak-lead-stack-component");
    var stackSection = stackComponent && stackComponent.closest("section.section");
    var contactSection = document.querySelector("#kontakt-direkt");

    if (journeySection && fitSection) {
      journeySection.insertAdjacentElement("afterend", fitSection);
    }

    if (stackSection && contactSection) {
      stackSection.insertAdjacentElement("afterend", contactSection);
    }
  }

  function preparePage() {
    updateHeroCopy();
    updateJourneyCopy();
    updateFitCopy();
    updatePersonDetails();
    updateFunnelUrls();
    moveSections();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", preparePage);
  } else {
    preparePage();
  }
})();
