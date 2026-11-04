/// <reference types="vite/client" />

// Declaration merging with Vite's built-in types requires `interface`
/* oxlint-disable typescript/consistent-type-definitions */
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
