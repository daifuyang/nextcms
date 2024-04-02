import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import _ from "lodash";

// 创建一个 axios 实例
const instance = axios.create({
  baseURL: "/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

instance.interceptors.request.use((config) => {
  const str = localStorage.getItem("token");
  // 如果token存在，则将其添加到请求头的Authorization字段中
  if (str) {
    const token = JSON.parse(str)
    config.headers.Authorization = `Bearer ${token.accessToken}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 对响应数据做点什么
    return response.data;
  },
  (error: AxiosError) => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export {
  instance as request
}
