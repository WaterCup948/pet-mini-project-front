import { RequestConfig } from "./types";

const getToken = () => uni.getStorageSync("token") || "";

// 请求拦截器
export const requestInterceptor = (config: RequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
};

// 响应拦截器
export const responseInterceptor = (response: any) => {
  if (response.statusCode !== 200) {
    throw new Error("请求失败");
  }
  if (!response.data.success) {
    throw new Error("请求失败");
  }
  return response.data.data;
};
