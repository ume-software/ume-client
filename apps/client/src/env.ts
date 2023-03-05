export const getENV = () => {
    const baseIdentityURL = process.env.NEXT_PUBLI_BASE_IDENTITY_API_URL || 'https://identity.dev.ume-software.me'
    const baseBookingURL = process.env.NEXT_PUBLIC_BASE_BOOKING_API_URL || 'https://booking.dev.ume-software.me'

    return {
        baseIdentityURL,
        baseBookingURL
    }
}