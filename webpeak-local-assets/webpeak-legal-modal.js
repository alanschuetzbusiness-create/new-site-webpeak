(function () {
  "use strict";

  var modal;
  var modalTitle;
  var modalBody;
  var lastActiveElement;
  var contentCache = {};
  var embeddedContent = {
    "datenschutz.html": {
      title: "Datenschutz",
      html: `
        <section class="legal-section">
          <h2>Verantwortliche Stelle</h2>
          <address class="legal-address"><strong>Webpeak</strong><br>Alan Schütz<br>Im Pramalinis 1a<br>7307 Jenins<br>Schweiz<br><a href="mailto:alan.schuetz@webpeak.ch">alan.schuetz@webpeak.ch</a><br><a href="tel:+41815602154">081 560 21 54</a></address>
        </section>
        <section class="legal-section">
          <h2>Bearbeitung von Personendaten</h2>
          <h3>Bereitstellung der Website</h3>
          <p>Beim Aufruf dieser Website können technisch erforderliche Daten bearbeitet werden, insbesondere IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite, übertragene Datenmenge, Browsertyp, Betriebssystem und verweisende Website. Diese Daten dienen der sicheren und zuverlässigen Bereitstellung der Website sowie der Fehleranalyse.</p>
          <h3>Kontaktaufnahme</h3>
          <p>Wenn Sie Webpeak per E-Mail, Telefon oder über ein Formular kontaktieren, werden die von Ihnen übermittelten Angaben bearbeitet, um Ihre Anfrage zu beantworten und eine mögliche Geschäftsbeziehung anzubahnen oder abzuwickeln. Dazu können Name, Kontaktdaten, Nachrichteninhalt und weitere freiwillig mitgeteilte Angaben gehören.</p>
          <h3>Aufbewahrung und Sicherheit</h3>
          <p>Personendaten werden nur so lange aufbewahrt, wie dies für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Webpeak trifft angemessene technische und organisatorische Massnahmen, um Personendaten vor unbefugtem Zugriff, Verlust und Missbrauch zu schützen.</p>
        </section>
        <section class="legal-section">
          <h2>Dienste von Dritten</h2>
          <h3>Hosting über GitHub Pages</h3>
          <p>Diese Website wird über GitHub Pages bereitgestellt, einen Dienst von GitHub, Inc. Beim Abruf der Website können Verbindungs- und Protokolldaten durch GitHub bearbeitet werden. Dabei können Daten auch ausserhalb der Schweiz bearbeitet werden. Weitere Informationen finden Sie in der <a href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener noreferrer" target="_blank">Datenschutzerklärung von GitHub</a>.</p>
          <h3>Terminbuchung mit Calendly</h3>
          <p>Auf einzelnen Seiten ist Calendly eingebunden, ein Dienst von Calendly, LLC. Wenn Sie das Buchungsmodul laden oder einen Termin vereinbaren, kann Calendly Personendaten und technische Nutzungsdaten bearbeiten. Die Bearbeitung erfolgt in eigener Verantwortung von Calendly und kann ausserhalb der Schweiz stattfinden. Weitere Informationen finden Sie in der <a href="https://calendly.com/privacy" rel="noopener noreferrer" target="_blank">Datenschutzerklärung von Calendly</a>.</p>
          <h3>Webflow-Komponenten und Formulare</h3>
          <p>Die Website verwendet lokal eingebundene Webflow-Komponenten. Wenn ein Formular über die Webflow-Infrastruktur verarbeitet wird, können die eingegebenen Angaben sowie technische Verbindungsdaten an Webflow, Inc. übermittelt werden. Weitere Informationen finden Sie in der <a href="https://webflow.com/legal/privacy" rel="noopener noreferrer" target="_blank">Datenschutzerklärung von Webflow</a>.</p>
          <h3>Google Analytics</h3>
          <p>Mit Ihrer Zustimmung verwendet diese Website Google Analytics 4, einen Analysedienst von Google. Dabei können insbesondere Angaben zu aufgerufenen Seiten, Interaktionen, Gerät, Browser, ungefährer Region und Herkunft des Besuchs bearbeitet werden. Google Analytics wird über Google Tag Manager eingebunden. Die Analyse-Speicherung ist standardmässig deaktiviert und wird erst nach Ihrer Zustimmung aktiviert. Sie können Ihre Auswahl jederzeit über die Cookie-Einstellungen ändern. Daten können durch Google auch ausserhalb der Schweiz bearbeitet werden. Weitere Informationen finden Sie in der <a href="https://policies.google.com/privacy" rel="noopener noreferrer" target="_blank">Datenschutzerklärung von Google</a>.</p>
          <h3>Externe Links</h3>
          <p>Beim Öffnen eines externen Links gelten die Datenschutzbestimmungen des jeweiligen Drittanbieters. Webpeak hat keinen Einfluss auf dessen Datenbearbeitung.</p>
        </section>
        <section class="legal-section">
          <h2>Ihre Rechte</h2>
          <p>Im Rahmen des anwendbaren Datenschutzrechts können Sie insbesondere:</p>
          <ul><li>Auskunft über die Bearbeitung Ihrer Personendaten verlangen,</li><li>unrichtige Personendaten berichtigen lassen,</li><li>die Löschung oder Einschränkung einer Bearbeitung verlangen, soweit keine gesetzlichen Pflichten entgegenstehen,</li><li>eine erteilte Einwilligung mit Wirkung für die Zukunft widerrufen und</li><li>unter den gesetzlichen Voraussetzungen die Herausgabe oder Übertragung Ihrer Daten verlangen.</li></ul>
          <p>Zur Ausübung Ihrer Rechte wenden Sie sich an <a href="mailto:alan.schuetz@webpeak.ch">alan.schuetz@webpeak.ch</a>. Sie haben zudem das Recht, sich an den Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) zu wenden.</p>
        </section>
        <section class="legal-section">
          <h2>Änderungen dieser Datenschutzerklärung</h2>
          <p>Webpeak kann diese Datenschutzerklärung anpassen, wenn sich die Website, die eingesetzten Dienste oder die rechtlichen Anforderungen ändern. Es gilt die jeweils auf dieser Website veröffentlichte Fassung.</p>
          <p>Stand: August 2026</p>
        </section>`
    },
    "impressum.html": {
      title: "Impressum",
      html: `
        <section class="legal-section">
          <h2>Anbieter dieser Website</h2>
          <address class="legal-address"><strong>Webpeak</strong><br>Alan Schütz<br>Im Pramalinis 1a<br>7307 Jenins<br>Schweiz</address>
        </section>
        <section class="legal-section">
          <h2>Kontakt</h2>
          <p>E-Mail: <a href="mailto:alan.schuetz@webpeak.ch">alan.schuetz@webpeak.ch</a><br>Telefon: <a href="tel:+41815602154">081 560 21 54</a></p>
        </section>
        <section class="legal-section">
          <h2>Haftungsausschluss</h2>
          <h3>Inhalte</h3>
          <p>Die Inhalte dieser Website werden mit grösstmöglicher Sorgfalt erstellt. Webpeak übernimmt jedoch keine Gewähr für die Richtigkeit, Vollständigkeit oder Aktualität der bereitgestellten Informationen. Die Nutzung der Inhalte erfolgt auf eigene Verantwortung.</p>
          <h3>Externe Links</h3>
          <p>Diese Website enthält Links zu Websites Dritter. Für deren Inhalte und Datenschutzpraktiken sind ausschliesslich die jeweiligen Betreiber verantwortlich. Webpeak hat keinen Einfluss auf die aktuelle und zukünftige Gestaltung dieser externen Angebote.</p>
        </section>
        <section class="legal-section">
          <h2>Urheberrecht</h2>
          <p>Die Inhalte, Bilder und sonstigen Werke auf dieser Website unterliegen dem schweizerischen Urheberrecht, soweit nicht anders gekennzeichnet. Jede Verwertung ausserhalb der gesetzlichen Schranken bedarf der vorherigen schriftlichen Zustimmung der jeweiligen Rechteinhaber.</p>
          <p>Stand: Juli 2026</p>
        </section>`
    }
  };

  function closeModal() {
    if (!modal || modal.hidden) return;

    modal.hidden = true;
    document.documentElement.classList.remove("webpeak-legal-modal-open");

    if (lastActiveElement && typeof lastActiveElement.focus === "function") {
      lastActiveElement.focus({ preventScroll: true });
    }
  }

  function buildModal() {
    modal = document.createElement("div");
    modal.className = "webpeak-legal-modal";
    modal.hidden = true;
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "webpeak-legal-modal-title");
    modal.innerHTML =
      '<div class="webpeak-legal-modal_backdrop" data-close-legal-modal></div>' +
      '<div class="webpeak-legal-modal_panel">' +
        '<button class="webpeak-legal-modal_close" type="button" aria-label="Popup schliessen" data-close-legal-modal>×</button>' +
        '<header class="webpeak-legal-modal_header">' +
          '<div class="tag">Rechtliches</div>' +
          '<h2 id="webpeak-legal-modal-title"></h2>' +
        '</header>' +
        '<div class="webpeak-legal-modal_body" tabindex="0"></div>' +
      '</div>';

    modalTitle = modal.querySelector("#webpeak-legal-modal-title");
    modalBody = modal.querySelector(".webpeak-legal-modal_body");
    document.body.appendChild(modal);

    modal.addEventListener("click", function (event) {
      if (event.target.closest("[data-close-legal-modal]")) closeModal();
    });
  }

  function extractLegalContent(html) {
    var page = new DOMParser().parseFromString(html, "text/html");
    var title = page.querySelector(".legal-hero h1");
    var content = page.querySelector(".legal-content");

    if (!title || !content) throw new Error("Rechtlicher Inhalt nicht gefunden");

    return {
      title: title.textContent.trim(),
      html: content.innerHTML
    };
  }

  function renderContent(content) {
    modalTitle.textContent = content.title;
    modalBody.innerHTML = content.html;
    modalBody.scrollTop = 0;
  }

  function openModal(url, trigger) {
    if (!modal) buildModal();

    lastActiveElement = trigger || document.activeElement;
    modal.hidden = false;
    document.documentElement.classList.add("webpeak-legal-modal-open");
    modalTitle.textContent = trigger.textContent.trim();
    modalBody.innerHTML = '<p class="webpeak-legal-modal_loading">Inhalt wird geladen …</p>';

    setTimeout(function () {
      modal.querySelector(".webpeak-legal-modal_close").focus({ preventScroll: true });
    }, 30);

    var contentKey = url.split("/").pop().split("?")[0].split("#")[0];
    var localContent = contentCache[url] || embeddedContent[contentKey];

    if (localContent) {
      contentCache[url] = localContent;
      renderContent(localContent);
      return;
    }

    fetch(url, { credentials: "same-origin" })
      .then(function (response) {
        if (!response.ok) throw new Error("Seite konnte nicht geladen werden");
        return response.text();
      })
      .then(extractLegalContent)
      .then(function (content) {
        contentCache[url] = content;
        renderContent(content);
      })
      .catch(function () {
        modalBody.innerHTML = '<p class="webpeak-legal-modal_error">Der Inhalt konnte gerade nicht geladen werden. Bitte versuchen Sie es erneut.</p>';
      });
  }

  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href$="datenschutz.html"], a[href$="impressum.html"]');
    if (!link) return;

    event.preventDefault();
    openModal(link.getAttribute("href"), link);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeModal();
  });
})();
