import axios from "axios";

const API = axios.create({
  baseURL: "https://sleepsense-ai.onrender.com"
});

// Automatically attach JWT token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export const analyzeSleep = (data) => {
  return API.post("/sleep-log", data);
};