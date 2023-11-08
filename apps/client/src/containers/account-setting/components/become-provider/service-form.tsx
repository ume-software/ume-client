/* eslint-disable react-hooks/exhaustive-deps */
import { Transition } from '@headlessui/react'
import { CloseSmall, DeleteFive, Down, Plus, Save, Write } from '@icon-park/react'
import { Button, Input, InputWithAffix, Modal, TextArea } from '@ume/ui'
import coin from 'public/coin-icon.png'
import { MenuModalEnum } from '~/enumVariable/enumVariable'

import { Fragment, useEffect, useState } from 'react'

import { ConfigProvider, message, notification, theme } from 'antd'
import Image from 'next/legacy/image'
import {
  ProviderServicePagingResponse,
  ServiceAttributePagingResponse,
  ServiceAttributeValuePagingResponse,
  ServicePagingResponse,
  ServiceResponse,
} from 'ume-service-openapi'

import ConfirmForm from '~/components/confirm-form/confirm-form'
import { SkeletonProviderService } from '~/components/skeleton-load'

import { trpc } from '~/utils/trpc'

interface ServiceForm {
  title: string
  description: string
  form: string
}

interface AttributeProps {
  id: string | undefined
  intro: string
  service: ServiceResponse | undefined
  serviceDefaultPrice: number
  serviceAttribute: {
    serviceAttributeId: string | undefined
    subServiceAttibute: { serviceAttributeValueId: string; serviceAttributeValueName: string }[]
  }[]
  specialTimeLot: { id?: string; startTimeOfDay?: string; endTimeOfDay?: string; amount?: number }[]
}

interface AttributeDisplayProps {
  intro: string
  service: string
  serviceDefaultPrice?: number
  serviceAttribute: {
    serviceAttributeId: string
    subServiceAttibute: { serviceAttributeValueId: string; serviceAttributeValueName: string }[]
  }[]
  specialTimeLot: { id?: string; startTimeOfDay?: string; endTimeOfDay?: string; amount?: number }[]
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

  const [listOwnService, setListOwnService] = useState<ProviderServicePagingResponse['row'] | undefined>()
  const [listService, setListService] = useState<ServicePagingResponse['row'] | undefined>()
  const [listServiceFilter, setListServiceFilter] = useState<ServicePagingResponse['row'] | undefined>()

  const [listServiceAttribute, setListServiceAttribute] = useState<ServiceAttributePagingResponse['row'] | undefined>()
  const [listServiceAttributeFilter, setListServiceAttributeFilter] = useState<
    ServiceAttributePagingResponse['row'] | undefined
  >()
  const [listServiceId, setListServiceId] = useState<string>('')
  const [listServiceAttributeId, setListServiceAttributeId] = useState<string>('')

  const { isLoading: isListOwnServiceLoading } = trpc.useQuery(['identity.providerGetOwnServices'], {
    onSuccess(data) {
      setListOwnService(data.data.row)
    },
  })

  const [serviceAttributeValue, setServiceAttributeValue] = useState<
    ServiceAttributeValuePagingResponse['row'] | undefined
  >(undefined)
  const [serviceAttributeValueFilter, setServiceAttributeValueFilter] = useState<
    ServiceAttributeValuePagingResponse['row'] | undefined
  >(undefined)

