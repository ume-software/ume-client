import { Menu, Transition } from '@headlessui/react'
import { Check, CloseSmall, Down } from '@icon-park/react'
import { Button, InputWithAffix, Modal, TextArea } from '@ume/ui'

import { Fragment, ReactElement, useState } from 'react'

import { notification } from 'antd'
import { Formik } from 'formik'
import { CreateReportUserRequestReasonTypeEnum } from 'ume-service-openapi'
import * as Yup from 'yup'

import ConfirmForm from '~/components/confirm-form/confirm-form'

import { trpc } from '~/utils/trpc'

interface TabDataProps {
  key: string
  label: string
  icon?: ReactElement
  [key: string]: any
}
interface ReportDataProps {
  providerId: string
  reasonType: string
  contentReport: string
}

const reportType: TabDataProps[] = [
  { key: CreateReportUserRequestReasonTypeEnum.Cheating, label: 'Gian lận' },
  { key: CreateReportUserRequestReasonTypeEnum.AbusiveLanguage, label: 'Lạm dụng ngôn ngữ và hành vi gây khó chịu' },
  { key: CreateReportUserRequestReasonTypeEnum.SpamOrHarassment, label: 'Spam hoặc quấy rối' },
  {
    key: CreateReportUserRequestReasonTypeEnum.InappropriateContent,
    label: 'Hình ảnh không phù hợp hoặc vi phạm đạo đức',
  },
  { key: CreateReportUserRequestReasonTypeEnum.ViolentOrDiscriminatoryBehavior, label: 'Hành vi bạo lực hoặc kỳ thị' },
  { key: CreateReportUserRequestReasonTypeEnum.FakeAccountOrScam, label: 'Tài khoản giả mạo hoặc lừa đảo' },
  {
    key: CreateReportUserRequestReasonTypeEnum.IllegalTransactions,
    label: 'Giao dịch bất hợp pháp hoặc không an toàn',
  },
]

