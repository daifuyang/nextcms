import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import _ from 'lodash';

// 创建一个 axios 实例
const instance = axios.create({
  baseURL: '/',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  // 如果token存在，则将其添加到请求头的Authorization字段中
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 导出一个封装后的请求函数
export const request = (url: string, config: AxiosRequestConfig = {}): Promise<AxiosResponse> => {
  let newConfig: AxiosRequestConfig = {};

  if (_.lowerCase(config.method) !== 'post') {
    newConfig.params = config;
  } else {
    newConfig = { ...config };
  }
  newConfig.url = url;

  return instance(newConfig).then((response) => {
    return response.data;
  });
};
