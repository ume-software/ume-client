/* eslint-disable react-hooks/exhaustive-deps */
import { Transition } from '@headlessui/react'
import { CloseSmall, DeleteFive, Down, Plus, Save } from '@icon-park/react'
import { Button, Input, InputWithAffix, Modal, TextArea } from '@ume/ui'
import coin from 'public/coin-icon.png'
import { MenuModalEnum } from '~/enumVariable/enumVariable'

import { Fragment, useState } from 'react'

import { ConfigProvider, message, notification, theme } from 'antd'
import Image from 'next/legacy/image'
import { ServiceAttributeValuePagingResponse, ServicePagingResponse, ServiceResponse } from 'ume-service-openapi'

import ConfirmForm from '~/components/confirm-form/confirmForm'

import { trpc } from '~/utils/trpc'

interface ServiceForm {
  title: string
  description: string
  form: string
}

interface AttributeProps {
  intro: string
  service: ServiceResponse | undefined
  serviceDefaultPrice: number
  serviceAttribute: {
    serviceAttributeId: ServiceResponse | undefined
    subServiceAttibute: { serviceAttributeValueId: string; serviceAttributeValueName: string }[]
  }[]
  specialTimeLot: { startTimeOfDay?: string; endTimeOfDay?: string; amount?: number }[]
}

interface AttributeDisplayProps {
  intro: string
  service: string
  serviceDefaultPrice?: number
  serviceAttribute: {
    serviceAttributeId: string
    subServiceAttibute: { serviceAttributeValueId: string; serviceAttributeValueName: string }[]
  }[]
  specialTimeLot: { startTimeOfDay?: string; endTimeOfDay?: string; amount?: number }[]
}

interface MenuDisplayProps {
  parent: number
  type: string
  isShow: boolean
  indexShow: number
  indexChildShow?: number
}

