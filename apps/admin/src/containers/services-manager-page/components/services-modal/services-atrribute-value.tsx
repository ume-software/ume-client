import { DeleteOne, Minus } from '@icon-park/react'
import { Button, FormInput } from '@ume/ui'

import * as React from 'react'

import { FormikErrors, useFormik } from 'formik'
import { HandleServiceAttributeValueRequestHandleTypeEnum } from 'ume-service-openapi'
import * as Yup from 'yup'

export interface IServiceAttributeValuesProps {
  serviceAttributeValuesData: any
  setServiceAttributeValuesData: any
  isReadOnly?: boolean
  handleType?: HandleServiceAttributeValueRequestHandleTypeEnum
}

export default function ServiceAttributeValues({
  serviceAttributeValuesData,
  setServiceAttributeValuesData,
  isReadOnly,
}: IServiceAttributeValuesProps) {
  const form = useFormik({
    initialValues: {
      id: (serviceAttributeValuesData.id as string) || '',
      value: (serviceAttributeValuesData.value as string) || '',
      viValue: (serviceAttributeValuesData.viValue as string) || '',
      isActivated: serviceAttributeValuesData.isActivated || true,
      handleType: serviceAttributeValuesData.handleType ?? HandleServiceAttributeValueRequestHandleTypeEnum.Update,
    },
    validationSchema: Yup.object({
      value: Yup.string().required('Thuộc tính là bắt buộc'),
      viValue: Yup.string(),
      serviceAttributeValues: Yup.array().min(0, ''),
    }),
    onSubmit: (values) => {
      setServiceAttributeValuesData({ ...values })
    },
  })
  console.log('values')

  React.useEffect(() => {
    form.setFieldValue(`value`, serviceAttributeValuesData.value)
    form.setFieldValue(`viValue`, serviceAttributeValuesData.viValue)
    form.setFieldValue(`isActivated`, serviceAttributeValuesData.isActivated)
    form.setFieldValue(
      `handleType`,
      serviceAttributeValuesData.handleType ?? HandleServiceAttributeValueRequestHandleTypeEnum.Update,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceAttributeValuesData])
  const handleChange = (fieldName, e) => {
    form.handleChange(e)
    setServiceAttributeValuesData({ ...form.values, [fieldName]: e.target.value })
  }
  return (
    <div className="w-full text-white">
      <div className="inline-block w-1/12 h-8"></div>
      <div className="inline-block w-5/12 h-8">
        {isReadOnly ? (
          <FormInput
            name="value"
            className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 
            ${form.errors.value && form.touched.value ? 'placeholder:text-red-500' : ''}
            `}
            placeholder={'Tên thuộc tính: Trống'}
            error={undefined}
            value={form.values.value}
            errorMessage={undefined}
            readOnly
          />
        ) : (
          <FormInput
            autoComplete="off"
            name="value"
            className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 
            ${form.errors.value && form.touched.value ? 'placeholder:text-red-500' : ''}
            `}
            placeholder={form.errors.value && form.touched.value ? form.errors.value : 'Tên thuộc tính: Silver'}
            disabled={false}
            onChange={(e) => {
              handleChange('value', e)
            }}
            onBlur={form.handleBlur}
            value={form.values.value}
            error={!!form.errors.value && !!form.touched.value}
            errorMessage={''}
          />
        )}
      </div>
      <div className="inline-block text-white">
        <Minus theme="filled" size="14" fill="#ffffff" />
      </div>
      <div className="inline-block w-5/12 h-8">
        {isReadOnly ? (
          <FormInput
            name="viValue"
            className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 
            ${form.errors.viValue && form.touched.viValue ? 'placeholder:text-red-500' : ''}
            `}
            placeholder={'Tên tiếng việt: Trống '}
            errorMessage={''}
            value={form.values.viValue}
            error={undefined}
            readOnly
          />
        ) : (
          <FormInput
            autoComplete="off"
            name="viValue"
            className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 
            ${form.errors.viValue && form.touched.viValue ? 'placeholder:text-red-500' : ''}
            `}
            placeholder={form.errors.viValue && form.touched.viValue ? form.errors.viValue : 'Tên tiếng việt: Bạc '}
            disabled={false}
            onChange={(e) => {
              handleChange('viValue', e)
            }}
            onBlur={form.handleBlur}
            value={form.values.viValue}
            error={!!form.errors.viValue && !!form.touched.viValue}
            errorMessage={''}
          />
        )}
      </div>
    </div>
  )
}
