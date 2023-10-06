import { Dialog, Transition } from '@headlessui/react'
import { Attention, CheckOne, CloseSmall, LoadingFour } from '@icon-park/react'
import { Button } from '~/button'

import { FormEvent, Fragment, ReactNode, useRef } from 'react'

interface SuccessErrorProps {
  show: boolean
  onClose: () => void
  title: string | ReactNode
  message: string | ReactNode
  closeButton: string | ReactNode
  colorIcon?: string
}

interface RiskConfirmProps extends SuccessErrorProps {
  okButton: string | ReactNode
  form?: ReactNode
  closeOnConfirm?: boolean
  titleCustomCss?: string
  panelCustomCss?: string
}

interface EditableFormProps {
  show: boolean
  onClose: () => void
  onOK: () => void
  title?: string | ReactNode
  form: ReactNode
  closeButtonOnConner?: ReactNode
  backgroundColor?: string
  closeWhenClickOutSide?: true | boolean
  customModalCSS?: string
}

const useSuccess = ({ show, onClose, title, message, closeButton }: SuccessErrorProps) => {
  const cancelButtonRef = useRef(null)
  const handleClose = () => {
    onClose()
  }

  return (
    <>
      <Transition.Root show={show || false} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 dialog-container"
          initialFocus={cancelButtonRef}
          onClose={handleClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative flex flex-col max-w-lg px-4 py-10 text-center transition-opacity duration-300 bg-white rounded-lg w-[32rem] dark:bg-navy-700 sm:px-5">
                  <CloseSmall
                    onClick={handleClose}
                    onKeyDown={(e) => e.key === 'Enter' && handleClose()}
                    tabIndex={1}
                    className="absolute float-right rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
                    theme="outline"
                    size="30"
                    fill="#000"
                  />
                  <div className="m-auto">
                    <CheckOne theme="outline" size="70" fill="#00B549" />
                  </div>
                  <div className="mt-4">
                    <h2 className="text-xl font-bold dark:text-navy-100">{title}</h2>
                    <p className="mt-2 mb-10 text-base">{message}</p>
                    {typeof closeButton === 'string' ? (
                      <Button
                        onClick={handleClose}
                        customCSS="btn bg-kmsconnect-primary hover:bg-kmsconnect-primary-focus focus:bg-kmsconnect-primary-focus active:bg-kmsconnect-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-auto font-medium text-white"
                      >
                        {closeButton}
                      </Button>
                    ) : (
                      closeButton
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

const useAlertError = ({ show, onClose, title, message, closeButton, colorIcon = '#FF0000' }: SuccessErrorProps) => {
  const cancelButtonRef = useRef(null)
  const handleClose = () => {
    onClose()
  }

  return (
    <>
      <Transition.Root show={show || false} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 dialog-container"
          initialFocus={cancelButtonRef}
          onClose={handleClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative flex flex-col max-w-lg px-4 py-10 text-center transition-opacity duration-300 bg-white rounded-lg w-[32rem] dark:bg-navy-700 sm:px-5">
                  <CloseSmall
                    onClick={handleClose}
                    onKeyDown={(e) => e.key === 'Enter' && handleClose()}
                    tabIndex={1}
                    className="absolute float-right rounded-full cursor-pointer right-2 top-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
                    theme="outline"
                    size="30"
                    fill="#000"
                  />
                  <div className="m-auto">
                    <Attention theme="outline" size="70" fill={colorIcon} />
                  </div>
                  <div className="mt-4">
                    <h2 className="text-xl font-bold dark:text-navy-100">{title}</h2>
                    <p className="mt-2 mb-10 text-base">{message}</p>
                    {typeof closeButton === 'string' ? (
                      <Button
                        onClick={handleClose}
                        customCSS="btn bg-kmsconnect-error hover:bg-kmsconnect-error-focus focus:bg-kmsconnect-error-focus active:bg-kmsconnect-error-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-auto font-medium text-white"
                      >
                        {closeButton}
                      </Button>
                    ) : (
                      closeButton
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

const DEFAULT_PANEL_STYLE =
  'relative overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:max-w-lg sm:w-full'
const DEFAULT_TITLE_STYLE = 'text-lg font-medium leading-6 text-gray-900'
const useRiskConfirm = ({
  show,
  onClose,
  title,
  message,
  closeButton,
  okButton,
  form,
  closeOnConfirm = true,
  panelCustomCss,
  titleCustomCss,
}: RiskConfirmProps) => {
  const panelClass = panelCustomCss ? panelCustomCss : DEFAULT_PANEL_STYLE
  const titleClass = titleCustomCss ? titleCustomCss : DEFAULT_TITLE_STYLE
  const cancelButtonRef = useRef(null)

  const handleClose = () => {
    onClose()
  }

  return (
    <>
      <Transition.Root show={show || false} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 dialog-container"
          initialFocus={cancelButtonRef}
          onClose={handleClose}
          onClick={(e) => {
            e.stopPropagation()
            handleClose()
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className={panelClass}>
                  <CloseSmall
                    onClick={handleClose}
                    onKeyDown={(e) => e.key === 'Enter' && handleClose()}
                    tabIndex={1}
                    className="absolute float-right rounded-full cursor-pointer top-1 right-1 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 "
                    theme="outline"
                    size="30"
                    fill="#808080"
                  />
                  <div className="justify-center px-10 pt-10 bg-white sm:p-4 sm:pt-10">
                    <div>
                      <div className="flex justify-center w-12 h-12 mx-auto rounded-full sm:mr-2 sm:ml-4 sm:h-10 sm:w-10">
                        <svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M24.5002 44.9173C30.138 44.9173 35.2422 42.6321 38.9369 38.9374C42.6316 35.2427 44.9168 30.1385 44.9168 24.5006C44.9168 18.8628 42.6316 13.7586 38.9369 10.0639C35.2422 6.3692 30.138 4.08398 24.5002 4.08398C18.8623 4.08398 13.7581 6.3692 10.0634 10.0639C6.36871 13.7586 4.0835 18.8628 4.0835 24.5006C4.0835 30.1385 6.36871 35.2427 10.0634 38.9374C13.7581 42.6321 18.8623 44.9173 24.5002 44.9173Z"
                            stroke="#FF0000"
                            stroke-width="3.8"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M24.5 29.222V25.1387C27.8827 25.1387 30.625 22.3964 30.625 19.0137C30.625 15.6309 27.8827 12.8887 24.5 12.8887C21.1173 12.8887 18.375 15.6309 18.375 19.0137"
                            stroke="#FF0000"
                            stroke-width="3.5"
                            stroke-linecap="square"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M24.4998 38.4089C25.9093 38.4089 27.0519 37.2662 27.0519 35.8568C27.0519 34.4473 25.9093 33.3047 24.4998 33.3047C23.0904 33.3047 21.9478 34.4473 21.9478 35.8568C21.9478 37.2662 23.0904 38.4089 24.4998 38.4089Z"
                            fill="#FF0000"
                          />
                        </svg>
                      </div>
                      <div className="mt-4 text-center sm:mt-0">
                        <Dialog.Title as="h3" className={titleClass}>
                          {title}
                        </Dialog.Title>
                        <div className="mt-1 ">
                          <p className="text-base font-normal text-gray-500">{message}</p>
                        </div>
                      </div>
                    </div>
                    <div>{form ? form : ''}</div>
                  </div>
                  <div className="flex justify-center flex-1 mt-3 mb-10 sm:px-6">
                    {typeof closeButton === 'string' ? (
                      <Button
                        customCSS="btn mr-2 bg-gray-200 hover:bg-gray-200-focus focus:bg-gray-200-focus active:bg-gray-200-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-auto font-medium text-black"
                        onClick={handleClose}
                      >
                        {closeButton}
                      </Button>
                    ) : (
                      closeButton
                    )}
                    {typeof okButton === 'string' ? (
                      <span
                        onClick={() => {
                          if (!closeOnConfirm) {
                            return null
                          }
                          onClose()
                        }}
                      >
                        <Button customCSS="btn bg-kmsconnect-primary hover:bg-kmsconnect-primary-focus focus:bg-kmsconnect-primary-focus active:bg-kmsconnect-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-auto font-medium text-white">
                          {okButton}
                        </Button>
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          if (!closeOnConfirm) {
                            return null
                          }
                          onClose()
                        }}
                      >
                        {okButton}
                      </span>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

const useEditableForm = ({
  show,
  onClose,
  title,
  form,
  onOK,
  closeButtonOnConner,
  backgroundColor,
  closeWhenClickOutSide,
  customModalCSS,
}: EditableFormProps) => {
  const cancelButtonRef = useRef(null)
  const handleClose = () => {
    onClose()
  }

  const handleOK = (event: FormEvent) => {
    event.preventDefault()
    onOK()
  }

  return (
    <>
      <Transition.Root show={show || false} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 dialog-container"
          initialFocus={cancelButtonRef}
          onClose={closeWhenClickOutSide ? handleClose : () => {}}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div
            className={`${
              customModalCSS ? customModalCSS : 'top-32'
            } fixed overflow-y-auto inset-0 z-50 custom-scrollbar`}
          >
            <div className={`flex justify-center text-center ${customModalCSS ? 'h-full' : 'min-h-fit'}  sm:p-0`}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className={`relative overflow-hidden text-left transition-all transform rounded-3xl shadow-xl sm:my-8 sm:max-w-lg sm:w-full ${
                    backgroundColor ? `bg-[${backgroundColor}]` : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between pt-6 mx-4 rounded-t-lg dark:bg-navy-800 sm:px-5">
                    <h3 className="flex items-center text-xl font-medium dark:text-navy-100">{title}</h3>
                    {closeButtonOnConner ? (
                      closeButtonOnConner
                    ) : (
                      <CloseSmall
                        onClick={handleClose}
                        onKeyDown={(e) => e.key === 'Enter' && handleClose()}
                        tabIndex={1}
                        className="absolute rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
                        theme="outline"
                        size="30"
                        fill="#000"
                      />
                    )}
                  </div>
                  {form}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

const useDisplayPost = ({
  show,
  onClose,
  title,
  form,
  onOK,
  closeButtonOnConner,
  backgroundColor,
  closeWhenClickOutSide,
  customModalCSS,
}: EditableFormProps) => {
  const cancelButtonRef = useRef(null)
  const handleClose = () => {
    onClose()
  }

  const handleOK = (event: FormEvent) => {
    event.preventDefault()
    onOK()
  }

  return (
    <>
      <Transition.Root show={show || false} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 dialog-container"
          initialFocus={cancelButtonRef}
          onClose={closeWhenClickOutSide ? handleClose : () => {}}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto top-0">
            <div className="flex justify-center text-center min-h-fit sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className={`relative ${
                    customModalCSS ? customModalCSS : 'overflow-hidden sm:my-5 sm:h-[95vh] sm:w-full'
                  } text-left ml-3 mr-3 transition-all transform rounded-3xl shadow-xl  ${
                    backgroundColor ? `bg-[${backgroundColor}]` : 'bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between pt-6 mx-4 rounded-t-lg dark:bg-navy-800 sm:px-5">
                    <h3 className="flex items-center text-xl font-medium dark:text-navy-100">{title}</h3>
                    {closeButtonOnConner ? (
                      closeButtonOnConner
                    ) : (
                      <CloseSmall
                        onClick={handleClose}
                        onKeyDown={(e) => e.key === 'Enter' && handleClose()}
                        tabIndex={1}
                        className="absolute rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
                        theme="outline"
                        size="30"
                        fill="#000"
                      />
                    )}
                  </div>
                  {form}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

const useLoading = ({ show, onClose, title, message, closeButton }: SuccessErrorProps) => {
  const cancelButtonRef = useRef(null)
  const handleClose = () => {
    onClose()
  }

  return (
    <>
      <Transition.Root show={show || false} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 dialog-container"
          initialFocus={cancelButtonRef}
          onClose={handleClose}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative flex flex-col max-w-lg px-4 py-10 text-center transition-opacity duration-300 bg-white rounded-lg w-[32rem] dark:bg-navy-700 sm:px-5">
                  <div className="m-auto">
                    <div className="animate-spin">
                      <LoadingFour theme="outline" size="70" className="animate-spin" fill="#27AAE1" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <h2 className="text-xl font-bold dark:text-navy-100">{title}</h2>
                    <p className="mt-2 mb-10 text-base">{message}</p>
                    {typeof closeButton === 'string' ? (
                      <Button
                        onClick={handleClose}
                        customCSS="btn bg-kmsconnect-grey hover:bg-kmsconnect-grey-focus focus:bg-kmsconnect-grey-focus active:bg-kmsconnect-grey-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90 w-auto font-medium text-white"
                        disabled={true}
                      >
                        {closeButton}
                      </Button>
                    ) : (
                      closeButton
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}

export { useSuccess, useAlertError, useRiskConfirm, useEditableForm, useDisplayPost, useLoading }
