/* eslint-disable react-hooks/exhaustive-deps */
import { Transition } from '@headlessui/react'
import { DeleteFive, Down, Plus, Save, Time } from '@icon-park/react'
import { Button, Input, InputWithAffix } from '@ume/ui'
import coin from 'public/coin-icon.png'
import { MenuModalEnum } from '~/enumVariable/enumVariable'

import { Fragment, useEffect, useRef, useState } from 'react'

import { notification } from 'antd'
import Image from 'next/legacy/image'
import { ServicePagingResponse, ServiceResponse } from 'ume-service-openapi'

import { trpc } from '~/utils/trpc'

interface AttributeProps {
  service: ServiceResponse | undefined
  serviceDefaultPrice: number
  serviceAttribute: string[]
  specialTimeLot: { startSpecialTime?: string; endSpecialTime?: string; specialServicePrice?: number }[]
}

interface AttributeDisplayProps {
  service: string
  serviceDefaultPrice?: number
  serviceAttribute: string[]
  specialTimeLot: { startSpecialTime?: string; endSpecialTime?: string; specialServicePrice?: number }[]
}

interface MenuDisplayProps {
  parent: number
  type: string
  isShow: boolean
  indexShow: number
}

const subAtributes = ['Gold', 'Silver', 'Iron']

