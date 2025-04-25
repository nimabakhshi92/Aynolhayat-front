const url = process.env.REACT_APP_API_URL;
const url0 = process.env.REACT_APP_API_URL0;
export default {
  post: `${url}/narration2/`,
  list: (pageNo, selectedOptions, pageSize = 10) => {
    let baseUrl = `${url}/narration2/?`;
    let index = 0;
    for (const key in selectedOptions) {
      if (selectedOptions[key]) {
        baseUrl += `${index !== 0 ? "&" : ""}${key}=${selectedOptions[key]}`;
        index += 1;
      }
    }
    baseUrl += `${index !== 0 ? "&" : ""}page=${pageNo}&page_size=${pageSize}`;
    return baseUrl;
  },
  get: (narrationId, userId) => {
    const userIdClause = userId ? `?user_id=${userId}` : "";
    return `${url}/narration2/${narrationId}/${userIdClause}`;
  },

  filterOptions: `${url}/filter_options/`,
  subject: {
    get: (subjectId) => `${url}/subject/${subjectId}/`,
    post: `${url}/subject/`,
  },
  summaryTree: {
    get: (summaryId) => `${url}/summary_tree/${summaryId}/`,
    post: `${url}/summary_tree/`,
  },
  footnote: {
    get: (footnoteId) => `${url}/footnote/${footnoteId}/`,
    post: `${url}/footnote/`,
  },
  similar: `${url}/similar_narrations/`,
  bookmark: `${url}/bookmark/`,
  bookmarkRemove: (id) => `${url}/bookmark/${id}/`,
  download: (narrationIds, userId) => {
    const base = `${url}/download_narrations/?ids=${narrationIds.join(",")}`;
    if (userId) return base + `&user=${userId}`;
  },

  downloadBackup: {
    list: () => `${url}/download_narrations_backup/`,
    get: (id) => `${url}/download_narrations_backup/1`,
  },
  downloadInstruction: {
    get: () => `${url}/download_instruction/1/`,
  },
};
