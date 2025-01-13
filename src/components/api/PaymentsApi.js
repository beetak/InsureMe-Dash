import axios from "axios";

export default axios.create({
  baseURL: "https://telzoneapi.telone.co.zw:7059/api"
})