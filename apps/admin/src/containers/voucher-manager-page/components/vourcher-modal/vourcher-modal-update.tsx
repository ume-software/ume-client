import { Plus } from '@icon-park/react'
import { Button, Input, TextArea } from '@ume/ui'
import { uploadImageVoucher } from '~/api/upload-media'

import * as React from 'react'
import { useRef, useState } from 'react'

import { Select, Space } from 'antd'
import Image from 'next/legacy/image'
import {
  CreateVoucherRequestDiscountUnitEnum,
  CreateVoucherRequestRecipientTypeEnum,
  CreateVoucherRequestTypeEnum,
} from 'ume-service-openapi'

import anhURL from '../../../../../public/anh.jpg'

import ModalBase from '~/components/modal-base'
import ComfirmModal from '~/components/modal-base/comfirm-modal'

const { Option } = Select

export interface IVourcherModalUpdateProps {
  closeFunction: any
  openValue: boolean
  vourcherId?: any
}

export default function VourcherModalUpdate({ vourcherId, closeFunction, openValue }: IVourcherModalUpdateProps) {
  // call API by vourcherID and set to init value
  const ImageInit = anhURL.src
  const nameInit = 'ABC'
  const vourcherCodeInit = 'TEST'
  const issuerInit = 'ABC'
  // const approverInit = 'ABC'
  const statusInit = 'ABC'
  const createAtInit = new Date().toLocaleDateString('en-GB')
  const endDateInit = new Date().toISOString().split('T')[0]
  const numVoucherInit = 10
  const numUserCanUseInit = 11
  const typeVoucherInit = CreateVoucherRequestTypeEnum.Discount
  const applyTimeInit = [2, 3]
  const numVoucherInDayInit = 11
  const numUserCanUseInDayInit = 123
  const minimizeInit = 123
  const audienceInit = CreateVoucherRequestRecipientTypeEnum.All
  const descriptionInit = 'ABC'
  const contentInit = 'SOME THING WRONG'
  const discountUnitInit = CreateVoucherRequestDiscountUnitEnum.Percent

  const titleValue = 'Thông Tin Khuyến Mãi'
  const [name, setName] = useState<any>(nameInit)
  const [vourcherCode, setVourcherCode] = useState<any>(vourcherCodeInit)
  const issuer = issuerInit
  const [status, setStatus] = useState<any>(statusInit)
  const [createAt, setCreateAt] = useState<any>(createAtInit)
  const [endDate, setEndDate] = useState<any>(endDateInit)
  const [numVoucher, setNumVoucher] = useState<any>(numVoucherInit)
  const [numUserCanUse, setNumUserCanUse] = useState<any>(numUserCanUseInit)
  const [typeVoucher, setTypeVoucher] = useState<any>(typeVoucherInit)
  const [applyTime, setApplyTime] = useState<Array<any>>(applyTimeInit)
  const [numVoucherInDay, setNumVoucherInDay] = useState<any>(numVoucherInDayInit)
  const [numUserCanUseInDay, setNumUserCanUseInDay] = useState<any>(numUserCanUseInDayInit)
  const [minimize, setMinimize] = useState<any>(minimizeInit)
  const [audience, setAudience] = useState<any>(audienceInit)
  const [description, setDescription] = useState<any>(descriptionInit)
  const [content, setContent] = useState<any>(contentInit)
  const [imageSource, setImageSource] = useState<string>(ImageInit)
  const [discountUnit, setDiscountUnit] = useState<string>(discountUnitInit)

  const [selectedImage, setSelectedImage] = useState<any | null>()
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [openConfirm, setOpenConfirm] = React.useState(false)
  const [isCreate, setIsCreate] = useState<boolean>(false)

  function clearData() {
    setImageSource(ImageInit)
    setSelectedImage(null)
    setName(nameInit)
    setVourcherCode(vourcherCodeInit)
    setStatus(statusInit)
    setEndDate(endDateInit)
    setNumVoucher(numVoucherInit)
    setNumUserCanUse(numUserCanUseInit)
    setTypeVoucher(typeVoucherInit)
    setApplyTime(applyTimeInit)
    setNumVoucherInDay(numVoucherInDayInit)
    setNumUserCanUseInDay(numUserCanUseInDayInit)
    setMinimize(minimizeInit)
    setAudience(audienceInit)
    setDescription(descriptionInit)
    setContent(contentInit)
    setIsCreate(false)
    setDiscountUnit(discountUnitInit)
  }
  function closeComfirmFormHandle() {
    setOpenConfirm(false)
  }
  function closeHandle() {
    setOpenConfirm(false)
    clearData()
    closeFunction()
  }
  const handleMediaChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setSelectedImage(file)
        setImageSource(URL.createObjectURL(file))
      }
      reader.readAsDataURL(file)
    }
  }
  const handleImageClick = () => {
    if (imageInputRef) {
      imageInputRef.current?.click()
    }
  }

  const handleChangeApplyDay = (dayText) => {
    setApplyTime(dayText)
  }
  function handleTypeVoucher(value) {
    setTypeVoucher(value)
  }
  function filterOptionTypeVoucher(input, option) {
    return (option?.label ?? '').toUpperCase().includes(input.toUpperCase())
  }

  function handleRecipientType(value) {
    setAudience(value)
  }

  function filterOptionRecipientType(input, option) {
    return (option?.label ?? '').toUpperCase().includes(input.toUpperCase())
  }
  function handleDisCountUnit(value) {
    console.log(value)
    setDiscountUnit(value)
  }

  function filterOptionDisCountUnit(input, option) {
    return (option?.label ?? '').toUpperCase().includes(input.toUpperCase())
  }

  function openConfirmModalCancel() {
    setOpenConfirm(true)
  }
  function openConfirmModal() {
    setIsCreate(true)
    setOpenConfirm(true)
  }

  function submitHandle() {
    uploadImage()
    //excute api here
    closeHandle()
  }
  function closeHandleSmall() {
    openConfirmModalCancel()
  }

  const uploadImage = async () => {
    console.log('start upload img')
    let imageUrl = ''
    try {
      if (selectedImage) {
        const formData = new FormData()
        formData.append('image', selectedImage)
        // formData.append('file', selectedImage, selectedImage.name)
        console.log(formData)
        const responseData = await uploadImageVoucher(formData)
        console.log(responseData)
        if (responseData?.data?.data?.results) {
          responseData?.data?.data?.results.map((image) => {
            console.log(image)
            imageUrl = image
          })
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    }
    return { imageUrl }
  }
  return (
    <div>
      <ModalBase
        titleValue={titleValue}
        closeFunction={closeHandleSmall}
        openValue={openValue}
        className="w-auto bg-black"
        width={1100}
        isdestroyOnClose={true}
      >
        <div className="flex-col w-auto bg-[#15151B] mt-5 px-4">
          <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="w-1/5 pr-4 mt-10">
              <div
                className={`
                w-36 h-52 overflow-hidden rounded-2xl bg-[#413F4D]
                ${!imageSource && ' flex items-center justify-center border-dashed border-2 border-[#FFFFFF80]'}
                `}
                onClick={handleImageClick}
              >
                {imageSource && (
                  <Image
                    className="overflow-hidden rounded-2xl"
                    width={144}
                    height={208}
                    src={imageSource!!}
                    alt=""
                    objectFit="cover"
                  />
                )}
                {!imageSource && (
                  <div className="flex items-center justify-center w-full h-full hover:scale-150">
                    <Plus className="" theme="filled" size="24" fill="#ffffff" />
                  </div>
                )}

                <input
                  className="w-0 opacity-0"
                  type="file"
                  name="files"
                  accept="image/*"
                  ref={imageInputRef}
                  onChange={(e) => handleMediaChange(e)}
                  multiple
                />
              </div>
            </div>
            <div className="flex flex-col justify-end w-2/5 ">
              <div className="w-full h-12 text-white">
                Tên:
                <div className="inline-block w-2/3 ">
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Mã:
                <div className="inline-block w-2/3 ">
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Mã: SUPPERSALE"
                    value={vourcherCode}
                    onChange={(e) => setVourcherCode(e.target.value)}
                    type="text"
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Người phát hành: <span className="font-bold">{issuer}</span>
              </div>
            </div>
            <div className="flex flex-col justify-end w-2/5 ">
              <div className="h-12 text-white">
                Trạng thái: <span className="font-bold">{status}</span>
              </div>
              <div className="h-12 text-white">
                Ngày phát hành: <span className="font-bold">{createAt}</span>
              </div>
              <div className="h-12 text-white">
                Ngày kết thúc:
                <div className="inline-block w-1/3 ">
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    type="date"
                    pattern="\d{2}/\d{2}/\d{4}"
                    value={endDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="flex flex-col justify-end w-3/5 mt-5">
              <div className="h-12 text-white">
                Số lượng phát hành:
                <div className="inline-block w-1/5 ">
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Số Lượng"
                    value={numVoucher}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      setNumVoucher(parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)
                    }}
                    type="number"
                    min={0}
                    max={100000}
                  />
                </div>
              </div>

              <div className="h-12 text-white">
                Số lượng tối đa một người có thể dùng:
                <div className="inline-block w-1/5 ">
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Số Lượng"
                    value={numUserCanUse}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      setNumUserCanUse(parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)
                    }}
                    type="number"
                    min={0}
                    max={100000}
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Loại:
                <Select
                  showSearch
                  placeholder="Loại"
                  optionFilterProp="children"
                  onChange={handleTypeVoucher}
                  filterOption={filterOptionTypeVoucher}
                  defaultValue={typeVoucher}
                  style={{
                    minWidth: '8rem',
                    marginLeft: '1rem',
                  }}
                  options={[
                    {
                      value: CreateVoucherRequestTypeEnum.Discount,
                      label: 'DISCOUNT',
                    },
                    {
                      value: CreateVoucherRequestTypeEnum.Cashback,
                      label: 'CASHBACK',
                    },
                  ]}
                />
              </div>
              <div className="h-12 text-white">
                Thời gian áp dụng trong tuần:
                <Select
                  mode="multiple"
                  placeholder="Chọn ngày"
                  onChange={handleChangeApplyDay}
                  optionLabelProp="label"
                  style={{
                    minWidth: '8rem',
                    marginLeft: '1rem',
                  }}
                  value={applyTime}
                  options={[
                    {
                      value: 1,
                      label: 'T2',
                    },
                    {
                      value: 2,
                      label: 'T3',
                    },
                    {
                      value: 3,
                      label: 'T4',
                    },
                    {
                      value: 4,
                      label: 'T5',
                    },
                    {
                      value: 5,
                      label: 'T6',
                    },
                    {
                      value: 6,
                      label: 'T7',
                    },
                    {
                      value: 7,
                      label: 'CN',
                    },
                  ]}
                ></Select>
              </div>
            </div>
            <div className="flex flex-col justify-end w-2/5 ">
              <div className="h-12 text-white">
                Số lượng phát hành mỗi ngày:
                <div className="inline-block w-1/3 ">
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Số Lượng"
                    value={numVoucherInDay}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      setNumVoucherInDay(parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)
                    }}
                    type="number"
                    min={0}
                    max={100000}
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Số lượng tối đa người dùng trong ngày:
                <div className="inline-block w-1/3 ">
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Số Lượng"
                    value={numUserCanUseInDay}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      setNumUserCanUseInDay(parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)
                    }}
                    type="number"
                    min={0}
                    max={100000}
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Giảm tối đa:
                <div className="inline-block w-1/4 ">
                  <Input
                    className="bg-[#413F4D]  border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Số Lượng"
                    value={minimize}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value)
                      if (!isNaN(newValue) && newValue >= 0) {
                        e.target.value = newValue.toString()
                      } else {
                        e.target.value = '0'
                      }
                      setMinimize(parseInt(e.target.value) > 0 ? parseInt(e.target.value) : 0)
                    }}
                    type="number"
                    min={0}
                    max={100}
                  />
                </div>
                <div className="inline-block w-1/4 ml-1 ">
                  <Select
                    showSearch
                    placeholder="Loại"
                    optionFilterProp="children"
                    onChange={handleDisCountUnit}
                    filterOption={filterOptionDisCountUnit}
                    defaultValue={discountUnit}
                    style={{
                      minWidth: '4rem',
                      marginLeft: '1rem',
                    }}
                    options={[
                      {
                        value: 'PERCENT',
                        label: '%',
                      },
                      {
                        value: 'CASH',
                        label: 'k/VND',
                      },
                    ]}
                  />
                </div>
              </div>
              <div className="h-12 text-white">
                Đối tượng:
                <Select
                  showSearch
                  placeholder="Loại"
                  optionFilterProp="children"
                  onChange={handleRecipientType}
                  filterOption={filterOptionRecipientType}
                  value={audience}
                  style={{
                    minWidth: '8rem',
                    marginLeft: '1rem',
                  }}
                  options={[
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.All,
                      label: 'ALL',
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.FirstTimeBooking,
                      label: 'FIRST_TIME_BOOKING',
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.PreviousBooking,
                      label: 'PREVIOUS_BOOKING',
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.SelectiveBooker,
                      label: 'SELECTIVE_BOOKER',
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.Top10Booker,
                      label: 'TOP_10_BOOKER',
                    },
                    {
                      value: CreateVoucherRequestRecipientTypeEnum.Top5Booker,
                      label: 'TOP_5_BOOKER',
                    },
                  ]}
                />
              </div>
            </div>
          </div>
          <div className="w-auto px-4 border-b-2 border-[#FFFFFF80] pb-5">
            <div className="flex flex-col justify-end mt-5">
              <div className="h-12 text-white">
                Mô tả:
                <div className="inline-block w-2/3 ">
                  <Input
                    className="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 ml-4"
                    placeholder="Mô tả"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                  />
                </div>
              </div>
              <div className="flex h-32 text-white">
                <span className="mr-4">Nội dung:</span>
                <TextArea
                  className="bg-[#413F4D] w-4/5"
                  rows={5}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-6">
          <Button customCSS="mx-6 px-4 py-1 border-2 hover:scale-105" onClick={openConfirmModalCancel}>
            Hủy
          </Button>
          <Button
            customCSS="mx-6 px-4 py-1 border-2 bg-[#7463F0] border-[#7463F0] hover:scale-105"
            onClick={openConfirmModal}
          >
            {'Tạo'}
          </Button>
        </div>
      </ModalBase>
      {openConfirm && (
        <ComfirmModal
          closeFunction={closeComfirmFormHandle}
          openValue={true}
          isComfirmFunction={isCreate ? submitHandle : closeHandle}
          titleValue={isCreate ? 'Xác nhận Tạo' : 'Xác nhận hủy'}
        ></ComfirmModal>
      )}
    </div>
  )
}
