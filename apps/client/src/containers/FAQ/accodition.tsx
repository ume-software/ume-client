import { Disclosure } from '@headlessui/react'
import { Up } from '@icon-park/react'

import { ReactNode } from 'react'

import { Image } from 'antd'

interface AccoditionProps {
  title: string | ReactNode
  descriptions: { content: string; img: string | undefined }[]
}

const Accodition = ({ title, descriptions }: AccoditionProps) => {
  return (
    <div className="w-full px-4 pt-16">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                <span>{title}</span>
                <Up
                  className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-purple-500`}
                  theme="outline"
                  size="20"
                  fill="#FFF"
                  strokeLinejoin="bevel"
                />
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                {descriptions.map((description, index) => (
                  <div key={index}>
                    <p>
                      {index + 1}. {description.content}
                    </p>
                    {description.img && <Image src={description.img} alt="FAQ Image" />}
                  </div>
                ))}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}
export default Accodition
