import axios from "axios";

const request = axios.create({ baseURL: process.env.REACT_APP_BASE_URL });

request.interceptors.request.use(
  (config) => {
    // const user = JSON.parse(getStorage("user"));
    // if (user) {
      // eslint-disable-next-line no-param-reassign
      config.headers = {
        ...config.headers,
        Authorization: "Token 49ff517043ce154b6e2359a690fc42234ee2223e",
      };
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

request.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error?.response?.data)
);

export default request;
