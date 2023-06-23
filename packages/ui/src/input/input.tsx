import { Copy, Download, PreviewCloseOne, PreviewOpen } from '@icon-park/react'

import React, { ReactNode, useState } from 'react'

import { nanoid } from 'nanoid'
import ReactTooltip from 'react-tooltip'

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

interface FormInputProps extends InputProps {
  error: boolean | undefined
  errorMessage: string | undefined
}

export const FormInput = ({ error, errorMessage, ...props }: FormInputProps) => {
  return (
    <>
      <Input
        {...props}
        tabIndex={99}
        className={`${
          error ? '!border-ume-error  !focus:border-ume-error !focus:outline-ume-error  !hover:border-ume-error' : ''
        } ${props.className} border border-slate-300 `}
      />
      {error ? <span className="block mt-1 text-ume-error text-[14px]">{errorMessage}</span> : null}
    </>
  )
}

interface InputWithAffixProps extends React.InputHTMLAttributes<HTMLInputElement> {
  position: 'left' | 'right'
  component: ReactNode
}

export const InputWithAffix = ({ position, component, ...props }: InputWithAffixProps) => {
  return (
    <div className="flex -space-x-px">
      {position === 'left' ? (
        <div className="flex items-center justify-center rounded-l border border-slate-300 px-3.5 font-inter dark:border-navy-450">
          {component}
        </div>
      ) : null}
      <Input
        tabIndex={99}
        {...props}
        className={`form-input w-full border px-3 py-2 placeholder:text-slate-400/70 ${
          position === 'left' ? 'rounded-r' : 'rounded-l'
        }`}
      />
      {position === 'right' ? (
        <div className="flex items-center justify-center rounded-r border border-slate-300 px-3.5 font-inter dark:border-navy-450">
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
    <div className="relative flex -space-x-px gap-2">
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

interface InputWithCopyButton extends React.InputHTMLAttributes<HTMLInputElement> {}

export const InputWithCopyButton = (props: InputWithCopyButton) => {
  const [copyText, setCopyText] = useState('Copy')
  const id = nanoid()

  const onCopyClick = (event: React.MouseEvent<HTMLElement>, value: string): void => {
    if (!navigator.clipboard) {
      const textArea = document.createElement('textarea')
      textArea.value = value
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      try {
        document.execCommand('copy')
      } catch (err) {
        // message.error('Failed to copy')
      }
      document.body.removeChild(textArea)
      return
    }
    navigator.clipboard.writeText(value).then(
      () => {
        setCopyText('Copied!')
        // message.success('Copied to clipboard!')
      },
      () => {
        // message.error('Failed to copy')
      },
    )
  }

  return (
    <>
      <ReactTooltip
        id={`InputWithCopyButton-${id}`}
        className="rounded-full opacity-100"
        backgroundColor="#e2e8f9"
        textColor="#1e293b"
        place="top"
        effect="solid"
      >
        <p className="text-sm text-black">{copyText}</p>
      </ReactTooltip>
      <InputWithButton
        position="right"
        component={
          <button
            tabIndex={99}
            data-tip
            data-for={`InputWithCopyButton-${id}`}
            className="px-3 border rounded-r border-slate-300"
            type="button"
            onClick={(event: React.MouseEvent<HTMLElement>) => {
              if (!props.disabled) {
                return onCopyClick(event, (props.value as string) || '')
              }
            }}
            onKeyDown={(e) => {
              e.key === 'Enter' && onCopyClick(e as any, (props.value as string) || '')
            }}
            onMouseLeave={() => setCopyText('Copy')}
          >
            <Copy size={22} />
          </button>
        }
        {...props}
      />
    </>
  )
}

export const InputWithDownloadButton = (props: any) => {
  const id = nanoid()
  const { onClick, ...clonedProps } = props

  return (
    <>
      <ReactTooltip
        id={`InputWithDownloadButton-${id}`}
        className="rounded-full opacity-100"
        backgroundColor="#e2e8f9"
        textColor="#1e293b"
        place="top"
        effect="solid"
      >
        <p className="text-sm text-black">{'Download'}</p>
      </ReactTooltip>
      <InputWithButton
        position="right"
        component={
          <button
            tabIndex={99}
            data-tip
            data-for={`InputWithDownloadButton-${id}`}
            className="px-3 border rounded-r border-slate-300"
            type="button"
            onClick={onClick}
            onKeyDown={(e) => {
              e.key === 'Enter' && onClick()
            }}
          >
            <Download size={22} />
          </button>
        }
        {...clonedProps}
      />
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
