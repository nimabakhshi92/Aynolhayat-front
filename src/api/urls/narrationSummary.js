const url = process.env.REACT_APP_API_URL;
export default {
  list: (pageNo, selectedOptions, pageSize = 10) => {
    let baseUrl = `${url}/narration_summary/?`;
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
};
