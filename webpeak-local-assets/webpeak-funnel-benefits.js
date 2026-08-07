document.addEventListener("DOMContentLoaded", function () {
  if (!document.querySelector('link[data-webpeak-legal-modal]')) {
    var legalStyles = document.createElement("link");
    legalStyles.rel = "stylesheet";
    legalStyles.href = "./webpeak-local-assets/webpeak-legal-modal.css?v=1";
    legalStyles.setAttribute("data-webpeak-legal-modal", "");
    document.head.appendChild(legalStyles);
  }

  if (!document.querySelector('script[data-webpeak-legal-modal]')) {
    var legalScript = document.createElement("script");
    legalScript.src = "./webpeak-local-assets/webpeak-legal-modal.js?v=2";
    legalScript.setAttribute("data-webpeak-legal-modal", "");
    document.body.appendChild(legalScript);
  }

  var benefitItems = document.querySelectorAll(".layout-stats_item");

  benefitItems.forEach(function (item) {
    var title = item.querySelector(".webpeak-stat-title");
    var description = item.querySelector("p");

    if (!title || !description) return;

    if (title.textContent.trim() === "Kostenlos") {
      title.textContent = "Neukundenoptimiert";
      description.textContent =
        "Ihre Website wird für Suchmaschinen (SEO) optimiert und führt Besucher gezielt zur Anfrage.";
    }

    if (title.textContent.trim() === "Unverbindlich") {
      description.textContent =
        "Keine Verpflichtung. Sie entscheiden erst, wenn Sie Ihre neue Startseite gesehen haben.";
    }
  });

  document.querySelectorAll(".webpeak-lead-form label > span").forEach(function (label) {
    if (label.textContent.trim() === "Für welches Unternehmen oder Projekt brauchen Sie Ihre Website?") {
      label.textContent = "Für welches Unternehmen oder Projekt brauchen Sie eine Website?";
    }
  });

  document.querySelectorAll("a, button, h2, p").forEach(function (element) {
    var text = element.textContent.trim();

    if (text === "Kostenloses Design anfragen" || text === "Kostenlosen Website-Entwurf anfragen") {
      element.textContent = "Unverbindliches Design anfragen";
    }

    if (text === "Füllen Sie kurz die Angaben aus. Wir prüfen Ihr Projekt und melden uns persönlich bei Ihnen, damit der Entwurf zu Ihrem Unternehmen passt.") {
      element.textContent = "Füllen Sie kurz die Angaben aus. Wir prüfen Ihr Projekt und melden uns kurz persönlich bei Ihnen, damit der Entwurf perfekt zu Ihrem Unternehmen passt.";
    }
  });

  var resultHeader = document.querySelector(".webpeak-stack-section-header");

  if (resultHeader) {
    var resultTag = resultHeader.querySelector(".tag");
    var resultTitle = resultHeader.querySelector("h2");

    if (resultTag) resultTag.textContent = "Das Ergebnis";
    if (resultTitle) resultTitle.textContent = "Wie Ihre neue Website Ihr Unternehmen unterstützt";
  }

  document.querySelectorAll(".stack_card h3").forEach(function (title) {
    if (title.textContent.trim() === "Ihre digitale Präsenz unterstützt Ihre Ziele") {
      title.textContent = "Ihre digitale Präsenz unterstützt Ihre strategischen Ziele";
    }
  });
});
