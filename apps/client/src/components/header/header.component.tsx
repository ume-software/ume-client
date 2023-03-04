import logo from 'public/ume-logo-2.svg'
import { Button } from '@ume/ui'
import React from 'react'
import { Search, Gift } from "@icon-park/react"
import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const Header: React.FC = () => {
  const router = useRouter()

  return (
    <div className="fixed z-10 flex items-center justify-between w-full h-16 bg-umeHeader ">
      <div className='flex items-center '>
        <span className="pl-6">
          <Link href={'/'}><Image width={160} height={40} alt="logo-ume" src={logo} layout="fixed" /></Link>
        </span>
        <span className="mr-6 text-xl font-semibold text-white align-middle hover:scale-105 hover:ease-in-out font-francois">
          <Link href={'/'}>Trang chủ</Link>
        </span>
        <span className="mr-6 text-xl font-semibold text-white align-middle hover:scale-105 hover:ease-in-out font-francois ">
          <Link href={'/'}>Tạo phòng</Link>
        </span>
        <span className="text-xl font-semibold text-white align-middle hover:scale-105 hover:ease-in-out font-francois">
          <Link href={'/'}>Cộng đồng</Link>
        </span>
      </div>
      <div className='flex items-center'>
        <div className="flex pr-6 flex-row-auto" >
          <span className='mr-5'>
            <Button
              name='register'
              customCSS='bg-[#37354F] py-2 hover:scale-105 rounded-3xl max-h-10 w-[160px] text-[15px] font-nunito'
              type='button'
            >
              Trở thành ume
            </Button>
          </span>
          <span className='mr-5 rounded-full hover:scale-110 hover:ease-in-out'>
            <button className='mt-2'><Search size={28} strokeWidth={4} fill="#FFFFFF" /></button>
          </span>
          <span className='mr-5 rounded-ful hover:scale-110 hover:ease-in-out'>
            <button className='mt-2'><Gift size={28} strokeWidth={4} fill="#FFFFFF" /></button>
          </span>
          <span className='mr-5'>
            <Button
              name='register'
              customCSS='bg-[#37354F] py-2 hover:scale-105 rounded-3xl max-h-10 w-[120px] text-[15px] font-nunito'
              type='button'
            >
              Đăng nhập
            </Button>
          </span>
          <span>
            <Button
              name='register'
              customCSS='bg-[#7463F0] py-2 rounded-3xl max-h-10 w-[120px] hover:scale-105 text-[15px] font-nunito'
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
