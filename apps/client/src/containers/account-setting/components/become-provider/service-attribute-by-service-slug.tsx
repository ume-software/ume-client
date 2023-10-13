import { Transition } from '@headlessui/react'
import { DeleteFive, Down, Plus } from '@icon-park/react'
import { Button, InputWithAffix } from '@ume/ui'
import { MenuModalEnum } from '~/enumVariable/enumVariable'

import { Fragment, useState } from 'react'

import { ServiceAttributeValuePagingResponse } from 'ume-service-openapi'

import { trpc } from '~/utils/trpc'

interface MenuDisplayProps {
  parent: number
  type: string
  isShow: boolean
}

const ServiceByServiceSlug = (props: { serviceId: string; index: number }) => {
  const [serviceAttribute, setServiceAttribute] = useState<ServiceAttributeValuePagingResponse['row'] | undefined>(
    undefined,
  )
  const { isLoading: isServiceAttributeLoading } = trpc.useQuery(
    ['identity.getServiceAttributeValueByServiceAttributeId', props.serviceId],
    {
      onSuccess(data) {
        setServiceAttribute(data.data.row)
        console.log(data.data.row)
      },
      enabled: !!props.serviceId,
    },
  )

  const [serviceAttributeArray, setServiceAttributeArray] = useState<ServiceAttributeValuePagingResponse['row']>([])

  const [displaySearchBox, setSearchBox] = useState<MenuDisplayProps>({
    parent: 0,
    type: '',
    isShow: false,
  })
  console.log(props.serviceId)

  const handleAddAttribute = (name: string, index: number) => {
    setServiceAttributeArray([...(serviceAttributeArray ?? []), (serviceAttributeArray ?? [])[index]])
    console.log('áassaas')
  }

  return (
    <>
      {!isServiceAttributeLoading && (
        <>
          {serviceAttribute && serviceAttribute.length > 0 ? (
            serviceAttribute.map((serviceAttr, index) => (
              <>
                <div className="flex items-center gap-3" key={index}>
                  <div className="w-fit relative">
                    <InputWithAffix
                      placeholder={``}
                      value={serviceAttr.viValue}
                      type="text"
                      // onChange={(e) => handleAttributeChange(props.index, props.subIndex, e.target.value)}
                      className="bg-zinc-800 rounded-xl border border-white border-opacity-30"
                      styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                      iconStyle="border-none"
                      position="right"
                      component={
                        <Down
                          theme="outline"
                          size="20"
                          fill="#fff"
                          strokeLinejoin="bevel"
                          className="cursor-pointer"
                          onMouseDown={() =>
                            setSearchBox({
                              parent: props.index,
                              type: MenuModalEnum.SUB_ATTRIBUTE,
                              isShow: true,
                            })
                          }
                        />
                      }
                      onMouseDown={() =>
                        setSearchBox({
                          parent: props.index,
                          type: MenuModalEnum.SUB_ATTRIBUTE,
                          isShow: true,
                        })
                      }
                    />
                    <Transition
                      as={Fragment}
                      show={
                        displaySearchBox.parent == props.index &&
                        displaySearchBox.isShow &&
                        displaySearchBox.type == MenuModalEnum.SUB_ATTRIBUTE
                      }
                      enter="transition ease-out duration-400"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-400"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <div
                        className="absolute right-0 left-0 max-h-[300px] w-full overflow-y-auto p-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hide-scrollbar"
                        style={{ zIndex: 5 }}
                        onMouseLeave={() =>
                          setSearchBox({
                            parent: props.index,
                            type: MenuModalEnum.SUB_ATTRIBUTE,
                            isShow: false,
                          })
                        }
                      >
                        <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                          {serviceAttribute.map((sub_attr, sub_attr_index) => (
                            <div
                              className={`flex gap-5 items-center bg-gray-700 hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                              key={sub_attr_index}
                              //   onClick={() => handleAttributeChange(index, props.subIndex, sub_attr)}
                            >
                              <p className="text-md font-semibold">{sub_attr.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Transition>
                  </div>
                  <Button
                    customCSS={`text-xl p-2 bg-red-500 hover:scale-105 rounded-xl`}
                    type="button"
                    isActive={true}
                    isOutlinedButton={true}
                    //   onClick={() => handleRemoveInput('SubAttribute', props.index, props.subIndex)}
                  >
                    <DeleteFive theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                  </Button>
                  <Button
                    customCSS={`text-sm p-2 hover:scale-105 rounded-xl`}
                    type="button"
                    isActive={true}
                    isOutlinedButton={true}
                    onClick={() => handleAddAttribute('SubAttribute', index)}
                  >
                    <Plus theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                    <p>Thêm thuộc tính</p>
                  </Button>
                </div>
              </>
            ))
          ) : (
            <>
              <InputWithAffix
                value={'Thuộc tính này không có giá trị'}
                type="text"
                className="bg-zinc-800 rounded-xl border border-white border-opacity-30"
                styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                iconStyle="border-none"
                position="right"
                component={undefined}
                read-only="true"
              />
            </>
          )}
        </>
      )}
    </>
  )
}
export default ServiceByServiceSlug
