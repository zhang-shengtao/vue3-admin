import axios from "axios";
import PINIA_USER from "@/stores/user";
import PINIA_LAYOUT from "@/stores/layout";
import { removeStorage } from "./storage";
import { ElMessage } from "element-plus";
import router from "@/router";
const { VITE_BASE_TOKEN_NAME, VITE_BASE_API } = import.meta.env;
import { typeOf } from "./method";

const request = axios.create({
  baseURL: VITE_BASE_API + "/api",
});

// 添加请求拦截器
request.interceptors.request.use((config) => {
  const { token } = PINIA_USER();
  const { addRequestToken, removeRequestToken } = PINIA_LAYOUT();
  token && (config.headers.Authorization = "Bearer " + token);
  removeRequestToken(config);
  addRequestToken(config);
  return config;
});

// 添加响应拦截器
request.interceptors.response.use(
  (response) => {
    const { removeRequestToken } = PINIA_LAYOUT();
    removeRequestToken(response.config);
    const res = response.data;
    if ((res.code >= 200 && res.code < 300) || typeOf(res) === "Blob") {
      return Promise.resolve(res);
    } else {
      return errorHandle(res);
    }
  },
  (error) => {
    if (error) {
      const errors = error.response.data;
      return errorHandle(errors);
    }
  }
);

// 提示错误信息
function tip(message) {
  ElMessage({
    message,
    grouping: true,
    type: "error",
  });
}
function login() {
  router.replace({
    path: "/login",
    query: {
      redirect: router.currentRoute.value.fullPath,
    },
  });
}
function errorHandle({ code, msg }) {
  switch (code) {
    case 401:
    case 403:
      login();
      tip(msg);
      removeStorage(VITE_BASE_TOKEN_NAME);
      PINIA_USER().$reset();
      break;
    default:
      break;
  }
  return Promise.reject(msg);
}

export default request;
