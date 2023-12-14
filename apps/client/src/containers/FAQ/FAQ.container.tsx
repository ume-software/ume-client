import { Right } from '@icon-park/react'

import { useState } from 'react'

import Image from 'next/legacy/image'

import { FAQContents } from './FAQ-content'

const FAQContainer = () => {
  const [accoditionTypeSelected, setAccoditionTypeSelected] = useState<string>('KYC')
  return (
    <div className="grid min-h-screen grid-cols-10 mr-10 text-white bg-umeBackground">
      <div className="col-span-10 xl:col-span-2 w-full sticky xl:top-20 top-16 z-[5]">
        <div className="min-w-[150px] min-h-[700px] max-h-screen xl:p-10 py-5 xl:bg-zinc-800 bg-umeBackground xl:rounded-3xl sticky top-20 bottom-20 overflow-y-auto hide-scrollbar">
          {FAQContents.map((content) => (
            <div key={content.key} className="w-full rounded-2xl p-2">
              <button
                type="button"
                className={`flex w-full justify-between items-center rounded-xl p-3 text-left text-lg font-semibold text-white ${
                  content.key == accoditionTypeSelected && 'bg-gray-700'
                } hover:bg-gray-700 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75`}
                onClick={() => {
                  setAccoditionTypeSelected(content.key == accoditionTypeSelected ? '' : content.key)
                }}
              >
                <span>{content.title}</span>
                <Right
                  className={`${
                    accoditionTypeSelected == content.key ? 'rotate-90 transform' : ''
                  } h-5 w-5 text-purple-500`}
                  theme="outline"
                  size="20"
                  fill="#FFF"
                  strokeLinejoin="bevel"
                />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="min-w-[770px] xl:col-span-8 col-span-10 xl:mt-0 mt-8 z-0 px-10">
        {FAQContents.find((faqDes) => faqDes.key == accoditionTypeSelected)?.descriptions.map((description, index) => (
          <div key={index} className="mb-10 space-y-3">
            <p className="text-lg font-semibold">
              {index + 1}. {description.content}
            </p>
            <div className="px-52">
              {description.img && (
                <Image layout="responsive" sizes="(max-width: 300px) 33vw" src={description.img} alt="FAQ Image" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default FAQContainer
