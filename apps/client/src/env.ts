export const getEnv = () => {
  const baseIdentityURL = process.env.NEXT_PUBLIC_BASE_IDENTITY_API_URL || 'http://localhost:5987'
  const baseBookingURL = process.env.NEXT_PUBLIC_BASE_BOOKING_API_URL || 'http://localhost:5997'
  const baseChattingURL = process.env.NEXT_PUBLIC_BASE_CHATTING_API_URL || 'http://localhost:5587'
  const baseLivestreamURL = process.env.NEXT_PUBLIC_BASE_LIVESTREAM_API_URL || 'http://localhost:5687'

  const baseSocketBookingURL =
    process.env.NEXT_PUBLIC_BASE_BOOKING_SOCKET_URL || 'http://ume.software:8101/booking-service/socket'
  const baseSocketChattingURL =
    process.env.NEXT_PUBLIC_BASE_CHATTING_SOCKET_URL || 'http://ume.software:8102/chatting-service/socket'
  return {
    baseIdentityURL,
    baseBookingURL,
    baseChattingURL,
    baseLivestreamURL,
    baseSocketBookingURL,
    baseSocketChattingURL,
  }
}
