import { CloseSmall } from '@icon-park/react'
import { Button, Modal } from '@ume/ui'

import { useCallback, useState } from 'react'

import { Image, notification } from 'antd'

import { trpc } from '~/utils/trpc'

export type KYCModalType = {
  visible: boolean
  handleClose: () => void
  data: any
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
}

const kycForm = (record: KYCFormType, handleAction: (action: KYCAction) => void, handleOpenConfimModal: () => void) => {
  return (
    <div className="flex flex-col w-full p-6 gap-4 bg-[#15151b] text-white ">
      <div className="flex flex-row gap-4">
        <div className="flex flex-row justify-start gap-4">
          <div className="text-lg font-medium">Tên:</div>
          <div>{record?.name}</div>
        </div>
      </div>
      <div className="flex flex-row gap-4">
        <div className="flex flex-row justify-start gap-4">
          <div className="text-lg font-medium">Email:</div>
          <div>{record?.email}</div>
        </div>
      </div>
      <div className="flex flex-row gap-6">
        <div className="flex flex-row gap-2">
          <div className="text-lg font-medium">Slug:</div>
          <div className="mt-0.5">{record?.slug}</div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="text-lg font-medium">Phone:</div>
          <div className="mt-0.5">{record?.phone}</div>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex justify-center">
            {record?.avatarUrl && (
              <Image src={record?.avatarUrl} className="rounded-xl" width={150} height={150} alt={'avata'} />
            )}
          </div>
          <div className="flex justify-center">
            {record?.backSideCitizenIdImageUrl && (
              <Image
                src={record?.backSideCitizenIdImageUrl}
                className="rounded-xl"
                width={150}
                height={150}
                alt={'back side citizen id'}
              />
            )}
          </div>
          <div className="flex justify-center">
            {record?.portraitImageUrl && (
              <Image
                src={record?.portraitImageUrl}
                className="rounded-xl"
                width={150}
                height={150}
                alt={'portrailt side citizen id'}
              />
            )}
          </div>
          <div className="flex justify-center">
            {record?.frontSideCitizenIdImageUrl && (
              <Image
                src={record?.frontSideCitizenIdImageUrl}
                className="rounded-xl"
                width={150}
                height={150}
                alt={'front side citizen id'}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center gap-4">
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

  const handleVisibleConfirm = useCallback(() => {
    setVisibleConfirm(true)
  }, [setVisibleConfirm])
  const handelCloseConfirm = useCallback(() => {
    setVisibleConfirm(false)
  }, [setVisibleConfirm])

  const handleActionConfirm = useCallback(
    (action: KYCAction) => {
      setAction(action)
    },
    [setAction],
  )

  const handleAction = useCallback(
    (id: string) => {
      actionKYC.mutate(
        { id, action },
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
    },
    [action, actionKYC, handelCloseConfirm, handleClose, utils],
  )

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handelCloseConfirm,
    show: visibleConfirm,
    form: (
      <div>
        <div className="flex flex-row justify-center gap-4 p-5">
          <Button
            customCSS="px-3 w-24 py-2 hover:bg-green-400 hover:text-black"
            type="button"
            onClick={() => {
              handleAction(data?.requestId)
            }}
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
    <>
      {kycModal}
      {confirmModal}
    </>
  )
}
