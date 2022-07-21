import axios from "axios";
import { BASE_URL } from "../config";

const userInstance = axios.create({
  baseURL: BASE_URL + "/core/",
  timeout: 8000,
  headers: {
    // Authorization: "JWT " + localStorage.getItem("access_token"),
    // "Content-Type": "application/json",
    // accept: "application/json",
  },
});

export default userInstance;
