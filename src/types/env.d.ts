// Declaration merging with Vite's built-in types requires `interface`
/* oxlint-disable typescript/consistent-type-definitions */
interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_GOOGLE_AUTH_URL: string
  readonly VITE_API_MOCKING?: string
}
