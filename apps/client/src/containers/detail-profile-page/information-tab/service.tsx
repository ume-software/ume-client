import { Send } from '@icon-park/react'
import { Button, InputWithButton } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import { useAuth } from '~/contexts/auth'

import { useState } from 'react'

import { Rate, notification } from 'antd'
import Image from 'next/legacy/image'
import { useRouter } from 'next/router'
import { ProviderServiceResponse } from 'ume-service-openapi'

import { CommentSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

interface PostFeedbackProps {
  rate: number
  content?: string
}

const Service = (props: { data: ProviderServiceResponse }) => {
  const router = useRouter()
  const slug = router.query

  const accessToken = localStorage.getItem('accessToken')
  const { user } = useAuth()

  const feedbackGame =
    trpc.useQuery(['booking.getFeedbackServiceById', String(props.data.id ?? '')], {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      enabled: !!props.data.id,
    }) ?? undefined
  const { data: userCanFeedBackProvider, isLoading: isUserCanFeedBackProviderLoading } = trpc.useQuery(
    ['booking.getCanFeedbackProvider', String(slug.profileId ?? '')],
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      enabled: !!slug.profileId && !!accessToken,
    },
  )

  const postFeedback = trpc.useMutation(['booking.postFeedback'])
  const utils = trpc.useContext()

  const [feedback, setFeedback] = useState<PostFeedbackProps>({ rate: 5, content: '' })

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendFeedback()
    }
  }

  const handleSendFeedback = () => {
    if (feedback.rate) {
      postFeedback.mutate(
        {
          id: userCanFeedBackProvider?.data.id ?? '',
          feedback: { amountStar: feedback.rate, content: feedback.content },
        },
        {
          onSuccess(data) {
            utils.invalidateQueries('booking.getFeedbackServiceById')
            utils.invalidateQueries('booking.getCanFeedbackProvider')
          },
          onError() {
            notification.error({
              message: 'Gửi đánh giá không thành công',
              description: 'Gửi đánh giá không thành công. Vui lòng thử lại sau!',
              placement: 'bottomLeft',
            })
          },
        },
      )
    }
  }

  return (
    <>
      <div className="p-10 bg-zinc-800 rounded-3xl">
        <p className="text-2xl font-bold text-white font-roboto">{props.data.service?.name}</p>
        <span className="text-lg font-normal leading-9 font-roboto">
          {props.data.description ?? 'Không có giới thiệu'}
        </span>
        <div className="my-5 border-t border-light-900 w-full opacity-30"></div>
        <div className="space-y-2">
          {props.data?.providerServiceAttributes?.map((providerServiceAttribute) => (
            <div key={providerServiceAttribute.id} className="flex items-center gap-3">
              <p className="text-lg font-bold">{providerServiceAttribute.serviceAttribute?.viAttribute}:</p>
              {providerServiceAttribute?.providerServiceAttributeValues?.map((attributeValue) => (
                <div key={attributeValue.id}>
                  <p>
                    {attributeValue.serviceAttributeValue?.viValue ?? attributeValue.serviceAttributeValue?.value},{' '}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {feedbackGame.data?.success && !isUserCanFeedBackProviderLoading ? (
        <div className="relative p-5 bg-zinc-800 rounded-3xl">
          <div className="h-[600px] flex flex-col gap-5 p-3 overflow-y-auto">
            <p className="text-2xl font-bold font-inter">Đánh giá</p>
            {Number(feedbackGame.data.data.row?.length || 0) > 0 ? (
              feedbackGame.data.data.row?.map((feedback) => (
                <div key={feedback.id} className="grid grid-cols-10 p-3 border-b-2 border-gray-600">
                  <div className="col-span-1">
                    <Image
                      className="object-cover rounded-full"
                      width={55}
                      height={55}
                      src={feedback?.booking?.booker?.avatarUrl ?? ImgForEmpty}
                      alt="Empty Image"
                    />
                  </div>
                  <div className="col-span-9 gap-3">
                    <div className="flex flex-row justify-between">
                      <span className="text-2xl font-bold leading-9 font-roboto">
                        {feedback?.booking?.booker?.name}
                      </span>

                      <div className="flex flex-row items-center gap-2">
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
          {userCanFeedBackProvider?.data?.id &&
          userCanFeedBackProvider?.data?.providerService?.id == props.data.id &&
          userCanFeedBackProvider?.data?.bookerId == user?.id ? (
            <div className="flex items-end gap-3 bg-transparent">
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
                      customCSS={`absolute top-2 right-5 bg-transparent ${!!feedback.rate && 'hover:scale-105'} `}
                      onClick={handleSendFeedback}
                      isLoading={postFeedback.isLoading}
                      type="button"
                      icon={<Send theme="filled" size="25" fill="#FFFFFF" strokeLinejoin="bevel" />}
                    />
                  }
                  onKeyDown={handleKeyPress}
                  value={feedback.content}
                  onChange={(e) => setFeedback({ ...feedback, content: e.target.value })}
                />
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
      ) : (
        <div className="relative p-5 bg-zinc-800 rounded-3xl">
          <CommentSkeletonLoader />
        </div>
      )}
    </>
  )
}
export default Service
