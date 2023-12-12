import { CloseSmall } from '@icon-park/react'
import { Button, Modal } from '@ume/ui'

import { useCallback, useState } from 'react'

import { Image, Select, notification } from 'antd'

import { kycReasons } from './kyc-reason'

import { trpc } from '~/utils/trpc'

export type KYCModalType = {
  visible: boolean
  handleClose: () => void
  data: any
  submiting?: boolean
  setSubmiting?: (value: boolean) => void
}
enum KYCAction {
  REJECT = 'REJECT',
  APPROVE = 'APPROVE',
}

export type KYCFormType = {
  avatarUrl?: string
  backSideCitizenIdImageUrl?: string
  frontSideCitizenIdImageUrl?: string
  portraitImageUrl?: string
  createdAt?: string
  deletedAt?: string
  dob?: string
  email?: string
  useId?: string
  name?: string
  phone?: string
  status?: string
  slug?: string
  updatedAt?: string
  id?: string
  requestId?: string
  citizenId: string
  citizenDod: string
  citizenName: string
  citizenGender: string
}

const kycForm = (record: KYCFormType, handleAction: (action: KYCAction) => void, handleOpenConfimModal: () => void) => {
  const mapGender = (englishGender, defaultLabel = 'Unknown') => {
    const genderMap = {
      MALE: 'Nam',
      FEMALE: 'Nữ',
      OTHER: 'Khác',
    }

    const vietnameseGender = genderMap[englishGender] || defaultLabel

    return vietnameseGender
  }

  const GenderTag = ({ englishGender }) => {
    const gender = mapGender(englishGender)

    const genderClasses = `mt-0.5 px-4 rounded-xl ${gender === 'Nam' ? 'bg-red-500' : ''} ${
      gender === 'Nữ' ? 'bg-blue-500' : ''
    }`

    return (
      <div className="flex flex-row gap-2">
        <div className="text-lg font-medium">Giới tính:</div>
        <div className={genderClasses}>{gender}</div>
      </div>
    )
  }
  console.log(record)
  return (
    <div className="flex flex-col w-full p-6 gap-4  bg-[#15151b] text-white border-t border-slate-700 mt-3">
      <div>
        <div className="flex flex-col justify-start">
          <div className="text-lg font-medium">CCCD/Passport:</div>
          <div className="w-full px-5 py-2 border rounded-2xl border-slate-700 bg-slate-700">{record?.citizenId}</div>
        </div>
        <div className="flex flex-col justify-start mt-3">
          <div className="text-lg font-medium">Họ và tên:</div>
          <div className="w-full px-5 py-2 border rounded-2xl border-slate-700 bg-slate-700">{record?.citizenName}</div>
        </div>
        <div className="flex flex-row justify-start mt-3">
          <div className="mr-3 text-lg font-medium">Ngày sinh:</div>
          <div className="px-5 py-1 border rounded-2xl border-slate-700 bg-slate-700">
            {new Date(record?.citizenDod).toLocaleDateString('en-GB')}
          </div>
        </div>
        <div className="flex flex-row gap-2 mt-3">
          <div className="mt-0.5">
            <GenderTag englishGender={record?.citizenGender} />
          </div>
        </div>
      </div>
      <div className="w-full border-t ">
        <div className="grid grid-cols-2 gap-10 mt-4">
          <div>
            <div className="text-lg font-bold">Ảnh mặt sau:</div>
            <div className="flex justify-center">
              {record?.backSideCitizenIdImageUrl && (
                <Image
                  src={record?.backSideCitizenIdImageUrl}
                  className="rounded-xl"
                  width={180}
                  height={120}
                  alt={'back side citizen id'}
                />
              )}
            </div>
          </div>
          <div>
            <div className="text-lg font-bold">Ảnh mặt trước:</div>
            <div className="flex justify-center">
              {record?.frontSideCitizenIdImageUrl && (
                <Image
                  src={record?.frontSideCitizenIdImageUrl}
                  className="rounded-xl"
                  width={180}
                  height={120}
                  alt={'front side citizen id'}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-5">
          <div className="text-lg font-bold">Ảnh khuôn mặt:</div>
          <div className="ml-8">
            {record?.backSideCitizenIdImageUrl && (
              <Image
                src={record?.portraitImageUrl}
                className="rounded-xl"
                width={120}
                height={120}
                alt={'back side citizen id'}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center gap-4 mt-5">
        <Button
          customCSS="px-3 w-28 py-2 bg-green-600 hover:bg-green-400 hover:text-black"
          type="button"
          onClick={() => {
            handleAction(KYCAction.APPROVE)
            handleOpenConfimModal()
          }}
        >
          Chấp thuận
        </Button>
        <Button
          customCSS="px-3 w-28 py-2 bg-red-600 hover:bg-red-400 hover:text-black"
          type="button"
          onClick={() => {
            handleAction(KYCAction.REJECT)
            handleOpenConfimModal()
          }}
        >
          Từ chối
        </Button>
      </div>
    </div>
  )
}

export const KYCModal = ({ visible, handleClose, data }: KYCModalType) => {
  const utils = trpc.useContext()
  const actionKYC = trpc.useMutation(['provider.actionKYC'])
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [action, setAction] = useState<KYCAction>(KYCAction.APPROVE)
  const [reasonReject, setReasonReject] = useState(null)

  const handleActionConfirm = useCallback(
    (action: KYCAction) => {
      setAction(action)
    },
    [setAction],
  )

  const handleVisibleConfirm = () => {
    setVisibleConfirm(true)
  }

  const handelCloseConfirm = () => {
    setVisibleConfirm(false)
  }

  const handleAction = (id: string) => {
    actionKYC.mutate(
      { id, action, reason: reasonReject || '' },
      {
        onSuccess: (data, success) => {
          if (success) {
            notification.success({
              message: 'Success',
              description: `${action} KYC Success`,
            })
            utils.invalidateQueries(['provider.getListRequestKYC'])
            handelCloseConfirm()
            handleClose()
          }
        },
        onError: (error, data) => {
          notification.error({
            message: 'Error',
            description: error.message || `${action} KYC Failed`,
          })
        },
      },
    )
  }

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handelCloseConfirm,
    show: visibleConfirm,
    form: (
      <div className="mt-4 border-t-2 border-slate-700">
        <div className="mt-3">
          <div className="flex flex-col justify-center text-center">
            <div className="text-lg font-normal text-white">
              Bạn có <span className="font-bold">chắc chắn</span> muốn thực hiện hành động này?
              <br /> Hành động này không thể hoàn tác.
            </div>
            <div className="mt-3 text-lg font-normal text-white">
              Hành động này sẽ
              {action === KYCAction.APPROVE ? (
                <span className="p-2 mx-1 font-bold bg-green-700 rounded-2xl">chấp thuận</span>
              ) : (
                <span className="p-2 mx-1 font-bold bg-red-700 rounded-2xl">từ chối</span>
              )}
              yêu cầu xác thực của người
              {action === KYCAction.REJECT && (
                <div className="flex flex-row mx-8 mt-6 text-left">
                  <div>Vui lòng chọn từ chối:</div>
                  <Select
                    className="w-[250px] ml-6"
                    placeholder="Vui lòng nhập lí do"
                    options={kycReasons}
                    onChange={(value) => {
                      setReasonReject(value)
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center gap-4 p-5">
          <Button
            customCSS={`px-3 w-24 py-2 ${
              KYCAction.REJECT === action && !reasonReject
                ? 'opacity-20 cursor-not-allowed hover:scale-100 '
                : 'hover:bg-green-400 hover:text-black '
            } `}
            type="button"
            onClick={() => {
              handleAction(data?.id)
            }}
            isDisable={KYCAction.REJECT === action && !reasonReject}
          >
            Xác nhận
          </Button>
          <Button
            customCSS="px-3 w-24 py-2 hover:bg-red-400 hover:text-black"
            type="button"
            onClick={() => {
              handelCloseConfirm()
            }}
          >
            Hủy bỏ
          </Button>
        </div>
      </div>
    ),
    title: <span className="text-white">Xác nhận</span>,
    backgroundColor: '#15151b',
    closeWhenClickOutSide: false,
    closeButtonOnConner: (
      <CloseSmall
        onClick={handelCloseConfirm}
        onKeyDown={(e) => e.key === 'Esc' && handelCloseConfirm()}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  const kycModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: visible,
    form: kycForm(data, handleActionConfirm, handleVisibleConfirm),
    title: <span className="text-white">Thông tin xác thực người dùng</span>,
    backgroundColor: '#15151b',
    closeWhenClickOutSide: false,
    closeButtonOnConner: (
      <CloseSmall
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Esc' && handleClose()}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })
  return (
    <div>
      {kycModal}
      {confirmModal}
    </div>
  )
}
