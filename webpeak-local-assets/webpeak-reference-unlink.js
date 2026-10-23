(function () {
  var section = document.querySelector("#referenzen-scroll");
  if (!section) return;

  section.querySelectorAll("a.reference-scroll_link").forEach(function (link) {
    var label = document.createElement("span");
    label.className = link.className;
    label.textContent = link.textContent;
    link.replaceWith(label);
  });

  section.querySelectorAll(".reference-scroll_card").forEach(function (card) {
    card.removeAttribute("data-reference-url");
  });
})();
