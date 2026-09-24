const background = document.getElementById("background");

function applyCustomBackground() {
  if (!background) return;
  document.body.style.background = "transparent";
  document.documentElement.style.backgroundColor = "#050505";
  const bgConfig = (window.CONFIG && window.CONFIG.BACKGROUND) || {};
  const type = bgConfig.type || "shader";

  if (type === "image" && bgConfig.imageUrl) {
    background.style.backgroundImage = `url("${bgConfig.imageUrl}")`;
    background.style.backgroundSize = "cover";
    background.style.backgroundPosition = "center";
    background.style.backgroundRepeat = "no-repeat";
    background.style.backgroundAttachment = "fixed";
    if (bgConfig.color) {
      background.style.backgroundColor = bgConfig.color;
    }
    if (bgConfig.overlayOpacity !== undefined) {
      let overlayMask = document.getElementById("bgOverlayMask");
      if (!overlayMask) {
        overlayMask = document.createElement("div");
        overlayMask.id = "bgOverlayMask";
        overlayMask.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:-1;";
        background.appendChild(overlayMask);
      }
      overlayMask.style.backgroundColor = `rgba(0,0,0,${bgConfig.overlayOpacity})`;
    }
  } else if (type === "color") {
    let bgColor = bgConfig.color || "#050505";
    background.innerHTML = "";
    background.style.backgroundImage = "none";
    background.style.background = bgColor;
    background.style.backgroundColor = bgColor;
  } else {
    let shaderColor = bgConfig.color || "#11e7ff";
    if (shaderColor.startsWith("#") && shaderColor.length === 9) {
      shaderColor = shaderColor.substring(0, 7);
    }
    background.style.backgroundImage = "none";
    background.style.backgroundColor = "#050505";
    background.style.background = "#050505";
    background.innerHTML = '\n            <div id="zyoShaderBackgroundEffect" style="position:fixed;inset:0;width:100vw;height:100dvh;overflow:hidden;pointer-events:none;z-index:-1;"></div>\n        ';
    import("https://zyo.lol/template/js/shader-background-effects.js?v=20260703-transparent-mask").then(({
      createShaderBackgroundEffect: _0xf12dd0,
      zyoShaderEffectFromBackgroundValue: _0x233f80
    }) => {
      const _0x428f11 = /Mobi|Android|iPhone|iPod/i.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
      _0xf12dd0("#zyoShaderBackgroundEffect", {
        effect: _0x233f80(13),
        color: shaderColor,
        animate: true,
        width: () => window.innerWidth,
        height: () => window.innerHeight,
        renderScale: _0x428f11 ? 0.45 : 0.65,
        maxDpr: _0x428f11 ? 1 : 1.5,
        maxFPS: _0x428f11 ? 20 : 30,
        powerPreference: "low-power"
      });
    }).catch(_0x27eab3 => console.error("Failed to load background effect", _0x27eab3));
  }
}

applyCustomBackground();

// Tự động đồng bộ Tên hiển thị lên màn hình Chờ (Overlay) & Tiêu đề trang (Document Title)
if (window.CONFIG && window.CONFIG.NAME_OVERRIDE) {
  const name = window.CONFIG.NAME_OVERRIDE;
  const ovNameEl = document.getElementById("ov-name");
  if (ovNameEl) ovNameEl.textContent = "@ " + name;
  document.title = "@ " + name;
}

