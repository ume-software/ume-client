export const getEnv = () => {
  const baseUmeServiceURL = process.env.NEXT_PUBLIC_BASE_BOOKING_API_URL ?? 'http://localhost:5698'
  const baseChattingURL = process.env.NEXT_PUBLIC_BASE_CHATTING_API_URL ?? 'http://localhost:5587'
  const baseLivestreamURL = process.env.NEXT_PUBLIC_BASE_LIVESTREAM_API_URL ?? 'http://localhost:5687'
  const baseUploadServiceURL = process.env.NEXT_PUBLIC_BASE_UPLOAD_SERVICE_API_URL ?? 'https://api.ume.software:8000'

  const baseSocketBookingURL = process.env.NEXT_PUBLIC_BASE_BOOKING_SOCKET_URL ?? 'https://api.ume.software:8001'
  const baseSocketChattingURL = process.env.NEXT_PUBLIC_BASE_CHATTING_SOCKET_URL ?? 'https://api.ume.software:8002'

  const agoraAppID = process.env.AGORA_APP_ID ?? 'deb87355aa6647739307678644d833cb'
  return {
    baseUmeServiceURL,
    baseChattingURL,
    baseLivestreamURL,
    baseSocketBookingURL,
    baseSocketChattingURL,
    baseUploadServiceURL,
    agoraAppID,
  }
}
