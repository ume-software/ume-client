import { Menu, Transition } from '@headlessui/react'
import { CloseSmall, DeleteFive, Down, Plus, Save, Write } from '@icon-park/react'
import { Button, FormInputWithAffix, Input, InputWithAffix, Modal, TextArea } from '@ume/ui'
import { MenuModalEnum } from '~/enumVariable/enumVariable'

import { Fragment, useEffect, useState } from 'react'

import { ConfigProvider, message, notification, theme } from 'antd'
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
  position: number
  intro: string
  service: ServiceResponse | undefined
  serviceDefaultPrice: string
  serviceAttribute: {
    serviceAttributeId: string | undefined
    subServiceAttibute: { serviceAttributeValueId: string; serviceAttributeValueName: string }[]
  }[]
  specialTimeLot: { id?: string; startTimeOfDay?: string; endTimeOfDay?: string; amount?: string }[]
}

interface AttributeDisplayProps {
  position: number
  intro: string
  service: string
  serviceDefaultPrice?: string
  serviceAttribute: {
    serviceAttributeId: string
    subServiceAttibute: { serviceAttributeValueId: string; serviceAttributeValueName: string }[]
  }[]
  specialTimeLot: { id?: string; startTimeOfDay?: string; endTimeOfDay?: string; amount?: string }[]
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
      position: 0,
      intro: '',
      service: undefined,
      serviceDefaultPrice: '1,000',
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
      position: 0,
      intro: '',
      service: '',
      serviceDefaultPrice: '1,000',
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
  const deleteProviderService = trpc.useMutation('identity.deleteServiceProvider')

