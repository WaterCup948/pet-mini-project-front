/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 后端请求基础地址 */
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
