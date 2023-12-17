import logo from 'public/ume-logo-2.svg'

import Image from 'next/legacy/image'
import Link from 'next/link'

export const Footer = () => {
  return (
    <div className="grid w-full grid-cols-12 gap-4 py-8 bg-umeHeader min-h-[10vh]">
      <div className="col-span-4 col-start-2 ">
        <Image width={160} height={40} alt="logo-ume" src={logo} layout="fixed" />
        <div className="flex flex-col justify-center mx-auto mt-2 text-slate-300"></div>
      </div>
      <div className="col-span-2 text-white">
        <div className="text-xl font-medium">Bắt đầu</div>
        <div className="flex flex-col justify-center mx-auto mt-2 text-slate-300">
          <Link href="/">Trang chủ</Link>
        </div>
      </div>
      <div className="col-span-2 col-end-12 text-white">
        <div className="text-xl font-medium">Điều khoản về người dùng</div>
        <div className="flex flex-col justify-center mx-auto mt-2 text-slate-300">
          <Link href="/terms-of-service">Điều khoản sử dụng</Link>
          <Link href="/contact-us">Liên hệ với chúng tôi</Link>
        </div>
      </div>
    </div>
  )
}
