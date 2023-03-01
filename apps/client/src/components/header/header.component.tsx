import logo from 'public/ume-logo-2.svg'
import { Button } from '@ume/ui'
import React from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const Header: React.FC = () => {
  const router = useRouter()

  return (
    <div className="fixed z-10 flex items-center justify-between w-full h-16 bg-umeHeader ">
      <div className='flex items-center '>
        <span className="pl-6">
          <Image width={160} height={40} alt="logo-ume" src={logo} layout="fixed" />
        </span>
        <span className="text-white font-semibold text-xl align-middle mr-6">
          <Link href={'/'}>Trang chủ</Link>
        </span>
        <span className="text-white font-semibold text-xl align-middle mr-6">
          <Link href={'/'}>Tạo phòng</Link>
        </span>
        <span className="text-white font-semibold text-xl align-middle">
          <Link href={'/'}>Cộng đồng</Link>
        </span>
      </div>
      <div className='flex items-center'>
        <div className="pr-6 flex flex-row-auto" >
          <span className='mr-5'>
            <Button
              name='register'
              customCSS='bg-[#2A235A] p-2 rounded-3xl max-h-10 w-[170px] text-[18px]'
              type='button'
            >
              Trở thành ume
            </Button>
          </span>
          <span className='mr-5'>
            <Button
              name='register'
              customCSS='bg-[#2A235A] p-2 rounded-3xl max-h-10 w-[130px] text-[18px]'
              type='button'
            >
              Đăng nhập
            </Button>
          </span>
          <span>
            <Button
              name='register'
              customCSS='bg-[#5B8FB9] p-2 rounded-3xl max-h-10 w-[130px] text-[18px]'
              type='button'
            >
              Đăng ký
            </Button>
          </span>
        </div>
      </div>
    </div>
  )
}
