export const API_ENDPOINT =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000/api'
    : 'https://feedbackok.com/api'
