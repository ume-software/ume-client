import { Button, FormInput } from '@ume/ui'
import empty_img from 'public/empty_error.png'

import { useEffect, useState } from 'react'

import { useFormik } from 'formik'
import Image from 'next/legacy/image'
import { ServiceResponse } from 'ume-service-openapi'
import * as Yup from 'yup'

import ServiceAttributes from './services-attribute-childrend'

import ModalBase from '~/components/modal-base'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

import { trpc } from '~/utils/trpc'

export interface IServicesModalViewProps {
  closeFunction: any
  openValue: boolean
  idService: string
}

export const ServicesModalView = ({ idService, closeFunction, openValue }: IServicesModalViewProps) => {
  const [servicesDetails, setServicesDetails] = useState<ServiceResponse>()
  const SELECT = [
    '$all',
    {
      serviceAttributes: [
        '$all',
        {
          serviceAttributeValues: ['$all'],
          $where: { deletedAt: null },
        },
      ],
      $where: { deletedAt: null },
    },
  ]
  trpc.useQuery(['services.getServiceDetails', { id: idService, select: JSON.stringify(SELECT) }], {
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
    onSuccess(data) {
      setServicesDetails(data.data)
    },
  })
  const titleValue = 'Xem dịch vụ'
  const [openConfirm, setOpenConfirm] = useState(false)
  const nameInit = servicesDetails?.name
  const viNameInit = servicesDetails?.viName
  const imageUrlInit = servicesDetails?.imageUrl ?? empty_img
  const isActivatedInit = true
  const numberUsedInit = 100
  const createdAtInit = servicesDetails?.createdAt
    ? new Date(servicesDetails?.createdAt).toLocaleDateString('en-GB')
    : ''
  const serviceAttributesInit = servicesDetails?.serviceAttributes ?? []

  const form = useFormik({
    initialValues: {
      name: nameInit,
      viName: viNameInit,
      imageUrl: imageUrlInit,
      isActivated: isActivatedInit,
      serviceAttributes: serviceAttributesInit,
      numberUsed: numberUsedInit,
      createdAt: createdAtInit,
      selectedImage: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Tên là bắt buộc'),
      viName: Yup.string().required('Tên là bắt buộc'),
      serviceAttributes: Yup.array()
        .of(
          Yup.object({
            attribute: Yup.string(),
            viAttribute: Yup.string(),
            isActivated: Yup.boolean(),
            serviceAttributeValues: Yup.array()
              .of(
                Yup.object({
                  value: Yup.string(),
                  viValue: Yup.string(),
                  isActivated: Yup.boolean(),
                }),
              )
              .min(0, ''),
          }),
        )
        .min(0, ''),
    }),
    onSubmit: (values, { resetForm }) => {
      openConfirmModal()
      resetForm()
    },
  })

  useEffect(() => {
    form.setFieldValue('name', nameInit)
    form.setFieldValue('viName', viNameInit)
    form.setFieldValue('imageUrl', imageUrlInit)
    form.setFieldValue('isActivated', isActivatedInit)
    form.setFieldValue('serviceAttributes', serviceAttributesInit)
    form.setFieldValue('numberUsed', numberUsedInit)
    form.setFieldValue('createdAt', createdAtInit)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [servicesDetails])

  function closeHandleSmall() {
    openConfirmModalCancel()
  }
  function openConfirmModalCancel() {
    setOpenConfirm(true)
  }
  function openConfirmModal() {
    setOpenConfirm(true)
  }
  function closeComfirmFormHandle() {
    setOpenConfirm(false)
  }
  function clearData() {
    form.resetForm()
  }
  function closeHandle() {
    setOpenConfirm(false)
    clearData()
    closeFunction()
  }

  async function submitHandle() {
    closeHandle()
  }
  return (
    <div>
      <form onSubmit={form.handleSubmit} className="flex flex-col mb-4 gap-y-4">
        <ModalBase
          titleValue={titleValue}
          closeFunction={closeFunction}
          openValue={openValue}
          className="w-auto bg-black"
          width={1100}
          isdestroyOnClose={true}
        >
          <div className="flex-col w-auto bg-[#15151B] mt-5 px-4">
            <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
              <div className="w-1/5 pr-4 mt-10">
                <div className={'w-36 h-52 overflow-hidden rounded-2xl bg-[#413F4D]'}>
                  <Image
                    className="overflow-hidden rounded-2xl"
                    width={144}
                    height={208}
                    src={imageUrlInit}
                    alt=""
                    objectFit="cover"
                  />
                </div>
              </div>
              <div className="flex flex-col justify-center w-2/5 ">
                <div className="w-64 h-24 text-white">
                  <div className="inline-block w-full h-8">Tên tiếng việt:</div>
                  <div className="inline-block w-full ">
                    <FormInput
                      className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 `}
                      placeholder={'Tên trống'}
                      disabled={false}
                      value={viNameInit}
                      error={undefined}
                      errorMessage={undefined}
                      readOnly
                    />
                  </div>
                </div>
                <div className="w-64 h-12 text-white">
                  <div className="inline-block w-full h-8">Tên tiếng anh:</div>
                  <div className="inline-block w-full ">
                    <FormInput
                      className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 `}
                      placeholder={'Tên trống'}
                      disabled={false}
                      value={nameInit}
                      error={undefined}
                      errorMessage={undefined}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col justify-center w-2/5 ">
                <div className="w-full h-12 text-white">
                  Trạng Thái:
                  <div className="inline-block w-2/3 pl-4">{isActivatedInit ? 'Hoạt Động' : 'Tạm Dừng'}</div>
                </div>
                <div className="w-full h-12 text-white">
                  Số người dùng: <span className="inline-block w-2/3 pl-4">{numberUsedInit} người</span>
                </div>
                <div className="w-full h-12 text-white">
                  Ngày Tạo: <span className="inline-block w-2/3 pl-4">{createdAtInit}</span>
                </div>
              </div>
            </div>
          </div>
          {/* compent-child */}

          <div className="grid grid-cols-2 gap-4 px-4 pb-4 mt-6">
            {serviceAttributesInit.map((childData, index) => (
              <div className="col-span-1 " key={index}>
                <ServiceAttributes
                  index={index}
                  serviceAttributesData={childData}
                  setServiceAttributesData={(data) => {
                    const updatedSubChildData = [...form.values.serviceAttributes]
                    updatedSubChildData[index] = data
                    form.setFieldValue(`serviceAttributes[${index}]`, data)
                  }}
                  isReadOnly={true}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center pb-4 mt-6">
            <Button customCSS="mx-6 px-4 py-1 border-2 hover:scale-110" onClick={openConfirmModalCancel}>
              Đóng
            </Button>
          </div>
        </ModalBase>
      </form>
      {openConfirm && (
        <ComfirmModal
          closeFunction={closeComfirmFormHandle}
          openValue={true}
          isComfirmFunction={closeHandle}
          titleValue={'Xác nhận đóng'}
        ></ComfirmModal>
      )}
    </div>
  )
}
