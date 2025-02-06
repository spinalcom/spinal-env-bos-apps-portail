import axios from "axios";

const endpoint = "/api/v1";
// const host = (process.env.SPINAL_API_URL || "").replace(`/\/$/`, (el) => "");

const host = 'https://api-demo-spinal-tower.spinalcom.com'
const baseURL = host.match(new RegExp(endpoint)) ? host : host + endpoint;

const http = axios.create({ baseURL });
http.interceptors.request.use((request) => {
  const t = localStorage.getItem("token");
  if (t) request.headers.common.Authorization = `Bearer ${t}`;
  return request;
});
export const HTTP = http;
export const HOST = host;