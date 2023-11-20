export const getEnv = () => {
  const baseUmeServiceURL = process.env.NEXT_PUBLIC_BASE_BOOKING_API_URL ?? 'http://localhost:5698'
  const baseChattingURL = process.env.NEXT_PUBLIC_BASE_CHATTING_API_URL ?? 'http://localhost:5587'
  const baseLivestreamURL = process.env.NEXT_PUBLIC_BASE_LIVESTREAM_API_URL ?? 'http://localhost:5687'

  const baseSocketBookingURL =
    process.env.NEXT_PUBLIC_BASE_BOOKING_SOCKET_URL ?? 'http://ume.software:8101/booking-service/socket'
  const baseSocketChattingURL = process.env.NEXT_PUBLIC_BASE_CHATTING_SOCKET_URL ?? 'http://18.136.124.5:8002'
  return {
    baseUmeServiceURL,
    baseChattingURL,
    baseLivestreamURL,
    baseSocketBookingURL,
    baseSocketChattingURL,
  }
}
