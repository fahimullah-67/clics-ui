import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7000/api/v1",

  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    console.log("Outgoing Request:", {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);
export default api;