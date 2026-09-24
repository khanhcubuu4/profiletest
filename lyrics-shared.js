window.LYRICS_DB = window.LYRICS_DB || {};

function registerLyrics(filename, lyricsArray) {
    window.LYRICS_DB[filename] = lyricsArray;
}
