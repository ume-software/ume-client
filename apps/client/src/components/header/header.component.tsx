import logo from 'public/ume-logo-2.png'

import React from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const Header: React.FC = () => {
  const router = useRouter()

  return (
    <div className="fixed z-10 flex items-center w-full h-16 bg-[#2A235A]">
      <span className="pl-8F ">
        <Image className="mx-auto" width={65} height={35} alt="logo-ume" src={logo} layout="fixed" />
      </span>
    </div>
  )
}
