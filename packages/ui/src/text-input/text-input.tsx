import { ChangeEventHandler, FocusEventHandler, MouseEventHandler, ReactNode, useState } from 'react'

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

export const TextInput = ({
    icon,
    type,
    placeholder,
    name,
    value,
    disabled = false,
    required = false,
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
}: TextInputProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <div className="relative">
            <label className={`block ${className}`}>
                <span className="text-[16px]">
                    {title} {required && <span className="text-ume-error">*</span>}
                </span>
                <span className="relative mt-1.5 flex items-center">
                    <input
                        tabIndex={99}
                        className={`text-base bg-[#FFFFFF] form-input dark:border-navy-450 peer w-full rounded border px-3 py-2 placeholder:text-slate-400/70
            ${disabled ? 'cursor-not-allowed bg-slate-100' : ''}
            ${icon ? 'pl-9' : ''}
            ${error
                                ? '!border-ume-error !hover:border-ume-error !focus:border-ume-error !focus:outline-ume-error'
                                : 'border-slate-300 hover:border-ume-blue focus-visible:border-ume-blue focus:border-ume-blue focus:outline-ume-blue dark:hover:border-navy-400 dark:focus:border-accent'
                            }
            ${type === 'password' ? 'pr-9' : ''}`}
                        type={showPassword ? 'text' : type}
                        placeholder={placeholder ? placeholder : `Enter your ${title}`}
                        name={name}
                        value={value}
                        disabled={disabled}
                        title={title}
                        onChange={onChange}
                        onClick={onClick}
                        onBlur={onBlur}
                        minLength={minLength}
                        maxLength={maxLength}
                    />
                    <span className="absolute flex items-center justify-center w-10 h-full pointer-events-none peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent text-slate-400">
                        {icon}
                    </span>
                </span>
                {subtitle && <div className="mt-1.5 text-slate-400 text-[.6875rem]">{subtitle}</div>}
                {error && <span className="mt-1.5 inline-block text-ume-error text-[14px]">{error}</span>}
            </label>
        </div>
    )
}