import { CloseSmall, DeleteOne, Minus, Plus } from '@icon-park/react'
import { Button, FormInput } from '@ume/ui'

import * as React from 'react'

import { FormikErrors, useFormik } from 'formik'
import * as Yup from 'yup'

import ServiceAttributeValues from './services-atrribute-value'

export interface IServiceAttributesProps {
  serviceAttributesData: any
  setServiceAttributesData: any
  removeChildComponent: any
  id: number
  isReadOnly?: boolean
}

export default function ServiceAttributes({
  id,
  serviceAttributesData,
  setServiceAttributesData,
  removeChildComponent,
  isReadOnly,
}: IServiceAttributesProps) {
  const form = useFormik({
    initialValues: {
      attribute: (serviceAttributesData.attribute as string) || '',
      viAttribute: (serviceAttributesData.viAttribute as string) || '',
      isActivated: (serviceAttributesData.isActivated as string) || '',
      serviceAttributeValues: serviceAttributesData.serviceAttributeValues || ([] as Array<Object>),
    },
    validationSchema: Yup.object({
      attribute: Yup.string().required('Thuộc tính là bắt buộc'),
      viAttribute: Yup.string(),
      serviceAttributeValues: Yup.array()
        .of(
          Yup.object({
            value: Yup.string().required('Thuộc tính là bắt buộc'),
            viValue: Yup.string(),
            isActivated: Yup.boolean(),
          }),
        )
        .min(0, ''),
    }),
    onSubmit: (values) => {
      setServiceAttributesData({ ...values })
    },
  })
  React.useEffect(() => {
    form.setFieldValue(`attribute`, serviceAttributesData.attribute)
    form.setFieldValue(`viAttribute`, serviceAttributesData.viAttribute)
    form.setFieldValue(`isActivated`, serviceAttributesData.isActivated)
    form.setFieldValue(`serviceAttributeValues`, serviceAttributesData.serviceAttributeValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceAttributesData])

  const handleChange = (fieldName, e) => {
    form.handleChange(e)
    setServiceAttributesData({ ...form.values, [fieldName]: e.target.value })
  }
  const addChildComponent = () => {
    form.setFieldValue('serviceAttributeValues', [
      ...form.values.serviceAttributeValues,
      {
        value: '',
        viValue: '',
        isActivated: true,
      },
    ])
  }
  const handleRemoveComponent = (id) => {
    removeChildComponent(id)
  }
  const removeSubChildComponent = (index) => {
    const updatedSubChildData = [...form.values.serviceAttributeValues]
    updatedSubChildData.splice(index, 1)
    form.setFieldValue(`serviceAttributeValues`, updatedSubChildData)
    setServiceAttributesData({ ...form.values, serviceAttributeValues: updatedSubChildData })
  }
  return (
    <div className="h-fit border-2 border-[#FFFFFF80] border-opacity-30 rounded-lg w-full pl-4">
      <div className="inline-block w-11/12 h-12 text-lg font-bold text-white">Thuộc Tính:</div>
      {!isReadOnly && (
        <div className="inline-block w-1/12">
          <Button
            isActive={false}
            onClick={() => {
              handleRemoveComponent(id)
            }}
          >
            <DeleteOne theme="filled" size="18" fill="#ffffff" className="my-auto rounded-sm hover:scale-110" />
          </Button>
        </div>
      )}

      <div className="w-full h-12 text-white">
        <div className="inline-block w-2/5">
          {isReadOnly ? (
            <FormInput
              autoComplete="off"
              name="attribute"
              className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 
            ${form.errors.attribute && form.touched.attribute ? 'placeholder:text-red-500' : ''}
            `}
              placeholder={'Tên thuộc tính: Trống'}
              disabled={false}
              value={form.values.attribute}
              error={!!form.errors.attribute && form.touched.attribute}
              errorMessage={''}
              readOnly
            />
          ) : (
            <FormInput
              autoComplete="off"
              name="attribute"
              className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 
            ${form.errors.attribute && form.touched.attribute ? 'placeholder:text-red-500' : ''}
            `}
              placeholder={
                !!form.errors.attribute && form.touched.attribute ? form.errors.attribute : 'Tên thuộc tính: Rank'
              }
              disabled={false}
              onChange={(e) => {
                handleChange('attribute', e)
              }}
              onBlur={form.handleBlur}
              value={form.values.attribute}
              error={!!form.errors.attribute && form.touched.attribute}
              errorMessage={''}
            />
          )}
        </div>
        <div className="inline-block text-white">
          <Minus theme="filled" size="14" fill="#ffffff" />
        </div>
        <div className="inline-block w-2/5">
          {isReadOnly ? (
            <FormInput
              name="viAttribute"
              className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 
            ${form.errors.viAttribute && form.touched.viAttribute ? 'placeholder:text-red-500' : ''}
            `}
              placeholder={'Tên tiếng việt: Trống'}
              error={undefined}
              errorMessage={undefined}
              value={form.values.viAttribute}
              readOnly
            />
          ) : (
            <FormInput
              autoComplete="off"
              name="viAttribute"
              className={`bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 
            ${form.errors.viAttribute && form.touched.viAttribute ? 'placeholder:text-red-500' : ''}
            `}
              placeholder={
                form.errors.viAttribute && form.touched.viAttribute ? form.errors.viAttribute : 'Tên tiếng việt: Hạng'
              }
              disabled={false}
              onChange={(e) => {
                handleChange('viAttribute', e)
              }}
              onBlur={form.handleBlur}
              value={form.values.viAttribute}
              error={!!form.errors.viAttribute && !!form.touched.viAttribute}
              errorMessage={''}
            />
          )}
        </div>
      </div>

      <div className="w-full mb-4">
        {form.values.serviceAttributeValues.map((childData, index) => (
          <div className="flex items-end w-full" key={index}>
            <ServiceAttributeValues
              serviceAttributeValuesData={childData}
              setServiceAttributeValuesData={(data) => {
                const updatedSubChildData = [...form.values.serviceAttributeValues]
                updatedSubChildData[index] = data
                form.setFieldValue(`serviceAttributeValues[${index}]`, data)
                setServiceAttributesData({ ...form.values, serviceAttributeValues: updatedSubChildData })
              }}
              isReadOnly={isReadOnly}
            />
            {!isReadOnly && (
              <div className="w-1/12">
                <Button
                  isActive={false}
                  onClick={() => {
                    removeSubChildComponent(index)
                  }}
                >
                  <DeleteOne
                    theme="filled"
                    size="18"
                    fill="#ffffff"
                    className=" bg-gray-500 border-2  border-[#FFFFFF] border-opacity-30 rounded-sm hover:scale-110 my-auto"
                  />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
      {!isReadOnly && (
        <div className="w-5/6 ">
          <div className="flex items-center justify-end w-full">
            <div className="w-20">
              <Button
                customCSS="bg-[#413F4D] border-2 border-[#FFFFFF] h-8 border-opacity-30 hover:scale-110"
                onClick={addChildComponent}
              >
                <Plus theme="outline" size="24" fill="#fff" />
                Thêm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
