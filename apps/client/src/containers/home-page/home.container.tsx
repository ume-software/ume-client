import cover from 'public/cover.png'

import Image from 'next/legacy/image'

import { AppLayout } from '~/components/layouts/app-layout/app-layout'

const HomePage = (props) => {
  return (
    <AppLayout {...props}>
      <div className="flex min-h-screen grow">
        <div className=" bg-dark-50">
          <Image className="w-full" src={cover} alt="cover"></Image>
        </div>
      </div>
    </AppLayout >
  )
}

export default HomePage
