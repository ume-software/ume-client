import { GrinningFaceWithOpenMouth, Picture, Star } from '@icon-park/react'
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
  } = trpc.useQuery(['booking.getFeedbackServiceById', props.data.id as string])
  if (loadingFeedback) {
    return <></>
  }
  feedbackGame = feedback?.data?.row

  return (
    <>
      <div className="p-10 bg-zinc-800 rounded-3xl">
        <p className="text-3xl font-bold text-white font-roboto">{props.data.service.name}</p>
        <Carousel autoplay>
          {props.data.images?.map((item, index) => <Image key={index} src={item} alt="Game Image" />) || (
            <>
              <Image src={ImgForEmpty} alt="Empty" />
              <p className="text-2xl font-semibold leading-9 text-center text-white font-roboto">Chưa có gì ở đây cả</p>
            </>
          )}
        </Carousel>
        <span className="text-lg font-normal leading-9 font-roboto">{props.data.description}</span>
      </div>
      <div className="relative p-5 bg-zinc-800 rounded-3xl">
        <div className="h-[600px] flex flex-col gap-5 p-3 overflow-y-auto">
          <p className="text-4xl font-bold font-inter">Đánh giá</p>

          {feedbackGame.length > 0 ? (
            feedbackGame?.map((feedback) => (
              <div key={feedback.id} className="grid grid-cols-10 p-3 border-2 border-gray-600 rounded-lg">
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
                    <span className="text-2xl font-bold leading-9 font-roboto">{feedback.booking.booker.name}</span>

                    <div className="flex flex-row items-center gap-1">
                      <p className="text-lg font-normal font-roboto">{feedback.amountStart}</p>
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
              <p className="text-2xl font-bold text-center font-inter">Chưa có đánh giá</p>
            </>
          )}
        </div>
        <div className="bg-transparent flex items-center gap-3">
          <div className="p-2 content-center bg-[#413F4D] rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400">
            <Picture theme="outline" size="24" fill="#FFFFFF" strokeLinejoin="bevel" />
          </div>

          <div className="w-[100%] h-[40px] relative">
            <input
              type="text"
              className="h-[40px] w-full bg-[#413F4D] text-white text-lg font-medium pl-5 pr-10 rounded-full"
              placeholder="Nhập bình luận"
              // value={messageInput}
              // onChange={(e) => setMessageInput(e.target.value)}
              // onKeyPress={handleKeyPress}
            />
            <div className="absolute transform -translate-y-1/2 rounded-full cursor-pointer top-1/2 right-3 z-4 hover:bg-gray-500 active:bg-gray-400">
              <GrinningFaceWithOpenMouth theme="outline" size="24" fill="#FFFFFF" strokeLinejoin="bevel" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default GamePlayed
