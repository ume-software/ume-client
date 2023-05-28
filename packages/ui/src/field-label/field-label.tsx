import { HTMLAttributes, InputHTMLAttributes, LabelHTMLAttributes } from 'react'

interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  labelName: string
  isOptional?: boolean
  className?: string
}

export const FieldLabel = ({ labelName, isOptional = false, className, ...props }: FieldLabelProps) => {
  return (
    <label className={`flex text-base gap-x-1 ${className}`} {...props}>
      {labelName}
      {isOptional && <span className="font-thin text-kmsconnect-textGrey">(optional)</span>}
    </label>
  )
}
