/// <reference types="vite/client" />
/// <reference types="@emotion/react/types/css-prop" />

interface ImportMetaEnv {
  // 다른 환경 변수들에 대한 타입 정의...
  readonly VITE_APP_HIKER_SERVER_ENDPOINT: string;
  readonly VITE_APP_HIKER_WEB_ENDPOINT: string;
  readonly PACKAGE_VERSION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
