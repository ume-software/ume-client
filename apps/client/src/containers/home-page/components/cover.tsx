import cover1 from 'public/cover1.jpg'
import cover2 from 'public/cover2.jpg'
import cover3 from 'public/cover3.jpg'

import { Carousel } from 'antd'
import Image from 'next/legacy/image'

const Cover = () => {
  return (
    <div>
      <Carousel autoplay effect="fade" style={{ borderRadius: 20 }}>
        <div>
          <Image className="object-fill h-full" src={cover1} objectFit="fill" layout="responsive" alt="cover"></Image>
        </div>
        <div>
          <Image className="object-fill h-full " src={cover2} objectFit="fill" layout="responsive" alt="cover"></Image>
        </div>
        <div>
          <Image className="object-fill h-full" src={cover3} objectFit="fill" layout="responsive" alt="cover"></Image>
        </div>
      </Carousel>
    </div>
  )
}

export default Cover
