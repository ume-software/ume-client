import { AddPicture, CloseSmall, DeleteFive } from '@icon-park/react'
import { Button, Input, Modal, TextArea } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'
import { uploadAudio, uploadImage } from '~/apis/upload-media'

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useId, useRef, useState } from 'react'

import { notification } from 'antd'
import Image from 'next/legacy/image'
import {
  AttachmentRequestTypeEnum,
  BookingComplaintResponse,
  BookingComplaintResponseComplaintStatusEnum,
  ThumbnailResponseTypeEnum,
} from 'ume-service-openapi'

import ConfirmForm from '~/components/confirm-form/confirm-form'

import { trpc } from '~/utils/trpc'

interface ComplainTicketProps {
  isModalComplainVisible: boolean
  setIsModalComplainVisible: Dispatch<SetStateAction<boolean>>
  bookingSelected: BookingComplaintResponse | undefined
}

interface ThumbnailsProps {
  url: string
  type: AttachmentRequestTypeEnum
}

const ResponseComplainTicketModal = ({
  isModalComplainVisible,
  setIsModalComplainVisible,
  bookingSelected,
}: ComplainTicketProps) => {
  const index = useId()
  const complainTicketRef = useRef<HTMLFormElement>(null)
  const [content, setContent] = useState<string>('')

  const [mediaFiles, setMediaFiles] = useState<File[] | undefined>()
  const [removeMedia, setRemoveMedia] = useState<boolean>(false)
  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState<boolean>(false)

  const utils = trpc.useContext()

  const responseComplain = trpc.useMutation(['identity.responseComplain'])

  useEffect(() => {
    setMediaFiles(undefined)
    setContent('')
  }, [bookingSelected])

  const isTimeMoreThan7Days = () => {
    const bookingTime = new Date(bookingSelected?.updatedAt ?? 0)
    const timestampFromIso = bookingTime.getTime()
    const currentTimestamp = Date.now()

    const sevenDaysAgoTimestamp = currentTimestamp - 7 * 24 * 60 * 60 * 1000

    if (timestampFromIso < sevenDaysAgoTimestamp) {
      return true
    } else {
      return false
    }
  }

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRemoveMedia(false)
    const fileInput = e.target as HTMLInputElement
    if (fileInput.files && fileInput.files.length > 0) {
      const newFiles: File[] = []
      for (const file of fileInput.files) {
        newFiles.push(file)
      }
      setMediaFiles(newFiles)
      setRemoveMedia(false)
    }
  }

  const handleClose = () => {
    setIsModalConfirmationVisible(false)
  }

  const handleUploadFiles = async (files: HTMLFormElement) => {
    const thumbnails: ThumbnailsProps[] = []
    const formData = new FormData(files)
    const inputFiles = formData.getAll('files')

    const images = new FormData()
    const videos = new FormData()

    if (!removeMedia) {
      for (const file of inputFiles) {
        if (file instanceof File) {
          if (file.type.startsWith('image/')) {
            images.append('file', file, file.name)
          } else if (file.type.startsWith('video/')) {
            videos.append('file', file, file.name)
          }
        }
      }

      try {
        if (images.getAll('file').length > 0) {
          const responseData = await uploadImage(images)
          if (responseData?.data?.data?.results) {
            responseData?.data?.data?.results.map((image) => {
              thumbnails.push({ url: image, type: ThumbnailResponseTypeEnum.Image })
            })
          }
        }
        if (videos.getAll('file').length > 0) {
          const responseData = await uploadAudio(videos)
          if (responseData?.data?.data?.results) {
            responseData?.data?.data?.results.map((video) => {
              thumbnails.push({ url: video, type: ThumbnailResponseTypeEnum.Video })
            })
          }
        }
      } catch (error) {
        notification.error({
          message: 'File ảnh bị lỗi',
          description: 'Vui lòng kiểm tra lại file ảnh!',
          placement: 'bottomLeft',
        })
      }
      return { thumbnails }
    } else {
      return { thumbnails: [] }
    }
  }

  const handleresponseComplain = async () => {
    if (complainTicketRef.current) {
      const fileUpload = await handleUploadFiles(complainTicketRef.current)

      if (content != '') {
        responseComplain.mutate(
          {
            bookingComplaintId: bookingSelected?.id ?? '',
            responseMessage: content,
            attachments: fileUpload.thumbnails,
          },
          {
            onSuccess() {
              utils.invalidateQueries('identity.getProviderHistoryComplain')
              setIsModalConfirmationVisible(false)
              setIsModalComplainVisible(false)
              notification.success({
                message: 'Phản hồi khiếu nại thành công',
                description: 'Phản hồi khiếu nại thành công.',
                placement: 'bottomLeft',
              })
            },
            onError(error) {
              notification.error({
                message: 'Phản hồi khiếu nại thất bại',
                description: `${error.message ?? 'Phản hồi khiếu nại thất bại. Vui lòng thử lại sau!'}`,
                placement: 'bottomLeft',
              })
            },
          },
        )
      }
    } else {
      notification.error({
        message: 'File ảnh bị lỗii',
        description: 'Vui lòng kiểm tra lại file ảnh!',
        placement: 'bottomLeft',
      })
    }
  }

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: isModalConfirmationVisible,
    customModalCSS: 'top-32',
    form: (
      <ConfirmForm
        title="Phản hồi khiếu nại"
        description="Bạn có chấp nhận Phản hồi khiếu nại này hay không?"
        isLoading={responseComplain.isLoading}
        onClose={handleClose}
        onOk={() => {
          handleresponseComplain()
        }}
      />
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={handleClose}
        onKeyDown={(e) => e.key === 'Enter' && handleClose()}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  useEffect(() => {
    if (removeMedia) {
      setMediaFiles(undefined)
    }
  }, [removeMedia])

  const responseComplainModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsModalComplainVisible(false),
    show: isModalComplainVisible,
    title: <p className="text-white">Khiếu nại</p>,
    customModalCSS: 'top-10 h-fit max-h-[98%] overflow-y-auto custom-scrollbar',
    form: (
      <>
        {isModalConfirmationVisible && confirmModal}
        <form ref={complainTicketRef}>
          <div className="flex flex-col gap-5 p-5 text-white">
            <div className="space-y-2">
              <label>Người bị khiếu nại:</label>
              <div>
                <Input
                  placeholder={`Tên người bị khiếu nại`}
                  value={bookingSelected?.booking?.booker?.name ?? ''}
                  type="text"
                  className="truncate border border-white bg-zinc-800 rounded-xl border-opacity-30"
                  onChange={() => {}}
                  readOnly
                />
              </div>
            </div>

            <div className="relative flex flex-col gap-3">
              <div className="relative flex items-center justify-between">
                <label>Hình ảnh*:</label>
                <div className="relative cursor-pointer w-fit">
                  {!mediaFiles ? (
                    <label className="z-10 flex items-center justify-start gap-2 p-3 bg-purple-600 rounded-lg hover:bg-gray-700">
                      <AddPicture theme="filled" size="15" fill="#FFFFFF" strokeLinejoin="bevel" />
                      Chọn ảnh
                    </label>
                  ) : (
                    <div
                      className="p-2 rounded-full hover:bg-gray-700"
                      onClick={() => setRemoveMedia(true)}
                      onKeyDown={() => {}}
                    >
                      <DeleteFive theme="filled" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />
                    </div>
                  )}
                  <div className={`absolute w-full h-full top-0 left-0 ${mediaFiles && '-z-10'}`}>
                    <input
                      className="w-full h-full opacity-0"
                      type="file"
                      name="files"
                      onChange={(e) => handleMediaChange(e)}
                      multiple
                    />
                  </div>
                </div>
              </div>
              <div className="relative max-h-[280px] h-[220px] flex flex-col gap-2 overflow-y-auto custom-scrollbar border border-white border-opacity-30 rounded-lg">
                {!removeMedia ? (
                  <>
                    {mediaFiles?.map((file: File) => {
                      if (file.type.startsWith('image/')) {
                        // eslint-disable-next-line @next/next/no-img-element
                        return (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt="ImageUpload"
                            className="rounded-lg border-2 border-opacity-30 p-2"
                          />
                        )
                      } else if (file.type.startsWith('video/')) {
                        const videoUrl = URL.createObjectURL(file)
                        return (
                          <video
                            key={index}
                            src={videoUrl}
                            controls
                            className="rounded-lg border-2 border-opacity-30 p-2"
                          >
                            Your browser does not support the video tag.
                          </video>
                        )
                      }
                      return null
                    })}
                  </>
                ) : (
                  <Image
                    className="absolute rounded-full"
                    layout="fill"
                    objectFit="cover"
                    src={ImgForEmpty}
                    alt="avatar"
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <label>Mô tả chi tiết*:</label>
              <TextArea
                className="bg-[#413F4D]"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>

          <div className="p-5 mt-3 text-center">
            {isTimeMoreThan7Days() &&
            bookingSelected?.complaintStatus == BookingComplaintResponseComplaintStatusEnum.AwaitingProviderResponse ? (
              <p className="text-lg font-bold text-red-500">Đơn này đã quá hạn khiếu nại</p>
            ) : bookingSelected?.complaintStatus !=
              BookingComplaintResponseComplaintStatusEnum.AwaitingProviderResponse ? (
              <p className="text-lg font-bold text-yellow-500">Đợi admin duyệt đơn</p>
            ) : (
              <Button
                customCSS={`!rounded-2xl w-full !text-white py-2 px-9 font-semibold text-lg text-center ${
                  !(content === '' && !mediaFiles) ? 'hover:scale-105' : 'cursor-not-allowed opacity-20'
                }`}
                type="button"
                isActive={true}
                isOutlinedButton={!(content === '' && !mediaFiles)}
                onClick={() => {
                  if (!(content === '' && !mediaFiles)) setIsModalConfirmationVisible(true)
                }}
              >
                Gửi
              </Button>
            )}
          </div>
        </form>
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={() => setIsModalComplainVisible(false)}
        onKeyDown={(e) => e.key === 'Enter' && setIsModalComplainVisible(false)}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  return <>{responseComplainModal}</>
}
export default ResponseComplainTicketModal