const overlay = document.getElementById("overlay");
window._overlayDismissed = false;
window._pendingCardReveals = [];
function revealCard(_0x4c1014) {
  if (!_0x4c1014 || _0x4c1014.dataset.revealed) {
    return;
  }
  if (window._overlayDismissed) {
    _0x4c1014.classList.add("card-pop-in");
    _0x4c1014.dataset.revealed = "1";
  } else if (window._pendingCardReveals.indexOf(_0x4c1014) === -1) {
    window._pendingCardReveals.push(_0x4c1014);
  }
}
window.dismissOverlay = function dismissOverlay() {
  const overlay = document.getElementById("overlay");
  const hintEl = document.getElementById("ov-hint");
  if (hintEl) {
    hintEl.textContent = "entering...";
    hintEl.style.animation = "none";
    hintEl.style.opacity = ".4";
  }
  if (overlay) {
    overlay.style.transition = "opacity 0.5s ease";
    overlay.style.opacity = "0";
    setTimeout(() => {
      overlay.style.display = "none";
    }, 500);
  }
  const revealEl = document.querySelector(".reveal");
  if (revealEl) {
    revealEl.classList.add("active");
  }
  const musicWidget = document.getElementById("musicWidget");
  if (musicWidget) {
    musicWidget.style.display = "flex";
  }
  window._overlayDismissed = true;
  if (window._pendingCardReveals) {
    window._pendingCardReveals.forEach(el => {
      if (!el.dataset.revealed) {
        el.classList.add("card-pop-in");
        el.dataset.revealed = "1";
      }
    });
    window._pendingCardReveals = [];
  }
  if (window._musicEnable !== false) {
    if ((!window.pl || window.pl.length === 0) && typeof CONFIG !== "undefined" && CONFIG.CUSTOM_MUSIC) {
      window.pl = CONFIG.CUSTOM_MUSIC;
      if (typeof pickInitialTrackIndex === "function") {
        window.ci = pickInitialTrackIndex(window.pl, CONFIG.MUSIC_DEFAULT_SRC);
      }
    }
    if (window.pl && window.pl.length > 0 && typeof window.loadTrack === "function") {
      const audio = document.getElementById("audio");
      if (!audio || !audio.src || audio.src === "" || audio.src === window.location.href || audio.src.endsWith("/") || audio.src.endsWith(".html")) {
        window.loadTrack(window.ci || 0, false);
      }
    }
    if (typeof tryPlay === "function") {
      tryPlay();
    }
  }
};
let accHourDeg = null;
let accMinDeg = null;
let accSecDeg = null;
function updateClock() {
  const _0x343352 = window._currentConfig || {};
  const _0x4256ae = _0x343352.WIDGET_CLOCK || {};
  let _0x1a3fa6 = new Date();
  if (_0x4256ae.timezone) {
    try {
      const _0x360d2b = new Date().toLocaleString("en-US", {
        timeZone: _0x4256ae.timezone
      });
      _0x1a3fa6 = new Date(_0x360d2b);
    } catch (_0x412f15) {}
  }
  const _0x589798 = document.getElementById("currentTime");
  const _0x439665 = document.getElementById("currentDate");
  const _0x2cbff9 = _0x1a3fa6.getHours();
  const _0x570bc4 = _0x1a3fa6.getMinutes();
  const _0x4a87f9 = _0x1a3fa6.getSeconds();
  if (_0x589798) {
    _0x589798.textContent = _0x2cbff9.toString().padStart(2, "0") + ":" + _0x570bc4.toString().padStart(2, "0") + ":" + _0x4a87f9.toString().padStart(2, "0");
  }
  if (_0x439665) {
    const _0x49f76e = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const _0x313f06 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let _0x38c6af = "";
    if (!_0x4256ae.timezone) {
      const _0x994353 = -new Date().getTimezoneOffset() / 60;
      _0x38c6af = " • GMT" + (_0x994353 >= 0 ? "+" : "") + _0x994353;
    }
    _0x439665.textContent = _0x49f76e[_0x1a3fa6.getDay()] + ", " + _0x313f06[_0x1a3fa6.getMonth()] + " " + _0x1a3fa6.getDate() + _0x38c6af;
  }
  const _0x362738 = document.getElementById("analogHour");
  const _0x1eb973 = document.getElementById("analogMinute");
  const _0x2455b4 = document.getElementById("analogSecond");
  if (_0x362738 && _0x1eb973 && _0x2455b4) {
    const _0x40d1a3 = _0x2cbff9 % 12 * 30 + _0x570bc4 * 0.5;
    const _0x155851 = _0x570bc4 * 6 + _0x4a87f9 * 0.1;
    const _0x11bba3 = _0x4a87f9 * 6;
    if (accSecDeg === null) {
      accSecDeg = _0x11bba3;
      accMinDeg = _0x155851;
      accHourDeg = _0x40d1a3;
    } else {
      const _0x595e7a = _0x11bba3 - (accSecDeg % 360 >= 0 ? accSecDeg % 360 : accSecDeg % 360 + 360);
      if (_0x595e7a < -180) {
        accSecDeg += 360 + _0x595e7a;
      } else {
        accSecDeg += _0x595e7a;
      }
      const _0x3aa5c2 = _0x155851 - (accMinDeg % 360 >= 0 ? accMinDeg % 360 : accMinDeg % 360 + 360);
      if (_0x3aa5c2 < -180) {
        accMinDeg += 360 + _0x3aa5c2;
      } else {
        accMinDeg += _0x3aa5c2;
      }
      const _0x1b0061 = _0x40d1a3 - (accHourDeg % 360 >= 0 ? accHourDeg % 360 : accHourDeg % 360 + 360);
      if (_0x1b0061 < -180) {
        accHourDeg += 360 + _0x1b0061;
      } else {
        accHourDeg += _0x1b0061;
      }
    }
    _0x362738.style.transform = "translateX(-50%) rotate(" + accHourDeg + "deg)";
    _0x1eb973.style.transform = "translateX(-50%) rotate(" + accMinDeg + "deg)";
    _0x2455b4.style.transform = "translateX(-50%) rotate(" + accSecDeg + "deg)";
  }
}
setInterval(updateClock, 1000);
updateClock();
function startWeatherAutoRefresh(_0x5d4926) {
  if (window._weatherInterval) {
    clearInterval(window._weatherInterval);
    window._weatherInterval = null;
  }
  fetchWeather(_0x5d4926);
  if (_0x5d4926.autoRefresh === false) {
    return;
  }
  const _0x5ae2d8 = Number(_0x5d4926.refreshMinutes) > 0 ? Number(_0x5d4926.refreshMinutes) : 30;
  window._weatherInterval = setInterval(function () {
    fetchWeather(_0x5d4926);
  }, _0x5ae2d8 * 60 * 1000);
}
function weatherApiIconClass(_0x47cd5e, _0x3d2438) {
  if (_0x47cd5e === 1000) {
    if (_0x3d2438) {
      return "fa-sun";
    } else {
      return "fa-moon";
    }
  }
  if (_0x47cd5e === 1003) {
    return "fa-cloud-sun";
  }
  if ([1006, 1009].includes(_0x47cd5e)) {
    return "fa-cloud";
  }
  if ([1030, 1135, 1147].includes(_0x47cd5e)) {
    return "fa-smog";
  }
  if ([1063, 1150, 1153, 1168, 1171, 1180, 1183, 1186, 1189, 1192, 1195, 1198, 1201, 1240, 1243, 1246].includes(_0x47cd5e)) {
    return "fa-cloud-rain";
  }
  if ([1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1255, 1258, 1261, 1264].includes(_0x47cd5e)) {
    return "fa-snowflake";
  }
  if ([1087, 1273, 1276, 1279, 1282].includes(_0x47cd5e)) {
    return "fa-cloud-bolt";
  }
  return "fa-cloud-sun";
}
async function fetchWeather(_0x16dcc0) {
  const _0xff0b34 = document.getElementById("weather-widget");
  if (!_0x16dcc0.location) {
    _0xff0b34.style.display = "none";
    return;
  }
  try {
    const _0x4d6bc3 = "/api/weather?q=" + encodeURIComponent(_0x16dcc0.location) + "&days=1";
    const _0x3a68d3 = await fetch(_0x4d6bc3);
    const _0x47374f = await _0x3a68d3.json();
    if (_0x47374f.error) {
      console.error("WeatherAPI error", _0x47374f.error.message || _0x47374f.error);
      _0xff0b34.style.display = "none";
      return;
    }
    const _0x42ceb2 = !!_0x16dcc0.useF;
    const _0x5c0489 = _0x47374f.forecast.forecastday[0].day;
    const _0x19ebee = _0x42ceb2 ? _0x47374f.current.temp_f : _0x47374f.current.temp_c;
    const _0x37ff3b = _0x42ceb2 ? _0x5c0489.mintemp_f : _0x5c0489.mintemp_c;
    const _0x255d7c = _0x42ceb2 ? _0x5c0489.maxtemp_f : _0x5c0489.maxtemp_c;
    const _0x32bd05 = _0x42ceb2 ? _0x47374f.current.wind_mph : _0x47374f.current.wind_kph;
    const _0x20490e = _0x42ceb2 ? _0x5c0489.totalprecip_in : _0x5c0489.totalprecip_mm;
    const _0x2d3caf = _0x42ceb2 ? "F" : "C";
    document.getElementById("weather-loc").textContent = "" + _0x47374f.location.name + (_0x47374f.location.country ? ", " + _0x47374f.location.country : "");
    document.getElementById("weather-temp").textContent = Math.round(_0x19ebee);
    document.getElementById("weather-unit").textContent = _0x2d3caf;
    document.getElementById("weather-unit-range").textContent = _0x2d3caf;
    document.getElementById("weather-cond").textContent = _0x47374f.current.condition.text;
    document.getElementById("weather-icon").className = "fa-solid " + weatherApiIconClass(_0x47374f.current.condition.code, _0x47374f.current.is_day);
    if (_0x16dcc0.showRange !== false) {
      document.getElementById("weather-range").style.display = "block";
      document.getElementById("weather-min").textContent = Math.round(_0x37ff3b);
      document.getElementById("weather-max").textContent = Math.round(_0x255d7c);
    } else {
      document.getElementById("weather-range").style.display = "none";
    }
    if (_0x16dcc0.showWind) {
      document.getElementById("weather-wind").style.display = "block";
      document.getElementById("weather-wind-val").textContent = Math.round(_0x32bd05 * 10) / 10;
    } else {
      document.getElementById("weather-wind").style.display = "none";
    }
    if (_0x16dcc0.showRain) {
      document.getElementById("weather-rain").style.display = "block";
      document.getElementById("weather-rain-val").textContent = _0x20490e;
    } else {
      document.getElementById("weather-rain").style.display = "none";
    }
    _0xff0b34.classList.toggle("weather-light", _0x16dcc0.theme === "light");
    _0xff0b34.style.display = "flex";
  } catch (_0x1eabc7) {
    console.error("Weather fetch error", _0x1eabc7);
    _0xff0b34.style.display = "none";
  }
}
function shuffleArray(_0x3ecdda) {
  const _0x431429 = _0x3ecdda.slice();
  for (let _0x4ce59c = _0x431429.length - 1; _0x4ce59c > 0; _0x4ce59c--) {
    const _0x135de3 = Math.floor(Math.random() * (_0x4ce59c + 1));
    [_0x431429[_0x4ce59c], _0x431429[_0x135de3]] = [_0x431429[_0x135de3], _0x431429[_0x4ce59c]];
  }
  return _0x431429;
}
async function fetchDiscordGuildCard(_0x432500) {
  const _0x4c792b = document.getElementById("discordGuildCard");
  if (!_0x4c792b) {
    return;
  }
  if (!_0x432500 || !_0x432500.enabled || !_0x432500.inviteCode) {
    _0x4c792b.style.display = "none";
    return;
  }
  try {
    const _0x57e758 = await fetch("https://discord.com/api/v10/invites/" + encodeURIComponent(_0x432500.inviteCode) + "?with_counts=true");
    if (!_0x57e758.ok) {
      throw new Error("Invite không hợp lệ hoặc đã hết hạn");
    }
    const _0x2a042d = await _0x57e758.json();
    const _0x5d6526 = _0x2a042d.guild || {};
    document.getElementById("dcGuildName").textContent = _0x5d6526.name || "Discord Server";
    document.getElementById("dcMemberCount").textContent = (_0x2a042d.approximate_member_count ?? 0).toLocaleString();
    document.getElementById("dcOnlineCount").textContent = (_0x2a042d.approximate_presence_count ?? 0).toLocaleString();
    document.getElementById("dcGuildIcon").src = _0x5d6526.icon ? "https://cdn.discordapp.com/icons/" + _0x5d6526.id + "/" + _0x5d6526.icon + ".png?size=128" : "https://cdn.discordapp.com/embed/avatars/0.png";
    document.getElementById("dcJoinBtn").href = _0x432500.inviteUrl || "https://discord.gg/" + _0x432500.inviteCode;
    const _0x1974be = document.getElementById("dcGuildDesc");
    if (_0x1974be) {
      if (_0x5d6526.description) {
        _0x1974be.style.display = "block";
        _0x1974be.textContent = _0x5d6526.description;
        _0x1974be.title = _0x5d6526.description;
      } else {
        _0x1974be.style.display = "none";
        _0x1974be.textContent = "";
      }
    }
    const _0x38af82 = document.getElementById("dcAvatarRow");
    _0x38af82.innerHTML = "";
    if (_0x432500.guildId) {
      try {
        const _0x377e15 = await fetch("https://discord.com/api/guilds/" + _0x432500.guildId + "/widget.json");
        if (_0x377e15.ok) {
          const _0x846df9 = await _0x377e15.json();
          const _0x5b4d6e = shuffleArray(_0x846df9.members || []).slice(0, 8);
          _0x5b4d6e.forEach((_0x7db609, _0x3a13dd) => {
            const _0x25b987 = document.createElement("div");
            _0x25b987.className = "dc-avatar-wrap";
            _0x25b987.style.setProperty("--i", _0x3a13dd);
            _0x25b987.dataset.username = _0x7db609.username;
            const _0xbf3ade = document.createElement("img");
            _0xbf3ade.className = "dc-avatar";
            _0xbf3ade.src = _0x7db609.avatar_url;
            _0xbf3ade.loading = "lazy";
            _0xbf3ade.alt = _0x7db609.username;
            _0x25b987.appendChild(_0xbf3ade);
            _0x38af82.appendChild(_0x25b987);
          });
          const _0x5f323f = (_0x846df9.presence_count || 0) - _0x5b4d6e.length;
          if (_0x5f323f > 0) {
            const _0x274a25 = document.createElement("div");
            _0x274a25.className = "dc-avatar-more";
            _0x274a25.style.setProperty("--i", _0x5b4d6e.length);
            _0x274a25.textContent = "+" + _0x5f323f;
            _0x38af82.appendChild(_0x274a25);
          }
        }
      } catch (_0x41ec3f) {
        console.warn("Widget avatar không lấy được (widget có thể đang tắt)", _0x41ec3f);
      }
    }
    _0x4c792b.style.display = "block";
    revealCard(_0x4c792b);
  } catch (_0x4e72d5) {
    console.error("Discord guild card error", _0x4e72d5);
    _0x4c792b.style.display = "none";
  }
}
let USER_ID = "";
let CUSTOM_SOCIALS = [];
let CUSTOM_BIOS = [];
let BACKGROUND_URL = "";
let NAME_OVERRIDE = "";
let AVATAR_OVERRIDE = "";
window.BACKGROUND_BLUR = 0;
window.applyBackground = function (_0x21311f) {
  if (!_0x21311f) {
    return;
  }
  let _0x3bb462 = document.getElementById("bg-style");
  if (!_0x3bb462) {
    _0x3bb462 = document.createElement("style");
    _0x3bb462.id = "bg-style";
    document.head.appendChild(_0x3bb462);
  }
  const _0x55b18e = window.BACKGROUND_BLUR || 0;
  _0x3bb462.innerHTML = "\n                body::before {\n                    content: \"\";\n                    position: fixed;\n                    top: -10%; left: -10%; right: -10%; bottom: -10%;\n                    background: url('" + _0x21311f + "') no-repeat center center fixed !important;\n                    background-size: cover !important;\n                    filter: blur(" + _0x55b18e + "px) brightness(0.6) saturate(0.8);\n                    z-index: -1;\n                }\n                body { background: #000 !important; }\n            ";
};
function renderSocials() {
  if (!Array.isArray(CUSTOM_SOCIALS) || !CUSTOM_SOCIALS.length) {
    return;
  }
  const _0x5b5173 = document.querySelector(".layout4-icons");
  if (!_0x5b5173) {
    return;
  }
  _0x5b5173.innerHTML = "";
  function _0x1e6042(_0x174d52) {
    return String(_0x174d52 || "").replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function _0x3eb130(_0x3ba194) {
    return /^(https?:|\/)/i.test(_0x3ba194 || "");
  }
  CUSTOM_SOCIALS.forEach(function (_0x549308) {
    if (!_0x549308 || !_0x549308.url) {
      return;
    }
    const _0x41fc3a = document.createElement("a");
    _0x41fc3a.className = "svg_item";
    const _0x5c1a42 = /^https?:\/\//i.test(_0x549308.url);
    if (_0x549308.isCopy || !_0x5c1a42) {
      _0x41fc3a.href = "#";
      _0x41fc3a.onclick = function (_0xdde954) {
        _0xdde954.preventDefault();
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(_0x549308.url);
        }
      };
      _0x41fc3a.title = "Copy: " + _0x549308.url;
    } else {
      _0x41fc3a.href = _0x549308.url;
      _0x41fc3a.target = "_blank";
      _0x41fc3a.rel = "noopener noreferrer";
      _0x41fc3a.title = _0x549308.label || _0x549308.url;
      _0x41fc3a.addEventListener("click", function (_0x5740fe) {
        _0x5740fe.preventDefault();
        const _0x3789b7 = _0x549308.url;
        _0x41fc3a.classList.add("is-launching");
        setTimeout(function () {
          window.open(_0x3789b7, "_blank", "noopener,noreferrer");
          _0x41fc3a.classList.remove("is-launching");
        }, 200);
      });
    }
    if (_0x3eb130(_0x549308.icon)) {
      _0x41fc3a.innerHTML = "<img src=\"" + _0x1e6042(_0x549308.icon) + "\" alt=\"" + _0x1e6042(_0x549308.label || "") + "\" style=\"width:24px;height:24px;object-fit:contain;\">";
    } else if (_0x549308.icon) {
      let _0xf8426 = _0x1e6042(_0x549308.icon).trim().toLowerCase();
      if (!_0xf8426.startsWith("fa-") && !_0xf8426.includes(" ")) {
        _0xf8426 = "fa-brands fa-" + _0xf8426;
      }
      let _0x5275a0 = "";
      if (_0xf8426.includes("roblox")) {
        _0x5275a0 = "#f12c2c";
      } else if (_0xf8426.includes("discord")) {
        _0x5275a0 = "#5865F2";
      } else if (_0xf8426.includes("youtube")) {
        _0x5275a0 = "#FF0000";
      } else if (_0xf8426.includes("twitter") || _0xf8426.includes("x-twitter")) {
        _0x5275a0 = "#1DA1F2";
      } else if (_0xf8426.includes("spotify")) {
        _0x5275a0 = "#1DB954";
      } else if (_0xf8426.includes("github")) {
        _0x5275a0 = "#fafafa";
      } else if (_0xf8426.includes("instagram")) {
        _0x5275a0 = "#E1306C";
      } else if (_0xf8426.includes("tiktok")) {
        _0x5275a0 = "#ff0050";
      } else if (_0xf8426.includes("steam")) {
        _0x5275a0 = "#66c0f4";
      } else if (_0xf8426.includes("twitch")) {
        _0x5275a0 = "#9146FF";
      } else if (_0xf8426.includes("facebook")) {
        _0x5275a0 = "#1877F2";
      } else if (_0xf8426.includes("soundcloud")) {
        _0x5275a0 = "#ff5500";
      }
      if (_0x5275a0) {
        _0x41fc3a.style.setProperty("--brand-color", _0x5275a0);
        _0x41fc3a.classList.add("brand-hover");
      }
      _0x41fc3a.innerHTML = "<i class=\"" + _0xf8426 + "\" style=\"font-size:24px\"></i>";
    } else {
      _0x41fc3a.innerHTML = "<span style=\"font-size:1.1rem;font-weight:600\">" + _0x1e6042((_0x549308.label || "?")[0].toUpperCase()) + "</span>";
    }
    _0x5b5173.appendChild(_0x41fc3a);
  });
}
const BADGE_CDN = "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/";
const DISCORD_BADGES = [{
  bit: 1,
  label: "Discord Staff",
  glyph: "🛡️",
  icon: BADGE_CDN + "discord-staff.svg"
}, {
  bit: 2,
  label: "Partnered Server Owner",
  glyph: "🎗️",
  icon: BADGE_CDN + "discord-partner.svg"
}, {
  bit: 4,
  label: "HypeSquad Events",
  glyph: "🎉",
  icon: BADGE_CDN + "hype-squad-events.svg"
}, {
  bit: 8,
  label: "Bug Hunter Lv1",
  glyph: "🐛",
  icon: BADGE_CDN + "discord-bug-hunter-green.svg"
}, {
  bit: 64,
  label: "HypeSquad Bravery",
  glyph: "🟪",
  icon: BADGE_CDN + "hype-squad-bravery.svg"
}, {
  bit: 128,
  label: "HypeSquad Brilliance",
  glyph: "🟧",
  icon: BADGE_CDN + "hype-squad-brilliance.svg"
}, {
  bit: 256,
  label: "HypeSquad Balance",
  glyph: "🟩",
  icon: BADGE_CDN + "hype-squad-balance.svg"
}, {
  bit: 512,
  label: "Early Supporter",
  glyph: "⭐",
  icon: BADGE_CDN + "discord-early-supporter.svg"
}, {
  bit: 16384,
  label: "Bug Hunter Lv2",
  glyph: "🪲",
  icon: BADGE_CDN + "discord-bug-hunter-gold.svg"
}, {
  bit: 131072,
  label: "Early Verified Bot Developer",
  glyph: "🤖",
  icon: BADGE_CDN + "discord-bot-dev.svg"
}, {
  bit: 262144,
  label: "Moderator Programs Alumni",
  glyph: "🛠️",
  icon: BADGE_CDN + "discord-mod.svg"
}, {
  bit: 4194304,
  label: "Active Developer",
  glyph: "💻",
  icon: BADGE_CDN + "active-developer.svg"
}];
function fmtMs(_0x15c795) {
  let _0x1876ba = Math.max(0, Math.floor(_0x15c795 / 1000));
  const _0x320503 = Math.floor(_0x1876ba / 3600);
  _0x1876ba -= _0x320503 * 3600;
  const _0x5ad0be = Math.floor(_0x1876ba / 60);
  _0x1876ba -= _0x5ad0be * 60;
  return (_0x320503 > 0 ? String(_0x320503).padStart(2, "0") + ":" : "") + String(_0x5ad0be).padStart(2, "0") + ":" + String(_0x1876ba).padStart(2, "0");
}
function resolveActivityImage(_0x574548) {
  if (!_0x574548 || !_0x574548.assets) {
    return null;
  }
  const _0x337d9e = _0x574548.assets.large_image || _0x574548.assets.small_image;
  if (!_0x337d9e) {
    return null;
  }
  if (_0x337d9e.startsWith("mp:")) {
    return "https://media.discordapp.net/" + _0x337d9e.substring(3);
  }
  if (_0x337d9e.startsWith("spotify:")) {
    return "https://i.scdn.co/image/" + _0x337d9e.substring(8);
  }
  if (_0x337d9e.startsWith("http://") || _0x337d9e.startsWith("https://")) {
    return _0x337d9e;
  }
  if (_0x574548.application_id) {
    return "https://cdn.discordapp.com/app-assets/" + _0x574548.application_id + "/" + _0x337d9e + ".png";
  }
  return null;
}
function updateActivityCard(_0x355ece, _0x36c0e4) {
  const _0x8facd8 = document.getElementById("dcActivityCard");
  const _0x3c2bd1 = document.getElementById("dcActivityImg");
  const _0x4ca2eb = document.getElementById("dcActivityTypeIcon");
  const _0x1d94f2 = document.getElementById("dcActivityKind");
  const _0x5bba4d = document.getElementById("dcActivityName");
  const _0x452c67 = document.getElementById("dcActivityDetails");
  const _0x4dc4d1 = document.getElementById("dcActivityState");
  const _0xb592b4 = document.getElementById("dcActivityElapsed");
  const _0x2b8930 = document.getElementById("dcActivityProgressWrap");
  const _0x34a8c2 = document.getElementById("dcActivityProgressFill");
  if (!_0x8facd8) {
    return;
  }
  if (_0x36c0e4 && _0x36c0e4.showActivityCard === false) {
    _0x8facd8.style.display = "none";
    if (window._activityInterval) {
      clearInterval(window._activityInterval);
      window._activityInterval = null;
    }
    return;
  }
  if (window._activityInterval) {
    clearInterval(window._activityInterval);
    window._activityInterval = null;
  }
  function _0x19d786(_0x1e9c53) {
    if (!_0x4ca2eb) {
      return;
    }
    const _0x108e59 = {
      spotify: "fa-brands fa-spotify",
      game: "fa-solid fa-gamepad",
      stream: "fa-solid fa-tower-broadcast",
      listen: "fa-solid fa-music",
      watch: "fa-solid fa-clapperboard",
      compete: "fa-solid fa-trophy",
      other: "fa-solid fa-bolt"
    };
    _0x4ca2eb.className = "dc-activity-type-icon is-" + _0x1e9c53;
    _0x4ca2eb.innerHTML = "<i class=\"" + (_0x108e59[_0x1e9c53] || _0x108e59.other) + "\"></i>";
  }
  function _0x3f479b(_0x3ed2ae, _0x4388e9) {
    if (!_0x3ed2ae || !_0x4388e9 || _0x4388e9 <= _0x3ed2ae) {
      if (_0x2b8930) {
        _0x2b8930.style.display = "none";
      }
      return;
    }
    if (_0x2b8930) {
      _0x2b8930.style.display = "block";
    }
    _0xb592b4.style.display = "block";
    const _0x59e119 = _0x4388e9 - _0x3ed2ae;
    function _0x5e618e() {
      const _0x5bde38 = Date.now();
      const _0x36e774 = Math.min(100, Math.max(0, (_0x5bde38 - _0x3ed2ae) / _0x59e119 * 100));
      if (_0x34a8c2) {
        _0x34a8c2.style.width = _0x36e774 + "%";
      }
      _0xb592b4.textContent = fmtMs(Math.max(0, _0x5bde38 - _0x3ed2ae)) + " / " + fmtMs(_0x59e119);
    }
    _0x5e618e();
    window._activityInterval = setInterval(_0x5e618e, 1000);
  }
  function _0x37843e(_0x171b8d) {
    if (_0x2b8930) {
      _0x2b8930.style.display = "none";
    }
    if (!_0x171b8d) {
      _0xb592b4.style.display = "none";
      return;
    }
    _0xb592b4.style.display = "block";
    function _0x5bfc93() {
      _0xb592b4.textContent = fmtMs(Date.now() - _0x171b8d) + " trôi qua";
    }
    _0x5bfc93();
    window._activityInterval = setInterval(_0x5bfc93, 1000);
  }
  if (_0x355ece.listening_to_spotify && _0x355ece.spotify) {
    const _0x49b1f6 = _0x355ece.spotify;
    _0x8facd8.style.display = "flex";
    revealCard(_0x8facd8);
    if (_0x3c2bd1) {
      _0x3c2bd1.src = _0x49b1f6.album_art_url || "";
      _0x3c2bd1.style.visibility = _0x49b1f6.album_art_url ? "visible" : "hidden";
    }
    _0x19d786("spotify");
    _0x1d94f2.textContent = "Đang nghe Spotify";
    _0x5bba4d.textContent = _0x49b1f6.song || "";
    _0x5bba4d.title = _0x49b1f6.song || "";
    const _0x105f05 = Array.isArray(_0x49b1f6.artist) ? _0x49b1f6.artist.join(", ") : _0x49b1f6.artist || "";
    _0x452c67.style.display = _0x105f05 ? "block" : "none";
    _0x452c67.textContent = _0x105f05 ? "bởi " + _0x105f05 : "";
    _0x4dc4d1.style.display = _0x49b1f6.album ? "block" : "none";
    _0x4dc4d1.textContent = _0x49b1f6.album || "";
    if (_0x49b1f6.timestamps && _0x49b1f6.timestamps.start && _0x49b1f6.timestamps.end) {
      _0x3f479b(_0x49b1f6.timestamps.start, _0x49b1f6.timestamps.end);
    } else {
      if (_0x2b8930) {
        _0x2b8930.style.display = "none";
      }
      _0xb592b4.style.display = "none";
    }
    return;
  }
  const _0xa91a9d = (_0x355ece.activities || []).find(function (_0x59969d) {
    return _0x59969d.type !== 4;
  });
  if (!_0xa91a9d) {
    _0x8facd8.style.display = "none";
    return;
  }
  _0x8facd8.style.display = "flex";
  revealCard(_0x8facd8);
  const _0xd024ca = {
    0: "Đang chơi",
    1: "Đang stream",
    2: "Đang nghe",
    3: "Đang xem",
    5: "Đang thi đấu"
  };
  const _0x2e3523 = {
    0: "game",
    1: "stream",
    2: "listen",
    3: "watch",
    5: "compete"
  };
  _0x19d786(_0x2e3523[_0xa91a9d.type] || "other");
  _0x1d94f2.textContent = _0xd024ca[_0xa91a9d.type] || "Hoạt động";
  _0x5bba4d.textContent = _0xa91a9d.name || "";
  _0x5bba4d.title = _0xa91a9d.name || "";
  const _0x92044a = resolveActivityImage(_0xa91a9d);
  if (_0x3c2bd1) {
    _0x3c2bd1.src = _0x92044a || "";
    _0x3c2bd1.style.visibility = _0x92044a ? "visible" : "hidden";
  }
  if (_0xa91a9d.details) {
    _0x452c67.style.display = "block";
    _0x452c67.textContent = _0xa91a9d.details;
  } else {
    _0x452c67.style.display = "none";
  }
  if (_0xa91a9d.state) {
    _0x4dc4d1.style.display = "block";
    _0x4dc4d1.textContent = _0xa91a9d.state;
  } else {
    _0x4dc4d1.style.display = "none";
  }
  if (_0xa91a9d.timestamps && _0xa91a9d.timestamps.start && _0xa91a9d.timestamps.end) {
    _0x3f479b(_0xa91a9d.timestamps.start, _0xa91a9d.timestamps.end);
  } else if (_0xa91a9d.timestamps && _0xa91a9d.timestamps.start) {
    _0x37843e(_0xa91a9d.timestamps.start);
  } else {
    if (_0x2b8930) {
      _0x2b8930.style.display = "none";
    }
    _0xb592b4.style.display = "none";
  }
}
function renderBadgeEl(_0x2f4586, _0x423123, _0x33b7fa) {
  const _0x537b9b = document.createElement("span");
  _0x537b9b.className = "dc-badge";
  _0x537b9b.dataset.label = _0x2f4586;
  if (_0x33b7fa) {
    const _0x6a1feb = document.createElement("img");
    _0x6a1feb.src = _0x33b7fa;
    _0x6a1feb.alt = _0x2f4586;
    _0x6a1feb.loading = "lazy";
    _0x6a1feb.onerror = function () {
      _0x537b9b.textContent = _0x423123;
    };
    _0x537b9b.appendChild(_0x6a1feb);
  } else {
    _0x537b9b.textContent = _0x423123;
  }
  return _0x537b9b;
}
function renderLanyardData(_0x2845b2, _0x3cf07c) {
  if (!_0x2845b2 || !_0x2845b2.discord_user) {
    return;
  }
  const _0x2f5921 = _0x2845b2.discord_user;
  let _0x2356c9;
  if (_0x2f5921.avatar) {
    const _0x5c68b8 = _0x2f5921.avatar.startsWith("a_") ? "gif" : "png";
    _0x2356c9 = "https://cdn.discordapp.com/avatars/" + _0x2f5921.id + "/" + _0x2f5921.avatar + "." + _0x5c68b8 + "?size=256";
  } else {
    const _0x53f77d = Number((BigInt(_0x2f5921.id) >> 0x16n) % 0x6n);
    _0x2356c9 = "https://cdn.discordapp.com/embed/avatars/" + _0x53f77d + ".png";
  }
  const hasCustomAvatar = typeof CONFIG !== "undefined" && CONFIG.AVATAR_OVERRIDE && CONFIG.AVATAR_OVERRIDE.trim() !== "";
  if (!hasCustomAvatar) {
    AVATAR_OVERRIDE = _0x2356c9;
    const _0x2b08aa = document.querySelector(".avatar-img");
    if (_0x2b08aa) {
      _0x2b08aa.src = _0x2356c9;
    }
  }
  const _0x49b9a2 = document.getElementById("avatarDecoration");
  if (_0x49b9a2) {
    if (_0x2f5921.avatar_decoration_data && _0x2f5921.avatar_decoration_data.asset) {
      _0x49b9a2.src = "https://cdn.discordapp.com/avatar-decoration-presets/" + _0x2f5921.avatar_decoration_data.asset + ".png?size=240&passthrough=true";
      _0x49b9a2.style.display = "block";
    } else {
      _0x49b9a2.style.display = "none";
    }
  }
  const _0x227116 = (typeof CONFIG !== "undefined" && CONFIG.NAME_OVERRIDE && CONFIG.NAME_OVERRIDE.trim() !== "") ? CONFIG.NAME_OVERRIDE : (_0x2f5921.global_name || _0x2f5921.username);
  NAME_OVERRIDE = _0x227116;
  const _0x88937e = document.getElementById("userName");
  if (_0x88937e) {
    _0x88937e.textContent = _0x227116;
    _0x88937e.dataset.username = _0x2f5921.username || "";
  }
  document.title = _0x227116;
  let _0x101aa6 = document.querySelector("meta[property='og:title']");
  if (_0x101aa6) {
    _0x101aa6.content = _0x227116;
  }
  const _0x5c5a76 = document.getElementById("avatarHandle");
  if (_0x5c5a76) {
    _0x5c5a76.textContent = "@" + (_0x2f5921.username || _0x227116);
  }
  const _0x49dced = _0x2f5921.public_flags || 0;
  const _0x5b7f0d = document.getElementById("dcBadges");
  if (_0x5b7f0d) {
    const _0x4b268e = _0x49dced + "|" + JSON.stringify(_0x3cf07c.customBadges || []);
    if (_0x5b7f0d.dataset.sig !== _0x4b268e) {
      _0x5b7f0d.dataset.sig = _0x4b268e;
      _0x5b7f0d.innerHTML = "";
      let _0xa07d93 = 0;
      DISCORD_BADGES.forEach(function (_0x274d26) {
        if ((_0x49dced & _0x274d26.bit) === _0x274d26.bit) {
          const _0x2a8826 = renderBadgeEl(_0x274d26.label, _0x274d26.glyph, _0x274d26.icon);
          _0x2a8826.style.animationDelay = _0xa07d93 * 0.07 + "s";
          _0x5b7f0d.appendChild(_0x2a8826);
          _0xa07d93++;
        }
      });
      (_0x3cf07c.customBadges || []).forEach(function (_0x30a1e5) {
        const _0x58db20 = renderBadgeEl(_0x30a1e5.label, _0x30a1e5.glyph, _0x30a1e5.icon);
        _0x58db20.style.animationDelay = _0xa07d93 * 0.07 + "s";
        _0x5b7f0d.appendChild(_0x58db20);
        _0xa07d93++;
      });
    }
  }
  updateActivityCard(_0x2845b2, _0x3cf07c);
}
async function fetchDiscordLanyard(_0x51c77f) {
  if (!_0x51c77f || !_0x51c77f.enabled || !_0x51c77f.id) {
    return;
  }
  try {
    const _0x102a87 = await fetch("https://api.lanyard.rest/v1/users/" + _0x51c77f.id);
    const _0x3590fb = await _0x102a87.json();
    if (!_0x3590fb || !_0x3590fb.success || !_0x3590fb.data || !_0x3590fb.data.discord_user) {
      console.warn("Lanyard: chua co du lieu. Nho join https://discord.gg/lanyard bang tai khoan id " + _0x51c77f.id);
      return;
    }
    renderLanyardData(_0x3590fb.data, _0x51c77f);
  } catch (_0x2db54c) {
    console.warn("Lanyard fetch loi:", _0x2db54c);
  }
}
let _lanyardWs = null;
let _lanyardWsHeartbeat = null;
let _lanyardWsReconnectTimer = null;
let _lanyardWsReconnectDelay = 1000;
function connectLanyardWS(_0x25e58b) {
  if (!_0x25e58b || !_0x25e58b.enabled || !_0x25e58b.id) {
    return;
  }
  if (_lanyardWsReconnectTimer) {
    clearTimeout(_lanyardWsReconnectTimer);
    _lanyardWsReconnectTimer = null;
  }
  if (_lanyardWs) {
    try {
      _lanyardWs.onclose = null;
      _lanyardWs.close();
    } catch (_0x123822) {}
  }
  const _0x55d99d = new WebSocket("wss://api.lanyard.rest/socket");
  _lanyardWs = _0x55d99d;
  _0x55d99d.onopen = function () {
    _lanyardWsReconnectDelay = 1000;
    _0x55d99d.send(JSON.stringify({
      op: 2,
      d: {
        subscribe_to_id: _0x25e58b.id
      }
    }));
  };
  _0x55d99d.onmessage = function (_0x264c31) {
    let _0x1b0286;
    try {
      _0x1b0286 = JSON.parse(_0x264c31.data);
    } catch (_0x54500e) {
      return;
    }
    if (_0x1b0286.op === 1 && _0x1b0286.d && _0x1b0286.d.heartbeat_interval) {
      if (_lanyardWsHeartbeat) {
        clearInterval(_lanyardWsHeartbeat);
      }
      _lanyardWsHeartbeat = setInterval(function () {
        if (_0x55d99d.readyState === WebSocket.OPEN) {
          _0x55d99d.send(JSON.stringify({
            op: 3
          }));
        }
      }, _0x1b0286.d.heartbeat_interval);
    }
    if (_0x1b0286.t === "INIT_STATE" || _0x1b0286.t === "PRESENCE_UPDATE") {
      renderLanyardData(_0x1b0286.d, _0x25e58b);
    }
  };
  _0x55d99d.onclose = function () {
    if (_lanyardWsHeartbeat) {
      clearInterval(_lanyardWsHeartbeat);
      _lanyardWsHeartbeat = null;
    }
    _lanyardWsReconnectTimer = setTimeout(function () {
      _lanyardWsReconnectDelay = Math.min(_lanyardWsReconnectDelay * 2, 30000);
      connectLanyardWS(_0x25e58b);
    }, _lanyardWsReconnectDelay);
  };
  _0x55d99d.onerror = function () {
    _0x55d99d.close();
  };
}
async function fetchPresence() {
  try {
    const _0x4c6864 = AVATAR_OVERRIDE;
    if (_0x4c6864) {
      const _0x49686f = document.querySelector(".avatar-img");
      if (_0x49686f) {
        _0x49686f.src = _0x4c6864;
      }
    }
    const _0x2efe6c = document.getElementById("userName");
    const _0x1b493f = typeof NAME_OVERRIDE !== "undefined" && NAME_OVERRIDE ? NAME_OVERRIDE : "";
    if (_0x1b493f) {
      document.title = _0x1b493f;
      const _0x36a874 = document.getElementById("avatarHandle");
      if (_0x36a874) {
        _0x36a874.textContent = "@" + _0x1b493f;
      }
    }
    let _0x3db798 = document.querySelector("meta[property='og:title']");
    if (_0x3db798) {
      _0x3db798.content = _0x1b493f;
    }
    let _0x1c03a4 = document.querySelector("meta[name='twitter:title']");
    if (_0x1c03a4) {
      _0x1c03a4.content = _0x1b493f;
    }
    if (_0x2efe6c && !window._nameEffectActive) {
      if (_0x1b493f) {
        _0x2efe6c.textContent = _0x1b493f;
      }
      _0x2efe6c.style.cursor = "pointer";
      _0x2efe6c.onclick = function () {
        const _0x1e0cc7 = this.dataset.username;
        if (!_0x1e0cc7) {
          return;
        }
        if (navigator.clipboard?.writeText) {
          navigator.clipboard.writeText(_0x1e0cc7).then(() => {
            if (typeof showToast === "function") {
              showToast("copied");
            }
          }).catch(() => {});
        }
      };
      if (window._layoutConfig && window._layoutConfig.nameEffect && window._layoutConfig.nameEffect !== "none") {
        applyNameEffect(window._layoutConfig.nameEffect);
      }
    }
  } catch (_0x50c133) {
    alert("fetchPresence error: " + _0x50c133.message);
    console.error(_0x50c133);
  } finally {
    try {
      const _0x35f71e = document.getElementById("ov-hint");
      const _0x44ddf0 = document.getElementById("overlay");
      if (_0x35f71e) {
        _0x35f71e.textContent = "[ click to start ]";
      }
      if (_0x44ddf0) {
        _0x44ddf0.style.pointerEvents = "auto";
        _0x44ddf0.style.cursor = "pointer";
        _0x44ddf0.addEventListener("click", dismissOverlay, {
          once: true
        });
      }
    } catch (_0x372cd3) {
      alert("finally error: " + _0x372cd3.message);
    }
  }
}
function initTypewriter() {
  const _0x466750 = CUSTOM_BIOS && CUSTOM_BIOS.length > 0 ? CUSTOM_BIOS : [" "];
  let _0x55616e = 0;
  let _0x25c2b3 = 0;
  let _0x25e256 = false;
  const _0x4bda2d = document.querySelector(".pronouns");
  if (!_0x4bda2d) {
    return;
  }
  if (window.bioTimer) {
    clearTimeout(window.bioTimer);
  }
  function _0xcd8558() {
    const _0x4781b7 = _0x466750[_0x55616e] || "";
    _0x4bda2d.textContent = _0x25e256 ? _0x4781b7.substring(0, --_0x25c2b3) : _0x4781b7.substring(0, ++_0x25c2b3);
    if (!_0x25e256 && _0x25c2b3 === _0x4781b7.length) {
      _0x25e256 = true;
      window.bioTimer = setTimeout(_0xcd8558, 2400);
      return;
    }
    if (_0x25e256 && _0x25c2b3 === 0) {
      _0x25e256 = false;
      _0x55616e = (_0x55616e + 1) % _0x466750.length;
      window.bioTimer = setTimeout(_0xcd8558, 500);
      return;
    }
    window.bioTimer = setTimeout(_0xcd8558, _0x25e256 ? 26 : 52);
  }
  _0xcd8558();
}
function loadParticlesEffect() {
  const _0x43eb4f = document.createElement("div");
  _0x43eb4f.className = "particles-container";
  for (let _0x3b88b7 = 0; _0x3b88b7 < 50; _0x3b88b7++) {
    const _0x5afb91 = document.createElement("div");
    _0x5afb91.className = "particle";
    _0x5afb91.style.left = Math.random() * 100 + "%";
    _0x5afb91.style.animationDuration = Math.random() * 8 + 4 + "s";
    _0x5afb91.style.animationDelay = Math.random() * 5 + "s";
    _0x5afb91.style.width = Math.random() * 2 + 1 + "px";
    _0x5afb91.style.height = _0x5afb91.style.width;
    _0x5afb91.style.opacity = Math.random() * 0.5 + 0.2;
    _0x43eb4f.appendChild(_0x5afb91);
  }
  document.body.appendChild(_0x43eb4f);
}
function loadPlasmaEffect(_0x14f75d, _0x331a93, _0x370bb2) {
  const _0x544755 = document.createElement("canvas");
  _0x544755.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:" + _0x370bb2 + ";";
  _0x544755.id = "plasma-canvas";
  document.body.appendChild(_0x544755);
  const _0x35369d = _0x544755.getContext("webgl");
  if (!_0x35369d) {
    console.warn("WebGL not supported");
    return;
  }
  _0x544755.width = window.innerWidth;
  _0x544755.height = window.innerHeight;
  _0x35369d.viewport(0, 0, _0x544755.width, _0x544755.height);
  const _0x4da262 = _0x14f75d.replace("#", "");
  const _0x4079f0 = parseInt(_0x4da262.substring(0, 2), 16) / 255;
  const _0x60fef1 = parseInt(_0x4da262.substring(2, 4), 16) / 255;
  const _0x2ba6ee = parseInt(_0x4da262.substring(4, 6), 16) / 255;
  const _0x2e3e12 = "attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.0,1.0);}";
  const _0x3bfabc = "precision mediump float;uniform float u_time;uniform vec2 u_resolution;uniform vec3 u_color;void main(){vec2 uv=(gl_FragCoord.xy/u_resolution.xy)*2.0-1.0;uv.x*=u_resolution.x/u_resolution.y;float v=0.0;for(int i=0;i<3;i++){float fi=float(i);vec2 p=uv+vec2(cos(u_time*0.3+fi*1.5)*0.8,sin(u_time*0.4+fi*2.0)*0.6);v+=1.0/length(p)*0.05;}v=clamp(v,0.0,1.0);gl_FragColor=vec4(u_color*v,v*0.4);}";
  function _0x25595a(_0x4b2232, _0x5e7b8c) {
    const _0x5343bf = _0x35369d.createShader(_0x4b2232);
    _0x35369d.shaderSource(_0x5343bf, _0x5e7b8c);
    _0x35369d.compileShader(_0x5343bf);
    return _0x5343bf;
  }
  const _0x349de6 = _0x35369d.createProgram();
  _0x35369d.attachShader(_0x349de6, _0x25595a(_0x35369d.VERTEX_SHADER, _0x2e3e12));
  _0x35369d.attachShader(_0x349de6, _0x25595a(_0x35369d.FRAGMENT_SHADER, _0x3bfabc));
  _0x35369d.linkProgram(_0x349de6);
  _0x35369d.useProgram(_0x349de6);
  const _0xafd18a = _0x35369d.createBuffer();
  _0x35369d.bindBuffer(_0x35369d.ARRAY_BUFFER, _0xafd18a);
  _0x35369d.bufferData(_0x35369d.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), _0x35369d.STATIC_DRAW);
  const _0x46284b = _0x35369d.getAttribLocation(_0x349de6, "a_position");
  _0x35369d.enableVertexAttribArray(_0x46284b);
  _0x35369d.vertexAttribPointer(_0x46284b, 2, _0x35369d.FLOAT, false, 0, 0);
  const _0x356beb = _0x35369d.getUniformLocation(_0x349de6, "u_time");
  const _0x10fe51 = _0x35369d.getUniformLocation(_0x349de6, "u_resolution");
  const _0x3859ab = _0x35369d.getUniformLocation(_0x349de6, "u_color");
  _0x35369d.uniform2f(_0x10fe51, _0x544755.width, _0x544755.height);
  _0x35369d.uniform3f(_0x3859ab, _0x4079f0, _0x60fef1, _0x2ba6ee);
  let _0x152edf = Date.now();
  function _0x25d4ac() {
    const _0x4586bb = (Date.now() - _0x152edf) / 1000 * _0x331a93;
    _0x35369d.uniform1f(_0x356beb, _0x4586bb);
    _0x35369d.drawArrays(_0x35369d.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(_0x25d4ac);
  }
  _0x25d4ac();
  window.addEventListener("resize", function () {
    _0x544755.width = window.innerWidth;
    _0x544755.height = window.innerHeight;
    _0x35369d.viewport(0, 0, _0x544755.width, _0x544755.height);
    _0x35369d.uniform2f(_0x10fe51, _0x544755.width, _0x544755.height);
  });
}
let _nameEffectActive = false;
function applyNameEffect(_0x25b2cf) {
  if (!_0x25b2cf || _0x25b2cf === "none") {
    return;
  }
  const _0x123334 = document.getElementById("userName");
  if (!_0x123334 || !_0x123334.textContent.trim()) {
    return;
  }
  if (_nameEffectActive) {
    return;
  }
  _nameEffectActive = true;
  _0x123334.style.webkitTextFillColor = "var(--nameColor, #ffffff)";
  _0x123334.style.background = "none";
  _0x123334.style.color = "var(--nameColor, #ffffff)";
  if (_0x25b2cf === "shine") {
    var _0x163e01 = _0x123334.textContent.trim();
    _0x123334.innerHTML = "";
    for (var _0x49173e = 0; _0x49173e < _0x163e01.length; _0x49173e++) {
      var _0x4491b7 = document.createElement("span");
      _0x4491b7.textContent = _0x163e01[_0x49173e] === " " ? "\xA0" : _0x163e01[_0x49173e];
      _0x4491b7.style.display = "inline-block";
      _0x4491b7.style.animation = "namePulse 2s linear infinite";
      _0x4491b7.style.animationDelay = _0x49173e * 0.1 + "s";
      _0x123334.appendChild(_0x4491b7);
    }
  } else if (_0x25b2cf === "rainbow") {
    _0x123334.classList.add("text-rainbow");
  } else if (_0x25b2cf === "glitch") {
    _0x123334.classList.add("text-glitch");
    _0x123334.setAttribute("data-text", _0x123334.textContent);
  } else if (_0x25b2cf === "wave") {
    var _0x163e01 = _0x123334.textContent.trim();
    _0x123334.innerHTML = "";
    var _0x30b380 = [];
    for (var _0x49173e = 0; _0x49173e < _0x163e01.length; _0x49173e++) {
      var _0x4491b7 = document.createElement("span");
      _0x4491b7.textContent = _0x163e01[_0x49173e] === " " ? "\xA0" : _0x163e01[_0x49173e];
      _0x4491b7.style.display = "inline-block";
      _0x4491b7.style.opacity = "0.5";
      _0x123334.appendChild(_0x4491b7);
      _0x30b380.push(_0x4491b7);
    }
    var _0x45d814 = _0x30b380.length;
    var _0x260e69 = [];
    function _0x39c136() {
      _0x260e69.push({
        position: 0,
        speed: 0.06
      });
    }
    function _0xb4cb9e() {
      for (var _0x4f6684 = _0x260e69.length - 1; _0x4f6684 >= 0; _0x4f6684--) {
        _0x260e69[_0x4f6684].position += _0x260e69[_0x4f6684].speed;
        if (_0x260e69[_0x4f6684].position > _0x45d814 + 3) {
          _0x260e69.splice(_0x4f6684, 1);
        }
      }
      for (var _0x1b1a26 = 0; _0x1b1a26 < _0x30b380.length; _0x1b1a26++) {
        var _0x316b2e = 0;
        for (var _0x5c8818 = 0; _0x5c8818 < _0x260e69.length; _0x5c8818++) {
          var _0x503fd4 = Math.abs(_0x1b1a26 - _0x260e69[_0x5c8818].position);
          if (_0x503fd4 < 3) {
            _0x316b2e += Math.cos(_0x503fd4 / 3 * Math.PI / 2);
          }
        }
        _0x316b2e = Math.min(1, Math.max(0, _0x316b2e));
        _0x30b380[_0x1b1a26].style.opacity = (0.5 + _0x316b2e * 0.5).toString();
        _0x30b380[_0x1b1a26].style.transform = "scale(" + (1 + _0x316b2e * 0.1) + ")";
        _0x30b380[_0x1b1a26].style.textShadow = _0x316b2e > 0 ? "0 0 " + _0x316b2e * 10 + "px" : "";
      }
      requestAnimationFrame(_0xb4cb9e);
    }
    _0x39c136();
    _0xb4cb9e();
    setInterval(_0x39c136, 2000);
  } else if (_0x25b2cf === "typewrite") {
    var _0x16962b = _0x123334.textContent.trim();
    var _0xa94568 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*";
    var _0x5e2196 = 50;
    var _0xdcecfb = 60;
    var _0x19bf16 = 60;
    var _0x26d966 = 5;
    var _0x375639 = 3500;
    async function _0x12a49e(_0x16bf63) {
      for (var _0x3ca4df = 0; _0x3ca4df < _0x26d966; _0x3ca4df++) {
        var _0x269be1 = "";
        for (var _0x1ef514 = 0; _0x1ef514 < _0x16bf63.length; _0x1ef514++) {
          if (Math.random() < 0.3) {
            _0x269be1 += _0xa94568[Math.floor(Math.random() * _0xa94568.length)];
          } else {
            _0x269be1 += _0x16bf63[_0x1ef514];
          }
        }
        _0x123334.textContent = _0x269be1;
        await new Promise(function (_0x100af9) {
          setTimeout(_0x100af9, _0x19bf16);
        });
      }
      _0x123334.textContent = _0x16bf63;
    }
    async function _0x78cd63(_0x277dc4) {
      var _0x456eea = "";
      for (var _0x3b5813 = 0; _0x3b5813 < _0x277dc4.length; _0x3b5813++) {
        _0x456eea += _0x277dc4[_0x3b5813];
        await _0x12a49e(_0x456eea);
        await new Promise(function (_0x5a12c1) {
          setTimeout(_0x5a12c1, _0x5e2196);
        });
      }
    }
    async function _0x500bad() {
      var _0xc3917c = _0x123334.textContent;
      while (_0xc3917c.length > 0) {
        _0xc3917c = _0xc3917c.slice(0, -1);
        _0x123334.textContent = _0xc3917c;
        await new Promise(function (_0x4b94a8) {
          setTimeout(_0x4b94a8, _0xdcecfb);
        });
      }
    }
    (async function _0x505e38() {
      while (true) {
        await _0x78cd63(_0x16962b);
        await new Promise(function (_0x5b667b) {
          setTimeout(_0x5b667b, _0x375639);
        });
        await _0x500bad();
        await new Promise(function (_0x49c3f6) {
          setTimeout(_0x49c3f6, 100);
        });
      }
    })();
  }
}
function loadNoiseEffect() {
  if (document.querySelector(".noise-overlay")) {
    return;
  }
  var _0x36728e = document.createElement("div");
  _0x36728e.className = "noise-overlay";
  _0x36728e.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:1;opacity:0.04;background-image:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3d3dtbW17e3t1dXWBgYGHh4d5eXlzc3Oeli7teleVlZWQkJCLi4ubm5unp6ejo6Oeli7teleVlZWQkJCLi4ucnJynp6ejo6MAAACQkJBl/qekAAAAG3RSTlNAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEAvEOwtAAAFVklEQVR4XpsXsG9mYGBkYuZh5sNkZMUQ4gAA\");background-repeat:repeat;background-size:100px 100px;animation:noiseAnim .2s steps(10) infinite;";
  document.body.appendChild(_0x36728e);
}
function loadRainEffect() {
  if (document.getElementById("rain-bg-canvas")) {
    return;
  }
  var _0x3bbc5e = document.createElement("canvas");
  _0x3bbc5e.id = "rain-bg-canvas";
  _0x3bbc5e.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;";
  document.body.appendChild(_0x3bbc5e);
  var _0x25f931 = _0x3bbc5e.getContext("2d");
  _0x3bbc5e.width = innerWidth;
  _0x3bbc5e.height = innerHeight;
  window.addEventListener("resize", function () {
    _0x3bbc5e.width = innerWidth;
    _0x3bbc5e.height = innerHeight;
  });
  var _0x5d16a5 = [];
  for (var _0x136807 = 0; _0x136807 < 150; _0x136807++) {
    _0x5d16a5.push({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      length: Math.random() * 20 + 10,
      vy: Math.random() * 5 + 2
    });
  }
  function _0x3ffa7f() {
    _0x25f931.clearRect(0, 0, _0x3bbc5e.width, _0x3bbc5e.height);
    _0x25f931.strokeStyle = "rgba(255,255,255,0.15)";
    _0x25f931.lineWidth = 1;
    _0x25f931.lineCap = "round";
    _0x5d16a5.forEach(function (_0x2d7810) {
      _0x25f931.beginPath();
      _0x25f931.moveTo(_0x2d7810.x, _0x2d7810.y);
      _0x25f931.lineTo(_0x2d7810.x, _0x2d7810.y + _0x2d7810.length);
      _0x25f931.stroke();
      _0x2d7810.y += _0x2d7810.vy;
      if (_0x2d7810.y > _0x3bbc5e.height) {
        _0x2d7810.y = -_0x2d7810.length;
        _0x2d7810.x = Math.random() * _0x3bbc5e.width;
      }
    });
    requestAnimationFrame(_0x3ffa7f);
  }
  _0x3ffa7f();
}
function loadCursorEffect(_0xe20e93, _0x4de597) {
  if (window._cursorEffectDestroy) {
    window._cursorEffectDestroy();
    window._cursorEffectDestroy = null;
  }
  if (!_0xe20e93 || _0xe20e93 === "none") {
    return;
  } else if (_0xe20e93 === "canvas") {
    (function () {
      var _0x339197 = document.createElement("canvas");
      _0x339197.style.cssText = "position:fixed;top:0;left:0;pointer-events:none;z-index:9991;";
      document.body.appendChild(_0x339197);
      var _0xd60099 = _0x339197.getContext("2d");
      _0x339197.width = innerWidth - 20;
      _0x339197.height = innerHeight;
      _0xd60099.running = true;
      _0xd60099.frame = 1;
      var _0xbac767 = {
        x: innerWidth / 2,
        y: innerHeight / 2
      };
      var _0x1adef5 = [];
      var _0x1ea058 = _0x4de597 || "#ffffff";
      function _0x723cd4(_0x53e8df) {
        this.spring = _0x53e8df + Math.random() * 0.1 - 0.02;
        this.friction = 0.5 + Math.random() * 0.01 - 0.002;
        this.nodes = [];
        for (var _0x95856f = 0; _0x95856f < 50; _0x95856f++) {
          this.nodes.push({
            x: _0xbac767.x,
            y: _0xbac767.y,
            vx: 0,
            vy: 0
          });
        }
      }
      _0x723cd4.prototype.update = function () {
        var _0x5e42cb = this.spring;
        var _0x5f8dbe = this.nodes[0];
        _0x5f8dbe.vx += (_0xbac767.x - _0x5f8dbe.x) * _0x5e42cb;
        _0x5f8dbe.vy += (_0xbac767.y - _0x5f8dbe.y) * _0x5e42cb;
        for (var _0x4ec822 = 0; _0x4ec822 < this.nodes.length; _0x4ec822++) {
          _0x5f8dbe = this.nodes[_0x4ec822];
          if (_0x4ec822 > 0) {
            var _0x51f012 = this.nodes[_0x4ec822 - 1];
            _0x5f8dbe.vx += (_0x51f012.x - _0x5f8dbe.x) * _0x5e42cb;
            _0x5f8dbe.vy += (_0x51f012.y - _0x5f8dbe.y) * _0x5e42cb;
            _0x5f8dbe.vx += _0x51f012.vx * 0.2;
            _0x5f8dbe.vy += _0x51f012.vy * 0.2;
          }
          _0x5f8dbe.vx *= this.friction;
          _0x5f8dbe.vy *= this.friction;
          _0x5f8dbe.x += _0x5f8dbe.vx;
          _0x5f8dbe.y += _0x5f8dbe.vy;
          _0x5e42cb *= 0.98;
        }
      };
      _0x723cd4.prototype.draw = function () {
        var _0x53efac = this.nodes[0].x;
        var _0x4ee8b3 = this.nodes[0].y;
        _0xd60099.beginPath();
        _0xd60099.moveTo(_0x53efac, _0x4ee8b3);
        for (var _0x2d973f = 1; _0x2d973f < this.nodes.length - 2; _0x2d973f++) {
          var _0x44d0ed = this.nodes[_0x2d973f];
          var _0x1dc319 = this.nodes[_0x2d973f + 1];
          _0x53efac = (_0x44d0ed.x + _0x1dc319.x) * 0.5;
          _0x4ee8b3 = (_0x44d0ed.y + _0x1dc319.y) * 0.5;
          _0xd60099.quadraticCurveTo(_0x44d0ed.x, _0x44d0ed.y, _0x53efac, _0x4ee8b3);
        }
        var _0x44d0ed = this.nodes[this.nodes.length - 2];
        var _0x1dc319 = this.nodes[this.nodes.length - 1];
        _0xd60099.quadraticCurveTo(_0x44d0ed.x, _0x44d0ed.y, _0x1dc319.x, _0x1dc319.y);
        _0xd60099.stroke();
        _0xd60099.closePath();
      };
      for (var _0x35df14 = 0; _0x35df14 < 20; _0x35df14++) {
        _0x1adef5.push(new _0x723cd4(0.4 + _0x35df14 / 20 * 0.025));
      }
      var _0x24365a = false;
      function _0xa3b241(_0x4f239e) {
        if (!_0x24365a) {
          _0x24365a = true;
        }
        _0xbac767.x = _0x4f239e.clientX || _0x4f239e.touches[0].pageX;
        _0xbac767.y = _0x4f239e.clientY || _0x4f239e.touches[0].pageY;
      }
      document.addEventListener("mousemove", _0xa3b241);
      document.addEventListener("touchmove", function (_0x24e948) {
        if (_0x24e948.touches.length > 0) {
          _0xa3b241(_0x24e948.touches[0]);
        }
      }, {
        passive: true
      });
      function _0x4dc20b() {
        if (_0xd60099.running) {
          _0xd60099.globalCompositeOperation = "source-over";
          _0xd60099.clearRect(0, 0, _0x339197.width, _0x339197.height);
          _0xd60099.globalCompositeOperation = "lighter";
          var _0x1243c7 = _0x1ea058.replace("#", "");
          if (_0x1243c7.length === 3) {
            _0x1243c7 = _0x1243c7.split("").map(function (_0x26331c) {
              return _0x26331c + _0x26331c;
            }).join("");
          }
          var _0x303c18 = parseInt(_0x1243c7.substring(0, 2), 16);
          var _0x2890fb = parseInt(_0x1243c7.substring(2, 4), 16);
          var _0x435f1f = parseInt(_0x1243c7.substring(4, 6), 16);
          _0xd60099.strokeStyle = "rgba(" + _0x303c18 + "," + _0x2890fb + "," + _0x435f1f + ",0.2)";
          _0xd60099.lineWidth = 1;
          for (var _0x2a5877 = 0; _0x2a5877 < _0x1adef5.length; _0x2a5877++) {
            _0x1adef5[_0x2a5877].update();
            _0x1adef5[_0x2a5877].draw();
          }
          _0xd60099.frame++;
        }
        requestAnimationFrame(_0x4dc20b);
      }
      _0x4dc20b();
      window.addEventListener("resize", function () {
        _0x339197.width = innerWidth - 20;
        _0x339197.height = innerHeight;
      });
      window._canvasOrbitDestroy = function () {
        _0x339197.remove();
        document.removeEventListener("mousemove", _0xa3b241);
      };
    })();
    window._cursorEffectDestroy = function () {
      if (window._canvasOrbitDestroy) {
        window._canvasOrbitDestroy();
      }
    };
  } else if (_0xe20e93 === "bubble") {
    var _0x15ef5b = document.createElement("canvas");
    _0x15ef5b.id = "cursor-fx";
    _0x15ef5b.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9990;";
    document.body.appendChild(_0x15ef5b);
    var _0x3903fd = _0x15ef5b.getContext("2d");
    _0x15ef5b.width = innerWidth;
    _0x15ef5b.height = innerHeight;
    window.addEventListener("resize", function () {
      _0x15ef5b.width = innerWidth;
      _0x15ef5b.height = innerHeight;
    });
    var _0x322d54 = [];
    function _0x1b5043(_0x138eda, _0x79bc3c) {
      _0x322d54.push({
        x: _0x138eda,
        y: _0x79bc3c,
        r: Math.random() * 4 + 2,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.8 - 0.4,
        life: 1
      });
    }
    document.addEventListener("mousemove", function (_0x2207fd) {
      if (_0x322d54.length < 60) {
        _0x1b5043(_0x2207fd.clientX, _0x2207fd.clientY);
      }
    });
    function _0x502e2e() {
      _0x3903fd.clearRect(0, 0, _0x15ef5b.width, _0x15ef5b.height);
      for (var _0x25c2f8 = _0x322d54.length - 1; _0x25c2f8 >= 0; _0x25c2f8--) {
        var _0x519312 = _0x322d54[_0x25c2f8];
        _0x519312.x += _0x519312.vx;
        _0x519312.y += _0x519312.vy;
        _0x519312.life -= 0.015;
        _0x519312.r = Math.max(0, _0x519312.r - 0.02);
        if (_0x519312.life <= 0) {
          _0x322d54.splice(_0x25c2f8, 1);
          continue;
        }
        _0x3903fd.globalAlpha = _0x519312.life * 0.6;
        _0x3903fd.strokeStyle = _0x4de597 || "#fff";
        _0x3903fd.lineWidth = 1;
        _0x3903fd.beginPath();
        _0x3903fd.arc(_0x519312.x, _0x519312.y, _0x519312.r, 0, Math.PI * 2);
        _0x3903fd.stroke();
      }
      _0x3903fd.globalAlpha = 1;
      requestAnimationFrame(_0x502e2e);
    }
    _0x502e2e();
    window._cursorEffectDestroy = function () {
      _0x15ef5b.remove();
    };
  } else if (_0xe20e93 === "emoji") {
    var _0x15ef5b = document.createElement("canvas");
    _0x15ef5b.id = "cursor-fx";
    _0x15ef5b.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9990;";
    document.body.appendChild(_0x15ef5b);
    var _0x3903fd = _0x15ef5b.getContext("2d");
    _0x15ef5b.width = innerWidth;
    _0x15ef5b.height = innerHeight;
    window.addEventListener("resize", function () {
      _0x15ef5b.width = innerWidth;
      _0x15ef5b.height = innerHeight;
    });
    var _0x56f402 = ["✨", "⭐", "💫", "🌟", "⚡"];
    var _0x1c34a3 = [];
    document.addEventListener("mousemove", function (_0x2024c5) {
      if (_0x1c34a3.length < 40 && Math.random() > 0.5) {
        _0x1c34a3.push({
          x: _0x2024c5.clientX,
          y: _0x2024c5.clientY,
          emoji: _0x56f402[Math.floor(Math.random() * _0x56f402.length)],
          vy: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 2,
          life: 1,
          size: Math.random() * 10 + 10
        });
      }
    });
    function _0x25317d() {
      _0x3903fd.clearRect(0, 0, _0x15ef5b.width, _0x15ef5b.height);
      for (var _0x45eade = _0x1c34a3.length - 1; _0x45eade >= 0; _0x45eade--) {
        var _0x20d320 = _0x1c34a3[_0x45eade];
        _0x20d320.x += _0x20d320.vx;
        _0x20d320.y += _0x20d320.vy;
        _0x20d320.life -= 0.02;
        if (_0x20d320.life <= 0) {
          _0x1c34a3.splice(_0x45eade, 1);
          continue;
        }
        _0x3903fd.globalAlpha = _0x20d320.life;
        _0x3903fd.font = _0x20d320.size + "px serif";
        _0x3903fd.fillText(_0x20d320.emoji, _0x20d320.x, _0x20d320.y);
      }
      _0x3903fd.globalAlpha = 1;
      requestAnimationFrame(_0x25317d);
    }
    _0x25317d();
    window._cursorEffectDestroy = function () {
      _0x15ef5b.remove();
    };
  } else if (_0xe20e93 === "fairydust") {
    var _0x15ef5b = document.createElement("canvas");
    _0x15ef5b.id = "cursor-fx";
    _0x15ef5b.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9990;";
    document.body.appendChild(_0x15ef5b);
    var _0x3903fd = _0x15ef5b.getContext("2d");
    _0x15ef5b.width = innerWidth;
    _0x15ef5b.height = innerHeight;
    window.addEventListener("resize", function () {
      _0x15ef5b.width = innerWidth;
      _0x15ef5b.height = innerHeight;
    });
    var _0x5c7e90 = _0x4de597 ? [_0x4de597] : ["#FE0000", "#FD8C00", "#FFE500", "#119F0B", "#0644B3", "#C22EDC"];
    var _0x498ab5 = [];
    document.addEventListener("mousemove", function (_0x4113ca) {
      if (_0x498ab5.length < 80) {
        _0x498ab5.push({
          x: _0x4113ca.clientX,
          y: _0x4113ca.clientY,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 2 + 1,
          life: 1,
          color: _0x5c7e90[Math.floor(Math.random() * _0x5c7e90.length)],
          size: Math.random() * 3 + 1
        });
      }
    });
    function _0x5747c0() {
      _0x3903fd.clearRect(0, 0, _0x15ef5b.width, _0x15ef5b.height);
      for (var _0x123fc5 = _0x498ab5.length - 1; _0x123fc5 >= 0; _0x123fc5--) {
        var _0x1152d6 = _0x498ab5[_0x123fc5];
        _0x1152d6.x += _0x1152d6.vx;
        _0x1152d6.y += _0x1152d6.vy;
        _0x1152d6.vy += 0.03;
        _0x1152d6.life -= 0.025;
        _0x1152d6.size = Math.max(0, _0x1152d6.size - 0.02);
        if (_0x1152d6.life <= 0) {
          _0x498ab5.splice(_0x123fc5, 1);
          continue;
        }
        _0x3903fd.globalAlpha = _0x1152d6.life;
        _0x3903fd.fillStyle = _0x1152d6.color;
        _0x3903fd.beginPath();
        _0x3903fd.arc(_0x1152d6.x, _0x1152d6.y, _0x1152d6.size, 0, Math.PI * 2);
        _0x3903fd.fill();
      }
      _0x3903fd.globalAlpha = 1;
      requestAnimationFrame(_0x5747c0);
    }
    _0x5747c0();
    window._cursorEffectDestroy = function () {
      _0x15ef5b.remove();
    };
  } else if (_0xe20e93 === "snowflake") {
    var _0x15ef5b = document.createElement("canvas");
    _0x15ef5b.id = "cursor-fx";
    _0x15ef5b.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9990;";
    document.body.appendChild(_0x15ef5b);
    var _0x3903fd = _0x15ef5b.getContext("2d");
    _0x15ef5b.width = innerWidth;
    _0x15ef5b.height = innerHeight;
    window.addEventListener("resize", function () {
      _0x15ef5b.width = innerWidth;
      _0x15ef5b.height = innerHeight;
    });
    var _0x12c600 = [];
    document.addEventListener("mousemove", function (_0x1a8b6e) {
      if (_0x12c600.length < 50 && Math.random() > 0.3) {
        _0x12c600.push({
          x: _0x1a8b6e.clientX,
          y: _0x1a8b6e.clientY,
          vx: (Math.random() - 0.5) * 2,
          vy: Math.random() * 2 + 1,
          life: 1,
          size: Math.random() * 8 + 8,
          rot: 0,
          rotSpeed: (Math.random() - 0.5) * 0.1
        });
      }
    });
    function _0x4f4f6e() {
      _0x3903fd.clearRect(0, 0, _0x15ef5b.width, _0x15ef5b.height);
      for (var _0x6c4242 = _0x12c600.length - 1; _0x6c4242 >= 0; _0x6c4242--) {
        var _0x5bfff7 = _0x12c600[_0x6c4242];
        _0x5bfff7.x += _0x5bfff7.vx;
        _0x5bfff7.y += _0x5bfff7.vy;
        _0x5bfff7.life -= 0.015;
        _0x5bfff7.rot += _0x5bfff7.rotSpeed;
        _0x5bfff7.vx += (Math.random() - 0.5) * 0.1;
        if (_0x5bfff7.life <= 0) {
          _0x12c600.splice(_0x6c4242, 1);
          continue;
        }
        _0x3903fd.globalAlpha = _0x5bfff7.life;
        _0x3903fd.font = _0x5bfff7.size + "px serif";
        _0x3903fd.save();
        _0x3903fd.translate(_0x5bfff7.x, _0x5bfff7.y);
        _0x3903fd.rotate(_0x5bfff7.rot);
        _0x3903fd.fillText("❄", 0, 0);
        _0x3903fd.restore();
      }
      _0x3903fd.globalAlpha = 1;
      requestAnimationFrame(_0x4f4f6e);
    }
    _0x4f4f6e();
    window._cursorEffectDestroy = function () {
      _0x15ef5b.remove();
    };
  } else if (_0xe20e93 === "rainbow") {
    var _0x15ef5b = document.createElement("canvas");
    _0x15ef5b.id = "cursor-fx";
    _0x15ef5b.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9990;";
    document.body.appendChild(_0x15ef5b);
    var _0x3903fd = _0x15ef5b.getContext("2d");
    _0x15ef5b.width = innerWidth;
    _0x15ef5b.height = innerHeight;
    window.addEventListener("resize", function () {
      _0x15ef5b.width = innerWidth;
      _0x15ef5b.height = innerHeight;
    });
    var _0x30e575 = [];
    var _0xd7b58f = _0x4de597 ? [_0x4de597] : ["#FE0000", "#FD8C00", "#FFE500", "#119F0B", "#0644B3", "#C22EDC"];
    document.addEventListener("mousemove", function (_0x478e43) {
      _0x30e575.push({
        x: _0x478e43.clientX,
        y: _0x478e43.clientY
      });
      if (_0x30e575.length > 20) {
        _0x30e575.shift();
      }
    });
    function _0x4e8a55() {
      _0x3903fd.clearRect(0, 0, _0x15ef5b.width, _0x15ef5b.height);
      if (_0x30e575.length > 1) {
        _0xd7b58f.forEach(function (_0x14ebf8, _0x365250) {
          _0x3903fd.beginPath();
          _0x3903fd.strokeStyle = _0x14ebf8;
          _0x3903fd.lineWidth = 3;
          _0x3903fd.lineCap = "round";
          _0x3903fd.lineJoin = "round";
          for (var _0x2319f0 = 0; _0x2319f0 < _0x30e575.length; _0x2319f0++) {
            var _0x2dc2a2 = _0x30e575[_0x2319f0];
            var _0x3c052e = _0x365250 * 3 - 9;
            if (_0x2319f0 === 0) {
              _0x3903fd.moveTo(_0x2dc2a2.x, _0x2dc2a2.y + _0x3c052e);
            } else {
              _0x3903fd.lineTo(_0x2dc2a2.x, _0x2dc2a2.y + _0x3c052e);
            }
          }
          _0x3903fd.globalAlpha = 0.7;
          _0x3903fd.stroke();
        });
      }
      _0x3903fd.globalAlpha = 1;
      requestAnimationFrame(_0x4e8a55);
    }
    _0x4e8a55();
    window._cursorEffectDestroy = function () {
      _0x15ef5b.remove();
    };
  } else if (_0xe20e93 === "ghost") {
    var _0x15ef5b = document.createElement("canvas");
    _0x15ef5b.id = "cursor-fx";
    _0x15ef5b.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9990;";
    document.body.appendChild(_0x15ef5b);
    var _0x3903fd = _0x15ef5b.getContext("2d");
    _0x15ef5b.width = innerWidth;
    _0x15ef5b.height = innerHeight;
    window.addEventListener("resize", function () {
      _0x15ef5b.width = innerWidth;
      _0x15ef5b.height = innerHeight;
    });
    var _0x50ef43 = [];
    document.addEventListener("mousemove", function (_0x2f5389) {
      _0x50ef43.push({
        x: _0x2f5389.clientX,
        y: _0x2f5389.clientY,
        life: 1
      });
      if (_0x50ef43.length > 30) {
        _0x50ef43.shift();
      }
    });
    function _0x3a46e3() {
      _0x3903fd.clearRect(0, 0, _0x15ef5b.width, _0x15ef5b.height);
      for (var _0x37f58d = _0x50ef43.length - 1; _0x37f58d >= 0; _0x37f58d--) {
        var _0xa5088e = _0x50ef43[_0x37f58d];
        _0xa5088e.life -= 0.03;
        if (_0xa5088e.life <= 0) {
          _0x50ef43.splice(_0x37f58d, 1);
          continue;
        }
        _0x3903fd.globalAlpha = _0xa5088e.life * 0.5;
        _0x3903fd.fillStyle = _0x4de597 || "#fff";
        _0x3903fd.beginPath();
        _0x3903fd.arc(_0xa5088e.x, _0xa5088e.y, _0xa5088e.life * 8, 0, Math.PI * 2);
        _0x3903fd.fill();
      }
      _0x3903fd.globalAlpha = 1;
      requestAnimationFrame(_0x3a46e3);
    }
    _0x3a46e3();
    window._cursorEffectDestroy = function () {
      _0x15ef5b.remove();
    };
  } else if (_0xe20e93 === "followdot") {
    var _0x15ef5b = document.createElement("canvas");
    _0x15ef5b.id = "cursor-fx";
    _0x15ef5b.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9990;";
    document.body.appendChild(_0x15ef5b);
    var _0x3903fd = _0x15ef5b.getContext("2d");
    _0x15ef5b.width = innerWidth;
    _0x15ef5b.height = innerHeight;
    window.addEventListener("resize", function () {
      _0x15ef5b.width = innerWidth;
      _0x15ef5b.height = innerHeight;
    });
    var _0x2ad1c2 = innerWidth / 2;
    var _0x3054da = innerHeight / 2;
    var _0x2bc5db = innerWidth / 2;
    var _0x43713c = innerHeight / 2;
    document.addEventListener("mousemove", function (_0x2097a1) {
      _0x2bc5db = _0x2097a1.clientX;
      _0x43713c = _0x2097a1.clientY;
    });
    function _0x30f091() {
      _0x3903fd.clearRect(0, 0, _0x15ef5b.width, _0x15ef5b.height);
      _0x2ad1c2 += (_0x2bc5db - _0x2ad1c2) * 0.1;
      _0x3054da += (_0x43713c - _0x3054da) * 0.1;
      var _0x46156e = _0x4de597 || "#ffffff";
      var _0x578d37 = _0x46156e.replace("#", "");
      if (_0x578d37.length === 3) {
        _0x578d37 = _0x578d37.split("").map(function (_0x5ad812) {
          return _0x5ad812 + _0x5ad812;
        }).join("");
      }
      var _0x1ce8d3 = parseInt(_0x578d37.substring(0, 2), 16) + "," + parseInt(_0x578d37.substring(2, 4), 16) + "," + parseInt(_0x578d37.substring(4, 6), 16);
      _0x3903fd.fillStyle = "rgba(" + _0x1ce8d3 + ",0.6)";
      _0x3903fd.beginPath();
      _0x3903fd.arc(_0x2ad1c2, _0x3054da, 8, 0, Math.PI * 2);
      _0x3903fd.fill();
      _0x3903fd.fillStyle = "rgba(" + _0x1ce8d3 + ",0.3)";
      _0x3903fd.beginPath();
      _0x3903fd.arc(_0x2ad1c2, _0x3054da, 14, 0, Math.PI * 2);
      _0x3903fd.fill();
      requestAnimationFrame(_0x30f091);
    }
    _0x30f091();
    window._cursorEffectDestroy = function () {
      _0x15ef5b.remove();
    };
  } else if (_0xe20e93 === "trailing") {
    var _0x15ef5b = document.createElement("canvas");
    _0x15ef5b.id = "cursor-fx";
    _0x15ef5b.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9990;";
    document.body.appendChild(_0x15ef5b);
    var _0x3903fd = _0x15ef5b.getContext("2d");
    _0x15ef5b.width = innerWidth;
    _0x15ef5b.height = innerHeight;
    window.addEventListener("resize", function () {
      _0x15ef5b.width = innerWidth;
      _0x15ef5b.height = innerHeight;
    });
    var _0x55d922 = [];
    document.addEventListener("mousemove", function (_0x57a75b) {
      _0x55d922.push({
        x: _0x57a75b.clientX,
        y: _0x57a75b.clientY
      });
      if (_0x55d922.length > 40) {
        _0x55d922.shift();
      }
    });
    function _0x656105() {
      _0x3903fd.clearRect(0, 0, _0x15ef5b.width, _0x15ef5b.height);
      if (_0x55d922.length > 1) {
        for (var _0x48c73 = 1; _0x48c73 < _0x55d922.length; _0x48c73++) {
          var _0x56d912 = _0x48c73 / _0x55d922.length;
          var _0x462eef = _0x4de597 || "#ffffff";
          var _0x1aacdd = _0x462eef.replace("#", "");
          if (_0x1aacdd.length === 3) {
            _0x1aacdd = _0x1aacdd.split("").map(function (_0x1de425) {
              return _0x1de425 + _0x1de425;
            }).join("");
          }
          var _0x7e1568 = parseInt(_0x1aacdd.substring(0, 2), 16) + "," + parseInt(_0x1aacdd.substring(2, 4), 16) + "," + parseInt(_0x1aacdd.substring(4, 6), 16);
          _0x3903fd.strokeStyle = "rgba(" + _0x7e1568 + "," + _0x56d912 * 0.6 + ")";
          _0x3903fd.lineWidth = _0x56d912 * 3;
          _0x3903fd.lineCap = "round";
          _0x3903fd.beginPath();
          _0x3903fd.moveTo(_0x55d922[_0x48c73 - 1].x, _0x55d922[_0x48c73 - 1].y);
          _0x3903fd.lineTo(_0x55d922[_0x48c73].x, _0x55d922[_0x48c73].y);
          _0x3903fd.stroke();
        }
      }
      requestAnimationFrame(_0x656105);
    }
    _0x656105();
    window._cursorEffectDestroy = function () {
      _0x15ef5b.remove();
    };
  } else if (_0xe20e93 === "sparking") {
    var _0x15ef5b = document.createElement("canvas");
    _0x15ef5b.id = "cursor-fx";
    var _0x2ecc42 = window.devicePixelRatio || 1;
    _0x15ef5b.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9990;";
    document.body.appendChild(_0x15ef5b);
    var _0x3903fd = _0x15ef5b.getContext("2d", {
      alpha: true
    });
    _0x15ef5b.width = innerWidth * _0x2ecc42;
    _0x15ef5b.height = innerHeight * _0x2ecc42;
    _0x3903fd.scale(_0x2ecc42, _0x2ecc42);
    window.addEventListener("resize", function () {
      _0x15ef5b.width = innerWidth * _0x2ecc42;
      _0x15ef5b.height = innerHeight * _0x2ecc42;
      _0x3903fd.scale(_0x2ecc42, _0x2ecc42);
    });
    var _0x5786da = [];
    function _0x237819(_0x4b382d, _0x53e47b) {
      this.x = _0x4b382d;
      this.y = _0x53e47b;
      this.size = 1 + Math.random() * 1.2;
      this.life = 500 + Math.random() * 400;
      this.birth = performance.now();
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.4;
    }
    _0x237819.prototype.draw = function (_0x7445fe) {
      var _0x50114f = _0x7445fe - this.birth;
      var _0x47db26 = 1 - _0x50114f / this.life;
      if (_0x47db26 <= 0) {
        return false;
      }
      this.x += this.vx;
      this.y += this.vy;
      _0x3903fd.globalAlpha = _0x47db26;
      _0x3903fd.fillStyle = _0x4de597 || "#fff";
      _0x3903fd.beginPath();
      _0x3903fd.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      _0x3903fd.fill();
      return true;
    };
    document.addEventListener("mousemove", function (_0x1615f2) {
      if (_0x5786da.length < 500) {
        _0x5786da.push(new _0x237819(_0x1615f2.clientX, _0x1615f2.clientY));
      }
    });
    function _0x260ba6(_0x39488a) {
      _0x3903fd.clearRect(0, 0, innerWidth, innerHeight);
      for (var _0x5c505e = _0x5786da.length - 1; _0x5c505e >= 0; _0x5c505e--) {
        if (!_0x5786da[_0x5c505e].draw(_0x39488a)) {
          _0x5786da.splice(_0x5c505e, 1);
        }
      }
      _0x3903fd.globalAlpha = 1;
      requestAnimationFrame(_0x260ba6);
    }
    requestAnimationFrame(_0x260ba6);
    window._cursorEffectDestroy = function () {
      _0x15ef5b.remove();
    };
  } else if (_0xe20e93 === "fluid") {
    var _0x15ef5b = document.createElement("canvas");
    _0x15ef5b.id = "cursor-fx";
    _0x15ef5b.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9990;";
    document.body.appendChild(_0x15ef5b);
    _0x15ef5b.width = innerWidth;
    _0x15ef5b.height = innerHeight;
    var _0x5cdef0 = _0x15ef5b.getContext("webgl", {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: false
    });
    if (!_0x5cdef0) {
      window._cursorEffectDestroy = function () {
        _0x15ef5b.remove();
      };
      return;
    }
    var _0x54d496 = "attribute vec2 a_position;void main(){gl_Position=vec4(a_position,0.0,1.0);}";
    var _0x49f816 = "precision mediump float;uniform float u_time;uniform vec2 u_resolution;uniform vec2 u_mouse;void main(){vec2 uv=gl_FragCoord.xy/u_resolution.xy;vec2 m=u_mouse/u_resolution;float d=distance(uv,m);float ripple=sin(d*30.0-u_time*3.0)*exp(-d*5.0)*0.3;gl_FragColor=vec4(vec3(ripple),abs(ripple)*0.8);}";
    function _0x5eab23(_0x31f650, _0x40b122) {
      var _0x1ae936 = _0x5cdef0.createShader(_0x31f650);
      _0x5cdef0.shaderSource(_0x1ae936, _0x40b122);
      _0x5cdef0.compileShader(_0x1ae936);
      return _0x1ae936;
    }
    var _0x31c411 = _0x5cdef0.createProgram();
    _0x5cdef0.attachShader(_0x31c411, _0x5eab23(_0x5cdef0.VERTEX_SHADER, _0x54d496));
    _0x5cdef0.attachShader(_0x31c411, _0x5eab23(_0x5cdef0.FRAGMENT_SHADER, _0x49f816));
    _0x5cdef0.linkProgram(_0x31c411);
    _0x5cdef0.useProgram(_0x31c411);
    var _0x3fe1dd = _0x5cdef0.createBuffer();
    _0x5cdef0.bindBuffer(_0x5cdef0.ARRAY_BUFFER, _0x3fe1dd);
    _0x5cdef0.bufferData(_0x5cdef0.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), _0x5cdef0.STATIC_DRAW);
    var _0x296da4 = _0x5cdef0.getAttribLocation(_0x31c411, "a_position");
    _0x5cdef0.enableVertexAttribArray(_0x296da4);
    _0x5cdef0.vertexAttribPointer(_0x296da4, 2, _0x5cdef0.FLOAT, false, 0, 0);
    var _0x61a122 = _0x5cdef0.getUniformLocation(_0x31c411, "u_time");
    var _0x459793 = _0x5cdef0.getUniformLocation(_0x31c411, "u_resolution");
    var _0x497e19 = _0x5cdef0.getUniformLocation(_0x31c411, "u_mouse");
    _0x5cdef0.uniform2f(_0x459793, _0x15ef5b.width, _0x15ef5b.height);
    _0x5cdef0.enable(_0x5cdef0.BLEND);
    _0x5cdef0.blendFunc(_0x5cdef0.SRC_ALPHA, _0x5cdef0.ONE_MINUS_SRC_ALPHA);
    var _0x2bc5db = innerWidth / 2;
    var _0x43713c = innerHeight / 2;
    document.addEventListener("mousemove", function (_0x540702) {
      _0x2bc5db = _0x540702.clientX;
      _0x43713c = innerHeight - _0x540702.clientY;
    });
    var _0x640bba = performance.now();
    function _0x3e4112() {
      _0x5cdef0.uniform1f(_0x61a122, (performance.now() - _0x640bba) / 1000);
      _0x5cdef0.uniform2f(_0x497e19, _0x2bc5db, _0x43713c);
      _0x5cdef0.clearColor(0, 0, 0, 0);
      _0x5cdef0.clear(_0x5cdef0.COLOR_BUFFER_BIT);
      _0x5cdef0.drawArrays(_0x5cdef0.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(_0x3e4112);
    }
    _0x3e4112();
    window.addEventListener("resize", function () {
      _0x15ef5b.width = innerWidth;
      _0x15ef5b.height = innerHeight;
      _0x5cdef0.viewport(0, 0, _0x15ef5b.width, _0x15ef5b.height);
      _0x5cdef0.uniform2f(_0x459793, _0x15ef5b.width, _0x15ef5b.height);
    });
    window._cursorEffectDestroy = function () {
      _0x15ef5b.remove();
    };
  }
}
function applyLayout(_0x32fae9) {
  if (!_0x32fae9) {
    return;
  }
  if (_0x32fae9.customFontUrl && _0x32fae9.customFontName) {
    const _0x1b6bb5 = new FontFace(_0x32fae9.customFontName, "url(" + _0x32fae9.customFontUrl + ")");
    _0x1b6bb5.load().then(function (_0x5ba5a6) {
      document.fonts.add(_0x5ba5a6);
      document.body.style.fontFamily = "'" + _0x32fae9.customFontName + "', sans-serif";
      document.documentElement.style.setProperty("--f-sans", "'" + _0x32fae9.customFontName + "', sans-serif");
      document.documentElement.style.setProperty("--f-serif", "'" + _0x32fae9.customFontName + "', sans-serif");
      document.documentElement.style.setProperty("--f-mono", "'" + _0x32fae9.customFontName + "', monospace");
    }).catch(function () {});
  }
  if (_0x32fae9.bgEffect === "plasma") {
    loadPlasmaEffect(_0x32fae9.plasmaColor || "#5c5c5c", _0x32fae9.plasmaSpeed || 0.5, _0x32fae9.plasmaOpacity || 0.9);
  } else if (_0x32fae9.bgEffect === "particles") {
    loadParticlesEffect();
  } else if (_0x32fae9.bgEffect === "noise") {
    loadNoiseEffect();
  } else if (_0x32fae9.bgEffect === "rain") {
    loadRainEffect();
  }
  if (_0x32fae9.cursorEffect && _0x32fae9.cursorEffect !== "none") {
    loadCursorEffect(_0x32fae9.cursorEffect, window._currentConfig?.GENERAL?.cursorEffectColor);
  }
  window._layoutConfig = _0x32fae9;
}
function applyStyleConfig(_0x1240fe) {
  if (!_0x1240fe) {
    return;
  }
  const _0x3a69f1 = document.documentElement;
  const _0x5ce58d = _0x1240fe.nameColor || "#ffffff";
  _0x3a69f1.style.setProperty("--nameColor", _0x5ce58d);
  const _0x4857cc = document.getElementById("userName");
  if (_0x4857cc) {
    _0x4857cc.style.color = _0x5ce58d;
  }
  const _0x14adac = _0x1240fe.bioColor || "rgba(255,255,255,0.85)";
  const _0x1ff31f = document.querySelector(".pronouns");
  if (_0x1ff31f) {
    _0x1ff31f.style.color = _0x14adac;
  }
  const _0x2217e9 = _0x1240fe.iconColor || "rgba(255,255,255,0.4)";
  document.querySelectorAll(".layout4-icons a").forEach(_0x34306c => _0x34306c.style.color = _0x2217e9);
  if (_0x1240fe.nameGlow && _0x4857cc) {
    _0x4857cc.style.textShadow = "0 0 16px " + _0x5ce58d;
  } else if (_0x4857cc) {
    _0x4857cc.style.textShadow = "none";
  }
  _0x3a69f1.style.setProperty("--primary-glow", _0x5ce58d);
}
function applyCustomSettings(_0x490352) {
  const _0x43f45f = document.documentElement;
  if (_0x490352.GENERAL) {
    if (_0x490352.GENERAL.cursorUrl) {
      let _0x1a8aa2 = document.getElementById("custom-cursor-style");
      if (!_0x1a8aa2) {
        _0x1a8aa2 = document.createElement("style");
        _0x1a8aa2.id = "custom-cursor-style";
        document.head.appendChild(_0x1a8aa2);
      }
      _0x1a8aa2.textContent = `
        body, html { cursor: url('${_0x490352.GENERAL.cursorUrl}'), auto; }
        a, button, [role="button"], .svg_item, .float-music-btn, .fm-controls i, .fm-play, .fm-bar, .fm-vol-bar, .dc-join-btn, .c-music-art-wrap, #overlay { cursor: pointer !important; }
      `;
    }
    if (_0x490352.GENERAL.customFont) {
      const _0xca77d6 = _0x490352.GENERAL.customFont.trim();
      let _0x2af3d7 = _0xca77d6;
      if (_0xca77d6 === "Custom" && _0x490352.GENERAL.customFontUrl) {
        _0x2af3d7 = "UploadedFont";
        let _0x3493c3 = document.getElementById("custom-upload-font-style");
        if (!_0x3493c3) {
          _0x3493c3 = document.createElement("style");
          _0x3493c3.id = "custom-upload-font-style";
          document.head.appendChild(_0x3493c3);
        }
        _0x3493c3.textContent = "\n                            @font-face { font-family: 'UploadedFont'; src: url('" + _0x490352.GENERAL.customFontUrl + "'); font-display: swap; }\n                            body, :not(i):not(.fa):not(.fas):not(.fab):not(.far):not(.fa-solid) { font-family: 'UploadedFont', sans-serif !important; }\n                        ";
      } else {
        let _0x5a27f6 = document.getElementById("custom-upload-font-style");
        if (_0x5a27f6) {
          _0x5a27f6.remove();
        }
        if (_0xca77d6.startsWith("http")) {
          _0x2af3d7 = "GeneralCustomFont";
          const _0x3bcd32 = new FontFace(_0x2af3d7, "url(" + _0xca77d6 + ")");
          _0x3bcd32.load().then(_0x448f84 => {
            document.fonts.add(_0x448f84);
          }).catch(_0x15c2dd => console.warn("General custom font load failed", _0x15c2dd));
        } else if (_0xca77d6 !== "Inter" && _0xca77d6 !== "Outfit") {
          const _0xd50771 = document.createElement("link");
          _0xd50771.href = "https://fonts.googleapis.com/css2?family=" + _0xca77d6.replace(/ /g, "+") + ":wght@300;400;500;600;700&display=swap";
          _0xd50771.rel = "stylesheet";
          document.head.appendChild(_0xd50771);
        } else {
          const _0x48ef88 = document.createElement("link");
          _0x48ef88.href = "https://fonts.googleapis.com/css2?family=" + _0xca77d6 + ":wght@300;400;500;600;700&display=swap";
          _0x48ef88.rel = "stylesheet";
          document.head.appendChild(_0x48ef88);
        }
      }
      let _0x5dab35 = document.getElementById("custom-font-style-layout4");
      if (!_0x5dab35) {
        _0x5dab35 = document.createElement("style");
        _0x5dab35.id = "custom-font-style-layout4";
        document.head.appendChild(_0x5dab35);
      }
      if (_0x2af3d7 === "Cormorant Garamond") {
        _0x5dab35.textContent = "#userName, .bio_description { font-family: '" + _0x2af3d7 + "', serif !important; }";
      } else {
        _0x5dab35.textContent = ":not(i) { font-family: '" + _0x2af3d7 + "', sans-serif !important; }";
      }
    }
    if (_0x490352.LAYOUT && _0x490352.LAYOUT.cursorEffect && _0x490352.LAYOUT.cursorEffect !== "none") {
      if (typeof loadCursorEffect === "function") {
        loadCursorEffect(_0x490352.LAYOUT.cursorEffect, _0x490352.GENERAL?.cursorEffectColor);
      }
    }
    if (_0x490352.GENERAL.cardOpacity !== undefined || _0x490352.GENERAL.cardBlur !== undefined) {
      const _0x2a87ee = _0x490352.GENERAL.cardOpacity !== undefined ? _0x490352.GENERAL.cardOpacity / 100 : 0.75;
      const _0x5da801 = _0x490352.GENERAL.cardBlur !== undefined ? _0x490352.GENERAL.cardBlur : 60;
      _0x43f45f.style.setProperty("--glass-core", "rgba(5, 3, 5, " + _0x2a87ee + ")");
      const _0xf33a98 = _0x2a87ee / 0.75 * 0.5;
      const _0x5e52ba = _0x2a87ee / 0.75 * 0.01;
      const _0x1798e6 = _0x2a87ee / 0.75 * 0.02;
      const _0x4ffc1f = _0x2a87ee * 33;
      const _0x20c4fd = 100 + _0x2a87ee / 0.75 * 140;
      let _0x13f7ad = document.getElementById("custom-card-bg-style");
      if (!_0x13f7ad) {
        _0x13f7ad = document.createElement("style");
        _0x13f7ad.id = "custom-card-bg-style";
        document.head.appendChild(_0x13f7ad);
      }
      _0x13f7ad.textContent = ".content-container.css_content_container, .dc-guild-card, .dc-activity-card { background: radial-gradient(ellipse at 85% 15%, color-mix(in srgb, var(--primary-glow) " + _0x4ffc1f + "%, transparent) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(255, 255, 255, " + _0x1798e6 + ") 0%, transparent 35%), linear-gradient(180deg, rgba(255, 255, 255, " + _0x5e52ba + ") 0%, rgba(0, 0, 0, " + _0xf33a98 + ") 100%), rgba(5, 3, 5, " + _0x2a87ee + ") !important; backdrop-filter: blur(" + _0x5da801 + "px) saturate(" + _0x20c4fd + "%) !important; -webkit-backdrop-filter: blur(" + _0x5da801 + "px) saturate(" + _0x20c4fd + "%) !important; }";
      const _0xfbc3a6 = _0x490352.WIDGET_WEATHER?.weatherOpacity !== undefined && _0x490352.WIDGET_WEATHER.weatherOpacity !== "" ? parseInt(_0x490352.WIDGET_WEATHER.weatherOpacity) : _0x2a87ee * 100;
      const _0x482bcf = _0x490352.WIDGETS?.rpcOpacity !== undefined && _0x490352.WIDGETS.rpcOpacity !== "" ? parseInt(_0x490352.WIDGETS.rpcOpacity) : _0x2a87ee * 100;
      const _0x43edaf = _0x490352.WIDGETS?.inviteOpacity !== undefined && _0x490352.WIDGETS.inviteOpacity !== "" ? parseInt(_0x490352.WIDGETS.inviteOpacity) : _0x2a87ee * 100;
      const _0x53322b = _0x490352.WIDGET_WEATHER?.theme === "light" ? "255, 255, 255" : "10, 7, 9";
      _0x13f7ad.textContent += "\n                        #weather-widget { background: rgba(" + _0x53322b + ", " + _0xfbc3a6 / 100 + ") !important; }\n                        #discord-presence { background: rgba(10, 7, 9, " + _0x482bcf / 100 + ") !important; }\n                        #discord-invite { background: rgba(10, 7, 9, " + _0x43edaf / 100 + ") !important; }\n                    ";
    }
    const _0xd3ec53 = document.getElementById("card3dWrapper");
    const _0x1b4ec9 = document.querySelector(".bio_content_container");
    const _0x466459 = document.getElementById("card3d");
    if (_0xd3ec53._mouseMoveHandler) {
      _0xd3ec53.removeEventListener("mousemove", _0xd3ec53._mouseMoveHandler);
      _0xd3ec53.removeEventListener("mouseleave", _0xd3ec53._mouseLeaveHandler);
    }
    if (!_0x490352.GENERAL || _0x490352.GENERAL.card3d !== false) {
      _0xd3ec53._mouseMoveHandler = _0x1f4a62 => {
        const _0x1ed953 = _0xd3ec53.getBoundingClientRect();
        const _0x5ea0d1 = _0x1f4a62.clientX - _0x1ed953.left;
        const _0x6b1b0e = _0x1f4a62.clientY - _0x1ed953.top;
        const _0x2bf50a = _0x1ed953.width / 2;
        const _0x317f58 = _0x1ed953.height / 2;
        const _0x5cc12d = (_0x6b1b0e - _0x317f58) / _0x317f58 * -10;
        const _0x26abcb = (_0x5ea0d1 - _0x2bf50a) / _0x2bf50a * 10;
        _0x1b4ec9.style.transform = "translateZ(0) rotateX(" + _0x5cc12d + "deg) rotateY(" + _0x26abcb + "deg)";
        const _0x3ce01d = _0x5ea0d1 / _0x1ed953.width * 100;
        const _0x40dac6 = _0x6b1b0e / _0x1ed953.height * 100;
        _0x466459.style.background = "\n                            radial-gradient(circle at " + _0x3ce01d + "% " + _0x40dac6 + "%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),\n                            radial-gradient(ellipse at 85% 15%, var(--primary-glow) 0%, transparent 45%),\n                            radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.02) 0%, transparent 35%),\n                            linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, rgba(0, 0, 0, 0.5) 100%),\n                            var(--glass-core)\n                        ";
      };
      _0xd3ec53._mouseLeaveHandler = () => {
        _0x1b4ec9.style.transform = "translateZ(0) rotateX(0deg) rotateY(0deg)";
        _0x466459.style.background = "\n                            radial-gradient(ellipse at 85% 15%, var(--primary-glow) 0%, transparent 45%),\n                            radial-gradient(circle at 15% 85%, rgba(255, 255, 255, 0.02) 0%, transparent 35%),\n                            linear-gradient(180deg, rgba(255, 255, 255, 0.01) 0%, rgba(0, 0, 0, 0.5) 100%),\n                            var(--glass-core)\n                        ";
      };
      _0xd3ec53.addEventListener("mousemove", _0xd3ec53._mouseMoveHandler);
      _0xd3ec53.addEventListener("mouseleave", _0xd3ec53._mouseLeaveHandler);
    } else {
      _0x1b4ec9.style.transform = "translateZ(0) rotateX(0deg) rotateY(0deg)";
    }
  }
  if (_0x490352.BORDER) {
    if (_0x490352.BORDER.radius !== undefined) {
      _0x43f45f.style.setProperty("--borderRadius", _0x490352.BORDER.radius + "px");
    }
    let _0xc0b2c9 = document.getElementById("custom-border-style");
    if (!_0xc0b2c9) {
      _0xc0b2c9 = document.createElement("style");
      _0xc0b2c9.id = "custom-border-style";
      document.head.appendChild(_0xc0b2c9);
    }
    let _0x3e73cb = "";
    if (_0x490352.BORDER.style === "solid") {
      _0x3e73cb += ".css_content_container, .dc-guild-card { border: " + (_0x490352.BORDER.width !== undefined ? _0x490352.BORDER.width : 1) + "px solid " + (_0x490352.BORDER.color || "#ffffff") + " !important; }";
      _0x3e73cb += ".avatar-img { border: " + (_0x490352.BORDER.width !== undefined ? _0x490352.BORDER.width : 2) + "px solid " + (_0x490352.BORDER.color || "rgba(255,255,255,0.1)") + " !important; }";
    } else if (_0x490352.BORDER.style === "shimmer") {
      const _0x4a3158 = _0x490352.BORDER.width !== undefined ? _0x490352.BORDER.width : 1;
      const _0x5abf1b = _0x490352.BORDER.radius !== undefined ? _0x490352.BORDER.radius : 24;
      const _0x457810 = _0x490352.BORDER.color || "rgba(255, 255, 255, 0.08)";
      const _0x3bac3f = _0x490352.BORDER.cardShimmerSpeed || 8;
      const _0x1156df = _0x490352.BORDER.avatarShimmerSpeed || 1;
      _0x3e73cb += "@property --shimmer-angle { syntax: '<angle>'; initial-value: 0deg; inherits: true; } ";
      _0x3e73cb += "@keyframes shimmer-spin { to { --shimmer-angle: 360deg; } } ";
      _0x3e73cb += ".css_content_container::before, .dc-guild-card::before { content: \"\"; position: absolute; inset: -" + _0x4a3158 + "px; border-radius: " + _0x5abf1b + "px; padding: " + _0x4a3158 + "px; background: conic-gradient(from var(--shimmer-angle), transparent 70%, " + _0x457810 + " 100%); -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0); -webkit-mask-composite: xor; mask-composite: exclude; pointer-events: none; animation: shimmer-spin " + _0x3bac3f + "s linear infinite; } ";
      _0x3e73cb += ".css_content_container, .dc-guild-card { border: " + _0x4a3158 + "px solid rgba(255,255,255,0.1) !important; transition: border-color 0.3s ease; } ";
      _0x3e73cb += ".css_content_container:hover, .dc-guild-card:hover { border-color: rgba(255,255,255,0.2) !important; } ";
      _0x3e73cb += ".avatar-wrapper { position: relative; display: inline-block; border-radius: 50%; } ";
      _0x3e73cb += ".avatar-img { border: 2px solid rgba(255,255,255,0.2) !important; }";
    }
    _0xc0b2c9.textContent = _0x3e73cb;
  }
  if (_0x490352.CUSTOM_CSS) {
    let _0x112ca1 = document.getElementById("user-custom-css");
    if (!_0x112ca1) {
      _0x112ca1 = document.createElement("style");
      _0x112ca1.id = "user-custom-css";
      document.head.appendChild(_0x112ca1);
    }
    _0x112ca1.textContent = _0x490352.CUSTOM_CSS;
  }
}
async function initApp() {
  try {
    let _0x5a8b55 = null;
    try {
      const _0x257a61 = await fetch("/api/config");
      if (_0x257a61.ok) {
        _0x5a8b55 = await _0x257a61.json();
      }
    } catch (_0xerr) {}
    if (!_0x5a8b55 && typeof CONFIG !== "undefined") {
      _0x5a8b55 = CONFIG;
    }
    if (_0x5a8b55) {
      window._currentConfig = _0x5a8b55;
      if (_0x5a8b55.WIDGET_CLOCK) {
        if (_0x5a8b55.WIDGET_CLOCK.enabled === false) {
          const _0x3f1892 = document.querySelector(".clock-widget");
          if (_0x3f1892) {
            _0x3f1892.style.display = "none";
          }
        }
        const _0x51f6ef = document.querySelector(".clock-location:not(#weather-loc)");
        if (_0x51f6ef) {
          _0x51f6ef.textContent = _0x5a8b55.WIDGET_CLOCK.location || "Saigon";
        }
        if (_0x5a8b55.WIDGET_CLOCK.theme === "light") {
          const _0x5e090f = document.querySelector(".clock-widget");
          if (_0x5e090f) {
            _0x5e090f.classList.add("clock-light");
          }
        }
      }
      if (_0x5a8b55.USER_ID) {
        USER_ID = _0x5a8b55.USER_ID;
      }
      if (_0x5a8b55.BACKGROUND_BLUR !== undefined) {
        window.BACKGROUND_BLUR = _0x5a8b55.BACKGROUND_BLUR;
      }
      if (_0x5a8b55.BACKGROUND_URL !== undefined) {
        BACKGROUND_URL = _0x5a8b55.BACKGROUND_URL;
      }
      if (BACKGROUND_URL) {
        window.applyBackground(BACKGROUND_URL);
      }
      if (_0x5a8b55.AVATAR_OVERRIDE !== undefined) {
        AVATAR_OVERRIDE = _0x5a8b55.AVATAR_OVERRIDE;
        if (AVATAR_OVERRIDE) {
          const _0x29289f = document.querySelector(".avatar-img");
          if (_0x29289f) {
            _0x29289f.src = AVATAR_OVERRIDE;
          }
        }
      }
      if (_0x5a8b55.NAME_OVERRIDE !== undefined) {
        NAME_OVERRIDE = _0x5a8b55.NAME_OVERRIDE;
      }
      const _0x36344a = document.getElementById("ov-name");
      if (_0x36344a) {
        _0x36344a.textContent = "@ " + (NAME_OVERRIDE || "bio").toLowerCase();
      }
      window.tt = "@" + (NAME_OVERRIDE || "bio").toLowerCase();
      window.ti = 0;
      window.td = false;
      if (_0x5a8b55.CUSTOM_SOCIALS) {
        CUSTOM_SOCIALS = _0x5a8b55.CUSTOM_SOCIALS;
      }
      if (_0x5a8b55.CUSTOM_BIOS) {
        CUSTOM_BIOS = _0x5a8b55.CUSTOM_BIOS;
      }
      if (_0x5a8b55.LOCATION_TEXT !== undefined) {
        const _0x5a4968 = document.getElementById("bottomLocation");
        if (_0x5a4968) {
          _0x5a4968.textContent = _0x5a8b55.LOCATION_TEXT + ".";
        }
      }
      if (_0x5a8b55.WIDGET_WEATHER) {
        if (_0x5a8b55.WIDGET_WEATHER.enabled) {
          startWeatherAutoRefresh(_0x5a8b55.WIDGET_WEATHER);
        } else {
          document.getElementById("weather-widget").style.display = "none";
        }
      } else {
        document.getElementById("weather-widget").style.display = "none";
      }
      if (_0x5a8b55.DISCORD_RPC && _0x5a8b55.DISCORD_RPC.enabled) {
        fetchDiscordPresence(_0x5a8b55.DISCORD_RPC);
      } else {
        const _0x197a6c = document.getElementById("discord-rpc");
        if (_0x197a6c) {
          _0x197a6c.style.display = "none";
        }
      }
      if (_0x5a8b55.DISCORD_INVITE && _0x5a8b55.DISCORD_INVITE.enabled) {
        fetchDiscordInvite(_0x5a8b55.DISCORD_INVITE);
      } else {
        const _0x40bb7b = document.getElementById("discord-invite");
        if (_0x40bb7b) {
          _0x40bb7b.style.display = "none";
        }
      }
      fetchDiscordGuildCard(_0x5a8b55.DISCORD_GUILD_CARD);
      if (_0x5a8b55.DISCORD_LANYARD && _0x5a8b55.DISCORD_LANYARD.enabled) {
        fetchDiscordLanyard(_0x5a8b55.DISCORD_LANYARD);
        connectLanyardWS(_0x5a8b55.DISCORD_LANYARD);
      }
      if (_0x5a8b55.LAYOUT) {
        applyLayout(_0x5a8b55.LAYOUT);
      }
      if (_0x5a8b55.STYLE) {
        applyStyleConfig(_0x5a8b55.STYLE);
      }
      applyCustomSettings(_0x5a8b55);
      if (_0x5a8b55.MUSIC_RANDOM !== undefined) {
        window.isMusicRandom = _0x5a8b55.MUSIC_RANDOM;
      }
      if (_0x5a8b55.MUSIC_ENABLE !== undefined) {
        window._musicEnable = _0x5a8b55.MUSIC_ENABLE;
      }
      if (_0x5a8b55.MUSIC_WIDGET !== undefined) {
        window._musicWidget = _0x5a8b55.MUSIC_WIDGET;
      }
      if (window._musicEnable && _0x5a8b55.CUSTOM_MUSIC && _0x5a8b55.CUSTOM_MUSIC.length > 0) {
        window.pl = _0x5a8b55.CUSTOM_MUSIC;
        window.ci = pickInitialTrackIndex(window.pl, _0x5a8b55.MUSIC_DEFAULT_SRC);
        window.loadTrack(window.ci, false);
      }
      if (window._musicWidget) {
        if (overlay.style.opacity === "0" || overlay.style.display === "none") {
          document.getElementById("musicWidget").style.display = "flex";
        }
      } else {
        document.getElementById("musicWidget").style.display = "none";
      }
    }
  } catch (_0x10bef9) {
    alert("Config error: " + _0x10bef9.message);
    console.error("Failed to load config", _0x10bef9);
  }
  try {
    renderSocials();
  } catch (_0x5285e1) {
    alert("Socials error: " + _0x5285e1.message);
  }
  try {
    fetchPresence();
  } catch (_0x19f914) {
    alert("Presence error: " + _0x19f914.message);
  }
  try {
    initTypewriter();
  } catch (_0x3bcd2c) {
    alert("Typewriter error: " + _0x3bcd2c.message);
  }
  setInterval(async () => {
    try {
      const _0x2e1c1b = await fetch("/api/config");
      if (_0x2e1c1b.ok) {
        const _0x44a6e3 = await _0x2e1c1b.json();
        window._currentConfig = _0x44a6e3;
        let _0x2bb650 = false;
        if (_0x44a6e3.BACKGROUND_URL !== window.BACKGROUND_URL) {
          window.BACKGROUND_URL = _0x44a6e3.BACKGROUND_URL;
          _0x2bb650 = true;
        }
        if (_0x44a6e3.BACKGROUND_BLUR !== undefined && _0x44a6e3.BACKGROUND_BLUR !== window.BACKGROUND_BLUR) {
          window.BACKGROUND_BLUR = _0x44a6e3.BACKGROUND_BLUR;
          _0x2bb650 = true;
        }
        if (_0x2bb650 && window.applyBackground) {
          window.applyBackground(window.BACKGROUND_URL);
        }
        if (_0x44a6e3.STYLE) {
          applyStyleConfig(_0x44a6e3.STYLE);
        }
        const _0x335621 = _0x44a6e3.WIDGET_WEATHER || {};
        if (_0x335621.enabled) {
          startWeatherAutoRefresh(_0x335621);
        } else {
          if (window._weatherInterval) {
            clearInterval(window._weatherInterval);
            window._weatherInterval = null;
          }
          document.getElementById("weather-widget").style.display = "none";
        }
        fetchDiscordGuildCard(_0x44a6e3.DISCORD_GUILD_CARD);
        if (_0x44a6e3.LOCATION_TEXT !== undefined) {
          const _0x392876 = document.querySelector(".clock-location:not(#weather-loc)");
          const _0x1a1f04 = document.getElementById("bottomLocation");
          if (_0x392876) {
            _0x392876.textContent = _0x44a6e3.LOCATION_TEXT;
          }
          if (_0x1a1f04) {
            _0x1a1f04.textContent = _0x44a6e3.LOCATION_TEXT + ".";
          }
        }
        if (_0x44a6e3.LAYOUT) {
          const _0x1d5418 = window._layoutConfig?.bgEffect;
          if (_0x1d5418 !== _0x44a6e3.LAYOUT.bgEffect || _0x44a6e3.LAYOUT.plasmaColor !== window._layoutConfig?.plasmaColor) {
            if (document.getElementById("plasma-canvas")) {
              document.getElementById("plasma-canvas").remove();
            }
            if (document.querySelector(".particles-container")) {
              document.querySelector(".particles-container").remove();
            }
            if (document.querySelector(".noise-overlay")) {
              document.querySelector(".noise-overlay").remove();
            }
            if (document.getElementById("rain-canvas")) {
              document.getElementById("rain-canvas").remove();
            }
            if (_0x44a6e3.LAYOUT.bgEffect === "plasma") {
              loadPlasmaEffect(_0x44a6e3.LAYOUT.plasmaColor || "#5c5c5c", _0x44a6e3.LAYOUT.plasmaSpeed || 0.5, _0x44a6e3.LAYOUT.plasmaOpacity || 0.9);
            } else if (_0x44a6e3.LAYOUT.bgEffect === "particles") {
              loadParticlesEffect();
            } else if (_0x44a6e3.LAYOUT.bgEffect === "noise") {
              loadNoiseEffect();
            } else if (_0x44a6e3.LAYOUT.bgEffect === "rain") {
              loadRainEffect();
            }
          }
          if (_0x44a6e3.LAYOUT.nameEffect !== window._layoutConfig?.nameEffect) {
            window._nameEffectActive = false;
            const _0xd58161 = document.getElementById("userName");
            if (_0xd58161) {
              _0xd58161.innerHTML = _0xd58161.textContent;
              _0xd58161.style.animation = "";
              _0xd58161.style.webkitTextFillColor = "transparent";
              _0xd58161.style.background = "linear-gradient(135deg, #ffffff 10%, var(--nameColor, #ffe4f4) 55%, var(--primary-glow) 100%)";
              _0xd58161.style.webkitBackgroundClip = "text";
              _0xd58161.style.backgroundClip = "text";
            }
            applyNameEffect(_0x44a6e3.LAYOUT.nameEffect);
          }
          window._layoutConfig = _0x44a6e3.LAYOUT;
        }
        if (_0x44a6e3.MUSIC_ENABLE !== undefined) {
          window._musicEnable = _0x44a6e3.MUSIC_ENABLE;
          if (!window._musicEnable) {
            const _0x338df3 = document.getElementById("audio");
            if (_0x338df3 && !_0x338df3.paused) {
              _0x338df3.pause();
            }
          }
        }
        if (_0x44a6e3.MUSIC_WIDGET !== undefined) {
          window._musicWidget = _0x44a6e3.MUSIC_WIDGET;
          if (!window._musicWidget) {
            document.getElementById("musicWidget").style.display = "none";
          } else if (_0x44a6e3.CUSTOM_MUSIC && _0x44a6e3.CUSTOM_MUSIC.length > 0) {
            document.getElementById("musicWidget").style.display = "flex";
          }
        }
        let _0x35c1ff = false;
        if (_0x44a6e3.CUSTOM_MUSIC && _0x44a6e3.CUSTOM_MUSIC.length > 0) {
          const _0x21832 = JSON.stringify(window.pl);
          const _0x4d892c = JSON.stringify(_0x44a6e3.CUSTOM_MUSIC);
          if (_0x21832 !== _0x4d892c) {
            window.pl = _0x44a6e3.CUSTOM_MUSIC;
            _0x35c1ff = true;
          }
        }
        if (_0x35c1ff && window._musicEnable) {
          window.ci = pickInitialTrackIndex(window.pl, _0x44a6e3.MUSIC_DEFAULT_SRC);
          window.loadTrack(window.ci, false);
        }
      }
    } catch (_0x4e8c94) {}
  }, 15000);
}
window.tt = "@bio";
window.ti = 0;
window.td = false;
function animT() {
  document.title = window.td ? window.tt.substring(0, window.ti--) : window.tt.substring(0, ++window.ti);
  if (!window.td && window.ti === window.tt.length) {
    window.td = true;
    setTimeout(animT, 2200);
    return;
  }
  if (window.td && window.ti === 0) {
    window.td = false;
    setTimeout(animT, 600);
    return;
  }
  setTimeout(animT, 340);
}
animT();

