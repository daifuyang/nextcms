import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from "axios";

// 定义一个接口来表示 API 响应的数据结构
interface ApiResponse {
  code: number;
  msg: string;
  data: any;
}

let baseURL = '/'
if (typeof window === 'undefined') {
  baseURL = `http://localhost:${process.env.PORT}`
}

export const instance =  axios.create({
  baseURL,
  timeout: 10000 // 请求超时时间
});

// 创建一个封装了 Axios 的类
class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    // 初始化 Axios 实例
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000 // 请求超时时间
    });

    // 在请求发送前拦截请求，可以添加请求头等操作
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig<any>) => {
        // 在请求发送前可以进行一些操作
        if (typeof window !== 'undefined') {
          const str = localStorage.getItem("token");
          // 如果token存在，则将其添加到请求头的Authorization字段中
          if (str) {
            const token = JSON.parse(str);
            config.headers.Authorization = `Bearer ${token.accessToken}`;
          }
        }

        return config;
      },
      (error: AxiosError) => {
        // 对请求错误做些什么
        return Promise.reject(error);
      }
    );

    // 在收到响应后拦截响应，可以统一处理响应数据或错误
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<any, any>) => {
        // 对响应数据进行处理
        if (response.data.code === -1) {
          window.location.href = "/admin/login";
        }
        return response;
      },
      (error: AxiosError) => {
        // 对响应错误进行处理
        return Promise.reject(error);
      }
    );
  }

  instance(config: AxiosRequestConfig<any>) {
    return this.axiosInstance(config);
  }

  // 封装 GET 请求
  get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse> {
    return this.axiosInstance.get<ApiResponse>(url, config).then((response) => response.data);
  }

  // 封装 POST 请求
  post<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse> {
    return this.axiosInstance.post<ApiResponse>(url, config).then((response) => response.data);
  }

  // 封装 PUT 请求
  put<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse> {
    return this.axiosInstance.put<ApiResponse>(url, config).then((response) => response.data);
  }

  // 封装 DELETE 请求
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse> {
    return this.axiosInstance.delete<ApiResponse>(url, config).then((response) => response.data);
  }
}


const request = new HttpClient(baseURL);


export function createAxiosFetchHandler(config?: Record<string, unknown>) {
  return async function (options: any) {
    const requestConfig: any = {
      ...options,
      url: options.uri,
      method: options.method,
      data: options.params,
      headers: options.headers,
      ...config
    };
    const response = await request.instance(requestConfig);
    if(response.status === 200) {
      return response.data;
    }
    return response;
  };
}

export { request };
