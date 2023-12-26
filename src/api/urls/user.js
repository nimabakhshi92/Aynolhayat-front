const url = process.env.REACT_APP_API_URL;
export default {
  login: { url: `${url}/login/` },
  signup: { url: `${url}/register/` },
  refreshToken: `${url}/token/refresh/`,
};
