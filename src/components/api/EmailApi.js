import axios from "axios";

export default axios.create({
  // baseURL: "http://localhost:5002/api/v1"
  // baseURL: "http://172.27.243.192:8083/api/v1"
  baseURL: "http://localhost:5003/api"
  // baseURL: "http://172.27.34.81:8083/api/v1"
  // baseURL: "http://172.27.6.189:8083/smart-wifi"
  // baseURL: "http://10.0.5.43:8083/smart-wifi"
  // baseURL: "http://172.27.34.81:10001/api/v1"
  // baseURL: "http://172.27.6.68:8083/api/v1"
  // baseURL: "http://172.27.34.81:8086/api/v1"
  // baseURL: "https://6882-41-175-91-38.ngrok-free.app/api/v1"
})