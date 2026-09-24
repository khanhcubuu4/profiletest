/**
 * ============================================================================
 * CẤU HÌNH TRANG CÁ NHÂN / CARD PROFILE (CONFIG.JS)
 * ============================================================================
 * Bạn có thể dễ dàng chỉnh sửa thông tin cá nhân, link mạng xã hội, nhạc nền,
 * thời tiết, Discord ID, và giao diện tại file này.
 */

const CONFIG = {
  // --------------------------------------------------------------------------
  // 1. CÀI ĐẶT CHUNG (GENERAL)
  // --------------------------------------------------------------------------
  GENERAL: {
    cardOpacity: 35, // Độ trong suốt của Card (0-100)
    cardBlur: 60,    // Độ mờ hậu cảnh Glassmorphism (px)
    card3d: true,    // Bật/tắt hiệu ứng nghiêng 3D theo con trỏ chuột
    cursorEffectColor: "#ffffff", // Màu sắc hiệu ứng con trỏ chuột
    cursorUrl: "https://r2.zyo.lol/cursor_url_b4393d90ba35.png", // Link hình ảnh con trỏ chuột tùy chỉnh
    customFont: "Custom",
    customFontUrl: "https://r2.zyo.lol/custom_font_url_a37fa9f6cbeb.ttf" // Font chữ tùy chỉnh
  },

  // --------------------------------------------------------------------------
  // 2. BỐ CỤC & HIỆU ỨNG (LAYOUT)
  // --------------------------------------------------------------------------
  LAYOUT: {
    cursorEffect: "canvas",   // Hiệu ứng con trỏ chuột: "canvas" | "none"
    bgEffect: "particles",    // Hiệu ứng nền: "particles" | "plasma" | "none"
    nameEffect: "none"        // Hiệu ứng tên: "none" | "rainbow" | "glow"
  },

  // --------------------------------------------------------------------------
  // HÌNH NỀN / MÀU NỀN (BACKGROUND)
  // --------------------------------------------------------------------------
  BACKGROUND: {
    type: "color",     // Kiểu nền: "shader" (nền sóng động) | "image" (ảnh/GIF) | "color" (màu đơn)
    imageUrl: "",       // Link hình ảnh hoặc GIF làm nền (khi type: "image")
    color: "#11e7ff",   // Màu sắc nền (khi type: "color" hoặc "shader")
    overlayOpacity: 0.4 // Lớp phủ làm tối nền giúp Card hiển thị rõ nét hơn (0.0 - 1.0)
  },

  // --------------------------------------------------------------------------
  // 3. VIỀN CARD (BORDER)
  // --------------------------------------------------------------------------
  BORDER: {
    style: "solid", // Kiểu viền: "solid" | "dashed" | "none"
    width: 1,       // Độ dày viền (px)
    color: "rgba(255, 255, 255, 0.12)", // Màu viền
    radius: 25      // Bo tròn góc card (px)
  },

  // --------------------------------------------------------------------------
  // 4. MÀU SẮC CHỮ & ICON (STYLE)
  // --------------------------------------------------------------------------
  STYLE: {
    nameColor: "#ffffff", // Màu chữ tên chính
    bioColor: "#b6b6b6",  // Màu chữ Bio / Tiểu sử
    iconColor: "#ffffff", // Màu icon mạng xã hội
    nameGlow: false       // Bật/tắt hiệu ứng phát sáng tên
  },

  // --------------------------------------------------------------------------
  // 5. THÔNG TIN CÁ NHÂN (PROFILE INFO)
  // --------------------------------------------------------------------------
  NAME_OVERRIDE: "xyun", // Tên hiển thị chính trên Card (tùy chỉnh thoải mái)
  AVATAR_OVERRIDE: "",        // Link avatar tùy chỉnh (để trống nếu dùng Discord avatar)
  LOCATION_TEXT: "Saigon",     // Vị trí hiển thị trên đồng hồ

  CUSTOM_BIOS: [
    "just a simple bio.",
    "welcome to my page."
  ],

  // Danh sách liên kết mạng xã hội (Social Links)
  CUSTOM_SOCIALS: [
    {
      label: "Discord",
      icon: "discord",
      url: "959315303907594240",
      isCopy: true // Click để copy Discord ID thay vì mở link
    },
    {
      label: "SoundCloud",
      icon: "soundcloud",
      url: "https://soundcloud.com/minh-ph-m-ho-ng-971535713/cilu-dalab-4loop?si=dd1237472cc34d729858e46dbe7ce45f&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
    },
    {
      label: "Spotify",
      icon: "spotify",
      url: ""
    },
    {
      label: "GitHub",
      icon: "github",
      url: "https://github.com/khanhdz59207"
    }
  ],

  // --------------------------------------------------------------------------
  // 6. TIỆN ÍCH ĐỒNG HỒ & THỜI TIẾT (WIDGETS)
  // --------------------------------------------------------------------------
  WIDGET_CLOCK: {
    enabled: true,
    location: "Saigon",
    theme: "dark"
  },

  WIDGET_WEATHER: {
    enabled: true,
    location: "Saigon", // Thành phố lấy dữ liệu thời tiết
    apiKey: "68901924b9374df4819145817261807",
    theme: "dark",
    useF: false,        // false = dùng độ C (°C), true = dùng độ F (°F)
    showRange: true,
    showWind: true,
    showRain: true,
    refreshMinutes: 30
  },

  // --------------------------------------------------------------------------
  // 7. KẾT NỐI DISCORD (LANYARD & GUILD CARD)
  // --------------------------------------------------------------------------
  DISCORD_LANYARD: {
    enabled: true,
    id: "959315303907594240", // Discord User ID để lấy Avatar/Trạng thái tự động qua Lanyard API
    autoRefresh: true,
    showActivityCard: false,
    customBadges: [
      {
        label: "Nitro Bronze (1 Month)",
        glyph: "💎",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/subscriptions/badges/bronze.png"
      },
      {
        label: "Server boosting (2 Months)",
        glyph: "🚀",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/boosts/discord-boost-2.svg"
      },
      {
        label: "Completed a Quest",
        glyph: "🗺️",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/quest.png"
      },
      {
        label: "Orbs Apprentice",
        glyph: "🔮",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/orb.svg"
      },
      {
        label: "Last Meadow Online",
        glyph: "🌾",
        icon: "https://raw.githubusercontent.com/mezotv/discord-badges/main/assets/last-meadow.png"
      }
    ]
  },

  DISCORD_GUILD_CARD: {
    enabled: true,
    inviteCode: "qkhz",
    inviteUrl: "https://discord.gg/Vt4sC2ZavU",
    guildId: "1346428810249109524"
  },

  // --------------------------------------------------------------------------
  // 8. TRÌNH PHÁT NHẠC (MUSIC PLAYER)
  // --------------------------------------------------------------------------
  MUSIC_ENABLE: true,
  MUSIC_RANDOM: false,
  MUSIC_WIDGET: true,
  MUSIC_DEFAULT_SRC: "NGHIÊM TỔNG & TRẦN TIỂU MUỘI NGONGIODEMQUATRANGSANGDEMNAY prod. NGÔ HẠO & MAI CẢNH DỊ - MCK __ Nger.mp3",

  CUSTOM_MUSIC: [
    {
      title: "NGONGIODEMQUATRANGSANGDEMNAY",
      artist: "Nghiêm Tổng & Trần Tiểu Muội (MCK ft. Marzuz)",
      src: "NGHIÊM TỔNG & TRẦN TIỂU MUỘI NGONGIODEMQUATRANGSANGDEMNAY prod. NGÔ HẠO & MAI CẢNH DỊ - MCK __ Nger.mp3",
      cover: "icon.jpg"
    }
  ],

  // --------------------------------------------------------------------------
  // 9. CSS TÙY CHỈNH (CUSTOM CSS STYLES)
  // --------------------------------------------------------------------------
  CUSTOM_CSS: `
                .content-container.css_content_container {
                    overflow: hidden;
                    background: rgba(25, 25, 25, 0.15);
                    box-shadow:
                        inset 1.5px 1.5px 3px rgba(255, 255, 255, 0.25),
                        inset 3px 3px 8px rgba(255, 255, 255, 0.1),
                        inset -1.5px -1.5px 4px rgba(0, 0, 0, 0.6),
                        inset -4px -4px 12px rgba(0, 0, 0, 0.4),
                        0 15px 35px rgba(0, 0, 0, 0.7);
                }

                .content-container.css_content_container::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -150%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
                    transform: skewX(-25deg);
                    animation: cardGlassShimmer 3.5s infinite ease-in-out;
                    pointer-events: none;
                    z-index: 999;
                }
                @keyframes cardGlassShimmer {
                    0% { left: -150%; }
                    40% { left: 150%; }
                    50% { left: 150%; }
                    90% { left: -150%; }
                    100% { left: -150%; }
                }

                .page-stack {
                    --bioWidth: 730px;
                }

                .dc-guild-card {
                    position: relative;
                    overflow: hidden;
                    box-shadow:
                        inset 1.5px 1.5px 3px rgba(255, 255, 255, 0.25),
                        inset 3px 3px 8px rgba(255, 255, 255, 0.1),
                        inset -1.5px -1.5px 4px rgba(0, 0, 0, 0.6),
                        inset -4px -4px 12px rgba(0, 0, 0, 0.4),
                        0 15px 35px rgba(0, 0, 0, 0.7) !important;
                }
                .dc-activity-card,
                .float-music-panel {
                    position: relative;
                    overflow: hidden;
                    background: rgba(25, 25, 25, 0.15) !important;
                    border: 1px solid rgba(255, 255, 255, 0.08) !important;
                    backdrop-filter: blur(24px) saturate(120%) !important;
                    -webkit-backdrop-filter: blur(24px) saturate(120%) !important;
                    box-shadow:
                        inset 1.5px 1.5px 3px rgba(255, 255, 255, 0.25),
                        inset 3px 3px 8px rgba(255, 255, 255, 0.1),
                        inset -1.5px -1.5px 4px rgba(0, 0, 0, 0.6),
                        inset -4px -4px 12px rgba(0, 0, 0, 0.4),
                        0 15px 35px rgba(0, 0, 0, 0.7) !important;
                }

                .clock-widget,
                .weather-card,
                #weather-widget {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                }
                .clock-widget:hover,
                .weather-card:hover {
                    box-shadow: none !important;
                }

                .dc-guild-card::after,
                .dc-activity-card::after,
                .float-music-panel::after {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: -150%;
                    width: 50%;
                    height: 100%;
                    background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0) 100%);
                    transform: skewX(-25deg);
                    animation: cardGlassShimmer 3.5s infinite ease-in-out;
                    pointer-events: none;
                    z-index: 5;
                }

                .bio-container,
                .ov-hint {
                    font-family: 'Inter', sans-serif;
                }
                .content .top #userName {
                    font-family: 'Unbounded', sans-serif !important;
                    font-weight: 700;
                    letter-spacing: -0.01em;
                }
                .pronouns,
                .clock-location {
                    font-family: 'Quicksand', sans-serif !important;
                    font-weight: 600;
                }
                .bio_small_infomation .bio_infomation,
                .avatar-handle,
                .clock-time,
                .clock-date,
                .weather-card .weather-info,
                #weather-widget,
                .c-music-label,
                .c-music-time,
                .fm-time,
                .dc-activity-elapsed,
                .dc-guild-counts {
                    font-family: 'JetBrains Mono', monospace !important;
                }
                .dc-guild-card,
                .dc-activity-card,
                .dc-guild-name,
                .dc-activity-name,
                .fm-title {
                    font-family: 'Sora', sans-serif !important;
                }
                .dc-guild-desc,
                .dc-activity-details,
                .dc-activity-state,
                .ov-name {
                    font-family: 'Inter', sans-serif !important;
                }

                .pronouns {
                    position: relative;
                    display: inline-block;
                    color: transparent !important;
                    background: linear-gradient(90deg, #dcdcdc 0%, #ffffff 35%, #8a8a8a 50%, #ffffff 65%, #dcdcdc 100%);
                    background-size: 220% 100%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    animation: bioTextShimmer 3.6s linear infinite;
                }
                @keyframes bioTextShimmer {
                    from { background-position: 200% center; }
                    to { background-position: -200% center; }
                }

                .content-container.css_content_container {
                    position: relative;
                }
                .border_shimmer {
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    pointer-events: none;
                    z-index: 999;
                    overflow: hidden;
                    clip-path: inset(0 round 26px);
                }
                .border_shimmer::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    padding: 2px;
                    background: radial-gradient(circle 132px at var(--shimmer-x, 0px) var(--shimmer-y, 0px), rgba(255,255,255,1), rgba(255,255,255,.96) 10%, rgba(255,255,255,.72) 24%, rgba(255,255,255,.32) 52%, transparent 88%);
                    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
                    -webkit-mask-composite: xor;
                    mask-composite: exclude;
                    filter: blur(2.5px) drop-shadow(0 0 20px rgba(255,255,255,.85));
                }

                .dc-guild-card {
                    border-left: 3px solid rgba(88, 101, 242, 0.55) !important;
                    border-radius: 18px !important;
                }
                .dc-guild-card .dc-join-btn {
                    background: linear-gradient(135deg, #5865F2, #7289DA) !important;
                    border: none !important;
                }
                .dc-activity-card {
                    border-left: 3px solid rgba(198, 120, 221, 0.55) !important;
                    border-radius: 18px !important;
                }
                .dc-activity-card .dc-activity-live-dot {
                    background: #c678dd !important;
                    box-shadow: 0 0 8px rgba(198, 120, 221, 0.8) !important;
                }
                .dc-activity-progress-fill {
                    background: linear-gradient(90deg, #c678dd, #8b5cf6) !important;
                }



                .dc-guild-card {
                    border-radius: var(--borderRadius, 24px) !important;
                    transition:
                        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                        border-color 0.35s ease,
                        box-shadow 0.35s ease !important;
                }
                .dc-guild-card:hover {
                    border-color: rgba(255, 255, 255, 0.18) !important;
                }
                .dc-corner {
                    position: absolute;
                    width: 16px;
                    height: 16px;
                    border: 2px solid var(--nameColor, #ffe4f4);
                    opacity: 0;
                    filter: drop-shadow(0 0 4px var(--primary-glow));
                    pointer-events: none;
                    z-index: 6;
                    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s ease;
                }
                .dc-corner-tl { top: 8px; left: 8px; border-right: none; border-bottom: none; border-top-left-radius: 4px; }
                .dc-corner-tr { top: 8px; right: 8px; border-left: none; border-bottom: none; border-top-right-radius: 4px; }
                .dc-corner-bl { bottom: 8px; left: 8px; border-right: none; border-top: none; border-bottom-left-radius: 4px; }
                .dc-corner-br { bottom: 8px; right: 8px; border-left: none; border-top: none; border-bottom-right-radius: 4px; }
                .dc-guild-card:hover .dc-corner {
                    opacity: 1;
                    filter: drop-shadow(0 0 6px var(--primary-glow));
                }
                .dc-card-glow {
                    position: absolute;
                    inset: 0;
                    border-radius: inherit;
                    pointer-events: none;
                    z-index: 4;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    background: radial-gradient(circle 170px at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.12), transparent 70%);
                }
                .dc-guild-card:hover .dc-card-glow {
                    opacity: 1;
                }
            `
};