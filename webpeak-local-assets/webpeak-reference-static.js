document.querySelectorAll(".reference-scroll_section").forEach(function (section) {
  section.querySelectorAll("a").forEach(function (link) {
    link.removeAttribute("href");
    link.removeAttribute("target");
    link.removeAttribute("rel");
  });

  section.querySelectorAll(".reference-scroll_link").forEach(function (url) {
    url.remove();
  });

  var liquidTitle = Array.prototype.find.call(
    section.querySelectorAll(".reference-scroll_title"),
    function (title) {
      return title.textContent.trim() === "SG Liquid Metal Collection";
    }
  );

  if (liquidTitle && liquidTitle.parentElement) {
    liquidTitle.parentElement.classList.add("reference-scroll_copy");
  }

  section.addEventListener(
    "click",
    function (event) {
      var activeCard = event.target.closest(".reference-scroll_card.is-active");
      if (!activeCard) return;
      event.preventDefault();
      event.stopPropagation();
    },
    true
  );
});
