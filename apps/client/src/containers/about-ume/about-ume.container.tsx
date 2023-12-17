import image from 'public/cover3.jpg'

import Head from 'next/head'
import Image from 'next/legacy/image'

const AboutUmePage = () => {
  return (
    <div>
      <Head>
        <title>UME | Về UME</title>
        <meta
          name="description"
          content="Chào mừng bạn đến với UME - Nền tảng cung cấp những tính năng cần thiết cho những người muốn bán thời gian rảnh rỗi của họ bằng cách chơi game với người khác, cũng như cho những người muốn tìm và đặt lịch để chơi game cùng người khác thông qua các kênh như chat. Hơn nữa, tính năng đăng bài còn tạo ra một cộng đồng giúp người dùng trong hệ thống tương tác nhiều hơn thông qua việc phản ứng và bình luận."
        />
      </Head>
      <div>
        <div className="mx-20 h-[600px]">
          <Image src={image} objectFit="cover" alt="about-ume" width={1920} height={600} className="rounded-lg" />
        </div>
        <div className="mx-10 text-center text-white">
          <h2 className="mb-4 text-3xl font-bold">Chào mừng đến với UME</h2>
          <p className="text-lg">
            UME không chỉ là một nền tảng, mà còn là một cơ hội cho những người muốn chia sẻ thời gian rảnh rỗi bằng
            cách tham gia chơi game với người khác, và cho những người muốn tìm kiếm và đặt lịch để chơi game cùng với
            họ thông qua các kênh như chat.
          </p>
          <p className="mt-4 text-lg">
            Đặc biệt, tính năng đăng bài còn tạo ra một cộng đồng, giúp người dùng tương tác nhiều hơn thông qua việc
            phản ứng và bình luận. Điều này không chỉ tạo ra một không gian giải trí mà còn kết nối cộng đồng yêu thích
            game của bạn, giúp mọi người gặp gỡ và chia sẻ niềm đam mê chung.
          </p>
          <p className="mt-4 text-lg">
            Hãy trải nghiệm UME ngay hôm nay và khám phá thế giới đầy sáng tạo và kết nối, nơi mà mỗi giờ rảnh rỗi trở
            nên ý nghĩa hơn.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AboutUmePage
