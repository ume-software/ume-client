import logo from 'public/ume-logo-2.svg'

import React from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const Header: React.FC = () => {
  const router = useRouter()

  return (
    <div className="fixed z-10 flex items-center w-full h-16 bg-[#100C2E]">
      <div>
        <span className="pl-8">
          <Image className="mx-auto" width={160} height={40} alt="logo-ume" src={logo} layout="fixed" />
        </span>
        <span className="text-white font-bold">
          <Link href={'/'}>Trang chủ</Link>
        </span>
      </div>
    </div>
  )
}
