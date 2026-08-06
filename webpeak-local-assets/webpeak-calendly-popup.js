(function () {
  var calendlyUrl = "https://calendly.com/alan-schuetz-webpeak/30min";
  var widgetScriptUrl = "https://assets.calendly.com/assets/external/widget.js";
  var scriptPromise;

  function loadCalendly() {
    if (window.Calendly && window.Calendly.initPopupWidget) {
      return Promise.resolve();
    }

    if (scriptPromise) return scriptPromise;

    scriptPromise = new Promise(function (resolve, reject) {
      var existingScript = document.querySelector('script[src="' + widgetScriptUrl + '"]');
      var script = existingScript || document.createElement("script");

      function finish() {
        if (window.Calendly && window.Calendly.initPopupWidget) resolve();
        else reject(new Error("Calendly konnte nicht geladen werden."));
      }

      script.addEventListener("load", finish, { once: true });
      script.addEventListener("error", reject, { once: true });

      if (!existingScript) {
        script.src = widgetScriptUrl;
        script.async = true;
        document.head.appendChild(script);
      }
    });

    return scriptPromise;
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest(
      'a[href="#erstgespraech"], a[href^="https://calendly.com/alan-schuetz-webpeak/30min"]'
    );
    if (!button) return;

    event.preventDefault();

    loadCalendly()
      .then(function () {
        window.Calendly.initPopupWidget({ url: calendlyUrl });
      })
      .catch(function () {
        window.open(calendlyUrl, "_blank", "noopener,noreferrer");
      });
  });
})();
