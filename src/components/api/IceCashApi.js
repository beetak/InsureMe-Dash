import axios from "axios";

export default axios.create({
  // baseURL: "http://insureme.co.zw:4040"
  baseURL: "http://localhost:4040/api"
})