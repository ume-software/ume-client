export const getEnv = () => {
  const baseUmeServiceURL = process.env.NEXT_PUBLIC_BASE_UME_API_URL ?? 'https://api.ume.software:8001'
  const baseChattingURL = process.env.NEXT_PUBLIC_BASE_CHATTING_API_URL ?? 'https://api.ume.software:8002'
  const baseUploadFileURL = process.env.NEXT_PUBLIC_BASE_UPLOAD_API_URL ?? 'https://api.ume.software:8000'

  const baseSocketBookingURL = process.env.NEXT_PUBLIC_BASE_UME_SOCKET_URL ?? 'https://api.ume.software:8001'
  const baseSocketChattingURL = process.env.NEXT_PUBLIC_BASE_CHATTING_SOCKET_URL ?? 'https://api.ume.software:8002'
  return {
    baseUmeServiceURL,
    baseChattingURL,
    baseSocketBookingURL,
    baseSocketChattingURL,
    baseUploadFileURL,
  }
}
