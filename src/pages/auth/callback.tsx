import { createFileRoute } from '@tanstack/react-router'
import { handleGoogleCallback } from './utils/handle-google-callback'

export const Route = createFileRoute('/auth/callback')({
  beforeLoad: handleGoogleCallback
})
