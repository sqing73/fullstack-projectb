import axios from "axios";

const BASE_URL = "http://us1.kyrios.cn:8913";
const EMPLOYEE_URL = `${BASE_URL}/employee`;
const HR_URL = `${BASE_URL}/hr`;

const authInterceptor = (req) => {
  const accessToken = JSON.parse(localStorage.getItem("user"))?.token;
  if (accessToken) {
    req.headers.Authorization = `Bearer ${accessToken}`;
  }
  return req;
};

export const API = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const EMPLOYEE_API = axios.create({
  baseURL: EMPLOYEE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const HR_API = axios.create({
  baseURL: HR_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiWithAuth = (apiPath) => {
  const api = axios.create({
    baseURL: BASE_URL + apiPath,
    headers: {
      "Content-Type": "application/json",
    },
  });
  api.interceptors.request.use(authInterceptor);
  return api;
}

EMPLOYEE_API.interceptors.request.use(authInterceptor);
HR_API.interceptors.request.use(authInterceptor);