const AddSkillForm = () => {
  const [listService, setListService] = useState<ServicePagingResponse['row'] | undefined>()
  const [listServiceFilter, setListServiceFilter] = useState<ServicePagingResponse['row'] | undefined>()
  const { isLoading: isServiceLoading } = trpc.useQuery(['booking.getListService'], {
    onSuccess(data) {
      setListService(data.data.row)
      setListServiceFilter(data.data?.row?.filter((service) => service.name?.toLocaleLowerCase().includes('')))
    },
  })

  const [attributes, setAttributes] = useState<AttributeProps[]>([
    {
      service: undefined,
      serviceDefaultPrice: 1,
      serviceAttribute: [''],
      specialTimeLot: [],
    },
  ])
  const [attributesDisplay, setAttributesDisplay] = useState<AttributeDisplayProps[]>([
    {
      service: '',
      serviceDefaultPrice: 1,
      serviceAttribute: [''],
      specialTimeLot: [],
    },
  ])
  const [displaySearchBox, setSearchBox] = useState<MenuDisplayProps>({
    parent: 0,
    type: '',
    isShow: false,
    indexShow: 0,
  })
  const [validateUpdateSkill, setValidateUpdateSkill] = useState<boolean>(false)

  const handleAddAttribute = () => {
    setAttributes([
      ...attributes,
      { service: undefined, serviceDefaultPrice: 1, serviceAttribute: [''], specialTimeLot: [] },
    ])
    setAttributesDisplay([
      ...attributesDisplay,
      { service: '', serviceDefaultPrice: 1, serviceAttribute: [''], specialTimeLot: [] },
    ])
    setListServiceFilter(
      listService?.filter((service) => service.name?.toLocaleLowerCase().includes(''.toLocaleLowerCase())),
    )
  }

  const handleRemoveAttribute = (index: number) => {
    const updatedAttributes = [...attributes]
    updatedAttributes.splice(index, 1)
    setAttributes(updatedAttributes)

    const updatedAttributesDisplay = [...attributesDisplay]
    updatedAttributesDisplay.splice(index, 1)
    setAttributesDisplay(updatedAttributesDisplay)

    setListServiceFilter(
      listService?.filter((service) => service.name?.toLocaleLowerCase().includes(''.toLocaleLowerCase())),
    )
  }

  const handleServiceInputChange = (index: number, searchText: string, serviceChange?: boolean) => {
    const updatedAttributesDisplay = [...attributesDisplay]
    updatedAttributesDisplay[index] = { ...updatedAttributesDisplay[index], service: searchText }
    setAttributesDisplay(updatedAttributesDisplay)
    serviceChange
      ? setListServiceFilter(
          listService?.filter((service) => service.name?.toLocaleLowerCase().includes(''.toLocaleLowerCase())),
        )
      : setListServiceFilter(
          listService?.filter((service) => service.name?.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())),
        )
  }

  const handleServiceChange = (index: number, value?: ServiceResponse) => {
    const updatedAttributes = [...attributes]
    updatedAttributes[index] = { ...updatedAttributes[index], service: value }
    setSearchBox({
      parent: index,
      type: MenuModalEnum.ATTRIBUTE,
      isShow: !displaySearchBox.isShow,
      indexShow: index,
    })
    setAttributes(updatedAttributes)
    handleServiceInputChange(index, value?.name!, true)
  }

  const handleServicePriceChange = (index: number, value: number) => {
    const updatedAttributes = [...attributes]
    updatedAttributes[index] = { ...updatedAttributes[index], serviceDefaultPrice: value }
    setAttributes(updatedAttributes)
  }

  const handleSpecialTimeChange = (index: number, value: string, type: string, time_slotIndex: number) => {
    const updatedAttributes = [...attributes]
    switch (type) {
      case 'StartSpecialTime':
        updatedAttributes[index].specialTimeLot[time_slotIndex].startSpecialTime = value
        setAttributes(updatedAttributes)

        break
      case 'EndSpecialTime':
        updatedAttributes[index].specialTimeLot[time_slotIndex].endSpecialTime = value
        setAttributes(updatedAttributes)
        break
      case 'SpecialServicePrice':
        updatedAttributes[index].specialTimeLot[time_slotIndex].specialServicePrice = Number(value)
        setAttributes(updatedAttributes)
        break
    }
  }

  const handleAddInput = (name: string, index: number) => {
    const updatedAttributes = [...attributes]
    const updatedAttributesDisplay = [...attributesDisplay]
    switch (name) {
      case 'SpecialTimeSlot':
        updatedAttributes[index].specialTimeLot.push({
          startSpecialTime: '',
          endSpecialTime: '',
          specialServicePrice: 0,
        })
        setAttributes(updatedAttributes)

        updatedAttributesDisplay[index].specialTimeLot.push({
          startSpecialTime: '',
          endSpecialTime: '',
          specialServicePrice: 0,
        })
        setAttributesDisplay(updatedAttributesDisplay)
        break
      case 'SubAttribute':
        updatedAttributes[index].serviceAttribute.push('')
        setAttributes(updatedAttributes)

        updatedAttributesDisplay[index].serviceAttribute.push('')
        setAttributesDisplay(updatedAttributesDisplay)
        break
      default:
        break
    }
  }

  const handleRemoveInput = (name: string, index: number, subIndex: number) => {
    const updatedAttributes = [...attributes]
    const updatedAttributesDisplay = [...attributesDisplay]

    switch (name) {
      case 'SpecialTimeSlot':
        updatedAttributes[index].specialTimeLot.splice(subIndex, 1)
        setAttributes(updatedAttributes)

        updatedAttributesDisplay[index].specialTimeLot.splice(subIndex, 1)
        setAttributesDisplay(updatedAttributesDisplay)
        break
      case 'SubAttribute':
        updatedAttributes[index].serviceAttribute.splice(subIndex, 1)
        setAttributes(updatedAttributes)

        updatedAttributesDisplay[index].serviceAttribute.splice(subIndex, 1)
        setAttributesDisplay(updatedAttributesDisplay)
        break
      default:
        break
    }
  }

  const handleAttributeChange = (index: number, subIndex: number, value: string) => {
    const updatedAttributes = [...attributes]
    updatedAttributes[index].serviceAttribute[subIndex] = value
    setAttributes(updatedAttributes)
  }

  useEffect(() => {
    if (
      attributes.some((attribute) => {
        return (
          !attribute.service ||
          attribute.serviceAttribute.some((item) => {
            return item == '' || !item
          })
        )
      })
    ) {
      setValidateUpdateSkill(false)
    } else {
      setValidateUpdateSkill(true)
    }
  }, [attributes])

  const handleUpdateSkillProvider = () => {
    if (validateUpdateSkill) {
      console.log(attributes)
    } else {
      notification.warning({
        message: 'Vui lòng nhập đầy đủ thông tin',
        description: 'Vui lòng kiểm tra lại và nhập đầy đủ thông tin của bạn!',
        placement: 'bottomLeft',
      })
    }
  }

  return (
    <>
      {!isServiceLoading ? (
        <>
          <div className="grid grid-cols-4 gap-5">
            {listService &&
              listService?.length > 0 &&
              attributes.map((attr, index) => (
                <div key={index} className="col-span-2 border border-white border-opacity-30 p-5 rounded-3xl">
                  <div className="flex justify-end items-center gap-2">
                    <Button
                      customCSS="text-xl p-2 rounded-xl hover:scale-105"
                      isActive={true}
                      isOutlinedButton={true}
                      onClick={() => handleUpdateSkillProvider()}
                    >
                      <Save theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                    </Button>
                    <Button
                      customCSS={`text-xl p-2 ${
                        attributes[index].serviceAttribute.length > 0
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-red-500 hover:scale-105'
                      }  rounded-xl`}
                      type="button"
                      isActive={true}
                      isDisable={attributes[index].serviceAttribute.length > 0}
                      isOutlinedButton={attributes[index].serviceAttribute.length <= 0}
                      onClick={() => handleRemoveAttribute(index)}
                    >
                      <DeleteFive theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-1 mb-5">
                    <label>Dịch vụ: </label>
                    <div className="flex items-center gap-3">
                      <div className="w-fit relative">
                        <InputWithAffix
                          placeholder={`${listService[0]?.name}`}
                          value={attributesDisplay[index]?.service || ''}
                          type="text"
                          onChange={(e) => handleServiceInputChange(index, e.target.value)}
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
                                  parent: index,
                                  type: MenuModalEnum.ATTRIBUTE,
                                  isShow: true,
                                  indexShow: index,
                                })
                              }
                            />
                          }
                          onMouseDown={() =>
                            setSearchBox({
                              parent: index,
                              type: MenuModalEnum.ATTRIBUTE,
                              isShow: true,
                              indexShow: index,
                            })
                          }
                        />
                        <Transition
                          as={Fragment}
                          show={
                            displaySearchBox.isShow &&
                            displaySearchBox.type == MenuModalEnum.ATTRIBUTE &&
                            displaySearchBox.indexShow == index
                          }
                          enter="transition ease-out duration-400"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-400"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <div
                            className="absolute right-0 left-0  max-h-[300px] w-full overflow-y-auto p-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hide-scrollbar"
                            style={{ zIndex: 5 }}
                            onMouseLeave={() =>
                              setSearchBox({
                                parent: index,
                                type: MenuModalEnum.ATTRIBUTE,
                                isShow: false,
                                indexShow: index,
                              })
                            }
                          >
                            <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                              {listServiceFilter && listServiceFilter.length > 0 ? (
                                listServiceFilter.map((service, service_index) => (
                                  <div
                                    className={`flex gap-5 items-center ${
                                      attributes.find((attr) => attr.service == service.id) && 'bg-gray-700'
                                    } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                                    key={service_index}
                                    onClick={() => handleServiceChange(index, service)}
                                  >
                                    <p className="text-md font-semibold">{service.name}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-md font-normal">Không có kết quả</p>
                              )}
                            </div>
                          </div>
                        </Transition>
                      </div>
                      <InputWithAffix
                        placeholder="Giá dịch vụ"
                        value={attributes[index].serviceDefaultPrice}
                        type="number"
                        name="ServicePrice"
                        onChange={(e) =>
                          handleServicePriceChange(index, Number(Number(e.target.value) > 0 ? e.target.value : 1))
                        }
                        className="max-w-[100px] bg-zinc-800 border border-white border-opacity-30 rounded-xl my-2"
                        styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                        iconStyle="border-none"
                        position="right"
                        component={<Image src={coin} width={100} height={100} alt="coin" />}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-5 mb-5 ml-3">
                    <label>Khung giờ tính thêm tiền: </label>
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-5">
                        {attr.specialTimeLot.map((timeSlot, time_slot_index) => (
                          <>
                            <div className="flex items-center gap-3" key={time_slot_index}>
                              <div className="flex items-center gap-3">
                                <Input
                                  placeholder="Thời gian bắt đầu"
                                  value={timeSlot.startSpecialTime}
                                  type="time"
                                  name="StartSpecialTime"
                                  onChange={(e) =>
                                    handleSpecialTimeChange(index, e.target.value, 'StartSpecialTime', time_slot_index)
                                  }
                                  className="max-w-[150px] bg-zinc-800 text-white border border-white border-opacity-30 !pr-1 rounded-xl my-2"
                                />
                                <Input
                                  placeholder="Thời gian kết thúc"
                                  value={timeSlot.endSpecialTime}
                                  type="time"
                                  name="EndSpecialTime"
                                  onChange={(e) =>
                                    handleSpecialTimeChange(index, e.target.value, 'EndSpecialTime', time_slot_index)
                                  }
                                  className="max-w-[150px] bg-zinc-800 text-white border border-white border-opacity-30 !pr-1 rounded-xl my-2"
                                />

                                <InputWithAffix
                                  placeholder="Giá"
                                  value={timeSlot.specialServicePrice}
                                  type="number"
                                  name="SpecialServicePrice"
                                  onChange={(e) =>
                                    handleSpecialTimeChange(
                                      index,
                                      String(Number(e.target.value) > 0 ? e.target.value : 1),
                                      'SpecialServicePrice',
                                      time_slot_index,
                                    )
                                  }
                                  className="max-w-[100px] bg-zinc-800 border border-white border-opacity-30 rounded-xl my-2"
                                  styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                                  iconStyle="border-none"
                                  position="right"
                                  component={<Image src={coin} width={100} height={100} alt="coin" />}
                                />
                              </div>
                              <Button
                                customCSS={`text-xl p-2 bg-red-500 hover:scale-105 rounded-xl`}
                                type="button"
                                isActive={true}
                                isOutlinedButton={true}
                                onClick={() => handleRemoveInput('SpecialTimeSlot', index, time_slot_index)}
                              >
                                <DeleteFive theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                              </Button>
                            </div>
                          </>
                        ))}
                      </div>
                      <Button
                        customCSS={`text-sm p-2 hover:scale-105 rounded-xl`}
                        type="button"
                        isActive={true}
                        isOutlinedButton={true}
                        onClick={() => handleAddInput('SpecialTimeSlot', index)}
                      >
                        <Plus theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                        <p>Thêm khung thời gian</p>
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 mt-5 mb-5 ml-10">
                    <label>Thuộc tính</label>
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-5">
                        {attr.serviceAttribute.map((value, subIndex) => (
                          <>
                            <div className="flex items-center gap-3" key={subIndex}>
                              <div className="w-fit relative">
                                <InputWithAffix
                                  placeholder={`${subAtributes[0]}`}
                                  value={value}
                                  type="text"
                                  onChange={(e) => handleAttributeChange(index, subIndex, e.target.value)}
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
                                          parent: index,
                                          type: MenuModalEnum.SUB_ATTRIBUTE,
                                          isShow: true,
                                          indexShow: subIndex,
                                        })
                                      }
                                    />
                                  }
                                  onMouseDown={() =>
                                    setSearchBox({
                                      parent: index,
                                      type: MenuModalEnum.SUB_ATTRIBUTE,
                                      isShow: true,
                                      indexShow: subIndex,
                                    })
                                  }
                                />
                                <Transition
                                  as={Fragment}
                                  show={
                                    displaySearchBox.parent == index &&
                                    displaySearchBox.isShow &&
                                    displaySearchBox.type == MenuModalEnum.SUB_ATTRIBUTE &&
                                    displaySearchBox.indexShow == subIndex
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
                                        parent: index,
                                        type: MenuModalEnum.SUB_ATTRIBUTE,
                                        isShow: false,
                                        indexShow: subIndex,
                                      })
                                    }
                                  >
                                    <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                                      {subAtributes.map((sub_attr, sub_attr_index) => (
                                        <div
                                          className={`flex gap-5 items-center bg-gray-700 hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                                          key={sub_attr_index}
                                          onClick={() => handleAttributeChange(index, subIndex, sub_attr)}
                                        >
                                          <p className="text-mg font-semibold">{sub_attr}</p>
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
                                onClick={() => handleRemoveInput('SubAttribute', index, subIndex)}
                              >
                                <DeleteFive theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                              </Button>
                            </div>
                          </>
                        ))}
                      </div>
                      <Button
                        customCSS={`text-sm p-2 hover:scale-105 rounded-xl`}
                        type="button"
                        isActive={true}
                        isOutlinedButton={true}
                        onClick={() => handleAddInput('SubAttribute', index)}
                      >
                        <Plus theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                        <p>Thêm thuộc tính</p>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            <div className="col-span-2 min-h-[300px] flex justify-center items-center">
              <Button
                customCSS={`text-lg p-2 hover:scale-105 rounded-xl`}
                type="button"
                isActive={true}
                isOutlinedButton={true}
                onClick={handleAddAttribute}
              >
                <Plus theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                <p>Thêm dịch vụ</p>
              </Button>
            </div>
          </div>

          {/* <div className="text-center mt-20">
            <Button
        isActive={false}
        isOutlinedButton={true}
        customCSS="w-[100px] text-xl p-2 rounded-xl hover:scale-105"
        onClick={() => handleClose()}
      >
        Hủy
      </Button>

            <Button
              customCSS="w-[150px] text-xl p-2 rounded-xl hover:scale-105"
              isActive={true}
              isOutlinedButton={true}
              onClick={() => handleUpdateSkillProvider()}
            >
              Xác nhận
            </Button>
          </div> */}
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default AddSkillForm
