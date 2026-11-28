/* Desktop navigation, local clock and ambient light. Profile data stays in config.js. */
(() => {
  'use strict';
  const config = typeof CONFIG !== 'undefined' ? CONFIG : {};
  const name = config.NAME_OVERRIDE || 'Profile';
  const body = document.body;
  const audioEl = document.getElementById('audio');
  const nav = document.querySelector('.desktop-nav');
  const tabs = [...nav.querySelectorAll('[data-page]')];
  const indicator = document.getElementById('navIndicator');
  const musicButtons = [document.getElementById('nowPlaying')];
  const panels = [...document.querySelectorAll('.scene-panel')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activePage = 'profile';
  let scrollFrame = 0;
  let scrollWatchFrame = 0;
  let toastTimer;
  // Start the explicitly requested light animation on every visit. Only the
  // on-page pause control stops it; OS preferences still apply to page scrolling.
  let motionPaused = false;

  document.getElementById('desktopBrand').textContent = name;
  document.getElementById('sceneSignature').replaceChildren(document.createTextNode(name), Object.assign(document.createElement('span'), { textContent: '.' }));
  document.getElementById('desktopLocation').textContent = `${config.LOCATION_TEXT || 'Saigon'}, VN`;

  function updateSceneClock() {
    const now = new Date();
    const options = { timeZone: config.WIDGET_CLOCK?.timezone || 'Asia/Ho_Chi_Minh' };
    document.getElementById('sceneTime').textContent = new Intl.DateTimeFormat('en-GB', { ...options, hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
    document.getElementById('sceneDate').textContent = new Intl.DateTimeFormat('en-US', { ...options, weekday: 'long', month: 'long', day: 'numeric' }).format(now);
  }
  updateSceneClock();
  setInterval(updateSceneClock, 1000);

  function placeIndicator() {
    const tab = tabs.find(item => item.dataset.page === activePage);
    if (!tab) return;
    indicator.style.width = `${tab.offsetWidth}px`;
    indicator.style.transform = `translateX(${tab.offsetLeft - 5}px)`;
  }
  function setActivePage(page, updateHash = true) {
    if (!['profile', 'card', 'social'].includes(page)) page = 'profile';
    activePage = page;
    tabs.forEach(tab => {
      const selected = tab.dataset.page === page;
      tab.classList.toggle('is-active', selected);
      if (selected) tab.setAttribute('aria-current', 'page'); else tab.removeAttribute('aria-current');
    });
    document.querySelectorAll('.scene-pagination button').forEach(dot => {
      const selected = dot.dataset.page === page;
      dot.classList.toggle('is-active', selected);
      if (selected) dot.setAttribute('aria-current', 'page'); else dot.removeAttribute('aria-current');
    });
    if (page === 'card') document.querySelector('.reveal')?.classList.add('active');
    if (updateHash) history.replaceState(null, '', `#${page}`);
    placeIndicator();
  }
  function stopScroll() {
    cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    if (!scrollWatchFrame) scrollWatchFrame = requestAnimationFrame(updatePageFromScroll);
  }
  function showPage(page, updateHash = true, animate = true) {
    stopScroll();
    setActivePage(page, updateHash);
    const target = document.getElementById(`panel-${activePage}`);
    const from = window.scrollY;
    const destination = () => Math.min(target.getBoundingClientRect().top + window.scrollY, Math.max(0, document.documentElement.scrollHeight - innerHeight));
    if (!animate || reducedMotion.matches || Math.abs(destination() - from) < 2) {
      window.scrollTo({ top: destination(), behavior: 'instant' });
      return;
    }
    const started = performance.now();
    // Move the whole document, including the intervening sections, like the reference.
    function step(now) {
      const progress = Math.min((now - started) / 950, 1);
      const eased = progress < .5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      window.scrollTo({ top: from + (destination() - from) * eased, behavior: 'instant' });
      if (progress < 1) scrollFrame = requestAnimationFrame(step);
      else { scrollFrame = 0; updatePageFromScroll(); }
    }
    scrollFrame = requestAnimationFrame(step);
  }
  function updatePageFromScroll() {
    scrollWatchFrame = 0;
    if (scrollFrame) return;
    const middle = innerHeight / 2;
    const current = panels.find(panel => {
      const rect = panel.getBoundingClientRect();
      return rect.top <= middle && rect.bottom > middle;
    });
    const page = current?.id.replace('panel-', '');
    if (page && page !== activePage) setActivePage(page);
  }
  window.addEventListener('scroll', () => {
    if (!scrollWatchFrame) scrollWatchFrame = requestAnimationFrame(updatePageFromScroll);
  }, { passive: true });
  window.addEventListener('wheel', stopScroll, { passive: true });
  window.addEventListener('touchstart', stopScroll, { passive: true });
  document.addEventListener('keydown', event => {
    if (['PageDown', 'PageUp', ' ', 'Escape'].includes(event.key) ||
        (!event.target.closest('.desktop-nav') && ['Home', 'End', 'ArrowUp', 'ArrowDown'].includes(event.key))) stopScroll();
  });
  document.querySelectorAll('[data-page]').forEach(button => button.addEventListener('click', () => showPage(button.dataset.page)));
  document.querySelector('.desktop-brand').addEventListener('click', event => { event.preventDefault(); showPage('profile'); });
  nav.addEventListener('keydown', event => {
    if (!event.target.matches('[data-page]')) return;
    const index = tabs.indexOf(event.target);
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    showPage(tabs[next].dataset.page);
    tabs[next].focus();
  });
  window.addEventListener('hashchange', () => showPage(location.hash.slice(1), false));
  window.addEventListener('resize', placeIndicator);
  document.fonts.ready.then(placeIndicator);

  function toggleMusic(force) {
    const open = typeof force === 'boolean' ? force : !body.classList.contains('music-open');
    body.classList.toggle('music-open', open);
    musicButtons.forEach(button => button.setAttribute('aria-expanded', String(open)));
  }
  musicButtons.forEach(button => button.addEventListener('click', () => toggleMusic()));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') toggleMusic(false); });
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('#musicWidget, #nowPlaying')) toggleMusic(false);
  });
  // Let the existing player unlock audio on a real user gesture.
  document.addEventListener('click', () => {
    if (!window._overlayDismissed && typeof window.dismissOverlay === 'function') window.dismissOverlay();
  }, { once: true });
  function syncMusic() {
    const track = window.pl?.[window.ci || 0];
    document.getElementById('nowPlayingTitle').textContent = track?.title || 'A little music, a little peace.';
    body.classList.toggle('is-playing', !!audioEl && !audioEl.paused);
  }
  if (audioEl) ['play', 'pause', 'loadedmetadata', 'emptied', 'ended'].forEach(event => audioEl.addEventListener(event, syncMusic));
  syncMusic();

  function toast(message) {
    const element = document.getElementById('desktopToast');
    element.textContent = message;
    element.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('visible'), 2200);
  }
  const dock = document.getElementById('socialDock');
  const brands = { discord: '#5865f2', soundcloud: '#ee6d25', spotify: '#159b54', github: '#242a35', facebook: '#1877f2', youtube: '#ec3939', instagram: '#bc4886' };
  (config.CUSTOM_SOCIALS || []).filter(social => social.url).forEach(social => {
    // Match the card's supported link protocols; never render executable URLs.
    if (!social.isCopy && !/^(https?:|mailto:)/i.test(social.url)) return;
    const item = document.createElement(social.isCopy ? 'button' : 'a');
    if (social.isCopy) {
      item.type = 'button';
      item.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(social.url); toast(`${social.label || 'ID'} copied`); }
        catch (_) { toast(`Discord ID: ${social.url}`); }
      });
    } else {
      item.href = social.url;
      item.target = '_blank';
      item.rel = 'noopener noreferrer';
    }
    item.setAttribute('aria-label', social.label || social.icon || 'Social link');
    item.dataset.label = social.label || social.icon || 'Social';
    item.style.setProperty('--brand', brands[social.icon] || '#425675');
    const icon = document.createElement('i');
    icon.className = /^[a-z0-9-]+$/.test(social.icon || '') ? `fa-brands fa-${social.icon}` : 'fa-solid fa-link';
    icon.setAttribute('aria-hidden', 'true');
    item.appendChild(icon);
    dock.appendChild(item);
  });
  if (!dock.children.length) document.getElementById('socialNote').textContent = 'Social links will appear here when added to the profile.';

  const motionButton = document.getElementById('motionToggle');
  function syncMotion() {
    body.classList.toggle('motion-paused', motionPaused);
    motionButton.setAttribute('aria-pressed', String(motionPaused));
    motionButton.setAttribute('aria-label', motionPaused ? 'Resume background animation' : 'Pause background animation');
    motionButton.title = motionPaused ? 'Resume animation' : 'Pause animation';
  }
  motionButton.addEventListener('click', () => {
    motionPaused = !motionPaused;
    syncMotion();
    if (!motionPaused) startDust();
  });
  syncMotion();
  const fullscreenButton = document.getElementById('fullscreenToggle');
  fullscreenButton.hidden = !document.fullscreenEnabled;
  fullscreenButton.addEventListener('click', async () => {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch (_) { toast('Fullscreen is unavailable in this browser.'); }
  });
  document.addEventListener('fullscreenchange', () => {
    const expanded = !!document.fullscreenElement;
    fullscreenButton.setAttribute('aria-label', expanded ? 'Exit fullscreen' : 'Enter fullscreen');
    fullscreenButton.querySelector('i').className = `fa-solid fa-${expanded ? 'compress' : 'expand'}`;
  });

  // The upper light fan sways while layers of haze travel down each shaft.
  // CSS beams remain available when WebGL cannot be created.
  function createLightRays() {
    const surface = document.getElementById('ambientRays');
    const scene = document.querySelector('.ambient-scene');
    const gl = surface.getContext('webgl', { alpha: true, antialias: false, depth: false, powerPreference: 'low-power' });
    if (!gl) return null;
    const shaders = [];
    let program;
    let buffer;
    try {
      function compile(type, source) {
        const shader = gl.createShader(type);
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Light shader unavailable');
        return shader;
      }
      const vertex = compile(gl.VERTEX_SHADER, `
        attribute vec2 position;
        void main() { gl_Position = vec4(position, 0.0, 1.0); }
      `);
      const fragment = compile(gl.FRAGMENT_SHADER, `
        #ifdef GL_FRAGMENT_PRECISION_HIGH
        precision highp float;
        #else
        precision mediump float;
        #endif
        uniform vec2 resolution;
        uniform float time;
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 cell = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), f.x),
                     mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0, 1.0)), f.x), f.y);
        }
        void main() {
          vec2 uv = gl_FragCoord.xy / resolution;
          uv.y = 1.0 - uv.y;
          float aspect = resolution.x / resolution.y;
          float source = sin(time * 0.28) * 0.018;
          vec2 p = vec2((uv.x - 0.5) * aspect - source, uv.y + 0.14);
          float angle = atan(p.x, p.y);
          // Move the shafts themselves, rather than just changing the surrounding glow.
          float sweep = sin(time * 0.55) * 0.13 + sin(time * 0.31 + 1.7) * 0.045;
          float movingAngle = angle + sweep + sin(uv.y * 4.0 - time * 0.8) * 0.012;
          float flow = noise(vec2(movingAngle * 6.0 + time * 0.22, time * 0.28));
          float broad = pow(noise(vec2(movingAngle * 10.0 + time * 0.38, time * 0.27)), 2.2);
          float streaks = pow(0.5 + 0.5 * sin(movingAngle * 38.0 + flow * 3.0 - time * 0.3), 7.0);
          float fan = 1.0 - smoothstep(0.3, 1.25, abs(angle));
          float fade = exp(-uv.y * 3.3);
          // Negative time in the vertical coordinate makes the soft light flow downward.
          float haze = noise(vec2(movingAngle * 5.0 + time * 0.1, uv.y * 5.0 - time * 0.65));
          float shimmer = 0.88 + 0.12 * sin(time * 0.9 + movingAngle * 9.0 - uv.y * 4.0);
          float shafts = (broad * 0.68 + streaks * 0.4) * fan * fade * (0.5 + haze * 0.65) * shimmer;
          float bloom = exp(-length(p * vec2(1.4, 1.0)) * 7.0) * 0.5;
          vec3 tint = mix(vec3(0.39, 0.52, 0.83), vec3(0.82, 0.87, 1.0), fade);
          gl_FragColor = vec4(tint * (shafts + bloom), 1.0);
        }
      `);
      program = gl.createProgram();
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Light renderer unavailable');
      gl.useProgram(program);
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      const size = gl.getUniformLocation(program, 'resolution');
      const clock = gl.getUniformLocation(program, 'time');
      function resize() {
        const scale = innerWidth < 700 ? .55 : .65;
        surface.width = Math.max(1, Math.round(innerWidth * scale));
        surface.height = Math.max(1, Math.round(innerHeight * scale));
        gl.viewport(0, 0, surface.width, surface.height);
        gl.uniform2f(size, surface.width, surface.height);
      }
      function draw(time) {
        if (gl.isContextLost()) return;
        gl.uniform1f(clock, time);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
      surface.addEventListener('webglcontextlost', () => {
        scene.classList.remove('rays-ready');
        surface.style.visibility = 'hidden';
      });
      scene.classList.add('rays-ready');
      return { resize, draw };
    } catch (_) {
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      shaders.forEach(shader => gl.deleteShader(shader));
      surface.style.display = 'none';
      return null;
    }
  }
  const rays = createLightRays();
  let rayTime = 8;
  const canvas = document.getElementById('ambientDust');
  const context = canvas.getContext('2d');
  let width = innerWidth, height = innerHeight, frame = 0, lastTime = 0;
  const dust = Array.from({ length: innerWidth < 700 ? 20 : 42 }, () => ({ x: Math.random(), y: Math.random(), radius: .35 + Math.random() * .7, speed: .0015 + Math.random() * .004, phase: Math.random() * Math.PI * 2 }));
  function resizeDust() {
    width = innerWidth; height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = width * dpr; canvas.height = height * dpr;
    context?.setTransform(dpr, 0, 0, dpr, 0, 0);
    rays?.resize();
    rays?.draw(rayTime);
  }
  function drawDust(time) {
    frame = 0;
    if ((!context && !rays) || motionPaused || document.hidden) { lastTime = 0; return; }
    if (time - lastTime >= 32) {
      const delta = lastTime ? Math.min((time - lastTime) / 1000, .1) : .032;
      lastTime = time;
      rayTime += delta;
      rays?.draw(rayTime);
      if (context) {
        context.clearRect(0, 0, width, height);
        dust.forEach(particle => {
          particle.y -= particle.speed * delta;
          if (particle.y < 0) particle.y = 1;
          const x = particle.x * width + Math.sin(time / 7000 + particle.phase) * 15;
          const light = Math.max(0, 1 - Math.abs(x / width - .5) * 2);
          context.fillStyle = `rgba(205,221,255,${.08 + light * .35})`;
          context.beginPath(); context.arc(x, particle.y * height, particle.radius, 0, Math.PI * 2); context.fill();
        });
      }
    }
    frame = requestAnimationFrame(drawDust);
  }
  function startDust() { if (!frame && !motionPaused && !document.hidden && (context || rays)) frame = requestAnimationFrame(drawDust); }
  resizeDust(); startDust();
  window.addEventListener('resize', resizeDust);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) startDust(); });
  showPage(location.hash.slice(1) || 'profile', false, false);
})();
