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
(function () {
  var audio = document.getElementById("audio");
  var lyricsContainer = document.getElementById("lyricsContainer");
  var lyricPrev = document.getElementById("lyricPrev");
  var lyricCurrent = document.getElementById("lyricCurrent");
  var lyricNext = document.getElementById("lyricNext");

  if (!audio || !lyricsContainer || !lyricPrev || !lyricCurrent || !lyricNext) {
    return;
  }

  var lyricLines = [];
  var currentIndex = -2;
  var currentTrackKey = null;

  // Trích xuất tên file từ đường dẫn nhạc (hỗ trợ full URL)
  function getFilenameFromSrc(src) {
    if (!src) return null;
    try {
      // Nếu là full URL thì lấy pathname
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

  // Kích hoạt animation chuyển câu hát mượt mà
  function triggerAnimation(element) {
    if (!element) return;
    element.classList.remove("lyric-anim");
    // Force reflow để animation reset lại
    void element.offsetWidth;
    element.classList.add("lyric-anim");
  }

  // Cập nhật giao diện 3 dòng lời hát (trước - hiện tại - tiếp theo)
  function updateLyricsUI(index) {
    if (index === -1) {
      // Trước khi dòng đầu tiên: hiển thị icon nhạc
      lyricPrev.textContent = "";
      lyricCurrent.innerHTML = '<i class="fa-solid fa-music lyric-note-icon" aria-hidden="true"></i>';
      lyricNext.textContent = lyricLines[0] ? lyricLines[0].text : "";
    } else {
      lyricPrev.textContent = index > 0 ? lyricLines[index - 1].text : "";
      lyricCurrent.textContent = lyricLines[index] ? lyricLines[index].text : "";
      lyricNext.textContent = (index + 1 < lyricLines.length) ? lyricLines[index + 1].text : "";
    }

    triggerAnimation(lyricPrev);
    triggerAnimation(lyricCurrent);
    triggerAnimation(lyricNext);
  }

  // Parse chuỗi LRC (ví dụ [00:21.98] Lyric text) thành mảng [{time, text}]
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
        // Nếu centiseconds là 2 chữ số thì *10 để ra milliseconds / 1000
        var frac = match[3].length === 2 ? cs / 100 : cs / 1000;
        var text = line.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/g, "").trim();
        if (text) {
          result.push({ time: min * 60 + sec + frac, text: text });
        }
      }
    });
    return result.sort(function (a, b) { return a.time - b.time; });
  }

  // Tìm lyric trong LYRICS_DB với nhiều kiểu key khác nhau
  function findLyricsInDB(filename) {
    var db = window.LYRICS_DB || {};
    if (!filename) return null;
    
    // Thử các dạng key: tên file gốc, encoded, decoded
    var candidates = [
      filename,
      encodeURIComponent(filename),
      decodeURIComponent(filename)
    ];
    
    for (var i = 0; i < candidates.length; i++) {
      var key = candidates[i];
      if (db[key] && Array.isArray(db[key]) && db[key].length > 0) {
        return db[key];
      }
    }
    return null;
  }

  // Tự động tìm lyric từ LRCLIB API nếu chưa có trong LYRICS_DB
  function fetchLyricsFromLRCLIB(filename) {
    if (!filename) return;
    var query = filename
      .replace(/\.[^/.]+$/, "")
      .replace(/_KLICKAUD/gi, "")
      .replace(/[_-]+/g, " ")
      .trim();
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
              // Nếu bài đang phát vẫn là bài này thì load lyric mới vào
              var nowFile = getFilenameFromSrc(audio.currentSrc || audio.src);
              if (nowFile === filename || decodeURIComponent(nowFile) === filename) {
                lyricLines = parsed;
                currentIndex = -2;
                lyricsContainer.style.display = "flex";
                updateLyricsUI(-1);
              }
            }
          }
        }
      })
      .catch(function (err) { console.warn("Auto-fetch lyrics from LRCLIB failed:", err); });
  }

  // Khởi tạo/tải lời bài hát cho nhạc hiện tại
  function loadLyrics() {
    var src = audio.currentSrc || audio.src || "";
    var filename = getFilenameFromSrc(src);
    
    // Nếu không có src hoặc src rỗng thì bỏ qua
    if (!filename || filename === "" || filename === "undefined") {
      return;
    }

    // Tránh reload lyric cho cùng bài đang phát
    if (filename === currentTrackKey) {
      return;
    }

    currentTrackKey = filename;
    currentIndex = -2;

    var found = findLyricsInDB(filename);

    if (found) {
      lyricLines = found;
      lyricsContainer.style.display = "flex";
      updateLyricsUI(-1);
    } else {
      lyricsContainer.style.display = "none";
      lyricLines = [];
      // Thử fetch từ LRCLIB
      fetchLyricsFromLRCLIB(filename);
    }
  }

  // Gọi loadLyrics khi src thay đổi hoặc metadata load xong
  audio.addEventListener("loadedmetadata", loadLyrics);
  audio.addEventListener("loadeddata", loadLyrics);
  audio.addEventListener("canplay", loadLyrics);  // currentSrc đã sẵn sàng
  audio.addEventListener("play", loadLyrics); // Quan trọng: khi bắt đầu phát lần đầu

  // Nếu audio đã có src sẵn thì load ngay
  if (audio.currentSrc && audio.currentSrc !== "") {
    loadLyrics();
  }

  // Theo dõi tiến trình phát nhạc và chuyển dòng lời tương ứng
  audio.addEventListener("timeupdate", function () {
    if (!lyricLines.length) return;
    
    var currentTime = audio.currentTime;
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
  });

  // Reset khi nhạc kết thúc hoặc pause (reset về icon nhạc)
  audio.addEventListener("ended", function () {
    currentIndex = -2;
    currentTrackKey = null;
    lyricLines = [];
    lyricsContainer.style.display = "none";
  });
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