import axios from "axios";

export default axios.create({
  // baseURL: "http://172.27.6.80:8083/api/v1"
  // baseURL: "http://172.27.244.145:8082/api/v1"
  baseURL: "http://localhost:8083/api/v1"
  // baseURL: "http://insureme.co.zw:8082/api/v1"
})