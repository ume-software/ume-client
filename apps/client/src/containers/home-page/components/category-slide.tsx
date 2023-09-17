import React from 'react'

import Image from 'next/legacy/image'
import Link from 'next/link'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

interface ICategoryProps {
  skills: any[]
}

const CategorySlide = (props: ICategoryProps) => {
  return (
    <>
      <Swiper spaceBetween={0} slidesPerView="auto" mousewheel={true}>
        {props?.skills.map((skill) => (
          <SwiperSlide className="!w-[200px]" key={skill.id}>
            <div className={`p-3 duration-500 ease-in-out cursor-pointer hover:scale-105`}>
              <Link href={`/filter-skill/${skill.name}?serviceId=${skill.id}`}>
                <div className="relative w-[170px] h-[260px]">
                  <Image
                    key={skill.id}
                    className="absolute rounded-xl pointer-events-none object-cover"
                    layout="fill"
                    src={skill.imageUrl}
                    alt={skill.name}
                  />
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default CategorySlide