const AddSkillForm = () => {
  const [messageApi, contextHolder] = message.useMessage()
  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState(false)
  const [serviceForm, setServiceForm] = useState<ServiceForm>({ title: '', description: '', form: '' })
  const [indexServiceForm, setIndexServiceForm] = useState<number>(-1)

  const [listService, setListService] = useState<ServicePagingResponse['row'] | undefined>()
  const [listServiceFilter, setListServiceFilter] = useState<ServicePagingResponse['row'] | undefined>()

  const [listServiceAttribute, setListServiceAttribute] = useState<any>()
  const [listServiceAttributeFilter, setListServiceAttributeFilter] = useState<any>()
  const [listServiceId, setListServiceId] = useState<string>('')
  const [listServiceAttributeId, setListServiceAttributeId] = useState<string>('')

  const [serviceAttributeValue, setServiceAttributeValue] = useState<
    ServiceAttributeValuePagingResponse['row'] | undefined
  >(undefined)
  const [serviceAttributeValueFilter, setServiceAttributeValueFilter] = useState<
    ServiceAttributeValuePagingResponse['row'] | undefined
  >(undefined)

  const [attributes, setAttributes] = useState<AttributeProps[]>([
    {
      intro: '',
      service: undefined,
      serviceDefaultPrice: 1,
      serviceAttribute: [
        {
          serviceAttributeId: undefined,
          subServiceAttibute: [{ serviceAttributeValueId: '', serviceAttributeValueName: '' }],
        },
      ],
      specialTimeLot: [],
    },
  ])
  const [attributesDisplay, setAttributesDisplay] = useState<AttributeDisplayProps[]>([
    {
      intro: '',
      service: '',
      serviceDefaultPrice: 1,
      serviceAttribute: [
        {
          serviceAttributeId: '',
          subServiceAttibute: [{ serviceAttributeValueId: '', serviceAttributeValueName: '' }],
        },
      ],
      specialTimeLot: [],
    },
  ])

  const { isLoading: isServiceLoading } = trpc.useQuery(['booking.getListService'], {
    onSuccess(data) {
      setListService(data.data.row)
      setListServiceFilter(data.data?.row?.filter((service) => service.name?.toLocaleLowerCase().includes('')))
    },
  })

  const { isLoading: isServiceAttributeLoading, isFetching: isServiceAttributeFetching } = trpc.useQuery(
    ['identity.getServiceAttributeByServiceSlug', listServiceId],
    {
      onSuccess(data) {
        setListServiceAttribute(data.data.row)
        setListServiceAttributeFilter(
          data.data?.row?.filter((serviceAttr) => serviceAttr.viAttribute?.toLocaleLowerCase().includes('')),
        )
      },
      enabled: !!listServiceId,
    },
  )

  const { isLoading: isServiceAttributeValueLoading, isFetching: isServiceAttributeValueFetching } = trpc.useQuery(
    ['identity.getServiceAttributeValueByServiceAttributeId', listServiceAttributeId],
    {
      onSuccess(data) {
        setServiceAttributeValue(data.data.row)
        setServiceAttributeValueFilter(
          data.data?.row?.filter((serviceAttr) => serviceAttr.viValue?.toLocaleLowerCase().includes('')),
        )
      },
      enabled: !!listServiceAttributeId,
    },
  )

  const createProvicerService = trpc.useMutation('identity.createServiceProvider')

  const [displaySearchBox, setSearchBox] = useState<MenuDisplayProps>({
    parent: 0,
    type: '',
    isShow: false,
    indexShow: 0,
  })

  const handleAddAttribute = () => {
    setAttributes([
      ...attributes,
      {
        intro: '',
        service: undefined,
        serviceDefaultPrice: 1,
        serviceAttribute: [
          {
            serviceAttributeId: undefined,
            subServiceAttibute: [{ serviceAttributeValueId: '', serviceAttributeValueName: '' }],
          },
        ],
        specialTimeLot: [],
      },
    ])
    setAttributesDisplay([
      ...attributesDisplay,
      {
        intro: '',
        service: '',
        serviceDefaultPrice: 1,
        serviceAttribute: [
          {
            serviceAttributeId: '',
            subServiceAttibute: [{ serviceAttributeValueId: '', serviceAttributeValueName: '' }],
          },
        ],
        specialTimeLot: [],
      },
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
    setIsModalConfirmationVisible(false)
  }

  const handleServiceInputChange = (
    name: string,
    index: number,
    searchText: string,
    sub_index?: number,
    serviceChange?: boolean,
    sub_attr_index?: number,
  ) => {
    const updatedAttributesDisplay = [...attributesDisplay]

    switch (name) {
      case 'Intro':
        updatedAttributesDisplay[index] = { ...updatedAttributesDisplay[index], intro: searchText ?? '' }
        setAttributesDisplay(updatedAttributesDisplay)
        break
      case 'Service':
        updatedAttributesDisplay[index] = { ...updatedAttributesDisplay[index], service: searchText }
        setAttributesDisplay(updatedAttributesDisplay)
        serviceChange
          ? setListServiceFilter(
              listService?.filter((service) => service.name?.toLocaleLowerCase().includes(''.toLocaleLowerCase())),
            )
          : setListServiceFilter(
              listService?.filter((service) =>
                service.name?.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()),
              ),
            )
        break
      case 'ServiceAttribute':
        const updatedAttributesDisplayItem = { ...updatedAttributesDisplay[index] }
        updatedAttributesDisplayItem.serviceAttribute[sub_index ?? 0].serviceAttributeId = searchText
        setAttributesDisplay(updatedAttributesDisplay)
        serviceChange
          ? setListServiceAttributeFilter(
              listServiceAttribute?.filter((serviceAttr) =>
                serviceAttr.viAttribute?.toLocaleLowerCase().includes(''.toLocaleLowerCase()),
              ),
            )
          : setListServiceAttributeFilter(
              listServiceAttribute?.filter((serviceAttr) =>
                serviceAttr.viAttribute?.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()),
              ),
            )
        break
      case 'ServiceAttributeValue':
        const updatedAttributesValueDisplayItem = { ...updatedAttributesDisplay[index] }
        updatedAttributesValueDisplayItem.serviceAttribute[sub_index ?? 0].subServiceAttibute[
          sub_attr_index ?? 0
        ].serviceAttributeValueName = searchText
        setAttributesDisplay(updatedAttributesDisplay)

        serviceChange
          ? setServiceAttributeValueFilter(
              serviceAttributeValue?.filter((serviceAttrValue) =>
                serviceAttrValue.viValue?.toLocaleLowerCase().includes(''.toLocaleLowerCase()),
              ),
            )
          : setServiceAttributeValueFilter(
              serviceAttributeValue?.filter((serviceAttrValue) =>
                serviceAttrValue.viValue?.toLocaleLowerCase().includes(searchText.toLocaleLowerCase()),
              ),
            )
        break
      default:
        break
    }
  }

  const handleServiceChange = (
    name: string,
    index: number,
    sub_index?: number,
    value?: any,
    sub_attr_index?: number,
    serviceAttributeValue?: { serviceAttributeId: string; serviceAttributeName: string },
    intro?: string,
  ) => {
    const updatedAttributes = [...attributes]
    switch (name) {
      case 'Intro':
        updatedAttributes[index] = { ...updatedAttributes[index], intro: intro ?? '' }
        setAttributes(updatedAttributes)
        handleServiceInputChange('Intro', index, intro ?? '', undefined, true)
        break
      case 'Service':
        setListServiceId(value?.id!)
        updatedAttributes[index] = { ...updatedAttributes[index], service: value }

        setSearchBox({
          parent: index,
          type: MenuModalEnum.SERVICE,
          isShow: !displaySearchBox.isShow,
          indexShow: index,
        })
        setAttributes(updatedAttributes)
        handleServiceInputChange('Service', index, value?.name!, undefined, true)
        break
      case 'ServiceAttribute':
        if (
          updatedAttributes[index].serviceAttribute.find(
            (serviceAttr) => serviceAttr.serviceAttributeId?.id == value?.id,
          )
        ) {
          messageApi.open({
            type: 'warning',
            content: 'Không thể thêm trùng thuộc tính',
            duration: 2,
          })
        } else {
          updatedAttributes[index].serviceAttribute[sub_index ?? 0] = {
            ...updatedAttributes[index].serviceAttribute[sub_index ?? 0],
            serviceAttributeId: value,
          }
          setAttributes(updatedAttributes)
          handleServiceInputChange('ServiceAttribute', index, value?.viAttribute!, sub_index, true)
          setListServiceAttributeId(value?.id!)
        }
        break
      case 'ServiceAttributeValue':
        if (
          updatedAttributes[index].serviceAttribute[sub_index ?? 0].subServiceAttibute.find(
            (subAttr) => subAttr.serviceAttributeValueId == serviceAttributeValue?.serviceAttributeId,
          )
        ) {
          messageApi.open({
            type: 'warning',
            content: 'Không thể thêm trùng giá trị thuộc tính',
            duration: 2,
          })
        } else {
          updatedAttributes[index].serviceAttribute[sub_index ?? 0].subServiceAttibute[sub_attr_index ?? 0] = {
            serviceAttributeValueId: serviceAttributeValue?.serviceAttributeId ?? '',
            serviceAttributeValueName: serviceAttributeValue?.serviceAttributeName ?? '',
          }
          setAttributes(updatedAttributes)
          handleServiceInputChange(
            'ServiceAttributeValue',
            index,
            serviceAttributeValue?.serviceAttributeName ?? '',
            sub_index,
            true,
            sub_attr_index,
          )
          setListServiceAttributeId(value?.id!)
        }

        break
      default:
        break
    }
  }

  const handleServicePriceChange = (index: number, value: number) => {
    const updatedAttributes = [...attributes]
    updatedAttributes[index] = { ...updatedAttributes[index], serviceDefaultPrice: value }
    setAttributes(updatedAttributes)
  }

  const handleSpecialTimeChange = (index: number, value: string, type: string, time_slotIndex: number) => {
    const updatedAttributes = [...attributes]
    switch (type) {
      case 'startTimeOfDay':
        updatedAttributes[index].specialTimeLot[time_slotIndex].startTimeOfDay = value
        setAttributes(updatedAttributes)

        break
      case 'endTimeOfDay':
        updatedAttributes[index].specialTimeLot[time_slotIndex].endTimeOfDay = value
        setAttributes(updatedAttributes)
        break
      case 'amount':
        updatedAttributes[index].specialTimeLot[time_slotIndex].amount = Number(value)
        setAttributes(updatedAttributes)
        break
    }
  }

  const handleAddInput = (name: string, index: number, sub_index?: number) => {
    const updatedAttributes = [...attributes]
    const updatedAttributesDisplay = [...attributesDisplay]
    switch (name) {
      case 'SpecialTimeSlot':
        updatedAttributes[index].specialTimeLot.push({
          startTimeOfDay: '',
          endTimeOfDay: '',
          amount: 0,
        })
        setAttributes(updatedAttributes)

        updatedAttributesDisplay[index].specialTimeLot.push({
          startTimeOfDay: '',
          endTimeOfDay: '',
          amount: 0,
        })
        setAttributesDisplay(updatedAttributesDisplay)
        break
      case 'ServiceAttribute':
        updatedAttributes[index].serviceAttribute.push({
          serviceAttributeId: undefined,
          subServiceAttibute: [{ serviceAttributeValueId: '', serviceAttributeValueName: '' }],
        })
        setAttributes(updatedAttributes)

        updatedAttributesDisplay[index].serviceAttribute.push({
          serviceAttributeId: '',
          subServiceAttibute: [{ serviceAttributeValueId: '', serviceAttributeValueName: '' }],
        })
        setAttributesDisplay(updatedAttributesDisplay)
        break
      case 'ServiceAttributeValue':
        updatedAttributes[index]?.serviceAttribute[sub_index ?? 0]?.subServiceAttibute.push({
          serviceAttributeValueId: '',
          serviceAttributeValueName: '',
        })
        setAttributes(updatedAttributes)

        console.log(attributes)

        updatedAttributesDisplay[index].serviceAttribute[sub_index ?? 0]?.subServiceAttibute?.push({
          serviceAttributeValueId: '',
          serviceAttributeValueName: '',
        })
        setAttributesDisplay(updatedAttributesDisplay)

        break
      default:
        break
    }
  }

  const handleRemoveInput = (name: string, index: number, sub_index: number) => {
    const updatedAttributes = [...attributes]
    const updatedAttributesDisplay = [...attributesDisplay]

    switch (name) {
      case 'SpecialTimeSlot':
        updatedAttributes[index].specialTimeLot.splice(sub_index, 1)
        setAttributes(updatedAttributes)

        updatedAttributesDisplay[index].specialTimeLot.splice(sub_index, 1)
        setAttributesDisplay(updatedAttributesDisplay)
        break
      case 'ServiceAttribute':
        updatedAttributes[index].serviceAttribute.splice(sub_index, 1)
        setAttributes(updatedAttributes)

        updatedAttributesDisplay[index].serviceAttribute.splice(sub_index, 1)
        setAttributesDisplay(updatedAttributesDisplay)
        break
      case 'ServiceAttributeValue':
        updatedAttributes[index].serviceAttribute[sub_index].subServiceAttibute.splice(sub_index, 1)
        setAttributes(updatedAttributes)

        updatedAttributesDisplay[index].serviceAttribute[sub_index].subServiceAttibute.splice(sub_index, 1)
        setAttributesDisplay(updatedAttributesDisplay)
        break
      default:
        break
    }
  }

  const handleUpdateSkillProvider = (index: number) => {
    if (attributes[index].service?.id && attributes[index].intro != '') {
      const req = {
        serviceId: attributes[index]?.service?.id,
        defaultCost: attributes[index]?.serviceDefaultPrice,
        description: attributes[index]?.intro,
        createBookingCosts: attributes[index].specialTimeLot.filter((specialTimeLot) => {
          if (specialTimeLot.startTimeOfDay != '' && specialTimeLot.endTimeOfDay != '') {
            return specialTimeLot
          }
        }),
        createServiceAttributes: attributes[index].serviceAttribute
          .filter((attribute) => attribute?.serviceAttributeId?.id)
          .map((attribute) => {
            const serviceAttributeValueIds = attribute.subServiceAttibute
              .filter((subAttr) => subAttr.serviceAttributeValueId !== '')
              .map((subAttr) => subAttr.serviceAttributeValueId)

            return {
              id: attribute.serviceAttributeId?.id,
              serviceAttributeValueIds,
            }
          }),
      }

      createProvicerService.mutate(
        {
          serviceId: req.serviceId ?? '',
          defaultCost: req.defaultCost,
          description: req.description,
          createBookingCosts: (req.createBookingCosts.length > 0 ? req.createBookingCosts : undefined) as any,
          createServiceAttributes: req.createServiceAttributes as any,
        },
        {
          onSuccess(data, variables, context) {
            console.log(data)
          },
        },
      )
    } else {
      notification.warning({
        message: 'Vui lòng nhập đầy đủ thông tin',
        description: 'Vui lòng kiểm tra lại và nhập đầy đủ thông tin của bạn!',
        placement: 'bottomLeft',
      })
    }
    setIsModalConfirmationVisible(false)
  }

  const openConfirmModal = () => {
    setIsModalConfirmationVisible(true)
  }

  const closeConfirmModal = () => {
    setIsModalConfirmationVisible(false)
  }

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: closeConfirmModal,
    show: isModalConfirmationVisible,
    form: (
      <>
        <ConfirmForm
          title={`${serviceForm.title}`}
          description={`${serviceForm.description}`}
          onClose={closeConfirmModal}
          onOk={() => {
            switch (serviceForm.form) {
              case 'UPDATE':
                handleUpdateSkillProvider(indexServiceForm)
                break
              case 'DELETE':
                handleRemoveAttribute(indexServiceForm)
                break
              default:
                break
            }
          }}
        />
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <>
        <CloseSmall
          onClick={closeConfirmModal}
          onKeyDown={(e) => e.key === 'Enter' && closeConfirmModal()}
          tabIndex={1}
          className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
          theme="outline"
          size="24"
          fill="#FFFFFF"
        />
      </>
    ),
  })

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
        }}
      >
        {contextHolder}
      </ConfigProvider>
      {isModalConfirmationVisible && confirmModal}
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
                      onClick={() => {
                        setServiceForm({
                          title: 'Cập nhật kỹ năng',
                          description: 'Bạn có chấp nhận cập nhật kỹ năng này không?',
                          form: 'UPDATE',
                        })
                        setIndexServiceForm(index)
                        openConfirmModal()
                      }}
                    >
                      <Save theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                    </Button>
                    <Button
                      customCSS={`text-xl p-2 bg-red-500 hover:scale-105 rounded-xl`}
                      type="button"
                      isActive={true}
                      isOutlinedButton={true}
                      onClick={() => {
                        setServiceForm({
                          title: 'Xóa kỹ năng',
                          description: 'Bạn có chấp nhận xóa kỹ năng này không?',
                          form: 'DELETE',
                        })
                        setIndexServiceForm(index)
                        openConfirmModal()
                      }}
                    >
                      <DeleteFive theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-1 mb-5">
                    <label>Giới thiệu về kỹ năng: </label>
                    <TextArea
                      name="description"
                      className="bg-[#413F4D] w-4/5 max-h-[140px]"
                      rows={5}
                      value={attributesDisplay[index].intro}
                      onChange={(e) =>
                        handleServiceChange('Intro', index, undefined, undefined, undefined, undefined, e.target.value)
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1 mb-5">
                    <label>Dịch vụ: </label>
                    <div className="flex items-center gap-3">
                      <div className="w-fit relative">
                        <InputWithAffix
                          placeholder={`${listService[0]?.name}`}
                          value={attributesDisplay[index]?.service || ''}
                          type="text"
                          onChange={(e) => handleServiceInputChange('Service', index, e.target.value)}
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
                                  type: MenuModalEnum.SERVICE,
                                  isShow: true,
                                  indexShow: index,
                                })
                              }
                            />
                          }
                          onMouseDown={() =>
                            setSearchBox({
                              parent: index,
                              type: MenuModalEnum.SERVICE,
                              isShow: true,
                              indexShow: index,
                            })
                          }
                        />
                        <Transition
                          as={Fragment}
                          show={
                            displaySearchBox.isShow &&
                            displaySearchBox.type == MenuModalEnum.SERVICE &&
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
                                type: MenuModalEnum.SERVICE,
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
                                    onClick={() => handleServiceChange('Service', index, undefined, service)}
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
                        {attr.specialTimeLot?.map((timeSlot, time_slot_index) => (
                          <>
                            <div className="flex items-center gap-3" key={time_slot_index}>
                              <div className="flex items-center gap-3">
                                <Input
                                  placeholder="Thời gian bắt đầu"
                                  value={timeSlot.startTimeOfDay}
                                  type="time"
                                  name="startTimeOfDay"
                                  onChange={(e) =>
                                    handleSpecialTimeChange(index, e.target.value, 'startTimeOfDay', time_slot_index)
                                  }
                                  className="max-w-[150px] bg-zinc-800 text-white border border-white border-opacity-30 !pr-1 rounded-xl my-2"
                                />
                                <Input
                                  placeholder="Thời gian kết thúc"
                                  value={timeSlot.endTimeOfDay}
                                  type="time"
                                  name="endTimeOfDay"
                                  onChange={(e) =>
                                    handleSpecialTimeChange(index, e.target.value, 'endTimeOfDay', time_slot_index)
                                  }
                                  className="max-w-[150px] bg-zinc-800 text-white border border-white border-opacity-30 !pr-1 rounded-xl my-2"
                                />

                                <InputWithAffix
                                  placeholder="Giá"
                                  value={timeSlot.amount}
                                  type="number"
                                  name="amount"
                                  onChange={(e) =>
                                    handleSpecialTimeChange(
                                      index,
                                      String(Number(e.target.value) > 0 ? e.target.value : 1),
                                      'amount',
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
                        {attr.serviceAttribute?.map((serviceAttribute, sub_index) => (
                          <>
                            <div className="flex items-center gap-3" key={sub_index}>
                              <div className="w-fit relative">
                                <InputWithAffix
                                  placeholder={`Hạng`}
                                  value={attributesDisplay[index].serviceAttribute[sub_index].serviceAttributeId}
                                  type="text"
                                  onChange={(e) =>
                                    handleServiceInputChange(
                                      'ServiceAttribute',
                                      index,
                                      String(e.target.value),
                                      sub_index,
                                    )
                                  }
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
                                          indexShow: sub_index,
                                        })
                                      }
                                      onClick={() => setListServiceId(attributes[index].service?.id ?? '')}
                                    />
                                  }
                                  onMouseDown={() =>
                                    setSearchBox({
                                      parent: index,
                                      type: MenuModalEnum.ATTRIBUTE,
                                      isShow: true,
                                      indexShow: sub_index,
                                    })
                                  }
                                  onClick={() => setListServiceId(attributes[index].service?.id ?? '')}
                                />
                                <Transition
                                  as={Fragment}
                                  show={
                                    displaySearchBox.parent == index &&
                                    displaySearchBox.isShow &&
                                    displaySearchBox.type == MenuModalEnum.ATTRIBUTE &&
                                    displaySearchBox.indexShow == sub_index
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
                                        type: MenuModalEnum.ATTRIBUTE,
                                        isShow: false,
                                        indexShow: sub_index,
                                      })
                                    }
                                  >
                                    <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                                      {!isServiceAttributeLoading && !isServiceAttributeFetching ? (
                                        listServiceAttributeFilter && listServiceAttributeFilter.length > 0 ? (
                                          listServiceAttributeFilter?.map((value_attr, sub_attr_index) => (
                                            <div
                                              className={`flex gap-5 items-center bg-gray-700 hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                                              key={sub_attr_index}
                                              onClick={() =>
                                                handleServiceChange('ServiceAttribute', index, sub_index, value_attr)
                                              }
                                            >
                                              <p className="text-mg font-semibold">{value_attr.viAttribute}</p>
                                            </div>
                                          ))
                                        ) : (
                                          <p className="text-md font-normal">Không có kết quả</p>
                                        )
                                      ) : (
                                        <>
                                          <div className="w-full animate-pulse flex-row items-center justify-center space-x-1 rounded-xl border p-3">
                                            <div className="h-6 w-full rounded-md bg-gray-300 "></div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </Transition>
                              </div>
                              <Button
                                customCSS={`text-xl p-2 bg-red-500 hover:scale-105 rounded-xl`}
                                type="button"
                                isActive={true}
                                isOutlinedButton={true}
                                onClick={() => handleRemoveInput('ServiceAttribute', index, sub_index)}
                              >
                                <DeleteFive theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                              </Button>
                            </div>
                            {attr.serviceAttribute[sub_index].serviceAttributeId && (
                              <>
                                <div className="flex flex-col gap-5 pl-7">
                                  {attr.serviceAttribute[sub_index].subServiceAttibute?.map(
                                    (_, sub_attr_value_index) => (
                                      <>
                                        <div className="flex items-center gap-3" key={sub_attr_value_index}>
                                          <div className="w-fit relative">
                                            <InputWithAffix
                                              placeholder={`Vàng`}
                                              value={
                                                attributesDisplay[index].serviceAttribute[sub_index].subServiceAttibute[
                                                  sub_attr_value_index
                                                ]?.serviceAttributeValueName ?? ''
                                              }
                                              type="text"
                                              onChange={(e) =>
                                                handleServiceInputChange(
                                                  'ServiceAttributeValue',
                                                  index,
                                                  String(e.target.value),
                                                  sub_index,
                                                  undefined,
                                                  sub_attr_value_index,
                                                )
                                              }
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
                                                      indexShow: sub_index,
                                                      indexChildShow: sub_attr_value_index,
                                                    })
                                                  }
                                                  onClick={() =>
                                                    setListServiceAttributeId(
                                                      attributes[index]?.serviceAttribute[sub_index]?.serviceAttributeId
                                                        ?.id ?? '',
                                                    )
                                                  }
                                                />
                                              }
                                              onMouseDown={() =>
                                                setSearchBox({
                                                  parent: index,
                                                  type: MenuModalEnum.SUB_ATTRIBUTE,
                                                  isShow: true,
                                                  indexShow: sub_index,
                                                  indexChildShow: sub_attr_value_index,
                                                })
                                              }
                                              onClick={() =>
                                                setListServiceAttributeId(
                                                  attributes[index]?.serviceAttribute[sub_index]?.serviceAttributeId
                                                    ?.id ?? '',
                                                )
                                              }
                                            />
                                            <Transition
                                              as={Fragment}
                                              show={
                                                displaySearchBox.parent == index &&
                                                displaySearchBox.isShow &&
                                                displaySearchBox.type == MenuModalEnum.SUB_ATTRIBUTE &&
                                                displaySearchBox.indexShow == sub_index &&
                                                displaySearchBox.indexChildShow == sub_attr_value_index
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
                                                    indexShow: sub_index,
                                                    indexChildShow: sub_attr_value_index,
                                                  })
                                                }
                                              >
                                                <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                                                  {!isServiceAttributeValueLoading &&
                                                  !isServiceAttributeValueFetching ? (
                                                    serviceAttributeValueFilter &&
                                                    serviceAttributeValueFilter.length > 0 ? (
                                                      serviceAttributeValueFilter?.map((value_attr, sub_attr_index) => (
                                                        <div
                                                          className={`flex gap-5 items-center bg-gray-700 hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                                                          key={sub_attr_index}
                                                          onClick={() =>
                                                            handleServiceChange(
                                                              'ServiceAttributeValue',
                                                              index,
                                                              sub_index,
                                                              undefined,
                                                              sub_attr_value_index,
                                                              {
                                                                serviceAttributeId: value_attr.id ?? '',
                                                                serviceAttributeName: value_attr.viValue ?? '',
                                                              },
                                                            )
                                                          }
                                                        >
                                                          <p className="text-mg font-semibold">{value_attr.viValue}</p>
                                                        </div>
                                                      ))
                                                    ) : (
                                                      <p className="text-md font-normal">Không có kết quả</p>
                                                    )
                                                  ) : (
                                                    <>
                                                      <div className="w-full animate-pulse flex-row items-center justify-center space-x-1 rounded-xl border p-3">
                                                        <div className="h-6 w-full rounded-md bg-gray-300 "></div>
                                                      </div>
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            </Transition>
                                          </div>
                                          <Button
                                            customCSS={`text-xl p-2 bg-red-500 hover:scale-105 rounded-xl`}
                                            type="button"
                                            isActive={true}
                                            isOutlinedButton={true}
                                            onClick={() =>
                                              handleRemoveInput(
                                                'ServiceAttributeValue',
                                                sub_index,
                                                sub_attr_value_index,
                                              )
                                            }
                                          >
                                            <DeleteFive theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                                          </Button>
                                        </div>
                                      </>
                                    ),
                                  )}
                                  <Button
                                    customCSS={`text-sm p-2 hover:scale-105 rounded-xl`}
                                    type="button"
                                    isActive={true}
                                    isOutlinedButton={true}
                                    onClick={() => handleAddInput('ServiceAttributeValue', index, sub_index)}
                                  >
                                    <Plus theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                                    <p>Thêm giá trị</p>
                                  </Button>
                                </div>
                              </>
                            )}
                          </>
                        ))}
                        <Button
                          customCSS={`text-sm p-2 hover:scale-105 rounded-xl`}
                          type="button"
                          isActive={true}
                          isOutlinedButton={true}
                          onClick={() => handleAddInput('ServiceAttribute', index)}
                        >
                          <Plus theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                          <p>Thêm thuộc tính</p>
                        </Button>
                      </div>
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
        </>
      ) : (
        <></>
      )}
    </>
  )
}
export default AddSkillForm