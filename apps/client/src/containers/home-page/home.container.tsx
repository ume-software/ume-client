import Image from 'next/legacy/image'
import { AppLayout } from '~/components/layouts/app-layout/app-layout'
import cover from 'public/cover.png'

const HomePage = (props) => {
  return (
    <AppLayout {...props}>
      <div className="flex min-h-screen grow">
        <div className='mx-40 bg-dark-50'>
          <Image src={cover} alt="cover"></Image>
        </div>
      </div>
      <div className=''>dasdasd</div>
    </AppLayout>
  )
}

export default HomePage
