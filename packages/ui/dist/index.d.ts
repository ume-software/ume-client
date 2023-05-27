import React, { ChangeEventHandler, FocusEventHandler, MouseEventHandler, ReactNode } from 'react'

import * as react_jsx_runtime from 'react/jsx-runtime'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  helper?: ReactNode
  children?: any
  value?: string
  customCSS?: string
  loadingIconColor?: 'white' | 'black'
  isLoading?: boolean
  isOutlinedButton?: boolean
  isDisabled?: boolean
  icon?: ReactNode
}
declare const Button: ({
  helper,
  children,
  customCSS,
  loadingIconColor,
  isLoading,
  isOutlinedButton,
  icon,
  type,
  isDisabled,
  ...props
}: ButtonProps) => JSX.Element

interface TextInputProps {
  icon?: ReactNode
  type: string
  placeholder?: string
  name: string
  value: string
  disabled?: boolean
  title?: string | undefined
  onChange: ChangeEventHandler<HTMLInputElement>
  onBlur?: FocusEventHandler<HTMLInputElement>
  onClick?: MouseEventHandler<HTMLInputElement>
  help?: boolean
  state?: string | undefined
  subtitle?: ReactNode
  error?: string
  className?: string
  minLength?: number
  maxLength?: number
  required?: boolean
}
declare const TextInput: ({
  icon,
  type,
  placeholder,
  name,
  value,
  disabled,
  required,
  title,
  onChange,
  onClick,
  onBlur,
  state,
  subtitle,
  className,
  error,
  minLength,
  maxLength,
}: TextInputProps) => JSX.Element

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
}
declare const useSuccess: ({
  show,
  onClose,
  title,
  message,
  closeButton,
}: SuccessErrorProps) => react_jsx_runtime.JSX.Element
declare const useAlertError: ({
  show,
  onClose,
  title,
  message,
  closeButton,
  colorIcon,
}: SuccessErrorProps) => react_jsx_runtime.JSX.Element
declare const useRiskConfirm: ({
  show,
  onClose,
  title,
  message,
  closeButton,
  okButton,
  form,
  closeOnConfirm,
  panelCustomCss,
  titleCustomCss,
}: RiskConfirmProps) => react_jsx_runtime.JSX.Element
declare const useEditableForm: ({
  show,
  onClose,
  title,
  form,
  onOK,
  closeButtonOnConner,
  backgroundColor,
}: EditableFormProps) => react_jsx_runtime.JSX.Element
declare const useLoading: ({
  show,
  onClose,
  title,
  message,
  closeButton,
}: SuccessErrorProps) => react_jsx_runtime.JSX.Element

declare const modal_useAlertError: typeof useAlertError
declare const modal_useEditableForm: typeof useEditableForm
declare const modal_useLoading: typeof useLoading
declare const modal_useRiskConfirm: typeof useRiskConfirm
declare const modal_useSuccess: typeof useSuccess
declare namespace modal {
  export {
    modal_useAlertError as useAlertError,
    modal_useEditableForm as useEditableForm,
    modal_useLoading as useLoading,
    modal_useRiskConfirm as useRiskConfirm,
    modal_useSuccess as useSuccess,
  }
}

interface DrawerProps {
  drawerTitle?: string
  children?: any
  isSearch?: boolean
  customOpenBtn?: string
  openBtn?: ReactNode
  footer?: ReactNode
}
declare const CustomDrawer: ({
  customOpenBtn,
  openBtn,
  footer,
  isSearch,
  children,
  drawerTitle,
  ...props
}: DrawerProps) => JSX.Element

export { Button, CustomDrawer, TextInput }
