export interface RequestConfig {
  url: string;
  method: "GET" | "POST";
  data?: any;
  headers?: Record<string, string>;
  //   responseType?: "json" | "text";
  //   timeout?: number;
}
