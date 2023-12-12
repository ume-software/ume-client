export const getEnv = () => {
  const baseUmeServiceURL = process.env.NEXT_PUBLIC_BASE_UME_API_URL ?? 'https://api.ume.software:8001/ume-service'
  const baseChattingURL =
    process.env.NEXT_PUBLIC_BASE_CHATTING_API_URL ?? 'https://api.ume.software:8002/chatting-service'
  const baseUploadFileURL =
    process.env.NEXT_PUBLIC_BASE_UPLOAD_API_URL ?? 'https://api.ume.software:8000/upload-service'

  const baseSocketBookingURL =
    process.env.NEXT_PUBLIC_BASE_UME_SOCKET_URL ?? 'https://api.ume.software:8001/ume-service/socket'
  const baseSocketChattingURL =
    process.env.NEXT_PUBLIC_BASE_CHATTING_SOCKET_URL ?? 'https://api.ume.software:8002/chatting-service/socket'
  return {
    baseUmeServiceURL,
    baseChattingURL,
    baseSocketBookingURL,
    baseSocketChattingURL,
    baseUploadFileURL,
  }
}