  const [attributes, setAttributes] = useState<AttributeProps[]>([
    {
      id: undefined,
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

  const { isLoading: isServiceLoading } = trpc.useQuery(['identity.providerGetServiceHaveNotRegistered'], {
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

  const utils = trpc.useContext()

  const createProvicerService = trpc.useMutation('identity.createServiceProvider')
  const updateProvicerService = trpc.useMutation('identity.updateServiceProvider')

  const [displaySearchBox, setSearchBox] = useState<MenuDisplayProps>({
    parent: 0,
    type: '',
    isShow: false,
    indexShow: 0,
  })

  useEffect(() => {
    if (listOwnService) {
      setAttributes(
        listOwnService?.map((ownService) => ({
          id: ownService.id,
          intro: ownService.description ?? '',
          service: ownService.service,
          serviceDefaultPrice: ownService.defaultCost ?? 1,
          serviceAttribute: ownService.providerServiceAttributes?.map((providerServiceAttr) => ({
            serviceAttributeId: providerServiceAttr.serviceAttributeId,
            subServiceAttibute: providerServiceAttr.providerServiceAttributeValues?.map((providerServiceAttrValue) => ({
              serviceAttributeValueId: providerServiceAttrValue.serviceAttributeValueId ?? '',
              serviceAttributeValueName:
                (providerServiceAttrValue?.serviceAttributeValue?.viValue != ''
                  ? providerServiceAttrValue?.serviceAttributeValue?.viValue
                  : providerServiceAttrValue?.serviceAttributeValue?.value) ?? '',
            })),
          })) as any,
          specialTimeLot: ownService.bookingCosts ?? [],
        })),
      )

      setAttributesDisplay(
        listOwnService?.map((ownService) => ({
          intro: ownService.description ?? '',
          service: ownService.service?.name ?? '',
          serviceDefaultPrice: ownService.defaultCost ?? 1,
          serviceAttribute: ownService.providerServiceAttributes?.map((providerServiceAttr) => ({
            serviceAttributeId: providerServiceAttr?.serviceAttribute?.viAttribute ?? '',
            subServiceAttibute: providerServiceAttr.providerServiceAttributeValues?.map((providerServiceAttrValue) => ({
              serviceAttributeValueId: providerServiceAttrValue?.serviceAttributeValue?.id ?? '',
              serviceAttributeValueName:
                (providerServiceAttrValue?.serviceAttributeValue?.viValue != ''
                  ? providerServiceAttrValue?.serviceAttributeValue?.viValue
                  : providerServiceAttrValue?.serviceAttributeValue?.value) ?? '',
            })),
          })) as any,
          specialTimeLot: ownService.bookingCosts ?? [],
        })),
      )
    }
  }, [listOwnService])

  const handleAddAttribute = () => {
    setAttributes([
      ...attributes,
      {
        id: undefined,
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
        updatedAttributesDisplay[index] = {
          ...updatedAttributesDisplay[index],
          service: searchText,
          serviceAttribute: [
            {
              serviceAttributeId: '',
              subServiceAttibute: [{ serviceAttributeValueId: '', serviceAttributeValueName: '' }],
            },
          ],
        }
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
        updatedAttributes[index] = {
          ...updatedAttributes[index],
          service: value,
          serviceAttribute: [
            {
              serviceAttributeId: undefined,
              subServiceAttibute: [{ serviceAttributeValueId: '', serviceAttributeValueName: '' }],
            },
          ],
        }

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
        if (updatedAttributes[index].serviceAttribute.find((serviceAttr) => serviceAttr.serviceAttributeId == value)) {
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
          handleServiceInputChange(
            'ServiceAttribute',
            index,
            listServiceAttribute?.find((serviceAttribute) => serviceAttribute.id == value)?.viAttribute ?? '',
            sub_index,
            true,
          )
          setListServiceAttributeId(value)
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

  const isTimePeriodIncluded = (period1: string[], period2: string[]) => {
    const [start1, end1] = period1.map((time) => time.split(':').map(Number))
    const [start2, end2] = period2.map((time) => time.split(':').map(Number))

    const startMinutes1 = (end2[0] < start2[0] ? 24 - start1[0] : start1[0]) * 60 + start1[1]
    const endMinutes1 = end1[0] * 60 + end1[1]
    const startMinutes2 = (end2[0] < start2[0] ? 24 - start2[0] : start2[0]) * 60 + start2[1]
    const endMinutes2 = end2[0] * 60 + end2[1]

    const isEntirelyIncluded =
      (end2[0] < start2[0] && startMinutes1 >= startMinutes2 && startMinutes1 <= endMinutes2) ||
      (startMinutes1 >= startMinutes2 && startMinutes1 <= endMinutes2) ||
      (end2[0] < start2[0] && endMinutes1 <= startMinutes2 && endMinutes1 >= endMinutes2) ||
      (end2[0] < start2[0] && endMinutes1 >= start2[0] * 60 + start2[1]) ||
      (end2[0] > start2[0] && endMinutes1 >= startMinutes2 && endMinutes1 <= endMinutes2) ||
      (end2[0] > start2[0] && endMinutes1 <= start2[0] * 60 + start2[1])

    return isEntirelyIncluded
  }

  const handleSpecialTimeChange = (index: number, value: string, type: string, time_slotIndex: number) => {
    const updatedAttributes = [...attributes]
    switch (type) {
      case 'startTimeOfDay':
        const found = updatedAttributes[index].specialTimeLot.some((timeSlot, time_slot_index) => {
          if (time_slot_index != time_slotIndex) {
            return isTimePeriodIncluded(
              [value, updatedAttributes[index].specialTimeLot[time_slotIndex].endTimeOfDay ?? ''],
              [timeSlot.startTimeOfDay ?? '', timeSlot.endTimeOfDay ?? ''],
            )
          }
        })

        if (found) {
          messageApi.open({
            type: 'warning',
            content: 'Khoảng thời gian không được trùng',
            duration: 2,
          })
        } else {
          updatedAttributes[index].specialTimeLot[time_slotIndex].startTimeOfDay = value
          setAttributes(updatedAttributes)
        }

        break
      case 'endTimeOfDay':
        const foundEOD = updatedAttributes[index].specialTimeLot.some((timeSlot, time_slot_index) => {
          if (time_slot_index != time_slotIndex) {
            return isTimePeriodIncluded(
              [updatedAttributes[index].specialTimeLot[time_slotIndex].startTimeOfDay ?? '', value],
              [timeSlot.startTimeOfDay ?? '', timeSlot.endTimeOfDay ?? ''],
            )
          }
        })
        if (foundEOD) {
          messageApi.open({
            type: 'warning',
            content: 'Khoảng thời gian không được trùng',
            duration: 2,
          })
        } else {
          updatedAttributes[index].specialTimeLot[time_slotIndex].endTimeOfDay = value
          setAttributes(updatedAttributes)
        }
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

  const handleRemoveInput = (name: string, index: number, sub_index: number, sub_attr_value_index?: number) => {
    const updatedAttributes = [...attributes]
    const updatedAttributesDisplay = [...attributesDisplay]

    switch (name) {
      case 'SpecialTimeSlot':
        updatedAttributes[index].specialTimeLot.splice(sub_index, 1)
        setAttributes(updatedAttributes)

        break
      case 'ServiceAttribute':
        updatedAttributes[index].serviceAttribute.splice(sub_index, 1)
        setAttributes(updatedAttributes)

        updatedAttributesDisplay[index].serviceAttribute.splice(sub_index, 1)
        setAttributesDisplay(updatedAttributesDisplay)
        break
      case 'ServiceAttributeValue':
        updatedAttributes[index].serviceAttribute[sub_index].subServiceAttibute.splice(sub_attr_value_index ?? 0, 1)
        setAttributes(updatedAttributes)

        updatedAttributesDisplay[index].serviceAttribute[sub_index].subServiceAttibute.splice(
          sub_attr_value_index ?? 0,
          1,
        )
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
            return {
              id: specialTimeLot.id,
              startTimeOfDay: specialTimeLot.startTimeOfDay,
              endTimeOfDay: specialTimeLot.endTimeOfDay,
              amount: specialTimeLot.amount,
            }
          }
        }),
        createServiceAttributes: attributes[index].serviceAttribute
          .filter((attribute) => attribute?.serviceAttributeId)
          .map((attribute) => {
            const serviceAttributeValueIds = attribute.subServiceAttibute
              .filter((subAttr) => subAttr.serviceAttributeValueId !== '')
              .map((subAttr) => subAttr.serviceAttributeValueId)

            return {
              id: attribute.serviceAttributeId,
              serviceAttributeValueIds,
            }
          }),
      }

      if (attributes[index].id) {
        updateProvicerService.mutate(
          {
            serviceId: req.serviceId ?? '',
            defaultCost: req.defaultCost,
            description: req.description,
            handleBookingCosts: (req.createBookingCosts.length > 0
              ? req.createBookingCosts.map((bookingCost) => {
                  return {
                    startTimeOfDay: bookingCost.startTimeOfDay,
                    endTimeOfDay: bookingCost.endTimeOfDay,
                    amount: bookingCost.amount,
                  }
                })
              : []) as any,
            handleProviderServiceAttributes: req.createServiceAttributes.map((serAttr) => {
              return {
                id: serAttr.id ?? '',
                handleServiceAttributeValueIds: serAttr.serviceAttributeValueIds,
              }
            }),
          },
          {
            onSuccess() {
              notification.success({
                message: `Cập nhật dịch vụ thành công`,
                description: `Dịch vụ đã được cập nhật`,
                placement: 'bottomLeft',
              })
            },
            onError() {
              notification.error({
                message: `Cập nhật dịch vụ thất bại`,
                description: `Có lỗi trong quá trình cập nhật. Vui lòng thử lại sau!`,
                placement: 'bottomLeft',
              })
            },
          },
        )
      } else {
        createProvicerService.mutate(
          {
            serviceId: req.serviceId ?? '',
            defaultCost: req.defaultCost,
            description: req.description,
            createBookingCosts: (req.createBookingCosts.length > 0 ? req.createBookingCosts : undefined) as any,
            createServiceAttributes: req.createServiceAttributes as any,
          },
          {
            onSuccess() {
              notification.success({
                message: `Tạo mới dịch vụ thành công`,
                description: `Dịch vụ đã được tạo mới`,
                placement: 'bottomLeft',
              })
              utils.invalidateQueries('identity.providerGetServiceHaveNotRegistered')
              utils.invalidateQueries('identity.providerGetOwnServices')
            },
            onError() {
              notification.error({
                message: `Tạo mới dịch vụ thất bại`,
                description: `Có lỗi trong quá trình tạo mới dịch vụ. Vui lòng thử lại sau!`,
                placement: 'bottomLeft',
              })
            },
          },
        )
      }
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
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={closeConfirmModal}
        onKeyDown={(e) => e.key === 'Enter' && closeConfirmModal()}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
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
      {!isServiceLoading && !isListOwnServiceLoading ? (
        <div className="grid grid-cols-4 gap-5">
          {listService &&
            listService?.length > 0 &&
            attributes.map((attr, index) => (
              <>
                {(createProvicerService.isLoading || updateProvicerService.isLoading) && indexServiceForm == index ? (
                  <div key={index} className="col-span-2 p-5 border border-white border-opacity-30 rounded-3xl">
                    <div className="flex items-center justify-center w-full h-full">
                      <span
                        className={`spinner h-28 w-28 animate-spin rounded-full border-[5px] border-r-transparent dark:border-navy-300 dark:border-r-transparent border-white`}
                      />
                    </div>
                  </div>
                ) : (
                  <div key={index} className="col-span-2 p-5 border border-white border-opacity-30 rounded-3xl">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        customCSS="text-xl p-2 rounded-xl hover:scale-105"
                        isActive={true}
                        isOutlinedButton={true}
                        onClick={() => {
                          setIndexServiceForm(index)
                          setServiceForm({
                            title: `${attr.id ? 'Cập nhật kỹ năng' : 'Tạo mới kỹ năng'}`,
                            description: `${
                              attr.id
                                ? `Bạn có chấp nhận cập nhật kỹ năng ${attributesDisplay[index].service} không?`
                                : `Bạn có chấp nhận tạo mới kỹ năng ${attributesDisplay[index].service} không?`
                            }`,
                            form: 'UPDATE',
                          })

                          openConfirmModal()
                        }}
                      >
                        {attr.id ? (
                          <Write theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
                        ) : (
                          <Save theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                        )}
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
                      <label>Giới thiệu về kỹ năng* : </label>
                      <TextArea
                        name="description"
                        className="bg-[#413F4D] w-4/5 max-h-[140px]"
                        rows={5}
                        value={attributesDisplay[index].intro}
                        onChange={(e) =>
                          handleServiceChange(
                            'Intro',
                            index,
                            undefined,
                            undefined,
                            undefined,
                            undefined,
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col gap-1 mb-5">
                      <label>Dịch vụ: </label>
                      <div className="flex items-center gap-3">
                        <div className="relative w-fit">
                          <InputWithAffix
                            disabled={!!listOwnService?.find((ownService) => ownService.serviceId == attr.service?.id)}
                            placeholder={`${listService[0]?.name}`}
                            value={attributesDisplay[index]?.service || ''}
                            type="text"
                            onChange={(e) => handleServiceInputChange('Service', index, e.target.value)}
                            className="border border-white bg-zinc-800 rounded-xl border-opacity-30"
                            styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                            iconStyle="border-none"
                            position="right"
                            component={
                              listOwnService?.find((ownService) => ownService.serviceId == attr.service?.id) ? (
                                <></>
                              ) : (
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
                              )
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
                                      onKeyDown={() => {}}
                                      onClick={() => handleServiceChange('Service', index, undefined, service)}
                                    >
                                      <p className="font-semibold text-md">{service.name}</p>
                                    </div>
                                  ))
                                ) : (
                                  <p className="font-normal text-md">Không có kết quả</p>
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
                      <label>Khung giờ đặc biệt: </label>
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-5">
                          {attr.specialTimeLot?.map((timeSlot, time_slot_index) => (
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
                                <div className="relative w-fit">
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
                                    className="border border-white bg-zinc-800 rounded-xl border-opacity-30"
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
                                                onKeyDown={() => {}}
                                                onClick={() =>
                                                  handleServiceChange(
                                                    'ServiceAttribute',
                                                    index,
                                                    sub_index,
                                                    value_attr.id,
                                                  )
                                                }
                                              >
                                                <p className="font-semibold text-mg">{value_attr.viAttribute}</p>
                                              </div>
                                            ))
                                          ) : (
                                            <p className="font-normal text-md">Không có kết quả</p>
                                          )
                                        ) : (
                                          <div className="flex-row items-center justify-center w-full p-3 space-x-1 border animate-pulse rounded-xl">
                                            <div className="w-full h-6 bg-gray-300 rounded-md "></div>
                                          </div>
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
                                <div className="flex flex-col gap-5 pl-7">
                                  {attr.serviceAttribute[sub_index].subServiceAttibute?.map(
                                    (_, sub_attr_value_index) => (
                                      <div className="flex items-center gap-3" key={sub_attr_value_index}>
                                        <div className="relative w-fit">
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
                                            className="border border-white bg-zinc-800 rounded-xl border-opacity-30"
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
                                                onClick={() => {
                                                  setListServiceAttributeId(
                                                    attributes[index]?.serviceAttribute[sub_index]!
                                                      .serviceAttributeId ?? '',
                                                  )
                                                }}
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
                                                attributes[index]?.serviceAttribute[sub_index]!.serviceAttributeId ??
                                                  '',
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
                                                {!isServiceAttributeValueLoading && !isServiceAttributeValueFetching ? (
                                                  serviceAttributeValueFilter &&
                                                  serviceAttributeValueFilter.length > 0 ? (
                                                    serviceAttributeValueFilter?.map((value_attr, sub_attr_index) => (
                                                      <div
                                                        className={`flex gap-5 items-center bg-gray-700 hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                                                        key={sub_attr_index}
                                                        onKeyDown={() => {}}
                                                        onClick={() =>
                                                          handleServiceChange(
                                                            'ServiceAttributeValue',
                                                            index,
                                                            sub_index,
                                                            undefined,
                                                            sub_attr_value_index,
                                                            {
                                                              serviceAttributeId: value_attr.id ?? '',
                                                              serviceAttributeName:
                                                                (value_attr.viValue != ''
                                                                  ? value_attr.viValue
                                                                  : value_attr.value) ?? '',
                                                            },
                                                          )
                                                        }
                                                      >
                                                        <p className="font-semibold text-mg">
                                                          {value_attr.viValue != ''
                                                            ? value_attr.viValue
                                                            : value_attr.value}
                                                        </p>
                                                      </div>
                                                    ))
                                                  ) : (
                                                    <p className="font-normal text-md">Không có kết quả</p>
                                                  )
                                                ) : (
                                                  <div className="flex-row items-center justify-center w-full p-3 space-x-1 border animate-pulse rounded-xl">
                                                    <div className="w-full h-6 bg-gray-300 rounded-md "></div>
                                                  </div>
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
                                              index,
                                              sub_index,
                                              sub_attr_value_index,
                                            )
                                          }
                                        >
                                          <DeleteFive theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                                        </Button>
                                      </div>
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
                )}
              </>
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
      ) : (
        <SkeletonProviderService />
      )}
    </>
  )
}
export default AddSkillForm
