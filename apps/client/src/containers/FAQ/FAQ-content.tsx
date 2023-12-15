import FAQKYC1 from 'public/FAQ/KYC/1.png'
import FAQKYC2 from 'public/FAQ/KYC/2.png'
import FAQKYC3 from 'public/FAQ/KYC/3.png'
import FAQKYC4 from 'public/FAQ/KYC/4.png'
import FAQKYC5 from 'public/FAQ/KYC/5.png'
import FAQProvider1 from 'public/FAQ/Provider-setting-profile/1.png'
import FAQProvider2 from 'public/FAQ/Provider-setting-profile/2.png'
import FAQProvider3 from 'public/FAQ/Provider-setting-profile/3.png'
import FAQProvider4 from 'public/FAQ/Provider-setting-profile/4.png'
import FAQProvider5 from 'public/FAQ/Provider-setting-profile/5.png'
import FAQProvider6 from 'public/FAQ/Provider-setting-profile/6.png'

import { ReactNode } from 'react'

import { StaticImageData } from 'next/legacy/image'

interface AccoditionProps {
  key: string
  title: ReactNode
  descriptions: { content: string; img: StaticImageData | undefined }[]
}

export const FAQContents: AccoditionProps[] = [
  {
    key: 'KYC',
    title: 'Xác thực tài khoản',
    descriptions: [
      { content: 'Cick vào ảnh đại diện của bạn.', img: FAQKYC1 },
      { content: 'Chọn "Cài đặt tài khoản".', img: FAQKYC2 },
      { content: 'Tại trang "Thông tin cá nhân" ấn vào nút "Xác minh danh tính".', img: FAQKYC3 },
      { content: 'Nhập đầy đủ các thông tin và ấn vào tiếp tục.', img: FAQKYC4 },
      { content: 'Tải hình ảnh để xác thực lên và nhấn xác minh.', img: FAQKYC5 },
      { content: 'Yêu cầu xác minh danh tính của bạn đã được gửi và đợi quản trị viên duyệt.', img: undefined },
    ],
  },
  {
    key: 'ProviderSettingProfile',
    title: 'Nhà cung cấp',
    descriptions: [
      { content: 'Nhấn vào "Nhà cung cấp" tại trang cài đặt tài khoản.', img: FAQProvider1 },
      { content: 'Nhấn vào nút "Trở thành nhà cung cấp".', img: FAQProvider2 },
      { content: 'Điền vào phần giới thiệu để gây ấn tượng với người khác.', img: FAQProvider3 },
      { content: 'Lựa chọn các dịch vụ và nhấn lưu.', img: FAQProvider4 },
      { content: 'Chọn chấp nhận.', img: FAQProvider5 },
      { content: 'Bây giờ chọn "Tài khoản của tôi" tại ảnh đại diện để thấy thành quả.', img: FAQProvider6 },
    ],
  },
]
