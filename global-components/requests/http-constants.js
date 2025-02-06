import axios from "axios";

export const DASHBOARD_MODE = {
  BOS_APP: "BOS_APP",
  PAM_APP: "PAM_APP",
};

class HttpService {
  constructor() {
    this.mode = DASHBOARD_MODE.PAM_APP; 
    this.host = (process.env.SPINAL_API_URL || "").replace(/\/$/, ""); 
    // this.host = 'http://localhost:3000'
    this.setEndpoint(); 

    this.http = axios.create({
      baseURL: this.computeBaseURL(),
    });

    this.http.interceptors.request.use((request) => {
      const token = localStorage.getItem("token");
      if (token) {
        request.headers.common.Authorization = `Bearer ${token}`;
      }
      return request;
    });


    this.get = this.http.get.bind(this.http);
    this.post = this.http.post.bind(this.http);
    this.put = this.http.put.bind(this.http);
    this.delete = this.http.delete.bind(this.http);
  }

  setApiMode(mode) {
    this.mode = mode;
    this.setEndpoint();
    this.http.defaults.baseURL = this.computeBaseURL();
  }

  setEndpoint() {
    this.endpoint = "/api/v1";
    // à modifier pour pam mode ou bos_mode
    // if (this.mode === DASHBOARD_MODE.BOS_APP) {
    //   this.endpoint = "/api/v1";
    // } else {
    //   const buildingId = localStorage.getItem("idBuilding");
    //   if (!buildingId) {
    //     throw new Error("Building ID is not set in localStorage");
    //   }
    //   this.endpoint = `/api/v2/building/${buildingId}/`;
    // }
  }

  computeBaseURL() {
    return this.host + this.endpoint;
  }
}

const httpInstance = new HttpService();
export default httpInstance;
