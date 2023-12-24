import { PreviewCloseOne, PreviewOpen } from '@icon-park/react'

import React, { ReactNode, useState } from 'react'

import './input.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className, ...props }: InputProps) => {
  return (
    <input
      tabIndex={99}
      className={`form-input w-full rounded px-3 py-2 placeholder:text-slate-400/70 hover:border-ume-blue  ${className}`}
      {...props}
    />
  )
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string
}
export const TextArea = ({ className, ...props }: TextAreaProps) => {
  const [value, setValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  return (
    <textarea
      className={`form-input w-full rounded px-3 py-2 placeholder:text-slate-400/70 hover:border-ume-blue ${className}`}
      value={value}
      onChange={handleChange}
      {...props}
    />
  )
}

interface FormInputProps extends InputProps {
  error: boolean | undefined
  errorMessage: string | undefined
  isDisable?: boolean
}

export const FormInput = ({ error, errorMessage, isDisable, ...props }: FormInputProps) => {
  return (
    <>
      <Input
        {...props}
        tabIndex={99}
        className={`${
          error ? '!border-ume-error  !focus:border-ume-error !focus:outline-ume-error  !hover:border-ume-error' : ''
        } ${props.className} border border-slate-300 `}
        disabled={isDisable}
      />
      {error ? <span className="block mt-1 text-ume-error text-[14px]">{errorMessage}</span> : null}
    </>
  )
}

interface InputWithAffixProps extends React.InputHTMLAttributes<HTMLInputElement> {
  position: 'left' | 'right'
  component: ReactNode
  iconStyle?: string
  styleInput?: string
}

export const InputWithAffix = ({ position, component, ...props }: InputWithAffixProps) => {
  return (
    <div className={`flex -space-x-px ${props.className}`}>
      {position === 'left' ? (
        <div
          className={`flex items-center justify-center rounded-l px-3.5 font-inter dark:border-navy-450 ${props.iconStyle}`}
        >
          {component}
        </div>
      ) : null}
      <Input
        tabIndex={99}
        {...props}
        className={`form-input w-full border px-3 py-2 placeholder:text-slate-400/70 ${
          position === 'left' ? 'rounded-r' : 'rounded-l'
        } ${props.styleInput}`}
      />
      {position === 'right' ? (
        <div
          className={`flex items-center justify-center rounded-l px-3.5 font-inter dark:border-navy-450 ${props.iconStyle}`}
        >
          {component}
        </div>
      ) : null}
    </div>
  )
}

interface FormInputWithAffixProps extends InputWithAffixProps {
  error: boolean | undefined
  errorMessage: string | undefined
}

export const FormInputWithAffix = ({ error, errorMessage, ...props }: FormInputWithAffixProps) => {
  return (
    <>
      <InputWithAffix tabIndex={99} {...props} />
      {error ? <span className="text-ume-error text-[14px]">{errorMessage}</span> : null}
    </>
  )
}

interface InputWithButtonProps extends React.InputHTMLAttributes<HTMLInputElement> {
  position: 'left' | 'right'
  component: ReactNode
}

export const InputWithButton = ({ position, component, ...props }: InputWithButtonProps) => {
  return (
    <div className="relative flex gap-2 -space-x-px">
      <Input {...props} tabIndex={99} />
      {position === 'left' ? <>{component}</> : null}
      {position === 'right' ? <>{component}</> : null}
    </div>
  )
}

interface FormInputWithButtonProps extends InputWithButtonProps {
  error: boolean | undefined
  errorMessage: string | undefined
}

export const FormInputWithButton = ({ error, errorMessage, ...props }: FormInputWithButtonProps) => {
  return (
    <>
      <InputWithButton {...props} tabIndex={99} />
      {error ? <span className="text-ume-error text-[14px]">{errorMessage}</span> : null}
    </>
  )
}

interface InputWithSecretButton extends React.InputHTMLAttributes<HTMLInputElement> {
  subtitle?: ReactNode
  error: boolean | undefined
  errorMessage: string | undefined
}

export const InputWithSecretButton = ({ error, errorMessage, subtitle, ...props }: InputWithSecretButton) => {
  const [type, setType] = useState('password')

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    if (type === 'password') {
      setType('text')
    } else {
      setType('password')
    }
  }

  return (
    <>
      <div className="relative flex">
        <Input
          {...props}
          tabIndex={99}
          type={type}
          className={`${
            error
              ? '!pr-9 !border-ume-error !focus:border-ume-error !focus:outline-ume-error !hover:border-ume-error'
              : ' w-full px-3 py-2 bg-[#FFFFFF] border rounded form-input peer border-slate-300 pr-9 placeholder:text-slate-400/70'
          }`}
        />
        <div
          className="absolute right-0 flex items-center justify-center w-10 h-full cursor-pointer text-slate-400"
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            handleClick(event)
          }}
          onKeyDown={(e) => {
            e.key === 'Enter' && handleClick(e as any)
          }}
          tabIndex={99}
        >
          {type === 'text' ? (
            <PreviewOpen theme="outline" size="20" fill="#6F6F70" />
          ) : (
            <PreviewCloseOne theme="outline" size="20" fill="#6F6F70" />
          )}
        </div>
      </div>
      {subtitle && <div className="mt-1.5 text-slate-400 text-sm">{subtitle}</div>}
      {error && <span className="mt-1.5 inline-block text-ume-error text-[14px]">{errorMessage}</span>}
    </>
  )
}
