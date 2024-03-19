const url = process.env.REACT_APP_API_URL;
export default {
  list: (section, userId) => {
    const userIdClause = userId ? `?user_id=${userId}` : "";
    if (section === "narration")
      return `${url}/table_of_contents/${userIdClause}`;
    if (section === "verse")
      return `${url}/verses_table_of_contents/${userIdClause}`;
    if (section === "surah")
      return `${url}/surah_table_of_contents/${userIdClause}`;
  },
};
