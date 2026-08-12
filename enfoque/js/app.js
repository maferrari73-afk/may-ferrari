(function () {
  "use strict";

  var STORAGE_SESSIONS = "enfoque_sessions_v1";
  var STORAGE_ACTIVE = "enfoque_active_v1";

  var CATS = {
    estudiar: { label: "Estudiar", icon: "📚", color: "#6c8cff" },
    leer: { label: "Leer", icon: "📖", color: "#4cc9a0" },
    aprender: { label: "Aprender", icon: "🧠", color: "#b389f9" },
    proyecto: { label: "Proyecto", icon: "🚀", color: "#ffb454" },
    scroll: { label: "Scroll", icon: "📱", color: "#ff6b6b" }
  };
  var FOCUS_CATS = ["estudiar", "leer", "aprender", "proyecto"];
  var DAY_LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  // ---------- storage ----------
  function loadSessions() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_SESSIONS)) || [];
    } catch (e) {
      return [];
    }
  }
  function saveSessions(sessions) {
    localStorage.setItem(STORAGE_SESSIONS, JSON.stringify(sessions));
  }
  function loadActive() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_ACTIVE));
    } catch (e) {
      return null;
    }
  }
  function saveActive(active) {
    if (active) localStorage.setItem(STORAGE_ACTIVE, JSON.stringify(active));
    else localStorage.removeItem(STORAGE_ACTIVE);
  }

  var sessions = loadSessions();
  var active = loadActive(); // { cat, start } | null
  var tickHandle = null;

  // ---------- time helpers ----------
  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  function formatHMS(totalSeconds) {
    var s = Math.max(0, Math.floor(totalSeconds));
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    return pad(h) + ":" + pad(m) + ":" + pad(sec);
  }

  function formatDuration(totalSeconds) {
    var mins = Math.round(totalSeconds / 60);
    if (mins < 1) return "<1m";
    var h = Math.floor(mins / 60);
    var m = mins % 60;
    if (h === 0) return m + "m";
    if (m === 0) return h + "h";
    return h + "h " + m + "m";
  }

  function formatClock(ts) {
    var d = new Date(ts);
    return pad(d.getHours()) + ":" + pad(d.getMinutes());
  }

  function startOfDay(ts) {
    var d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function startOfWeek(ts) {
    var d = new Date(ts);
    var day = (d.getDay() + 6) % 7; // 0 = Monday
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - day);
    return d.getTime();
  }

  // ---------- session lifecycle ----------
  function startSession(cat) {
    var now = Date.now();
    if (active) {
      if (active.cat === cat) {
        finishActive();
        return;
      }
      finishActive();
    }
    active = { cat: cat, start: now };
    saveActive(active);
    render();
    startTick();
  }

  function finishActive() {
    if (!active) return;
    var now = Date.now();
    var duration = Math.round((now - active.start) / 1000);
    if (duration >= 1) {
      sessions.push({
        id: active.start + "_" + active.cat,
        cat: active.cat,
        start: active.start,
        end: now,
        duration: duration
      });
      saveSessions(sessions);
    }
    active = null;
    saveActive(null);
    stopTick();
    render();
  }

  function deleteSession(id) {
    sessions = sessions.filter(function (s) { return s.id !== id; });
    saveSessions(sessions);
    render();
  }

  function startTick() {
    stopTick();
    tickHandle = setInterval(updateActiveTimer, 1000);
    updateActiveTimer();
  }
  function stopTick() {
    if (tickHandle) { clearInterval(tickHandle); tickHandle = null; }
  }
  function updateActiveTimer() {
    if (!active) return;
    var elapsed = (Date.now() - active.start) / 1000;
    document.getElementById("activeTimer").textContent = formatHMS(elapsed);
  }

  // ---------- aggregation ----------
  function weeklyTotals() {
    var weekStart = startOfWeek(Date.now());
    var totals = {};
    Object.keys(CATS).forEach(function (c) { totals[c] = [0, 0, 0, 0, 0, 0, 0]; });
    sessions.forEach(function (s) {
      if (s.start < weekStart) return;
      var dayIdx = Math.floor((startOfDay(s.start) - weekStart) / 86400000);
      if (dayIdx < 0 || dayIdx > 6) return;
      totals[s.cat][dayIdx] += s.duration;
    });
    return totals;
  }

  function weekScrollTotal() {
    var weekStart = startOfWeek(Date.now());
    var total = 0;
    sessions.forEach(function (s) {
      if (s.cat === "scroll" && s.start >= weekStart) total += s.duration;
    });
    if (active && active.cat === "scroll") {
      total += (Date.now() - active.start) / 1000;
    }
    return total;
  }

  function todaySessions() {
    var dayStart = startOfDay(Date.now());
    var dayEnd = dayStart + 86400000;
    var list = sessions.filter(function (s) { return s.start >= dayStart && s.start < dayEnd; });
    if (active) {
      list = list.concat([{
        id: "active",
        cat: active.cat,
        start: active.start,
        end: null,
        duration: (Date.now() - active.start) / 1000,
        live: true
      }]);
    }
    return list.sort(function (a, b) { return b.start - a.start; });
  }

  // ---------- rendering ----------
  function renderPhrase() {
    var scrollSecs = weekScrollTotal();
    var el = document.getElementById("phrase");
    if (scrollSecs < 60) {
      el.textContent = "¿Qué vas a ganar scrolleando esta semana?";
    } else {
      el.textContent = "¿Qué ganaste scrolleando " + formatDuration(scrollSecs) + " esta semana?";
    }
  }

  function renderActiveBanner() {
    var banner = document.getElementById("activeBanner");
    if (!active) {
      banner.classList.add("hidden");
      return;
    }
    banner.classList.remove("hidden");
    var meta = CATS[active.cat];
    document.getElementById("activeLabel").textContent = meta.icon + " " + meta.label;
    updateActiveTimer();
  }

  function renderButtons() {
    var scrollBtn = document.getElementById("scrollBtn");
    var scrollRunning = active && active.cat === "scroll";
    scrollBtn.classList.toggle("running", !!scrollRunning);
    scrollBtn.textContent = scrollRunning ? "Dejar de scrollear" : "Empecé a scrollear";

    document.querySelectorAll(".btn-cat").forEach(function (btn) {
      var cat = btn.getAttribute("data-cat");
      var running = active && active.cat === cat;
      btn.classList.toggle("running", !!running);
    });

    document.getElementById("scrollWeekTotal").textContent =
      formatDuration(weekScrollTotal()) + " esta semana";
  }

  function renderChart() {
    var totals = weeklyTotals();
    var weekStart = startOfWeek(Date.now());
    var chart = document.getElementById("chart");
    chart.innerHTML = "";

    var dayTotals = [0, 0, 0, 0, 0, 0, 0];
    FOCUS_CATS.forEach(function (c) {
      totals[c].forEach(function (v, i) { dayTotals[i] += v; });
    });
    var maxTotal = Math.max.apply(null, dayTotals.concat([1800])); // floor of 30min scale

    for (var i = 0; i < 7; i++) {
      var col = document.createElement("div");
      col.className = "chart-col";

      var bar = document.createElement("div");
      bar.className = "chart-bar";
      bar.style.height = "100%";

      FOCUS_CATS.forEach(function (c) {
        var v = totals[c][i];
        if (v <= 0) return;
        var seg = document.createElement("div");
        seg.className = "chart-seg";
        seg.style.height = (v / maxTotal * 100) + "%";
        seg.style.background = CATS[c].color;
        bar.appendChild(seg);
      });

      var dayLabel = document.createElement("div");
      dayLabel.className = "chart-day";
      dayLabel.textContent = DAY_LABELS[i];

      col.appendChild(bar);
      col.appendChild(dayLabel);
      chart.appendChild(col);
    }

    var legend = document.getElementById("legend");
    legend.innerHTML = "";
    FOCUS_CATS.forEach(function (c) {
      var total = totals[c].reduce(function (a, b) { return a + b; }, 0);
      var item = document.createElement("div");
      item.className = "legend-item";
      var dot = document.createElement("span");
      dot.className = "legend-dot";
      dot.style.background = CATS[c].color;
      item.appendChild(dot);
      item.appendChild(document.createTextNode(
        CATS[c].label + " · " + formatDuration(total)
      ));
      legend.appendChild(item);
    });

    var weekEnd = weekStart + 6 * 86400000;
    var fmt = { day: "numeric", month: "short" };
    var rangeText = new Date(weekStart).toLocaleDateString("es-AR", fmt) +
      " – " + new Date(weekEnd).toLocaleDateString("es-AR", fmt);
    document.getElementById("weekRange").textContent = rangeText;
  }

  function renderHistory() {
    var list = todaySessions();
    var ul = document.getElementById("history");
    var empty = document.getElementById("historyEmpty");
    ul.innerHTML = "";

    if (list.length === 0) {
      empty.classList.remove("hidden");
      return;
    }
    empty.classList.add("hidden");

    list.forEach(function (s) {
      var meta = CATS[s.cat];
      var li = document.createElement("li");
      li.className = "history-item";

      var left = document.createElement("div");
      left.className = "h-left";
      var dot = document.createElement("span");
      dot.className = "h-dot";
      dot.style.background = meta.color;
      var name = document.createElement("span");
      name.className = "h-name";
      name.textContent = meta.icon + " " + meta.label;
      var time = document.createElement("span");
      time.className = "h-time";
      time.textContent = formatClock(s.start) + (s.live ? " · en curso" : " – " + formatClock(s.end));
      left.appendChild(dot);
      left.appendChild(name);
      left.appendChild(time);

      var dur = document.createElement("span");
      dur.className = "h-dur";
      dur.textContent = formatDuration(s.duration);

      li.appendChild(left);
      li.appendChild(dur);

      if (!s.live) {
        var del = document.createElement("button");
        del.className = "h-del";
        del.setAttribute("aria-label", "Eliminar");
        del.textContent = "✕";
        del.addEventListener("click", function () { deleteSession(s.id); });
        li.appendChild(del);
      }

      ul.appendChild(li);
    });
  }

  function render() {
    renderPhrase();
    renderActiveBanner();
    renderButtons();
    renderChart();
    renderHistory();
  }

  // ---------- events ----------
  document.getElementById("scrollBtn").addEventListener("click", function () {
    startSession("scroll");
  });
  document.querySelectorAll(".btn-cat").forEach(function (btn) {
    btn.addEventListener("click", function () {
      startSession(btn.getAttribute("data-cat"));
    });
  });
  document.getElementById("finishBtn").addEventListener("click", finishActive);

  // periodic re-render for phrase/chart/history in case app stays open across day/week boundaries
  setInterval(render, 60000);

  render();
  if (active) startTick();

  // ---------- PWA service worker ----------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }
})();
