import axios from "axios";
import { BASE_URL } from "../config";

const axiosInstance = axios.create({
  baseURL: BASE_URL + "/api/",
  timeout: 8000,
//   headers: {
//     Authorization: "Bearer" + localStorage.getItem("access_token"),
//     // "Content-Type": "application/json",
//     // accept: "application/json",
//   },
});

export default axiosInstance;