const audio = document.getElementById("audio");
if (audio) {
  audio.volume = 0.5;
}

window.pl = (typeof CONFIG !== "undefined" && CONFIG.CUSTOM_MUSIC && CONFIG.CUSTOM_MUSIC.length > 0) ? CONFIG.CUSTOM_MUSIC : [];
window.isMusicRandom = typeof CONFIG !== "undefined" && CONFIG.MUSIC_RANDOM !== undefined ? CONFIG.MUSIC_RANDOM : false;

function pickInitialTrackIndex(_0x397424, _0xd208b1) {
  if (_0xd208b1 && Array.isArray(_0x397424)) {
    const _0x538172 = _0x397424.findIndex(_0x1fe625 => _0x1fe625 && _0x1fe625.src === _0xd208b1);
    if (_0x538172 !== -1) {
      return _0x538172;
    }
  }
  if (window.isMusicRandom && Array.isArray(_0x397424) && _0x397424.length > 0) {
    return Math.floor(Math.random() * _0x397424.length);
  } else {
    return 0;
  }
}

window.ci = pickInitialTrackIndex(window.pl, typeof CONFIG !== "undefined" ? CONFIG.MUSIC_DEFAULT_SRC : "");

function syncPlayUI() {
  const _0x48de7b = document.getElementById("playBtn");
  const _0x512f7b = document.getElementById("audio-thumb");
  if (!_0x48de7b || !_0x512f7b || !audio) {
    return;
  }
  const _0x1f3b90 = "<i class=\"fa-solid fa-play\"></i>";
  const _0x44edba = "<i class=\"fa-solid fa-pause\"></i>";
  if (!audio.paused) {
    _0x48de7b.innerHTML = _0x44edba;
    _0x512f7b.classList.add("spin");
  } else {
    _0x48de7b.innerHTML = _0x1f3b90;
    _0x512f7b.classList.remove("spin");
  }
}

