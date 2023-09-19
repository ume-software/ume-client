import { GrinningFaceWithOpenMouth, Picture, Send, Star } from '@icon-park/react'
import { Button, InputWithButton } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'

import { useEffect, useState } from 'react'

import { Carousel, Rate } from 'antd'
import Image from 'next/legacy/image'
import { FeedbackPagingResponse, ProviderSkillResponse } from 'ume-service-openapi'

import { trpc } from '~/utils/trpc'

interface PostFeedbackProps {
  rate: number
  content?: string
}

const GamePlayed = (props: { data: ProviderSkillResponse }) => {
  const feedbackGame = trpc.useQuery(['booking.getFeedbackSkillById', props.data.id!.toString()]) || undefined
  const postFeedback = trpc.useMutation(['booking.postFeedback'])

  const [feedback, setFeedback] = useState<PostFeedbackProps>({ rate: 5, content: '' })

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendFeedback()
    }
  }

  const handleSendFeedback = () => {
    if (!!feedback.rate) {
      postFeedback.mutate(
        { id: props.data.id!.toString(), feedback: { amountStar: feedback.rate, content: feedback.content } },
        {
          onSuccess(data) {
            console.log(data.success)
          },
        },
      )
    }
  }

  return (
    <>
      <div className="p-10 bg-zinc-800 rounded-3xl">
        <p className="text-3xl font-bold text-white font-roboto">{props.data.skill?.name}</p>
        {/* <Carousel autoplay>
          {props.data.images?.map((item, index) => <Image key={index} src={item} alt="Game Image" />) || (
            <>
              <Image src={ImgForEmpty} alt="Empty" />
              <p className="text-2xl font-semibold leading-9 text-center text-white font-roboto">Chưa có gì ở đây cả</p>
            </>
          )}
        </Carousel> */}
        <span className="text-lg font-normal leading-9 font-roboto">
          {props.data.description ?? 'Không có giới thiệu'}
        </span>
      </div>
      {feedbackGame.data?.success ? (
        <>
          <div className="relative p-5 bg-zinc-800 rounded-3xl">
            <div className="h-[600px] flex flex-col gap-5 p-3 overflow-y-auto">
              <p className="text-4xl font-bold font-inter">Đánh giá</p>

              {Number(feedbackGame.data.data.row?.length || 0) > 0 ? (
                feedbackGame.data.data.row?.map((feedback) => (
                  <div key={feedback.id} className="grid grid-cols-10 p-3 border-b-2 border-gray-600">
                    <div className="col-span-1">
                      <Image
                        className="object-cover rounded-full"
                        width={55}
                        height={55}
                        src={feedback?.booking?.booker?.avatarUrl || ImgForEmpty}
                        alt="Empty Image"
                      />
                    </div>
                    <div className="col-span-9 gap-3">
                      <div className="flex flex-row justify-between">
                        <span className="text-2xl font-bold leading-9 font-roboto">
                          {feedback?.booking?.booker?.name}
                        </span>

                        <div className="flex flex-row items-center gap-2">
                          {/* <p className="text-lg font-normal font-roboto">{feedback.amountStar}</p> */}
                          <Rate disabled defaultValue={feedback.amountStar} />
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
            <div className="bg-transparent flex items-end gap-3">
              <div className="p-2 content-center bg-[#413F4D] rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400">
                <Picture theme="outline" size="24" fill="#FFFFFF" strokeLinejoin="bevel" />
              </div>
              <div className="w-full">
                <div className="p-2">
                  <Rate defaultValue={feedback.rate} onChange={(value) => setFeedback({ ...feedback, rate: value })} />
                </div>
                <InputWithButton
                  className="outline-none bg-[#413F4D] text-white border-none focus:outline-[#6d3fe0] max-h-10 rounded-2xl"
                  placeholder="Bình luận"
                  position={'right'}
                  component={
                    <Button
                      customCSS={`absolute top-0 bottom-0 right-3 ${!!feedback.rate && 'hover:scale-105'} `}
                      onClick={handleSendFeedback}
                      isLoading={postFeedback.isLoading}
                      type="button"
                      icon={<Send theme="filled" size="25" fill="#FFFFFF" strokeLinejoin="bevel" />}
                    />
                  }
                  onKeyPress={handleKeyPress}
                  value={feedback.content}
                  onChange={(e) => setFeedback({ ...feedback, content: e.target.value })}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default GamePlayed
