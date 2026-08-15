import { RequestConfig } from "./types";
import { requestInterceptor, responseInterceptor } from "./interceptors";

/**
 * HTTP请求函数
 * @param config 请求配置
 * @returns
 */
const request = (config: RequestConfig) => {
  const processedConfig = requestInterceptor(config);
  const url = `${import.meta.env.VITE_BASE_URL}${processedConfig.url}`;
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method: processedConfig.method,
      data: processedConfig.data,
      header: processedConfig.headers,
      success: (res) => {
        try {
          resolve(responseInterceptor(res));
        } catch (error) {
          reject(error);
        }
      },
      fail: (err) => {
        reject("请求失败", err);
      },
    });
  });
};

export const get = (url: string, data?: any) =>
  request({ url, method: "GET", data });

export const post = (url: string, data?: any) =>
  request({ url, method: "POST", data });