  const [displaySearchBox, setDisplaySearchBox] = useState<MenuDisplayProps>({
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
          position: ownService.position ?? 0,
          intro: ownService.description ?? '',
          service: ownService.service,
          serviceDefaultPrice:
            ownService.defaultCost?.toLocaleString('en-US', {
              currency: 'VND',
            }) ?? '1,000',
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
          specialTimeLot:
            ownService.bookingCosts?.map((specialTime) => ({
              ...specialTime,
              amount: (specialTime?.amount ?? 0).toLocaleString('en-US', {
                currency: 'VND',
              }),
            })) ?? [],
        })),
      )

      setAttributesDisplay(
        listOwnService?.map((ownService) => ({
          position: ownService.position ?? 0,
          intro: ownService.description ?? '',
          service: ownService.service?.name ?? '',
          serviceDefaultPrice:
            ownService.defaultCost?.toLocaleString('en-US', {
              currency: 'VND',
            }) ?? '1,000',
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
          specialTimeLot:
            ownService.bookingCosts?.map((specialTime) => ({
              ...specialTime,
              amount: (specialTime?.amount ?? 0).toLocaleString('en-US', {
                currency: 'VND',
              }),
            })) ?? [],
        })),
      )
    }
  }, [listOwnService])

  const handleAddAttribute = () => {
    setAttributes([
      ...attributes,
      {
        id: undefined,
        position: listOwnService?.length ?? 0,
        intro: '',
        service: undefined,
        serviceDefaultPrice: '1,000',
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
        position: listOwnService?.length ?? 0,
        intro: '',
        service: '',
        serviceDefaultPrice: '1,000',
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
    if (attributes[index]?.id) {
      deleteProviderService.mutate(attributes[index].service?.id ?? '', {
        onSuccess() {
          utils.invalidateQueries('identity.providerGetServiceHaveNotRegistered')
          utils.invalidateQueries('identity.providerGetOwnServices')
          notification.success({
            message: `Xóa dịch vụ thành công`,
            description: `Dịch vụ đã được xóa`,
            placement: 'bottomLeft',
          })
        },
        onError() {
          notification.error({
            message: `Xóa dịch vụ thất bại`,
            description: `Có lỗi trong quá trình xóa. Vui lòng thử lại sau!`,
            placement: 'bottomLeft',
          })
        },
      })
      setIsModalConfirmationVisible(false)
    } else {
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
  }

  const handleServiceInputChange = (
    name: string,
    index: number,
    searchText: string,
    sub_index?: number,
    serviceChange?: boolean,
    sub_attr_index?: number,
    position?: number,
  ) => {
    const updatedAttributesDisplay = [...attributesDisplay]

    switch (name) {
      case 'Position':
        updatedAttributesDisplay[index] = { ...updatedAttributesDisplay[index], position: position ?? 0 }
        setAttributesDisplay(updatedAttributesDisplay)
        break
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
      case 'Position':
        updatedAttributes[index] = { ...updatedAttributes[index], position: value ?? 0 }
        setAttributes(updatedAttributes)
        handleServiceInputChange('Position', index, '', undefined, true, undefined, value ?? 0)
        break
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

        setDisplaySearchBox({
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

  const handleServicePriceChange = (index: number, value: string) => {
    const updatedAttributes = [...attributes]
    updatedAttributes[index] = { ...updatedAttributes[index], serviceDefaultPrice: value }
    setAttributes(updatedAttributes)
  }

  const isTimePeriodIncluded = (period1: string[], period2: string[]) => {
    const [startInputTime, endInputTime] = period1
    const [startInputHours, startInputMinutes] = startInputTime.split(':').map(Number)
    const [endInputHours, endInputMinutes] = endInputTime.split(':').map(Number)

    const [startTime, endTime] = period2
    const [startHours, startMinutes] = startTime.split(':').map(Number)
    const [endHours, endMinutes] = endTime.split(':').map(Number)

    if (endHours > startHours) {
      return (
        (startInputHours > startHours &&
          startInputHours < endHours &&
          endInputHours > startHours &&
          endInputHours < endHours) ||
        (startInputHours == startHours && startInputMinutes > startMinutes) ||
        (endInputHours == endHours && endInputMinutes < endMinutes) ||
        (startInputHours == endHours && startInputMinutes < endMinutes) ||
        (endInputHours == startHours && endInputMinutes > startMinutes) ||
        (endInputHours && endInputHours < startInputHours) ||
        (endInputHours == startInputHours && endInputMinutes < startInputMinutes)
      )
    } else if (endHours < startHours) {
      return (
        (startInputHours < startHours &&
          startInputHours > endHours &&
          endInputHours < startHours &&
          endInputHours > endHours) ||
        (startInputHours == startHours && startInputMinutes < startMinutes) ||
        (endInputHours == endHours && endInputMinutes > endMinutes) ||
        (endInputHours && endInputHours > startInputHours) ||
        (endInputHours == startInputHours && endInputMinutes > startInputMinutes)
      )
    }
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
        updatedAttributes[index].specialTimeLot[time_slotIndex].amount = value
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
          amount: '0',
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
        position: attributes[index]?.position,
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
            position: req.position ?? 0,
            defaultCost: Number(req.defaultCost.replace(/,/g, '')),
            description: req.description,
            handleBookingCosts: (req.createBookingCosts.length > 0
              ? req.createBookingCosts.map((bookingCost) => {
                  return {
                    startTimeOfDay: bookingCost.startTimeOfDay,
                    endTimeOfDay: bookingCost.endTimeOfDay,
                    amount: Number((bookingCost.amount ?? '0').replace(/,/g, '')),
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
              utils.invalidateQueries('identity.providerGetOwnServices')
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
            position: req.position ?? 0,
            defaultCost: Number(req.defaultCost.replace(/,/g, '')),
            description: req.description,
            createBookingCosts:
              req.createBookingCosts.length > 0
                ? (req.createBookingCosts.map((bookingCost) => ({
                    ...bookingCost,
                    amount: Number(bookingCost.amount?.replace(/,/g, '')),
                  })) as any)
                : undefined,
            createServiceAttributes: req.createServiceAttributes as any,
          },
          {
            onSuccess() {
              utils.invalidateQueries('identity.providerGetServiceHaveNotRegistered')
              utils.invalidateQueries('identity.providerGetOwnServices')
              notification.success({
                message: `Tạo mới dịch vụ thành công`,
                description: `Dịch vụ đã được tạo mới`,
                placement: 'bottomLeft',
              })
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
    customModalCSS: 'top-32',
    form: (
      <>
        <ConfirmForm
          title={`${serviceForm.title}`}
          description={`${serviceForm.description}`}
          onClose={closeConfirmModal}
          isLoading={updateProvicerService.isLoading || deleteProviderService.isLoading}
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
        <>
          <div className="grid grid-cols-4 gap-5">
            {listService &&
              listService?.length > 0 &&
              attributes.map((attr, index) => (
                <>
                  {(createProvicerService.isLoading ||
                    updateProvicerService.isLoading ||
                    deleteProviderService.isLoading) &&
                  indexServiceForm == index ? (
                    <div key={index} className="col-span-2 p-5 border border-white border-opacity-30 rounded-3xl">
                      <div className="flex items-center justify-center w-full h-full">
                        <span
                          className={`spinner h-28 w-28 animate-spin rounded-full border-[5px] border-r-transparent dark:border-navy-300 dark:border-r-transparent border-white`}
                        />
                      </div>
                    </div>
                  ) : (
                    <div key={index} className="col-span-2 p-5 border border-white border-opacity-30 rounded-3xl">
                      <div className="flex items-center justify-between pb-3">
                        <div className="flex items-center gap-2">
                          {attr.id && (
                            <>
                              <p>Vị trí: </p>
                              <div className="relative">
                                <Menu>
                                  <div>
                                    <Menu.Button>
                                      <div className="min-w-[80px] flex justify-between items-center px-3 py-1 rounded-lg bg-zinc-800 border border-white border-opacity-30">
                                        <p>{attributesDisplay[index].position}</p>
                                        <Down theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />
                                      </div>
                                    </Menu.Button>
                                  </div>
                                  <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-400"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-400"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                  >
                                    <Menu.Items className="min-w-full max-h-[200px] absolute right-0 p-2 origin-top-right bg-umeHeader divide-y divide-gray-200 rounded-md shadow-lg w-fit top-9 ring-1 ring-black ring-opacity-30 focus:outline-none overflow-y-auto hide-scrollbar">
                                      <div className="flex flex-col w-full gap-2">
                                        {attributes?.map((_, position_index) => (
                                          <div
                                            key={position_index}
                                            className="w-full p-2 font-medium rounded-md cursor-pointer text-md hover:bg-gray-700"
                                            onClick={() => {
                                              handleServiceChange('Position', index, undefined, position_index + 1)
                                            }}
                                            onKeyDown={() => {}}
                                          >
                                            {position_index + 1}
                                          </div>
                                        ))}
                                      </div>
                                    </Menu.Items>
                                  </Transition>
                                </Menu>
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <Button
                            type="button"
                            customCSS="text-xl p-2 rounded-xl hover:scale-105"
                            isActive={true}
                            isOutlinedButton={true}
                            onClick={() => {
                              if (!(Number(attributes[index].serviceDefaultPrice.replace(/,/g, '')) <= 0)) {
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
                              }
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
                              disabled={
                                !!listOwnService?.find((ownService) => ownService.serviceId == attr.service?.id)
                              }
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
                                      setDisplaySearchBox({
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
                                setDisplaySearchBox({
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
                                  setDisplaySearchBox({
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
                                        onKeyDown={() => {}}
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
                          <div className="relative">
                            <FormInputWithAffix
                              placeholder="Giá dịch vụ"
                              value={attributes[index].serviceDefaultPrice.toLocaleString()}
                              type="text"
                              name="ServicePrice"
                              onChange={(e) => {
                                const inputValue = e.target.value.replace(/,/g, '')
                                const numericValue = parseFloat(inputValue)
                                const formattedValue = isNaN(numericValue) ? '0' : numericValue.toLocaleString()
                                if (Number(inputValue) < 100001) {
                                  handleServicePriceChange(index, formattedValue)
                                }
                              }}
                              error={Number(attributes[index].serviceDefaultPrice.replace(/,/g, '')) <= 0}
                              errorMessage=""
                              className={`max-w-[130px] bg-zinc-800 border ${
                                Number(attributes[index].serviceDefaultPrice.replace(/,/g, '')) <= 0
                                  ? 'border-red-500'
                                  : 'border-white border-opacity-30'
                              } rounded-xl my-2`}
                              styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                              iconStyle="border-none pl-0 pr-2"
                              position="right"
                              component={<span className="text-xs italic"> đ</span>}
                            />
                            {Number(attributes[index].serviceDefaultPrice.replace(/,/g, '')) <= 0 && (
                              <p className="absolute bottom-[-2] text-xs text-red-500">Giá phải lớn hơn 0đ</p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mt-5 mb-5 ml-3">
                        <label>Khung giờ đặc biệt: </label>
                        <div className="flex flex-col gap-5">
                          <div className="flex flex-col gap-5">
                            {attr.specialTimeLot?.map((timeSlot, time_slot_index) => (
                              <>
                                <div className="flex items-center gap-3" key={time_slot_index}>
                                  <div className="grid items-center grid-cols-4 gap-1 2xl:grid-cols-6 2xl:gap-3">
                                    <div className="col-span-2 min-w-[105px]">
                                      <Input
                                        placeholder="Thời gian bắt đầu"
                                        value={timeSlot.startTimeOfDay}
                                        type="time"
                                        name="startTimeOfDay"
                                        onChange={(e) =>
                                          handleSpecialTimeChange(
                                            index,
                                            e.target.value,
                                            'startTimeOfDay',
                                            time_slot_index,
                                          )
                                        }
                                        className="max-w-[180px] bg-zinc-800 text-white border border-white border-opacity-30 !pr-1 rounded-xl my-2"
                                      />
                                    </div>
                                    <div className="col-span-2 min-w-[105px]">
                                      <Input
                                        placeholder="Thời gian kết thúc"
                                        value={timeSlot.endTimeOfDay}
                                        type="time"
                                        name="endTimeOfDay"
                                        onChange={(e) =>
                                          handleSpecialTimeChange(
                                            index,
                                            e.target.value,
                                            'endTimeOfDay',
                                            time_slot_index,
                                          )
                                        }
                                        className="max-w-[180px] bg-zinc-800 text-white border border-white border-opacity-30 !pr-1 rounded-xl my-2"
                                      />
                                    </div>
                                    <div className="col-span-2">
                                      <InputWithAffix
                                        placeholder="Giá"
                                        value={timeSlot.amount}
                                        type="text"
                                        name="amount"
                                        onChange={(e) => {
                                          const inputValue = e.target.value.replace(/,/g, '')
                                          const numericValue = parseFloat(inputValue)
                                          const formattedValue = isNaN(numericValue)
                                            ? '0'
                                            : numericValue.toLocaleString()
                                          if (Number(inputValue) < 100001) {
                                            handleSpecialTimeChange(index, formattedValue, 'amount', time_slot_index)
                                          }
                                        }}
                                        className="max-w-[130px] bg-zinc-800 border border-white border-opacity-30 rounded-xl my-2"
                                        styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                                        iconStyle="border-none pl-0 pr-2"
                                        position="right"
                                        component={<span className="text-xs italic"> đ</span>}
                                      />
                                    </div>
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
                                            setDisplaySearchBox({
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
                                        setDisplaySearchBox({
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
                                          setDisplaySearchBox({
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
                                                  className={`flex gap-5 items-center hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                                                  key={sub_attr_index}
                                                  onClick={() =>
                                                    handleServiceChange(
                                                      'ServiceAttribute',
                                                      index,
                                                      sub_index,
                                                      value_attr.id,
                                                    )
                                                  }
                                                  onKeyDown={() => {}}
                                                >
                                                  <p className="font-semibold text-mg">{value_attr.viAttribute}</p>
                                                </div>
                                              ))
                                            ) : (
                                              <p className="font-normal text-md">Không có kết quả</p>
                                            )
                                          ) : (
                                            <>
                                              <div className="flex-row items-center justify-center w-full p-3 space-x-1 border animate-pulse rounded-xl">
                                                <div className="w-full h-6 bg-gray-300 rounded-md "></div>
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
                                              <div className="relative w-fit">
                                                <InputWithAffix
                                                  placeholder={`Vàng`}
                                                  value={
                                                    attributesDisplay[index].serviceAttribute[sub_index]
                                                      .subServiceAttibute[sub_attr_value_index]
                                                      ?.serviceAttributeValueName ?? ''
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
                                                        setDisplaySearchBox({
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
                                                    setDisplaySearchBox({
                                                      parent: index,
                                                      type: MenuModalEnum.SUB_ATTRIBUTE,
                                                      isShow: true,
                                                      indexShow: sub_index,
                                                      indexChildShow: sub_attr_value_index,
                                                    })
                                                  }
                                                  onClick={() =>
                                                    setListServiceAttributeId(
                                                      attributes[index]?.serviceAttribute[sub_index]!
                                                        .serviceAttributeId ?? '',
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
                                                      setDisplaySearchBox({
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
                                                          serviceAttributeValueFilter?.map(
                                                            (value_attr, sub_attr_index) => (
                                                              <div
                                                                className={`flex gap-5 items-center  hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
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
                                                                      serviceAttributeName:
                                                                        (value_attr.viValue != ''
                                                                          ? value_attr.viValue
                                                                          : value_attr.value) ?? '',
                                                                    },
                                                                  )
                                                                }
                                                                onKeyDown={() => {}}
                                                              >
                                                                <p className="font-semibold text-mg">
                                                                  {value_attr.viValue != ''
                                                                    ? value_attr.viValue
                                                                    : value_attr.value}
                                                                </p>
                                                              </div>
                                                            ),
                                                          )
                                                        ) : (
                                                          <p className="font-normal text-md">Không có kết quả</p>
                                                        )
                                                      ) : (
                                                        <>
                                                          <div className="flex-row items-center justify-center w-full p-3 space-x-1 border animate-pulse rounded-xl">
                                                            <div className="w-full h-6 bg-gray-300 rounded-md "></div>
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
                                                    index,
                                                    sub_index,
                                                    sub_attr_value_index,
                                                  )
                                                }
                                              >
                                                <DeleteFive
                                                  theme="outline"
                                                  size="20"
                                                  fill="#fff"
                                                  strokeLinejoin="bevel"
                                                />
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
                  )}
                </>
              ))}

            <div className="col-span-2 min-h-[500px] flex justify-center items-center">
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
        <SkeletonProviderService />
      )}
    </>
  )
}
export default AddSkillForm
