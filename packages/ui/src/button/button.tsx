import React, { ReactNode } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  helper?: ReactNode
  children?: any
  value?: string
  customCSS?: string
  loadingIconColor?: 'white' | 'black'
  isLoading?: boolean
  isOutlinedButton?: boolean
  isActive?: boolean
  icon?: ReactNode
}
const DEFAULT_STYLE = `rounded-md border-1 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/99 font-medium text-white`
export const Button = ({
  helper,
  children,
  customCSS,
  loadingIconColor = 'white',
  isLoading = false,
  isOutlinedButton = false,
  icon,
  type = 'submit',
  isActive = false,
  ...props
}: ButtonProps) => {
  const btnClass =
    DEFAULT_STYLE +
    (isActive
      ? ` ${isOutlinedButton ? 'bg-purple-700 text-slate-800 cursor-pointer' : 'bg-gray-600'}`
      : ` ${isOutlinedButton && 'border border-slate-300'}`) +
    (customCSS ? ` ${customCSS}` : '')

  return (
    <>
      <div className={btnClass}>
        <button
          {...props}
          type={type}
          disabled={!isActive}
          className={`w-full h-full btn ${!isOutlinedButton ? 'bg-transparent' : 'bg-transparent cursor-pointer'}`}
          tabIndex={99}
          style={{ borderRadius: 3 }}
        >
          <div className="flex items-center justify-center gap-x-2">
            {isLoading && (
              <span
                className={`spinner h-5 w-5 animate-spin rounded-full border-[3px] border-r-transparent dark:border-navy-300 dark:border-r-transparent ${
                  loadingIconColor === 'white' ? 'border-white' : 'border-black'
                }`}
              />
            )}
            {icon && <span>{icon}</span>}
            {children}
          </div>
        </button>
      </div>
      {helper && <span className="button-helper">{helper}</span>}
    </>
  )
}
