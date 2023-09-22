import { FullScreen, Star } from '@icon-park/react'
import ImgForEmpty from 'public/img-for-empty.png'

import Image from 'next/image'
import { GetProfileProviderBySlugResponse } from 'ume-service-openapi'

const PersonalInformation = (props: { data: GetProfileProviderBySlugResponse }) => {
  return (
    <>
      <div className="bg-zinc-800 rounded-3xl p-10">
        <div className="flex flex-col gap-10">
          <span className="font-roboto font-normal text-lg leading-9">{props.data?.description}</span>
        </div>
      </div>
    </>
  )
}
export default PersonalInformation
