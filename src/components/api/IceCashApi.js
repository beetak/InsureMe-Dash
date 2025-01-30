import axios from "axios";

export default axios.create({
  baseURL: "https://insureme.co.zw:8083/api"
  // baseURL: "http://localhost:4040/api"
})