function tryPlay() {
  try {
    if ((!window.pl || window.pl.length === 0) && typeof CONFIG !== "undefined" && CONFIG.CUSTOM_MUSIC) {
      window.pl = CONFIG.CUSTOM_MUSIC;
    }
    if (audio && window.pl && window.pl.length > 0 && (!audio.src || audio.src === "" || audio.src === window.location.href)) {
      if (typeof window.ci === "undefined") window.ci = 0;
      window.loadTrack(window.ci, false);
    }
    if (audio) {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.then(syncPlayUI).catch(err => {
          console.warn("audio.play failed:", err);
          syncPlayUI();
        });
      } else {
        syncPlayUI();
      }
    }
  } catch (err) {
    console.error("tryPlay error:", err);
    syncPlayUI();
  }
}

window.togglePlay = function () {
  if (audio && audio.paused) {
    tryPlay();
  } else if (audio) {
    audio.pause();
  }
};

window.loadTrack = function (_0x506236, _0x25ea2b) {
  if (!window.pl || !window.pl[_0x506236]) {
    return;
  }
  const _0x2f9765 = window.pl[_0x506236];
  if (audio) audio.src = _0x2f9765.src;
  const titleEl = document.getElementById("audio-title");
  const thumbEl = document.getElementById("audio-thumb");
  if (titleEl) titleEl.textContent = _0x2f9765.title || "Unknown";
  if (thumbEl) thumbEl.src = _0x2f9765.cover || "https://i.imgur.com/8Q9Qg3L.png";
  const _0x8dda37 = document.getElementById("curTime");
  const _0x5b1627 = document.getElementById("durTime");
  if (_0x8dda37) _0x8dda37.textContent = "0:00";
  if (_0x5b1627) _0x5b1627.textContent = "0:00";
  const pfill = document.getElementById("pfill");
  if (pfill) pfill.style.width = "0%";
  if (_0x25ea2b) {
    tryPlay();
  }
};

