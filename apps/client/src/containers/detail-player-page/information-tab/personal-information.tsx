import { FullScreen, Star } from '@icon-park/react'
import ImgForEmpty from 'public/img-for-empty.png'

import Image from 'next/image'

const PersonalInformation = (props: { data }) => {
  let rate = 0
  let sumRate = 0
  const reviews = props.data.reviews || 0
  if (reviews.length > 0) {
    for (let index = 0; index < reviews.length; index++) {
      rate += reviews.rate
    }
    sumRate = rate / reviews.length
  }

  return (
    <>
      <div className="bg-zinc-800 rounded-3xl p-10">
        <div className="flex flex-col gap-10">
          <p className="font-inter font-bold text-4xl">{props.data?.title || 'Hello guys!'}</p>
          <span className="font-roboto font-normal text-lg leading-9">{props.data?.description}</span>
        </div>
      </div>
      <div className="bg-zinc-800 rounded-3xl p-5">
        <div className="flex flex-col p-3 gap-5">
          <div className="flex justify-between items-center">
            <p className="font-inter font-bold text-4xl">Đánh giá</p>
            <div className="flex justify-between items-center gap-2">
              {sumRate > 0 ? (
                <>
                  <p className="font-roboto font-normal text-2xl">{sumRate}</p>
                  <Star theme="filled" size="20" fill="#FFDF00" />
                </>
              ) : (
                ''
              )}
            </div>
          </div>
          {props.data.reviews?.map((item) => (
            <div key={item.id} className="flex flex-col border-2 border-gray-600 rounded-lg p-3">
              <div className="flex flex-row justify-between">
                <span className="font-roboto font-bold text-2xl leading-9">{item.name}</span>
                <div className="flex flex-row items-center gap-1 leading-9">
                  <p className="font-roboto font-normal text-lg">{item.rate}</p>
                  <Star theme="filled" size="15" fill="#FFDF00" />
                </div>
              </div>
              <div className="flex flex-row gap-3 text-gray-600 leading-9 truncate">
                {item.serviceUsed.map((service, index) => (
                  <p key={index} className="font-roboto font-normal text-md">
                    {service}
                  </p>
                ))}
              </div>
              <span className="font-roboto font-normal text-lg leading-9">{item.comment}</span>
            </div>
          )) || (
            <>
              <Image src={ImgForEmpty} alt="Empty Image" />
              <p className="text-center font-inter font-bold text-2xl">Chưa có đánh giá</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
export default PersonalInformation
