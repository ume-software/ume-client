import logo from 'public/ume-logo.png'

import React from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const Header: React.FC = () => {
  const router = useRouter()

  return (
    <div>
      <span className="pl-8">
        <Image className="mx-auto" width={65} height={35} alt="logo" src={logo} layout="fixed" />
      </span>
      <div>

      </div>
    </div>
  )
}
