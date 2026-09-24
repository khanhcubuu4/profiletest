/**
 * ============================================================================
 * HIỆU ỨNG WEBGL PLASMA BACKGROUND (PLASMA.JS)
 * ============================================================================
 * Hiệu ứng phông nền WebGL Plasma sống động, phản ứng theo con trỏ chuột,
 * tự động tối ưu tốc độ khung hình (FPS) cho máy tính và thiết bị di động.
 */

function isIPad() {
  return /iPad/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

const isMobile = /Mobi|Android|iPhone|iPod/i.test(navigator.userAgent) || isIPad();

/**
 * Khởi tạo hiệu ứng WebGL Plasma Canvas Background
 * @param {Object} options - Các tùy chỉnh hiệu ứng (màu sắc, tốc độ, độ chi tiết...)
 */
function createPlasmaEffect(options = {}) {
  const settings = {
    container: options.container || "body",
    color: options.color || "#ffffff",
    speed: options.speed ?? 0.5,
    direction: options.direction ?? 1,
    scale: options.scale ?? 1.1,
    opacity: options.opacity ?? 0.9,
    mouseInteractive: options.mouseInteractive ?? false,
    renderScale: options.renderScale ?? 0.65,
    maxFPS: options.maxFPS ?? 45,
    iterations: options.iterations ?? 60,
    precision: options.precision ?? "highp",
    powerPreference: options.powerPreference ?? "default",
    antialias: options.antialias ?? false,
    maxDPR: options.maxDPR ?? 2
  };

  // Chuyển đổi mã màu Hex thành giá trị RGB dạng float (0.0 - 1.0)
  function hexToRgbFloat(hex) {
    if (!hex) return { r: 0.07, g: 0.9, b: 1.0 };
    let cleanHex = hex.trim().replace(/^#/, "");
    if (cleanHex.length === 8) {
      cleanHex = cleanHex.substring(0, 6);
    }
    if (cleanHex.length === 6) {
      return {
        r: parseInt(cleanHex.substring(0, 2), 16) / 255,
        g: parseInt(cleanHex.substring(2, 4), 16) / 255,
        b: parseInt(cleanHex.substring(4, 6), 16) / 255
      };
    } else if (cleanHex.length === 3) {
      return {
        r: parseInt(cleanHex[0] + cleanHex[0], 16) / 255,
        g: parseInt(cleanHex[1] + cleanHex[1], 16) / 255,
        b: parseInt(cleanHex[2] + cleanHex[2], 16) / 255
      };
    }
    return { r: 0.07, g: 0.9, b: 1.0 };
  }

  const containerElem = document.querySelector(settings.container);
  if (!containerElem) {
    throw new Error(`Container "${settings.container}" không tồn tại`);
  }

  // Tạo phần tử bao bọc Canvas
  const wrapperDiv = document.createElement("div");
  wrapperDiv.className = "plasma-container";
  wrapperDiv.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    pointer-events: none;
    z-index: -1;
  `;

  const canvasElem = document.createElement("canvas");
  canvasElem.id = "plasma-" + Date.now();
  canvasElem.style.cssText = `
    width: 100%;
    height: 100%;
    display: block;
  `;

  wrapperDiv.appendChild(canvasElem);
  containerElem.appendChild(wrapperDiv);

  const dpr = Math.min(window.devicePixelRatio || 1, settings.maxDPR) * settings.renderScale;
  const gl = canvasElem.getContext("webgl2", {
    alpha: true,
    antialias: settings.antialias,
    premultipliedAlpha: true,
    powerPreference: settings.powerPreference
  });

  if (!gl) {
    throw new Error("Trình duyệt không hỗ trợ WebGL2");
  }

  // Mã Shader Vertex & Fragment (GLSL ES 3.0)
  const vertexShaderSource = `
    #version 300 es
    precision ${settings.precision} float;
    in vec2 position;
    in vec2 uv;
    out vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    #version 300 es
    precision ${settings.precision} float;
    uniform vec2 iResolution;
    uniform float iTime;
    uniform vec3 uCustomColor;
    uniform float uUseCustomColor;
    uniform float uSpeed;
    uniform float uDirection;
    uniform float uScale;
    uniform float uOpacity;
    uniform vec2 uMouse;
    uniform float uMouseInteractive;
    uniform float uIterations;
    out vec4 fragColor;

    void mainImage(out vec4 o, vec2 C) {
        vec2 center = iResolution.xy * 0.5;
        C = (C - center) / uScale + center;
        vec2 mouseOffset = (uMouse - center) * 0.0002;
        C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
        float i, d, z, T = iTime * uSpeed * uDirection;
        vec3 O, p, S;
        for (vec2 r = iResolution.xy, Q; ++i < uIterations; O += o.w/d * o.xyz) {
            p = z * normalize(vec3(C - 0.5 * r, r.y));
            p.z -= 4.;
            S = p;
            d = p.y - T;
            p.x += 0.4 * (1. + p.y) * sin(d + p.x * 0.1) * cos(0.34 * d + p.x * 0.05);
            Q = p.xz *= mat2(cos(p.y + vec4(0., 11., 33., 0.) - T));
            z += d = abs(sqrt(length(Q * Q)) - 0.25 * (5. + S.y)) / 3. + 8e-4;
            o = 1. + sin(S.y + p.z * 0.5 + S.z - length(S - p) + vec4(2., 1., 0., 8.));
        }
        o.xyz = tanh(O / 1e4);
    }

    bool finite1(float x) { return !(isnan(x) || isinf(x)); }
    vec3 sanitize(vec3 c) {
        return vec3(
            finite1(c.r) ? c.r : 0.0,
            finite1(c.g) ? c.g : 0.0,
            finite1(c.b) ? c.b : 0.0
        );
    }

    void main() {
        vec4 o = vec4(0.0);
        mainImage(o, gl_FragCoord.xy);
        vec3 rgb = sanitize(o.rgb);
        float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
        vec3 customColor = intensity * uCustomColor;
        vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
        float alpha = length(rgb) * uOpacity;
        fragColor = vec4(finalColor, alpha);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(log || "Không thể biên dịch shader");
    }
    return shader;
  }

  const vertShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragShader = compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

  const program = gl.createProgram();
  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.bindAttribLocation(program, 0, "position");
  gl.bindAttribLocation(program, 1, "uv");
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error("Không thể liên kết chương trình shader");
  }

  gl.useProgram(program);

  const quadVertices = new Float32Array([
    -1, -1, 0, 0,
     1, -1, 1, 0,
    -1,  1, 0, 1,
    -1,  1, 0, 1,
     1, -1, 1, 0,
     1,  1, 1, 1
  ]);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 4, 0);

  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT * 4, Float32Array.BYTES_PER_ELEMENT * 2);

  const uniforms = {
    iResolution: gl.getUniformLocation(program, "iResolution"),
    iTime: gl.getUniformLocation(program, "iTime"),
    uCustomColor: gl.getUniformLocation(program, "uCustomColor"),
    uUseCustomColor: gl.getUniformLocation(program, "uUseCustomColor"),
    uSpeed: gl.getUniformLocation(program, "uSpeed"),
    uDirection: gl.getUniformLocation(program, "uDirection"),
    uScale: gl.getUniformLocation(program, "uScale"),
    uOpacity: gl.getUniformLocation(program, "uOpacity"),
    uMouse: gl.getUniformLocation(program, "uMouse"),
    uMouseInteractive: gl.getUniformLocation(program, "uMouseInteractive"),
    uIterations: gl.getUniformLocation(program, "uIterations")
  };

  const colorFloat = hexToRgbFloat(settings.color);
  const state = {
    direction: settings.direction,
    speed: settings.speed,
    scale: settings.scale,
    opacity: settings.opacity,
    iterations: settings.iterations,
    useCustomColor: 1,
    customColor: new Float32Array([colorFloat.r, colorFloat.g, colorFloat.b]),
    mouseInteractive: settings.mouseInteractive ? 1 : 0,
    mouse: new Float32Array([0, 0])
  };

  let resizeTimeout = null;

  function resizeCanvas() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const renderWidth = Math.max(1, Math.floor(width * dpr));
    const renderHeight = Math.max(1, Math.floor(height * dpr));

    canvasElem.width = renderWidth;
    canvasElem.height = renderHeight;
    canvasElem.style.width = width + "px";
    canvasElem.style.height = height + "px";

    gl.viewport(0, 0, renderWidth, renderHeight);
    gl.uniform2f(uniforms.iResolution, renderWidth, renderHeight);
  }

  function onResize() {
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
  }

  resizeCanvas();
  window.addEventListener("resize", onResize);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  function updateMousePos(e) {
    if (state.mouseInteractive <= 0) return;
    const rect = canvasElem.getBoundingClientRect();
    state.mouse[0] = e.clientX - rect.left;
    state.mouse[1] = e.clientY - rect.top;
  }

  canvasElem.addEventListener("mousemove", updateMousePos);
  canvasElem.addEventListener("touchmove", (e) => {
    if (e.touches.length === 0) return;
    updateMousePos(e.touches[0]);
  }, { passive: true });

  canvasElem.addEventListener("touchstart", (e) => {
    if (e.touches.length === 0) return;
    updateMousePos(e.touches[0]);
  }, { passive: true });

  canvasElem.addEventListener("mouseleave", () => {
    state.mouse[0] = 0;
    state.mouse[1] = 0;
  });

  // Thiết lập Uniform ban đầu
  gl.uniform3fv(uniforms.uCustomColor, state.customColor);
  gl.uniform1f(uniforms.uUseCustomColor, state.useCustomColor);
  gl.uniform1f(uniforms.uSpeed, state.speed * 0.4);
  gl.uniform1f(uniforms.uDirection, state.direction);
  gl.uniform1f(uniforms.uScale, state.scale);
  gl.uniform1f(uniforms.uOpacity, state.opacity);
  gl.uniform1f(uniforms.uMouseInteractive, state.mouseInteractive);
  gl.uniform2fv(uniforms.uMouse, state.mouse);
  gl.uniform1f(uniforms.uIterations, state.iterations);

  const startTime = performance.now();
  let animationFrameId = null;
  let lastFrameTime = 0;
  const frameInterval = 1000 / settings.maxFPS;

  function render(now) {
    animationFrameId = requestAnimationFrame(render);
    if (settings.maxFPS < 60) {
      const elapsed = now - lastFrameTime;
      if (elapsed < frameInterval) return;
      lastFrameTime = now - (elapsed % frameInterval);
    }
    const timeInSeconds = (now - startTime) * 0.001;

    gl.uniform1f(uniforms.iTime, timeInSeconds);
    gl.uniform2fv(uniforms.uMouse, state.mouse);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  animationFrameId = requestAnimationFrame(render);

  return {
    setColor(hexColor) {
      const rgb = hexToRgbFloat(hexColor);
      state.customColor[0] = rgb.r;
      state.customColor[1] = rgb.g;
      state.customColor[2] = rgb.b;
      gl.uniform3fv(uniforms.uCustomColor, state.customColor);
    },
    setSpeed(newSpeed) {
      state.speed = newSpeed;
      gl.uniform1f(uniforms.uSpeed, state.speed * 0.4);
    },
    setDirection(newDirection) {
      state.direction = newDirection;
      gl.uniform1f(uniforms.uDirection, state.direction);
    },
    setScale(newScale) {
      state.scale = newScale;
      gl.uniform1f(uniforms.uScale, state.scale);
    },
    setOpacity(newOpacity) {
      state.opacity = newOpacity;
      gl.uniform1f(uniforms.uOpacity, state.opacity);
    },
    setMouseInteractive(isInteractive) {
      state.mouseInteractive = isInteractive ? 1 : 0;
      gl.uniform1f(uniforms.uMouseInteractive, state.mouseInteractive);
    },
    setIterations(newIterations) {
      state.iterations = newIterations;
      gl.uniform1f(uniforms.uIterations, state.iterations);
    },
    destroy() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("resize", onResize);
      wrapperDiv.remove();
    }
  };
}

// Khởi tạo hiệu ứng Plasma với thông số tối ưu cho Desktop / Di động
const bgCfg = (window.CONFIG && window.CONFIG.BACKGROUND) || {};
const activeColor = bgCfg.color || "#11e7ff";

if (!isMobile) {
  const plasma = createPlasmaEffect({
    color: activeColor,
    renderScale: 0.65,
    maxFPS: 30,
    iterations: 55,
    powerPreference: "low-power",
    maxDPR: 2
  });
} else {
  const plasma = createPlasmaEffect({
    color: activeColor,
    renderScale: 0.5,
    maxFPS: 24,
    iterations: 35,
    powerPreference: "low-power",
    maxDPR: 1
  });
}