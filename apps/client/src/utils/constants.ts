export const MISSING_REQUIRED_FIELD_MESSAGE = ''

export const getSocket = () => {
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
