import errorImage from 'public/404_error.png'

import Head from 'next/head'
import Image from 'next/legacy/image'
import Link from 'next/link'

const Error404CustomPage = () => {
  return (
    <div className="bg-umeBackground">
      <Head>
        <title>UME | 404</title>
      </Head>
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <Image src={errorImage} alt="featureUpdate" objectFit="cover" />
        <Link href={'/'} className="px-2 py-1 text-4xl font-semibold text-white hover:bg-slate-500 rounded-2xl">
          Trở về trang chủ
        </Link>
      </div>
    </div>
  )
}

export default Error404CustomPage
