import ImgForEmpty from 'public/img-for-empty.png'

import { Carousel } from 'antd'
import Image from 'next/legacy/image'

const GamePlayed = (props: { data }) => {
  return (
    <>
      <p className="font-roboto font-bold text-white text-3xl">{props.data.skill.name}</p>
      <Carousel autoplay>
        {props.data.images?.map((item, index) => <Image key={index} src={item} alt="Game Image" />) || (
          <>
            <Image src={ImgForEmpty} alt="Empty" />
            <p className="font-roboto font-semibold text-white text-2xl text-center leading-9">Chả có gì ở đây cả</p>
          </>
        )}
      </Carousel>
      <span className="font-roboto font-normal text-lg leading-9">{props.data.description}</span>
    </>
  )
}
export default GamePlayed
