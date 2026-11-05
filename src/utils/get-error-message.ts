import axios from 'axios'

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Brak połączenia z serwerem'

    const data: unknown = error.response.data
    if (
      typeof data === 'object' &&
      data !== null &&
      'message' in data &&
      typeof data.message === 'string' &&
      data.message
    ) {
      return data.message
    }
  }

  return fallback
}
