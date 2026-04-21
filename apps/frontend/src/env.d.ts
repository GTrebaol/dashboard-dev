/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SONAR_PROJECTS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
