import { Star } from '@icon-park/react'
import ImgForEmpty from 'public/img-for-empty.png'

import { Carousel } from 'antd'
import Image from 'next/legacy/image'

import { trpc } from '~/utils/trpc'

const GamePlayed = (props: { data }) => {
  let feedbackGame: any
  const {
    data: feedback,
    isLoading: loadingFeedback,
    isFetching,
  } = trpc.useQuery(['booking.getFeedbackSkillById', props.data.id as string])
  if (loadingFeedback) {
    return <></>
  }
  feedbackGame = feedback?.data?.row

  return (
    <>
      <div className="bg-zinc-800 rounded-3xl p-10">
        <p className="font-roboto font-bold text-white text-3xl">{props.data.skill.name}</p>
        <Carousel autoplay>
          {props.data.images?.map((item, index) => <Image key={index} src={item} alt="Game Image" />) || (
            <>
              <Image src={ImgForEmpty} alt="Empty" />
              <p className="font-roboto font-semibold text-white text-2xl text-center leading-9">Chưa có gì ở đây cả</p>
            </>
          )}
        </Carousel>
        <span className="font-roboto font-normal text-lg leading-9">{props.data.description}</span>
      </div>
      <div className="bg-zinc-800 rounded-3xl p-5">
        <div className="flex flex-col p-3 gap-5">
          <p className="font-inter font-bold text-4xl">Đánh giá</p>

          {feedbackGame.length > 0 ? (
            feedbackGame?.map((feedback) => (
              <div key={feedback.id} className="grid grid-cols-10 border-2 border-gray-600 rounded-lg p-3">
                <div className="col-span-1">
                  <Image
                    className="object-cover rounded-full"
                    width={55}
                    height={55}
                    src={feedback.booking.booker.avatarUrl || ImgForEmpty}
                    alt="Empty Image"
                  />
                </div>
                <div className="col-span-9 gap-3">
                  <div className="flex flex-row justify-between">
                    <span className="font-roboto font-bold text-2xl leading-9">{feedback.booking.booker.name}</span>

                    <div className="flex flex-row items-center gap-1">
                      <p className="font-roboto font-normal text-lg">{feedback.amountStart}</p>
                      <Star theme="filled" size="15" fill="#FFDF00" />
                    </div>
                  </div>
                  <span className="font-normal text-md">{feedback.content}</span>
                </div>
              </div>
            ))
          ) : (
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
export default GamePlayed
