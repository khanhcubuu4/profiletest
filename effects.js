/**
 * ============================================================================
 * HIỆU ỨNG VÀ ĐỒNG BỘ LỜI BÀI HÁT (EFFECTS.JS)
 * ============================================================================
 * - Đồng bộ lời bài hát (Lyrics Sync) từ LYRICS_DB theo thời gian nhạc chạy.
 * - Hiệu ứng viền sáng quét xung quanh Card (Border Shimmer Animation).
 * - Hiệu ứng rê chuột trên Card Discord Guild (Mouse Glow).
 * - Hiệu ứng nghiêng 3D (VanillaTilt) & Hiệu ứng con trỏ chuột (Cursor Trail).
 */

// 1. Đồng bộ Lời Bài Hát (Lyrics Manager)
// 1. Đồng bộ & Hiệu ứng Trượt Lời Bài Hát Dọc (Smooth Vertical Sliding Lyrics Engine)
(function () {
  var audio = document.getElementById("audio");
  var lyricsContainer = document.getElementById("lyricsContainer");
  var lyricsTrack = document.getElementById("lyricsTrack");

  if (!audio || !lyricsContainer) {
    return;
  }

  // Tự động tạo lyricsTrack nếu chưa có trong HTML
  if (!lyricsTrack) {
    lyricsTrack = document.createElement("div");
    lyricsTrack.className = "lyrics_track";
    lyricsTrack.id = "lyricsTrack";
    lyricsContainer.innerHTML = "";
    lyricsContainer.appendChild(lyricsTrack);
  }

  var lyricLines = [];
  var currentIndex = -2;
  var currentTrackKey = null;
  var animFrameId = null;
  var PRE_OFFSET = 0.55; // Offset giúp lyric cuộn sẵn sàng ngay trước tiếng hát

  function getFilenameFromSrc(src) {
    if (!src) return null;
    try {
      var url = new URL(src, window.location.href);
      var pathname = url.pathname;
      var filename = pathname.substring(pathname.lastIndexOf("/") + 1);
      return decodeURIComponent(filename);
    } catch (e) {
      var clean = src.split("?")[0].split("#")[0];
      var filename = clean.substring(clean.lastIndexOf("/") + 1);
      return decodeURIComponent(filename);
    }
  }

  function renderTrackDOM() {
    lyricsTrack.innerHTML = "";
    if (!lyricLines.length) return;

    // Item khởi đầu trước câu hát đầu tiên (icon nốt nhạc)
    var introItem = document.createElement("div");
    introItem.className = "lyric_item lyric_intro";
    introItem.dataset.index = "-1";
    introItem.innerHTML = '<i class="fa-solid fa-music lyric-note-icon" aria-hidden="true"></i>';
    lyricsTrack.appendChild(introItem);

    // Mỗi câu lyric là 1 item riêng biệt trong track
    lyricLines.forEach(function (line, idx) {
      var item = document.createElement("div");
      item.className = "lyric_item";
      item.dataset.index = idx;
      item.textContent = line.text;
      lyricsTrack.appendChild(item);
    });
  }

  function updateLyricsUI(index) {
    var items = lyricsTrack.querySelectorAll(".lyric_item");
    if (!items.length) return;

    items.forEach(function (el) {
      var idx = parseInt(el.dataset.index, 10);
      el.classList.remove("active", "prev", "next", "far");
      if (idx === index) {
        el.classList.add("active");
      } else if (idx === index - 1) {
        el.classList.add("prev");
      } else if (idx === index + 1) {
        el.classList.add("next");
      } else {
        el.classList.add("far");
      }
    });

    // Xác định item active để tính toán pixel offset trượt cuộn
    var activeItem = lyricsTrack.querySelector('.lyric_item[data-index="' + index + '"]') || items[0];
    if (activeItem) {
      var containerHeight = lyricsContainer.clientHeight || 125;
      var itemTop = activeItem.offsetTop;
      var itemHeight = activeItem.offsetHeight;

      // Tính vị trí Y để căn giữa dòng active vào trung tâm container
      var targetY = -(itemTop - (containerHeight / 2) + (itemHeight / 2));
      lyricsTrack.style.transform = "translate3d(0, " + targetY + "px, 0)";
    }
  }

  function syncLyrics() {
    if (!lyricLines.length) return;

    var currentTime = audio.currentTime + PRE_OFFSET;
    var foundIndex = -1;

    for (var i = 0; i < lyricLines.length; i++) {
      if (lyricLines[i].time <= currentTime) {
        foundIndex = i;
      } else {
        break;
      }
    }

    if (foundIndex !== currentIndex) {
      currentIndex = foundIndex;
      updateLyricsUI(foundIndex);
    }
  }

  function startSyncLoop() {
    syncLyrics();
    if (!audio.paused && !audio.ended) {
      animFrameId = requestAnimationFrame(startSyncLoop);
    }
  }

  function stopSyncLoop() {
    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
  }

  function parseLRC(lrcText) {
    if (!lrcText) return [];
    var lines = lrcText.split("\n");
    var result = [];
    var timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
    lines.forEach(function (line) {
      var match = line.match(timeRegex);
      if (match) {
        var min = parseInt(match[1], 10);
        var sec = parseInt(match[2], 10);
        var cs = parseInt(match[3], 10);
        var frac = match[3].length === 2 ? cs / 100 : cs / 1000;
        var text = line.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, "").trim();
        if (text) {
          result.push({ time: min * 60 + sec + frac, text: text });
        }
      }
    });
    return result.sort(function (a, b) { return a.time - b.time; });
  }

  function findLyricsInDB(filename) {
    var db = window.LYRICS_DB || {};
    if (!filename) return null;
    var candidates = [filename, encodeURIComponent(filename), decodeURIComponent(filename)];
    for (var i = 0; i < candidates.length; i++) {
      var key = candidates[i];
      if (db[key] && Array.isArray(db[key]) && db[key].length > 0) {
        return db[key];
      }
    }
    return null;
  }

  function fetchLyricsFromLRCLIB(filename) {
    if (!filename) return;
    var query = filename.replace(/\.[^/.]+$/, "").replace(/_KLICKAUD/gi, "").replace(/[_-]+/g, " ").trim();
    if (!query) return;

    fetch("https://lrclib.net/api/search?q=" + encodeURIComponent(query))
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (Array.isArray(data) && data.length > 0) {
          var match = data.find(function (item) { return item.syncedLyrics; }) || data[0];
          if (match && match.syncedLyrics) {
            var parsed = parseLRC(match.syncedLyrics);
            if (parsed.length > 0) {
              window.LYRICS_DB = window.LYRICS_DB || {};
              window.LYRICS_DB[filename] = parsed;
              var nowFile = getFilenameFromSrc(audio.currentSrc || audio.src);
              if (nowFile === filename || decodeURIComponent(nowFile) === filename) {
                lyricLines = parsed;
                currentIndex = -2;
                renderTrackDOM();
                lyricsContainer.style.display = "flex";
                requestAnimationFrame(function () {
                  updateLyricsUI(-1);
                });
              }
            }
          }
        }
      })
      .catch(function (err) { console.warn("Auto-fetch lyrics from LRCLIB failed:", err); });
  }

  function loadLyrics() {
    var src = audio.currentSrc || audio.src || "";
    var filename = getFilenameFromSrc(src);

    if (!filename || filename === "" || filename === "undefined") {
      return;
    }

    if (filename === currentTrackKey) {
      return;
    }

    currentTrackKey = filename;
    currentIndex = -2;

    var found = findLyricsInDB(filename);

    if (found) {
      lyricLines = found;
      renderTrackDOM();
      lyricsContainer.style.display = "flex";
      requestAnimationFrame(function () {
        updateLyricsUI(-1);
      });
    } else {
      lyricsContainer.style.display = "none";
      lyricLines = [];
      fetchLyricsFromLRCLIB(filename);
    }
  }

  audio.addEventListener("loadedmetadata", loadLyrics);
  audio.addEventListener("loadeddata", loadLyrics);
  audio.addEventListener("canplay", loadLyrics);
  audio.addEventListener("play", function () {
    loadLyrics();
    startSyncLoop();
  });
  audio.addEventListener("pause", stopSyncLoop);
  audio.addEventListener("timeupdate", syncLyrics);
  audio.addEventListener("seeked", syncLyrics);
  audio.addEventListener("ended", function () {
    stopSyncLoop();
    currentIndex = -2;
    currentTrackKey = null;
    lyricLines = [];
    lyricsContainer.style.display = "none";
  });

  if (audio.currentSrc && audio.currentSrc !== "") {
    loadLyrics();
  }
  if (!audio.paused) {
    startSyncLoop();
  }
})();

