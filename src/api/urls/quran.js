const url = process.env.REACT_APP_API_URL;
export default {
  surah: `${url}/quran_surah/`,
  verse: (surahNo, verseNo) =>
    `${url}/quran/?surah_no=${surahNo}&verse_no=${verseNo}`,
};
