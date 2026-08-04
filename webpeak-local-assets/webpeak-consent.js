(function () {
  "use strict";

  var storageKey = "webpeak_consent_v1";
  var banner;
  var settingsButton;

  function updateConsent(choice) {
    var granted = choice === "accepted" ? "granted" : "denied";
    window.gtag("consent", "update", {
      analytics_storage: granted,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied"
    });
    window.dataLayer.push({ event: "webpeak_consent_update", consent_choice: choice });
  }

  function saveChoice(choice) {
    try { window.localStorage.setItem(storageKey, choice); } catch (error) {}
    updateConsent(choice);
    banner.classList.remove("is-visible");
    banner.setAttribute("aria-hidden", "true");
  }

  function openBanner() {
    banner.classList.add("is-visible");
    banner.setAttribute("aria-hidden", "false");
    banner.querySelector("button").focus();
  }

  function init() {
    banner = document.createElement("section");
    banner.className = "webpeak-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-modal", "true");
    banner.setAttribute("aria-labelledby", "webpeak-consent-title");
    banner.setAttribute("aria-hidden", "true");
    banner.innerHTML =
      '<h2 id="webpeak-consent-title">Ein kleiner Hinweis zum Datenschutz</h2>' +
      '<p>Wir verwenden Cookies, damit unsere Webseite zuverlässig funktioniert und um zu verstehen, wie sie genutzt wird. Persönliche Angaben wie Ihr Name, Ihre Telefonnummer oder Ihre Angaben im Kontaktformular werden dabei nicht erfasst. <a href="datenschutz.html">Mehr zum Datenschutz</a>.</p>' +
      '<div class="webpeak-consent__actions">' +
        '<button class="webpeak-consent__button webpeak-consent__button--accept" type="button" data-consent="accepted">Optionale Cookies erlauben</button>' +
        '<button class="webpeak-consent__button webpeak-consent__button--reject" type="button" data-consent="rejected">Ohne optionale Cookies fortfahren</button>' +
      '</div>';

    settingsButton = document.createElement("button");
    settingsButton.className = "footer_link webpeak-consent-footer-link";
    settingsButton.type = "button";
    settingsButton.textContent = "Datenschutzeinstellungen";

    banner.addEventListener("click", function (event) {
      var button = event.target.closest("[data-consent]");
      if (button) saveChoice(button.getAttribute("data-consent"));
    });
    settingsButton.addEventListener("click", openBanner);
    document.body.appendChild(banner);
    var footerLinks = document.querySelector(".footer_legal-list.is-links");
    if (footerLinks) {
      var divider = document.createElement("div");
      divider.className = "divider";
      divider.textContent = "|";
      footerLinks.appendChild(divider);
      footerLinks.appendChild(settingsButton);
    }

    var storedChoice = null;
    try { storedChoice = window.localStorage.getItem(storageKey); } catch (error) {}
    if (storedChoice === "accepted" || storedChoice === "rejected") {
    } else {
      openBanner();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
