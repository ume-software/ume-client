import Head from 'next/head'

const ContactUsePage = () => {
  const handleOpenEmail = () => {
    const emailAddress = 'dotranminhchu@gmail.com'
    const subject = 'Subject of the email' // You can customize the subject if needed
    const body = 'Content of the email' // You can customize the body if needed

    const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

    // Open the default email client
    window.location.href = mailtoLink
  }

  return (
    <div>
      <Head>
        <title>UME | Liên hệ</title>
      </Head>
      <div className="flex items-center justify-center h-[73.5vh] text-white">
        <div className="">
          <h1 className="mb-6 text-3xl font-bold">Liên hệ với chúng tôi</h1>
          <p className="mb-4">
            Chúng tôi luôn sẵn lòng lắng nghe và giải đáp mọi thắc mắc của bạn. Hãy liên hệ với chúng tôi thông qua các
            cách sau:
          </p>
          <div className="flex flex-col space-y-4">
            <div>
              <h2 className="mb-2 text-xl font-semibold">Thông tin liên hệ</h2>
              <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ, Quốc gia ABC</p>
              <p>Email: info@ume.com</p>
              <p>Điện thoại: (+84) 123 456 789</p>
            </div>

            <div>
              <h2 className="mb-2 text-xl font-semibold">Gửi thông điệp</h2>
              <button onClick={handleOpenEmail} className="p-2 text-white bg-blue-500 rounded hover:bg-blue-700">
                Mở hộp thư
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUsePage
