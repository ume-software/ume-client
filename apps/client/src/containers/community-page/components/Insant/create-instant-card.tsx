import { CheckOne, CloseOne, CloseSmall, Plus } from '@icon-park/react'
import { Button, Modal, TextArea } from '@ume/ui'

import { useEffect, useState } from 'react'

import { notification } from 'antd'
import { FormikErrors, useFormik } from 'formik'

import { backgroundColors } from './bg-color-instant-card'

import { trpc } from '~/utils/trpc'

interface IFormValues {
  content: string
  hashtag: string[]
  gradientColors: string
}

const validate = (value: IFormValues): FormikErrors<IFormValues> => {
  const errors: FormikErrors<IFormValues> = {}

  return errors
}

const CreateInstantCard = ({ isModalCreateInstantCardVisible, setIsModalCreateInstantCardVisible }) => {
  const maxText = 100
  const maxTag = 3
  const maxLengthHashtag = 10

  const form = useFormik({
    initialValues: {
      content: '',
      hashtag: [],
      gradientColors: '1',
    },
    validate,
    onSubmit: () => {},
  })

  const getHashTags = trpc.useQuery(['community.getTopInstantCardHashTags'])
  const createInstantCard = trpc.useMutation(['community.createInstantCard'])

  const utils = trpc.useContext()

  const [hashtagsValueArray, setHashtagsValueArray] = useState<string[]>([])
  const [isAddNewHashtag, setIsAddNewHashtag] = useState<boolean>(false)
  const [addNewHashtag, setAddNewHashtag] = useState<string>('')

  const handleAddHashtags = (newHashtags: string) => {
    if (form.values.hashtag.length < maxTag) {
      const newHashtagArray = [...form.values.hashtag, newHashtags]
      form.setFieldValue('hashtag', newHashtagArray)
    }
  }

  const handleRemoveHashtag = (index: number) => {
    const newHashtagArray = [...form.values.hashtag]
    newHashtagArray.splice(index, 1)

    form.setFieldValue('hashtag', newHashtagArray)
  }

  useEffect(() => {
    const contentArray: string[] = form.values.hashtag.map((hashtagInput) => {
      const content =
        getHashTags.data?.data.row?.find((hashtag) => hashtag.content == hashtagInput)?.content ?? hashtagInput
      return content
    })
    setHashtagsValueArray(contentArray)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.values.hashtag])

  const createNewInstantCard = (e) => {
    e.preventDefault()
    if (!(form.values.content === '' || !(form.values.hashtag.length > 0))) {
      createInstantCard.mutate(
        {
          content: form.values.content,
          gradientColors: form.values.gradientColors,
          hashTags: form.values.hashtag,
        },
        {
          onSuccess: (data) => {
            notification.success({
              message: 'Tạo tìm kiếm mới thành công!',
              description: 'Tìm kiếm mới đã được tạo thành công.',
              placement: 'bottomLeft',
            })
            setIsModalCreateInstantCardVisible(false)
            utils.invalidateQueries('community.getTopInstantCardHashTags')
          },
        },
      )
    }
  }

  const InstantCardModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsModalCreateInstantCardVisible(false),
    title: <p className="text-white">Tạo tìm kiếm</p>,
    show: isModalCreateInstantCardVisible,
    customModalCSS: 'top-20',
    form: (
      <div className={`px-5 py-3`}>
        <div className="max-h-[550px] flex flex-col overflow-y-auto p-5 custom-scrollbar gap-5">
          <span className="text-white text-center opacity-50">
            Lưu ý: <p className="inline-block font-semibold">Tìm kiếm của bạn chỉ xuất hiện 30 phút</p>
          </span>
          <div className={`relative text-white space-y-2`}>
            <label>Nội dung:</label>
            <div
              className={`h-fit rounded-xl ${
                backgroundColors.find((bgColor) => bgColor.key == form.values.gradientColors)?.color
              }`}
            >
              <TextArea
                className="bg-transparent min-h-[100px] max-h-[140px] focus:outline-none"
                rows={5}
                name="content"
                maxLength={maxText}
                value={form.values.content}
                onChange={form.handleChange}
              />

              <p className="absolute bottom-1 right-1 opacity-50 font-semibold">
                {form.values.content.length}/{maxText}
              </p>
            </div>
          </div>
          <div className="grid 2xl:grid-cols-8 lg:grid-cols-6 grid-cols-4 ">
            {backgroundColors.map((bgColor) => (
              <div className="relative w-fit h-fit col-span-1" key={bgColor.key + bgColor.color}>
                <div
                  className={`h-10 w-10 ${bgColor.color} rounded-lg ${
                    bgColor.key == form.values.gradientColors ? 'border-2 border-purple-600' : ''
                  }`}
                  onClick={() => form.setFieldValue('gradientColors', bgColor.key)}
                  onKeyDown={() => {}}
                />
                {bgColor.key == form.values.gradientColors && (
                  <CheckOne
                    theme="two-tone"
                    size="15"
                    fill={['#FFF', '#9333ea']}
                    strokeLinejoin="bevel"
                    className="absolute top-0 right-0"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-white space-y-2">
            <label>Tag:</label>
            <p className="mx-2 inline-block font-semibold">
              ({form.values.hashtag.length}/{maxTag})
            </p>
            <div className="border border-white bg-[#413F4D] p-2 rounded-lg border-opacity-30">
              {hashtagsValueArray.map((hastagValue, index) => (
                <div
                  key={hastagValue + index + 'display'}
                  className="inline-block p-2 text-md font-semibold rounded-xl bg-[#66627e] mr-3 mb-2"
                >
                  <div className="flex items-center gap-3">
                    {hastagValue}
                    <CloseOne
                      className="cursor-pointer"
                      theme="outline"
                      size="20"
                      fill="#FFF"
                      strokeLinejoin="bevel"
                      onClick={() => {
                        handleRemoveHashtag(index)
                      }}
                    />
                  </div>
                </div>
              ))}
              {form.values.hashtag.length < maxTag && (
                <>
                  {isAddNewHashtag ? (
                    <input
                      placeholder={`Talk,...`}
                      value={addNewHashtag}
                      type="text"
                      name="hashtag"
                      className="w-24 h-10 p-2 inline-block border border-white bg-[#716d8b] rounded-lg border-opacity-30"
                      onChange={(e) => {
                        const updatedValue = e.target.value.replace(/ /g, '')
                        setAddNewHashtag(updatedValue)
                      }}
                      maxLength={maxLengthHashtag}
                      onKeyUp={(e) => {
                        if (e.key == 'Enter') {
                          setIsAddNewHashtag(false)
                          setAddNewHashtag('')
                          if (addNewHashtag != '') {
                            handleAddHashtags(addNewHashtag)
                          }
                        }
                      }}
                      onBlur={() => {
                        setIsAddNewHashtag(false)
                        setAddNewHashtag('')
                        if (addNewHashtag != '') {
                          handleAddHashtags(addNewHashtag)
                        }
                      }}
                      autoComplete="off"
                      autoFocus={isAddNewHashtag}
                    />
                  ) : (
                    <div className="inline-block">
                      <span
                        className="flex items-center gap-2 w-20 h-10 p-2 border border-white bg-[#716d8b] rounded-lg border-opacity-30"
                        onClick={() => setIsAddNewHashtag(true)}
                        onKeyDown={() => {}}
                      >
                        <Plus theme="outline" size="15" fill="#FFF" strokeLinejoin="bevel" />
                        Tag
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {(getHashTags.data?.data.row?.length ?? 0) > 0 &&
              getHashTags.data?.data.row?.map((hashtag) => (
                <div
                  key={hashtag.id}
                  className={`inline-block p-2 rounded-lg text-white bg-[#716d8b] ${
                    Array.isArray(form.values.hashtag) && form.values.hashtag.includes(hashtag.content) && 'opacity-30'
                  } cursor-pointer mr-3`}
                  onClick={() => {
                    const isNewHashtagsExist = form.values.hashtag.find((oldHashtag) => oldHashtag == hashtag.content)
                    if (!isNewHashtagsExist) {
                      handleAddHashtags(hashtag.content)
                    }
                  }}
                  onKeyDown={() => {}}
                >
                  {hashtag.content}
                </div>
              ))}
          </div>
        </div>
        <div className="p-5 mt-3 text-center">
          <Button
            customCSS={`!rounded-2xl w-full !text-white py-2 px-5 font-semibold text-lg text-center ${
              !(form.values.content === '' || !(form.values.hashtag.length > 0)) && 'hover:scale-105'
            }`}
            type="button"
            isActive={true}
            isOutlinedButton={!(form.values.content === '' || !(form.values.hashtag.length > 0))}
            isLoading={createInstantCard.isLoading}
            onClick={createNewInstantCard}
          >
            Tạo tìm kiếm
          </Button>
        </div>
      </div>
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={() => setIsModalCreateInstantCardVisible(false)}
        onKeyDown={(e) => e.key === 'Enter' && setIsModalCreateInstantCardVisible(false)}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })
  return <>{InstantCardModal}</>
}
export default CreateInstantCard