const ReportModal = ({ isModalReportVisible, setIsModalReportVisible, providerId }) => {
  const [reportTypeFilter, setReportTypeFilter] = useState<TabDataProps[]>(reportType)
  const [isMenuShow, setIsMenuShow] = useState<boolean>(false)
  const [isModalConfirmationVisible, setIsModalConfirmationVisible] = useState<boolean>(false)
  const [reportData, setReportData] = useState<ReportDataProps>({
    providerId: providerId,
    reasonType: '',
    contentReport: '',
  })
  const reportUser = trpc.useMutation(['booking.postReportUser'])

  const reportModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsModalReportVisible(false),
    title: <p className="text-white">Tố cáo</p>,
    show: isModalReportVisible,
    customModalCSS: 'top-32',
    form: (
      <Formik
        initialValues={{
          reasonType: reportType[0].key,
          content: '',
        }}
        onSubmit={(values) => {
          setReportData({ providerId: providerId, reasonType: values.reasonType, contentReport: values.content })
          setIsModalConfirmationVisible(true)
        }}
        validationSchema={Yup.object().shape({
          reasonType: Yup.string().required('Xin hãy nhập loại tố cáo'),
          content: Yup.string().required('Xin hãy nhập lý do'),
        })}
      >
        {({ handleSubmit, handleChange, handleBlur, values, errors, setFieldValue }) => (
          <div className="flex flex-col gap-5 p-10 text-white">
            <div className="space-y-2">
              <label>Loại tố cáo: </label>
              <InputWithAffix
                placeholder="Tiền donate"
                value={reportType.find((reason) => values.reasonType == reason.key)?.label}
                name="reasonType"
                type="text"
                onChange={(e) => {
                  handleChange(e)
                  setReportTypeFilter(
                    reportType.filter(
                      (rpType) =>
                        rpType.key.toLocaleLowerCase().includes(values.reasonType.toLocaleLowerCase()) ||
                        rpType.label.toLocaleLowerCase().includes(values.reasonType.toLocaleLowerCase()),
                    ),
                  )
                }}
                className={`w-full max-h-[50px] bg-zinc-800 border ${
                  errors.reasonType ? 'border-red-500' : 'border-white border-opacity-30'
                } rounded-xl my-2`}
                styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                position="right"
                component={<Down theme="outline" size="20" fill="#FFF" strokeLinejoin="bevel" />}
                autoComplete="off"
                onClick={() => {
                  setIsMenuShow(true)
                  setReportTypeFilter(reportType)
                }}
                onBlur={handleBlur}
              />
              <div className="relative w-full">
                <Menu>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-400"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-400"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    show={isMenuShow}
                  >
                    <Menu.Items
                      className="absolute right-0 left-0 p-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg w-full max-h-[200px] overflow-y-auto ring-1 ring-black ring-opacity-5 focus:outline-none custom-scrollbar"
                      style={{ zIndex: 5 }}
                    >
                      <div
                        className="flex flex-col gap-2"
                        style={{ zIndex: 10 }}
                        onMouseLeave={() => setIsMenuShow(false)}
                      >
                        {reportTypeFilter.map((rpTy, index) => (
                          <div
                            key={index}
                            className={`flex gap-5 items-center ${
                              values.reasonType == rpTy.key ? 'bg-gray-700' : ''
                            } hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                            onClick={() => {
                              setFieldValue('reasonType', rpTy.key)
                              setIsMenuShow(false)
                            }}
                            onKeyDown={() => {}}
                          >
                            <p className="font-semibold text-mg">{rpTy.label}</p>
                            <div>
                              {values.reasonType == rpTy.key ? (
                                <Check theme="filled" size="10" fill="#FFFFFF" strokeLinejoin="bevel" />
                              ) : (
                                ''
                              )}
                            </div>
                          </div>
                        ))}

                        {!((reportTypeFilter ?? []).length > 0) && (
                          <p className="text-md font-normal">Không có kết quả</p>
                        )}
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              {!!errors.reasonType && <p className="pl-3 text-xs text-red-500">{errors.reasonType}</p>}
            </div>
            <div className="space-y-2">
              <label>Nội dung: </label>
              <TextArea
                name="content"
                className={`bg-zinc-800 w-full max-h-[140px] rounded-xl border ${
                  errors.content ? 'border-red-500' : 'border-white border-opacity-30'
                }`}
                rows={5}
                value={values.content}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {!!errors.content && <p className="pl-3 text-xs text-red-500">{errors.content}</p>}
            </div>
            <div className="w-full text-center">
              <Button
                customCSS={`text-md py-2 px-5 rounded-xl ${
                  !(errors.content || errors.reasonType) ? 'hover:scale-105' : 'opacity-30 cursor-not-allowed'
                }`}
                type="button"
                isActive={!errors.content}
                isOutlinedButton={true}
                onClick={() => handleSubmit()}
              >
                Gửi
              </Button>
            </div>
          </div>
        )}
      </Formik>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: false,
    closeButtonOnConner: (
      <CloseSmall
        onClick={() => setIsModalReportVisible(false)}
        onKeyDown={() => {}}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })

  const handleCloseComfirmModal = () => {
    setIsModalConfirmationVisible(false)
  }

  const confirmModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleCloseComfirmModal,
    show: isModalConfirmationVisible,
    customModalCSS: 'top-32',
    form: (
      <>
        <ConfirmForm
          title="Tố cáo nhà cung cấp này"
          description={`Bạn muốn tố cáo nhà cũng cấp này với lý do ${
            reportType.find((item) => item.key == reportData.reasonType)?.label
          } không?`}
          isLoading={reportUser.isLoading}
          onClose={handleCloseComfirmModal}
          onOk={() => {
            reportUser.mutate(
              {
                slug: reportData.providerId,
                reasonType: reportData.reasonType as any,
                content: reportData.contentReport,
              },
              {
                onSuccess() {
                  setIsModalReportVisible(false)
                  setIsModalConfirmationVisible(false)
                  notification.success({
                    message: 'Gửi tố cáo thành công',
                    description: 'Tố cáo của bạn đã được gửi',
                    placement: 'bottomLeft',
                  })
                },
                onError(error) {
                  notification.error({
                    message: 'Gửi tố cáo thất bại',
                    description: `${error.message ?? 'Gửi tố cáo thất bại. Vui lòng thử lại sau!'}`,
                    placement: 'bottomLeft',
                  })
                },
              },
            )
          }}
        />
      </>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <>
        <CloseSmall
          onClick={handleCloseComfirmModal}
          onKeyDown={(e) => e.key === 'Enter' && handleCloseComfirmModal()}
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
      {isModalConfirmationVisible && confirmModal} {reportModal}
    </>
  )
}
export { ReportModal }
