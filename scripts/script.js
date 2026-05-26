(function () {
  var validHashes = [
    "#servicos",
    "#sobre",
    "#avaliacoes",
    "#localizacao",
    "#agendar",
    "#galeria",
    "#diferenciais",
    "#horarios",
    "#inicio",
  ];

  if (window.location.hash && validHashes.indexOf(window.location.hash) === -1) {
    history.replaceState(null, "", " ");
  }

  var yearEl = document.getElementById("footer-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  var map = [6, 0, 1, 2, 3, 4, 5];
  var todayIdx = map[new Date().getDay()];
  var rows = document.querySelectorAll("#hours-list .row");

  rows.forEach(function (row) {
    var idx = parseInt(row.getAttribute("data-idx"), 10);

    if (idx === todayIdx) {
      row.classList.add("today");

      var dayEl = row.querySelector(".day");
      if (dayEl) {
        dayEl.textContent = dayEl.textContent + " · hoje";
      }
    }
  });

  var navToggle = document.querySelector("[data-nav-toggle]");
  var navList = document.getElementById("nav-list");

  if (navToggle && navList) {
    function setNav(open) {
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      navList.classList.toggle("is-open", open);
    }

    navToggle.addEventListener("click", function () {
      setNav(navToggle.getAttribute("aria-expanded") !== "true");
    });

    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        setNav(false);
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setNav(false);
      }
    });
  }

  var teamTrack = document.querySelector("[data-team-track]");

  if (teamTrack) {
    var prevTeamBtn = document.querySelector("[data-team-prev]");
    var nextTeamBtn = document.querySelector("[data-team-next]");

    function getTeamStep() {
      var card = teamTrack.querySelector(".team-card");
      if (!card) {
        return teamTrack.clientWidth;
      }

      var styles = getComputedStyle(teamTrack);
      var gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;

      return card.getBoundingClientRect().width + gap;
    }

    function updateTeamButtons() {
      var maxScroll = teamTrack.scrollWidth - teamTrack.clientWidth - 2;

      if (prevTeamBtn) {
        prevTeamBtn.disabled = teamTrack.scrollLeft <= 2;
      }

      if (nextTeamBtn) {
        nextTeamBtn.disabled = teamTrack.scrollLeft >= maxScroll;
      }
    }

    if (prevTeamBtn) {
      prevTeamBtn.addEventListener("click", function () {
        teamTrack.scrollBy({ left: -getTeamStep(), behavior: "smooth" });
      });
    }

    if (nextTeamBtn) {
      nextTeamBtn.addEventListener("click", function () {
        teamTrack.scrollBy({ left: getTeamStep(), behavior: "smooth" });
      });
    }

    teamTrack.addEventListener("scroll", function () {
      window.requestAnimationFrame(updateTeamButtons);
    });

    window.addEventListener("resize", updateTeamButtons);
    updateTeamButtons();
  }

  var revealElements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    revealElements.forEach(function (element) {
      element.classList.add("is-in");
    });

    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealElements.forEach(function (element) {
    observer.observe(element);
  });
})();
