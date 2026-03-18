import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const user_storage = localStorage.getItem("user-storage");
  if (user_storage) {
    const { state } = JSON.parse(user_storage);
    if (state?.token) {
      config.headers.set('Authorization', `Bearer ${state.token}`);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
}
);

export default API;
