(function () {
    var lyrics = [
        { time: 2.00, text: "🎶 NGONGIODEMQUATRANGSANGDEMNAY - Nghiêm Tổng & Trần Tiểu Muội (MCK & Marzuz) 🎶" },
        { time: 10.72, text: "Dành tặng em bao khúc nhạc trữ tình, những thề hẹn" },
        { time: 14.03, text: "Tương với tư, nhớ người, thức trắng đêm" },
        { time: 17.25, text: "Hòa vào trong nỗi nhớ, nhìn theo bóng lưng" },
        { time: 21.14, text: "Dành tặng em cơn gió chiều qua, trăng sáng đêm nay" },
        { time: 24.07, text: "Duyên ý tiền kiếp trổ bông kiếp này" },
        { time: 27.65, text: "Nguyện cùng em hết kiếp bạc đầu ngắm trăng" },
        { time: 33.85, text: "Thế gian kia biết bao nhiêu người" },
        { time: 37.36, text: "Mình gặp được nhau, hợp lại tan, kể được bao nhiêu câu chuyện" },
        { time: 40.18, text: "Tình chơi vơi, đành vậy thôi, bao nhiêu nỗi niềm" },
        { time: 44.34, text: "Đã qua rồi, không xót xa quá" },
        { time: 48.00, text: "Chẳng còn đau, để lần sau khi ta ước nguyện" },
        { time: 50.66, text: "Rằng thật mau thuộc về nhau" },
        { time: 52.04, text: "Và nếu như có lần sau, nước mắt ấy nó sẽ được lau" },
        { time: 57.52, text: "Bên trong đôi mắt đục ngầu là bờ môi, là làn mi, là nụ hôn của một tiểu thư anh đã từng" },
        { time: 62.40, text: "Và nếu như có lần sau, nước mắt ấy nó sẽ được lau" },
        { time: 67.96, text: "Bên trong đôi mắt nhạt màu là nụ hôn của em và ta lại thấy yêu như lần đầu" },
        { time: 74.28, text: "Chẳng thiết nghĩ câu chuyện thế gian" },
        { time: 79.50, text: "Chỉ đắm đuối hàng mi em" },
        { time: 84.76, text: "Liệu có chút rung động, nhớ nhung?" },
        { time: 89.98, text: "Mình cùng nhau dạo bước, lặng nhìn thế gian" },
        { time: 94.25, text: "Dành tặng em bao khúc nhạc trữ tình, những thề hẹn" },
        { time: 97.80, text: "Tương với tư, nhớ người, thức trắng đêm" },
        { time: 100.70, text: "Hòa vào trong nỗi nhớ, nhìn theo bóng lưng" },
        { time: 104.62, text: "Dành tặng em cơn gió chiều qua, trăng sáng đêm nay" },
        { time: 108.20, text: "Duyên ý tiền kiếp trổ bông kiếp này" },
        { time: 111.18, text: "Nguyện cùng em hết kiếp bạc đầu ngắm trăng" },
        { time: 117.40, text: "Cứ như là mới biết yêu lần đầu" },
        { time: 120.95, text: "Ngồi ngẩn ngơ dưới ánh trăng, trái tim này rung động" },
        { time: 127.46, text: "Cứ tíu tít, ríu rít, líu lo chẳng thành câu" },
        { time: 131.36, text: "Mà dường như ánh mắt đã trăm lần được thấu hiểu" },
        { time: 136.58, text: "Đưa đôi tay, cầm tay dạo chơi, khiêu vũ" },
        { time: 139.20, text: "Cùng đuổi bắt đến nơi ánh dương cuối cùng" },
        { time: 141.80, text: "Đợi gió lên mây tới kéo đến, long lanh ánh trăng trời" },
        { time: 147.50, text: "Mà dẫu ta có phải cách xa nghìn trùng bất tận" },
        { time: 151.92, text: "Ngọt ngào bên tai vài câu hẹn ước về ngày tương phùng" },
        { time: 157.75, text: "Chẳng thiết nghĩ câu chuyện thế gian" },
        { time: 162.98, text: "Chỉ đắm đuối hàng mi em" },
        { time: 168.24, text: "Liệu có chút rung động, nhớ nhung?" },
        { time: 173.45, text: "Mình cùng nhau dạo bước, lặng nhìn thế gian" },
        { time: 177.70, text: "Dành tặng em bao khúc nhạc trữ tình, những thề hẹn" },
        { time: 181.30, text: "Tương với tư, nhớ người, thức trắng đêm" },
        { time: 184.16, text: "Hòa vào trong nỗi nhớ, nhìn theo bóng lưng" },
        { time: 188.10, text: "Dành tặng em cơn gió chiều qua, trăng sáng đêm nay" },
        { time: 191.65, text: "Duyên ý tiền kiếp trổ bông kiếp này" },
        { time: 194.66, text: "Nguyện cùng em hết kiếp bạc đầu ngắm trăng" },
        { time: 198.48, text: "Dành tặng em bao khúc nhạc trữ tình, những thề hẹn" },
        { time: 202.15, text: "Tương với tư, nhớ người, thức trắng đêm" },
        { time: 205.10, text: "Hòa vào trong nỗi nhớ, nhìn theo bóng lưng" },
        { time: 208.95, text: "Dành tặng em cơn gió chiều qua, trăng sáng đêm nay" },
        { time: 212.55, text: "Duyên ý tiền kiếp trổ bông kiếp này" },
        { time: 215.50, text: "Nguyện cùng em hết kiếp bạc đầu ngắm trăng ❤️" }
    ];

    var songNames = [
        "NGHIÊM TỔNG & TRẦN TIỂU MUỘI NGONGIODEMQUATRANGSANGDEMNAY prod. NGÔ HẠO & MAI CẢNH DỊ - MCK __ Nger.mp3",
        "Du_bao_thoi_tiet_hom_nay_KLICKAUD.mp3",
        "greyd.mp3",
        "track1.mp3",
        "track2.mp3",
        "track3.mp3",
        "GREY D - dự báo thời tiết hôm nay mưa  official visualizer - ST.319 Entertainment.mp3"
    ];

    function setLyrics(key) {
        if (window.registerLyrics) {
            window.registerLyrics(key, lyrics);
        } else {
            window.LYRICS_DB = window.LYRICS_DB || {};
            window.LYRICS_DB[key] = lyrics;
        }
    }

    songNames.forEach(function (name) {
        setLyrics(name);
        setLyrics(encodeURIComponent(name));
        setLyrics(decodeURIComponent(name));
    });
})();
