const url = process.env.REACT_APP_API_URL;
export default {
  login: { url: `${url}/login/` },
  refreshToken: `${url}/token/refresh/`,
};
