import { Dialog, Transition } from '@headlessui/react'
import { CloseSmall } from '@icon-park/react'

import { Fragment, ReactNode, useRef } from 'react'

interface EditableFormProps {
  show: boolean
  onClose: () => void
  onOK: () => void
  title?: string | ReactNode
  form: ReactNode
  closeButtonOnConner?: ReactNode
  backgroundColor?: string
  closeWhenClickOutSide?: boolean
  customModalCSS?: string
}

const useEditableForm = ({
  show,
  onClose,
  title,
  form,
  closeButtonOnConner,
  backgroundColor,
  closeWhenClickOutSide = true,
  customModalCSS,
}: EditableFormProps) => {
  const cancelButtonRef = useRef(null)
  const handleClose = () => {
    onClose()
  }
  return (
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
          <div className="fixed inset-0 transition-opacity bg-gray-400 bg-opacity-50" />
        </Transition.Child>
        <div className={`${customModalCSS ?? 'top-32'} fixed overflow-y-auto inset-0 z-50 custom-scrollbar`}>
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
                className={`relative overflow-hidden text-left transition-all h-fit transform rounded-3xl shadow-xl sm:my-8 sm:max-w-lg sm:w-full ${
                  backgroundColor ? `bg-[${backgroundColor}]` : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between pt-6 mx-4 rounded-t-lg dark:bg-navy-800 sm:px-5">
                  <h3 className="flex items-center text-xl font-medium dark:text-navy-100">{title}</h3>
                  {closeButtonOnConner ?? (
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

  return (
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
          <div className="fixed inset-0 transition-opacity bg-gray-400 bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 top-0 z-50 overflow-y-auto custom-scrollbar">
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
                  customModalCSS ?? 'overflow-hidden sm:my-5 sm:h-[95vh] sm:w-full'
                } text-left ml-3 mr-3 transition-all transform rounded-3xl shadow-xl  ${
                  backgroundColor ? `bg-[${backgroundColor}]` : 'bg-white'
                }`}
              >
                <div className="flex items-start justify-between pt-6 mx-4 rounded-t-lg dark:bg-navy-800 sm:px-5">
                  <h3 className="flex items-center text-xl font-medium dark:text-navy-100">{title}</h3>
                  {closeButtonOnConner ?? (
                    <CloseSmall
                      onClick={handleClose}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleClose()
                        }
                      }}
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
  )
}

export { useEditableForm, useDisplayPost }
