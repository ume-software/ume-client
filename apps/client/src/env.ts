export const getEnv = () => {
  const baseIdentityURL = process.env.NEXT_PUBLI_BASE_IDENTITY_API_URL || 'http://localhost:5987'
  const baseBookingURL = process.env.NEXT_PUBLIC_BASE_BOOKING_API_URL || 'http://localhost:5997'

  return {
    baseIdentityURL,
    baseBookingURL,
  }
}

export const getSocketEnv = () => {
  const SOCKET_EVENT = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
  }
  const SOCKET_SERVER_EMIT = {
    USER_BOOKING_PROVIDER: 'USER_BOOKING_PROVIDER',
    PROVIDER_HANDLED_BOOKING: 'PROVIDER_HANDLED_BOOKING',
  }

  return {
    SOCKET_EVENT,
    SOCKET_SERVER_EMIT,
  }
}
