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
    var prevBtn = document.querySelector("[data-team-prev]");
    var nextBtn = document.querySelector("[data-team-next]");
    var dotsWrap = document.querySelector("[data-team-dots]");
    var cards = teamTrack.querySelectorAll(".team-card");

    function pageSize() {
      var first = cards[0];

      if (!first) {
        return teamTrack.clientWidth;
      }

      var styles = getComputedStyle(teamTrack);
      var gap = parseFloat(styles.columnGap || styles.gap || "0") || 0;

      return first.getBoundingClientRect().width + gap;
    }

    function pagesCount() {
      var step = pageSize();

      if (!step) {
        return 1;
      }

      return Math.max(
        1,
        Math.ceil((teamTrack.scrollWidth - 1) / step) - Math.floor(teamTrack.clientWidth / step) + 1
      );
    }

    function currentPage() {
      var step = pageSize();

      if (!step) {
        return 0;
      }

      return Math.round(teamTrack.scrollLeft / step);
    }

    function updateUI() {
      var max = teamTrack.scrollWidth - teamTrack.clientWidth - 2;

      if (prevBtn) {
        prevBtn.disabled = teamTrack.scrollLeft <= 2;
      }

      if (nextBtn) {
        nextBtn.disabled = teamTrack.scrollLeft >= max;
      }

      if (dotsWrap) {
        var cur = currentPage();

        Array.prototype.forEach.call(dotsWrap.children, function (dot, index) {
          dot.setAttribute("aria-current", index === cur ? "true" : "false");
        });
      }
    }

    function buildDots() {
      if (!dotsWrap) {
        return;
      }

      dotsWrap.innerHTML = "";

      var totalPages = pagesCount();

      if (totalPages <= 1) {
        dotsWrap.style.display = "none";
        return;
      }

      dotsWrap.style.display = "";

      for (var i = 0; i < totalPages; i++) {
        var button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", "Ir para profissional " + (i + 1));

        (function (index) {
          button.addEventListener("click", function () {
            teamTrack.scrollTo({ left: index * pageSize(), behavior: "smooth" });
          });
        })(i);

        dotsWrap.appendChild(button);
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        teamTrack.scrollBy({ left: -pageSize(), behavior: "smooth" });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        teamTrack.scrollBy({ left: pageSize(), behavior: "smooth" });
      });
    }

    teamTrack.addEventListener("scroll", function () {
      window.requestAnimationFrame(updateUI);
    });

    window.addEventListener("resize", function () {
      buildDots();
      updateUI();
    });

    buildDots();
    updateUI();
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