// 2. Hiệu Ứng Viền Sáng Quét Quanh Card (Border Shimmer Animation)
(function () {
  function getBorderPos(rect, progress) {
    var width = Math.max(1, rect.width);
    var height = Math.max(1, rect.height);
    var perimeter = (width + height) * 2;
    var distance = ((progress % 1 + 1) % 1) * perimeter;

    if (distance <= width) {
      return { x: distance, y: 0 };
    }
    distance -= width;
    if (distance <= height) {
      return { x: width, y: distance };
    }
    distance -= height;
    if (distance <= width) {
      return { x: width - distance, y: height };
    }
    return { x: 0, y: height - (distance - width) };
  }

  function animateShimmer() {
    var card3d = document.getElementById("card3d");
    var borderShimmer = card3d && card3d.querySelector(".border_shimmer");

    if (card3d && borderShimmer) {
      var rect = card3d.getBoundingClientRect();
      var pos = getBorderPos(rect, performance.now() / 9000);
      borderShimmer.style.setProperty("--shimmer-x", pos.x + "px");
      borderShimmer.style.setProperty("--shimmer-y", pos.y + "px");
    }
    requestAnimationFrame(animateShimmer);
  }

  requestAnimationFrame(animateShimmer);
})();

// 3. Hiệu Ứng Rê Chuột Trên Discord Guild Card (Mouse Position Tracking)
(function () {
  var discordCard = document.getElementById("discordGuildCard");
  if (!discordCard) return;
  discordCard.addEventListener("mousemove", function (event) {
    var rect = discordCard.getBoundingClientRect();
    discordCard.style.setProperty("--mx", event.clientX - rect.left + "px");
    discordCard.style.setProperty("--my", event.clientY - rect.top + "px");
  });
})();