function fmt(_0x3289f4) {
  if (!isFinite(_0x3289f4) || _0x3289f4 < 0) {
    return "0:00";
  }
  const _0x935546 = Math.floor(_0x3289f4 / 60);
  const _0x1c35cf = Math.floor(_0x3289f4 % 60);
  return _0x935546 + ":" + (_0x1c35cf < 10 ? "0" : "") + _0x1c35cf;
}

initApp();
window.pNext = function () {
  window.ci = window.isMusicRandom ? Math.floor(Math.random() * window.pl.length) : (window.ci + 1) % window.pl.length;
  window.loadTrack(window.ci, true);
};
window.pPrev = function () {
  window.ci = window.isMusicRandom ? Math.floor(Math.random() * window.pl.length) : (window.ci - 1 + window.pl.length) % window.pl.length;
  window.loadTrack(window.ci, true);
};
window.seekTrack = function (_0x61c20d) {
  const _0x13c534 = document.getElementById("pbar");
  if (!_0x13c534 || !audio.duration) {
    return;
  }
  const _0x1c3d65 = _0x13c534.getBoundingClientRect();
  let _0x20ecf1 = _0x61c20d.clientX;
  if (_0x61c20d.touches && _0x61c20d.touches.length > 0) {
    _0x20ecf1 = _0x61c20d.touches[0].clientX;
  }
  let _0x5a40d5 = (_0x20ecf1 - _0x1c3d65.left) / _0x1c3d65.width;
  if (_0x5a40d5 < 0) {
    _0x5a40d5 = 0;
  }
  if (_0x5a40d5 > 1) {
    _0x5a40d5 = 1;
  }
  audio.currentTime = _0x5a40d5 * audio.duration;
};
window.seekVol = function (_0x49c4f9) {
  const _0x34bb3b = document.getElementById("vbar");
  if (!_0x34bb3b) {
    return;
  }
  const _0x42a57c = _0x34bb3b.getBoundingClientRect();
  let _0x4e8eb7 = _0x49c4f9.clientX;
  if (_0x49c4f9.touches && _0x49c4f9.touches.length > 0) {
    _0x4e8eb7 = _0x49c4f9.touches[0].clientX;
  }
  let _0x251c0d = (_0x4e8eb7 - _0x42a57c.left) / _0x42a57c.width;
  if (_0x251c0d < 0) {
    _0x251c0d = 0;
  }
  if (_0x251c0d > 1) {
    _0x251c0d = 1;
  }
  audio.volume = _0x251c0d;
  document.getElementById("vfill").style.width = _0x251c0d * 100 + "%";
  const _0x595246 = document.getElementById("volIcon");
  if (_0x595246) {
    if (_0x251c0d === 0) {
      _0x595246.className = "fa-solid fa-volume-xmark";
    } else if (_0x251c0d < 0.5) {
      _0x595246.className = "fa-solid fa-volume-low";
    } else {
      _0x595246.className = "fa-solid fa-volume-high";
    }
  }
};
let isDraggingVol = false;
let isDraggingProgress = false;
document.getElementById("vbar").addEventListener("mousedown", _0x30ed4a => {
  _0x30ed4a.preventDefault();
  isDraggingVol = true;
  window.seekVol(_0x30ed4a);
});
document.getElementById("vbar").addEventListener("touchstart", _0x5b07c2 => {
  isDraggingVol = true;
  window.seekVol(_0x5b07c2);
}, {
  passive: true
});
document.getElementById("pbar").addEventListener("mousedown", _0x241eb3 => {
  _0x241eb3.preventDefault();
  isDraggingProgress = true;
  window.seekTrack(_0x241eb3);
});
document.getElementById("pbar").addEventListener("touchstart", _0x2f4a56 => {
  isDraggingProgress = true;
  window.seekTrack(_0x2f4a56);
}, {
  passive: true
});
window.addEventListener("mousemove", _0x234be8 => {
  if (isDraggingVol || isDraggingProgress) {
    _0x234be8.preventDefault();
  }
  if (isDraggingVol) {
    window.seekVol(_0x234be8);
  }
  if (isDraggingProgress) {
    window.seekTrack(_0x234be8);
  }
});
window.addEventListener("touchmove", _0x4d09da => {
  if (isDraggingVol) {
    window.seekVol(_0x4d09da);
  }
  if (isDraggingProgress) {
    window.seekTrack(_0x4d09da);
  }
}, {
  passive: true
});
window.addEventListener("mouseup", () => {
  isDraggingVol = false;
  isDraggingProgress = false;
});
window.addEventListener("touchend", () => {
  isDraggingVol = false;
  isDraggingProgress = false;
});
audio.addEventListener("play", syncPlayUI);
audio.addEventListener("pause", syncPlayUI);
audio.addEventListener("ended", pNext);
audio.addEventListener("timeupdate", () => {
  const _0x5a21c2 = document.getElementById("curTime");
  const _0x102ae4 = document.getElementById("durTime");
  const _0x2b86f9 = document.getElementById("pfill");
  if (_0x2b86f9) {
    _0x2b86f9.style.width = (audio.currentTime / audio.duration || 0) * 100 + "%";
  }
  if (_0x5a21c2) {
    _0x5a21c2.textContent = fmt(audio.currentTime);
  }
  if (_0x102ae4) {
    _0x102ae4.textContent = fmt(audio.duration || 0);
  }
});
(function () {
  var _0xd59cac = document.createElement("div");
  _0xd59cac.style.cssText = "position:fixed;top:-90px;left:50%;transform:translateX(-50%);z-index:99999;background:rgba(6,8,7,0.97);border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:12px 20px;display:flex;align-items:center;gap:11px;box-shadow:0 16px 48px rgba(0,0,0,.7);backdrop-filter:blur(20px);transition:top .45s cubic-bezier(.34,1.2,.64,1);min-width:230px;max-width:320px;font-family:Outfit,sans-serif;white-space:nowrap;";
  var _0x480d39 = document.createElement("span");
  _0x480d39.style.cssText = "font-size:1rem;flex-shrink:0;";
  var _0x340381 = document.createElement("div");
  var _0x5303e0 = document.createElement("div");
  _0x5303e0.style.cssText = "font-size:.8rem;font-weight:600;color:#fff;";
  var _0x3b225b = document.createElement("div");
  _0x3b225b.style.cssText = "font-size:.72rem;color:rgba(255,255,255,.35);margin-top:2px;font-family:Geist Mono,monospace;";
  _0x340381.appendChild(_0x5303e0);
  _0x340381.appendChild(_0x3b225b);
  _0xd59cac.appendChild(_0x480d39);
  _0xd59cac.appendChild(_0x340381);
  var _0x6bed34 = null;
  window.showToast = function (_0x37629a) {
    clearTimeout(_0x6bed34);
    if (_0x37629a === "loading") {
      _0x480d39.textContent = "⏳";
      _0x5303e0.textContent = "Not ready yet";
      _0x3b225b.textContent = "Please wait...";
    } else if (_0x37629a === "copied") {
      _0x480d39.textContent = "✦";
      _0x5303e0.textContent = "Copied";
      _0x3b225b.textContent = "Username copied.";
    } else {
      _0x480d39.textContent = "◆";
      _0x5303e0.textContent = "Access denied";
      _0x3b225b.textContent = "Developer tools are disabled.";
    }
    _0xd59cac.style.top = "20px";
    _0x6bed34 = setTimeout(function () {
      _0xd59cac.style.top = "-90px";
    }, 3000);
  };
  document.addEventListener("DOMContentLoaded", function () {
    document.body.appendChild(_0xd59cac);
  });
  document.addEventListener("contextmenu", function (_0x390898) {
    _0x390898.preventDefault();
    showToast("block");
  });
  document.addEventListener("keydown", function (_0x1fda57) {
    if (_0x1fda57.key === "F12" || _0x1fda57.ctrlKey && _0x1fda57.shiftKey && ["I", "J", "C", "K"].includes(_0x1fda57.key.toUpperCase()) || _0x1fda57.ctrlKey && _0x1fda57.key.toUpperCase() === "U") {
      _0x1fda57.preventDefault();
      _0x1fda57.stopPropagation();
      showToast("block");
      return false;
    }
    if (_0x1fda57.ctrlKey && _0x1fda57.key.toLowerCase() === "s") {
      _0x1fda57.preventDefault();
      return false;
    }
    if (_0x1fda57.ctrlKey && _0x1fda57.key.toLowerCase() === "p") {
      _0x1fda57.preventDefault();
      return false;
    }
  });
  var _0x26e11d = false;
  var _0x575a6f = 160;
  var _0x2c4e20 = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || "ontouchstart" in window;
  if (!_0x2c4e20) {
    setInterval(function () {
      var _0x12a588 = window.outerWidth - window.innerWidth;
      var _0x59c34f = window.outerHeight - window.innerHeight;
      if ((_0x12a588 > _0x575a6f || _0x59c34f > _0x575a6f) && !_0x26e11d) {
        _0x26e11d = true;
        showToast("block");
      } else if (_0x12a588 <= _0x575a6f && _0x59c34f <= _0x575a6f) {
        _0x26e11d = false;
      }
    }, 900);
    setInterval(function () {
      var _0x4fde86 = new Date();
      (function () {}).constructor("debugger")();
      if (new Date() - _0x4fde86 > 300 && !_0x26e11d) {
        _0x26e11d = true;
        showToast("block");
      }
    }, 2500);
  }
  Object.defineProperty(window, "_phantom", {
    get: function () {
      showToast("block");
    }
  });
  window.addEventListener("devtoolschange", function (_0x2e9584) {
    if (_0x2e9584.detail.open) {
      showToast("block");
    }
  });
})();
(function () {
  const _0x19abbb = document.querySelector(".float-music-btn");
  const _0x15d724 = document.getElementById("musicPanel");
  if (!_0x19abbb || !_0x15d724) {
    return;
  }
  let _0x160927 = false;
  let _0x10c15c = false;
  let _0x4da406 = null;
  function _0x29a72f() {
    if (!_0x160927 && !_0x10c15c) {
      _0x15d724.classList.remove("active");
    }
  }
  _0x19abbb.addEventListener("mouseenter", () => {
    _0x10c15c = true;
    if (_0x4da406) {
      clearTimeout(_0x4da406);
    }
    if (!_0x160927) {
      _0x15d724.classList.add("active");
    }
  });
  _0x19abbb.addEventListener("mouseleave", () => {
    _0x10c15c = false;
    _0x4da406 = setTimeout(_0x29a72f, 150);
  });
  _0x15d724.addEventListener("mouseenter", () => {
    _0x10c15c = true;
    if (_0x4da406) {
      clearTimeout(_0x4da406);
    }
    if (!_0x160927) {
      _0x15d724.classList.add("active");
    }
  });
  _0x15d724.addEventListener("mouseleave", () => {
    _0x10c15c = false;
    _0x4da406 = setTimeout(_0x29a72f, 150);
  });
  _0x19abbb.addEventListener("click", _0x2559ff => {
    _0x2559ff.preventDefault();
    _0x160927 = !_0x160927;
    if (_0x160927) {
      _0x15d724.classList.add("active");
    } else if (!_0x10c15c) {
      _0x15d724.classList.remove("active");
    }
  });
})();

(function initGlobalAutoPlay() {
  function startMusicOnUserGesture() {
    if (typeof audio !== "undefined" && audio && audio.paused) {
      tryPlay();
    }
    document.removeEventListener("click", startMusicOnUserGesture);
    document.removeEventListener("touchstart", startMusicOnUserGesture);
    document.removeEventListener("keydown", startMusicOnUserGesture);
  }
  document.addEventListener("click", startMusicOnUserGesture);
  document.addEventListener("touchstart", startMusicOnUserGesture, { passive: true });
  document.addEventListener("keydown", startMusicOnUserGesture);

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(tryPlay, 300);
  } else {
    document.addEventListener("DOMContentLoaded", () => setTimeout(tryPlay, 300));
  }
})();