import axios from "axios";

export default axios.create({
  // baseURL: "https://da38-41-175-91-38.ngrok-free.app/api/v1"
  // baseURL: "https://6882-41-175-91-38.ngrok-free.app/api/v1"
  baseURL: "http://insureme.telone.co.zw:8082/api/v1"
  // baseURL: "http://172.27.243.192:8083/api/v1"
})