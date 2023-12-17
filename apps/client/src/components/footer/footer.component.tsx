import logo from 'public/ume-logo-2.svg'

import Image from 'next/legacy/image'
import Link from 'next/link'

export const Footer = () => {
  return (
    <div className="grid w-full grid-cols-12 gap-4 py-8 bg-umeHeader min-h-[10vh]">
      <div className="col-span-4 col-start-4 ">
        <Image width={160} height={40} alt="logo-ume" src={logo} layout="fixed" />
        <div className="flex flex-col justify-center mx-auto mt-2 text-slate-300">
          <div>
            <h2 className="mb-2 text-xl font-semibold">Thông tin liên hệ</h2>
            <p>Địa chỉ: 123 Đường ABC, Thành phố XYZ, Quốc gia ABC</p>
            <p>Email: info@ume.com</p>
            <p>Điện thoại: (+84) 123 456 789</p>
          </div>
        </div>
      </div>

      <div className="col-span-2 col-end-10 text-white">
        <div className="text-xl font-medium">Điều khoản về người dùng</div>
        <div className="flex flex-col justify-center mx-auto mt-2 text-slate-300">
          <Link prefetch href="/terms-of-service">
            Điều khoản sử dụng
          </Link>
          <Link prefetch href="/contact-us">
            Liên hệ với chúng tôi
          </Link>
          <Link prefetch href="/contact-us">
            Về chúng tôi
          </Link>
        </div>
      </div>
    </div>
  )
}