// 4. Hiệu Ứng Nghiêng 3D Card (VanillaTilt) & Con Trỏ Chuột (Cursor Effect)
function initInteractiveEffects() {
  if (typeof VanillaTilt !== "undefined") {
    var cardEl = document.getElementById("card3d");
    if (cardEl && typeof CONFIG !== "undefined" && CONFIG.GENERAL && CONFIG.GENERAL.card3d !== false) {
      try {
        VanillaTilt.init(cardEl, {
          max: 8,
          speed: 600,
          glare: true,
          "max-glare": 0.12,
          gyroscope: true
        });
      } catch (e) {
        console.warn("VanillaTilt init card3d error:", e);
      }
    }

    var extraCards = document.querySelectorAll(".dc-guild-card, .dc-activity-card");
    if (extraCards.length > 0) {
      try {
        VanillaTilt.init(Array.from(extraCards), {
          max: 6,
          speed: 500,
          scale: 1.01
        });
      } catch (e) {
        console.warn("VanillaTilt init extraCards error:", e);
      }
    }
  }

  if (typeof loadCursorEffect === "function") {
    var effectType = (typeof CONFIG !== "undefined" && CONFIG.LAYOUT && CONFIG.LAYOUT.cursorEffect)
      ? CONFIG.LAYOUT.cursorEffect
      : "canvas";
    var effectColor = (typeof CONFIG !== "undefined" && CONFIG.GENERAL && CONFIG.GENERAL.cursorEffectColor)
      ? CONFIG.GENERAL.cursorEffectColor
      : "#ffffff";
    if (effectType && effectType !== "none") {
      try {
        loadCursorEffect(effectType, effectColor);
      } catch (e) {
        console.warn("loadCursorEffect error:", e);
      }
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInteractiveEffects);
} else {
  initInteractiveEffects();
}