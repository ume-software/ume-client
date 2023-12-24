import { CloseSmall } from '@icon-park/react'
import { Modal } from '@ume/ui'

import { AuthForm } from './auth-form.component'

export const LoginModal = ({ isModalLoginVisible, setIsModalLoginVisible }) => {
  const handleClose = () => {
    setIsModalLoginVisible(false)
  }
  const loginModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: handleClose,
    show: isModalLoginVisible,
    customModalCSS: 'top-32',
    form: <AuthForm setShowModal={setIsModalLoginVisible} />,
    backgroundColor: '#15151b',
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
  return <>{loginModal}</>
}
