import ImgForEmpty from 'public/img-for-empty.png'

import { Rate } from 'antd'
import Image from 'next/legacy/image'
import { UserInformationResponse } from 'ume-service-openapi'

import { CommentSkeletonLoader } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

const PersonalIntroduce = (props: { data: UserInformationResponse }) => {
  const feedbackByUserSlug =
    trpc.useQuery(['booking.getFeedbackServiceByUserSlug', props.data.slug ?? props.data.id], {
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      cacheTime: 0,
      refetchOnMount: true,
      enabled: !!props.data.slug || !!props.data.id,
    }) ?? undefined
  return (
    <>
      <div className="p-10 bg-zinc-800 rounded-3xl">
        <div className="flex flex-col gap-10">
          <span className="text-lg font-normal leading-9 font-roboto">{props.data?.providerConfig?.description}</span>
        </div>
      </div>
      {!feedbackByUserSlug.isLoading && feedbackByUserSlug.data?.success ? (
        <div className="relative p-5 bg-zinc-800 rounded-3xl">
          <div className="h-[600px] flex flex-col gap-5 p-3 overflow-y-auto">
            <p className="text-2xl font-bold font-inter">Đánh giá</p>
            {Number(feedbackByUserSlug.data.data.row?.length || 0) > 0 ? (
              feedbackByUserSlug.data.data.row?.map((feedback) => (
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
                    <span className="text-sm font-normal opacity-30">
                      -- {feedback.booking?.providerService?.service?.name} --
                    </span>
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
        </div>
      ) : (
        <div className="relative p-5 bg-zinc-800 rounded-3xl">
          <CommentSkeletonLoader />
        </div>
      )}
    </>
  )
}
export default PersonalIntroduce
