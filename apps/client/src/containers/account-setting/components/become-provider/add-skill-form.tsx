import { Menu, Transition } from '@headlessui/react'
import { Check, DeleteFive, Down, Plus, Search } from '@icon-park/react'
import { Button, InputWithAffix } from '@ume/ui'
import { MenuModalEnum } from '~/enumVariable/enumVariable'

import { Fragment, useEffect, useState } from 'react'

import { notification } from 'antd'

interface AttributeProps {
  serviceName: string
  serviceAttribute: string[]
}

interface MenuDisplayProps {
  parent: number
  type: string
  isShow: boolean
  indexShow: number
}

const hotGamesOf2021 = [
  'Elden Ring',
  'Horizon Forbidden West',
  'Resident Evil Village',
  'Ratchet & Clank: Rift Apart',
  'Deathloop',
  'Far Cry 6',
  'Hogwarts Legacy',
  'Back 4 Blood',
  'New World',
  'Kena: Bridge of Spirits',
]

const subAtributes = ['Gold', 'Silver', 'Iron']

const AddSkillForm = () => {
  const [attributes, setAttributes] = useState<AttributeProps[]>([
    {
      serviceName: '',
      serviceAttribute: [''],
    },
  ])
  const [displaySearchBox, setSearchBox] = useState<MenuDisplayProps>({
    parent: 0,
    type: '',
    isShow: false,
    indexShow: 0,
  })
  const [validateUpdateSkill, setValidateUpdateSkill] = useState<boolean>(false)

  const handleAddAttribute = () => {
    setAttributes([...attributes, { serviceName: '', serviceAttribute: [''] }])
  }

  const handleRemoveAttribute = (index: number) => {
    const updatedAttributes = [...attributes]
    updatedAttributes.splice(index, 1)
    setAttributes(updatedAttributes)
  }

  const handleServiceNameChange = (index: number, value: string) => {
    const updatedAttributes = [...attributes]
    updatedAttributes[index] = { ...updatedAttributes[index], serviceName: value }

    console.log(updatedAttributes)

    setAttributes(updatedAttributes)
  }

  const handleAddInput = (index: number) => {
    const updatedAttributes = [...attributes]
    updatedAttributes[index].serviceAttribute.push('')
    setAttributes(updatedAttributes)
  }

  const handleRemoveInput = (index: number, subIndex: number) => {
    const updatedAttributes = [...attributes]
    updatedAttributes[index].serviceAttribute.splice(subIndex, 1)
    setAttributes(updatedAttributes)
  }

  const handleAttributeChange = (index: number, subIndex: number, value: string) => {
    const updatedAttributes = [...attributes]
    updatedAttributes[index].serviceAttribute[subIndex] = value
    setAttributes(updatedAttributes)
  }

  useEffect(() => {
    if (
      attributes.some((attribute) => {
        return (
          attribute.serviceName == '' ||
          !attribute.serviceName ||
          attribute.serviceAttribute.some((item) => {
            return item == '' || !item
          })
        )
      })
    ) {
      setValidateUpdateSkill(false)
    } else {
      setValidateUpdateSkill(true)
    }
  }, [attributes])

  const handleUpdateSkillProvider = () => {
    if (validateUpdateSkill) {
      console.log(attributes)
    } else {
      notification.warning({
        message: 'Vui lòng nhập đầy đủ thông tin',
        description: 'Vui lòng kiểm tra lại và nhập đầy đủ thông tin của bạn!',
        placement: 'bottomLeft',
      })
    }
  }

  return (
    <>
      <div className="grid grid-cols-4 gap-5">
        {attributes.map((attr, index) => (
          <div className="col-span-2 border border-white border-opacity-30 p-5 rounded-3xl">
            <div className="flex flex-col gap-2">
              <label>Dịch vụ</label>
              <div className="flex items-center gap-3">
                <div className="w-fit relative">
                  <InputWithAffix
                    placeholder={`${hotGamesOf2021[0]}`}
                    value={attributes[index].serviceName}
                    type="text"
                    onChange={(e) => handleServiceNameChange(index, e.target.value)}
                    className="bg-zinc-800 rounded-xl border border-white border-opacity-30"
                    styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                    iconStyle="border-none"
                    position="right"
                    component={
                      <Down
                        theme="outline"
                        size="20"
                        fill="#fff"
                        strokeLinejoin="bevel"
                        className="cursor-pointer"
                        onMouseDown={() =>
                          setSearchBox({ parent: index, type: MenuModalEnum.ATTRIBUTE, isShow: true, indexShow: index })
                        }
                      />
                    }
                    onMouseDown={() =>
                      setSearchBox({
                        parent: index,
                        type: MenuModalEnum.ATTRIBUTE,
                        isShow: true,
                        indexShow: index,
                      })
                    }
                  />
                  <Transition
                    as={Fragment}
                    show={
                      displaySearchBox.isShow &&
                      displaySearchBox.type == MenuModalEnum.ATTRIBUTE &&
                      displaySearchBox.indexShow == index
                    }
                    enter="transition ease-out duration-400"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-400"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <div
                      className="absolute right-0 left-0  max-h-[300px] w-full overflow-y-auto p-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hide-scrollbar"
                      style={{ zIndex: 5 }}
                      onMouseLeave={() =>
                        setSearchBox({
                          parent: index,
                          type: MenuModalEnum.ATTRIBUTE,
                          isShow: false,
                          indexShow: index,
                        })
                      }
                    >
                      <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                        {hotGamesOf2021.map((game, game_index) => (
                          <div
                            className={`flex gap-5 items-center bg-gray-700 hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                            key={game_index}
                            onClick={(e) => handleServiceNameChange(index, game)}
                          >
                            <p className="text-mg font-semibold">{game}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Transition>
                </div>
                <Button
                  customCSS={`text-xl p-2 ${
                    attributes[index].serviceAttribute.length > 0
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-red-500 hover:scale-105'
                  }  rounded-xl`}
                  type="button"
                  isActive={true}
                  isDisable={attributes[index].serviceAttribute.length > 0}
                  isOutlinedButton={true}
                  onClick={() => handleRemoveAttribute(index)}
                >
                  <DeleteFive theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                </Button>
              </div>
            </div>
            <div className="flex flex-col gap-2 mt-5 ml-10">
              <label>Thuộc tính</label>
              <div className="flex flex-col gap-7">
                <div className="flex flex-col gap-5">
                  {attr.serviceAttribute.map((value, subIndex) => (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-fit relative" key={subIndex}>
                          <InputWithAffix
                            placeholder={`${subAtributes[0]}`}
                            value={value}
                            type="text"
                            onChange={(e) => handleAttributeChange(index, subIndex, e.target.value)}
                            className="bg-zinc-800 rounded-xl border border-white border-opacity-30"
                            styleInput={`bg-zinc-800 rounded-xl border-none focus:outline-none`}
                            iconStyle="border-none"
                            position="right"
                            component={
                              <Down
                                theme="outline"
                                size="20"
                                fill="#fff"
                                strokeLinejoin="bevel"
                                className="cursor-pointer"
                                onMouseDown={() =>
                                  setSearchBox({
                                    parent: index,
                                    type: MenuModalEnum.SUB_ATTRIBUTE,
                                    isShow: true,
                                    indexShow: subIndex,
                                  })
                                }
                              />
                            }
                            onMouseDown={() =>
                              setSearchBox({
                                parent: index,
                                type: MenuModalEnum.SUB_ATTRIBUTE,
                                isShow: true,
                                indexShow: subIndex,
                              })
                            }
                          />
                          <Transition
                            as={Fragment}
                            show={
                              displaySearchBox.parent == index &&
                              displaySearchBox.isShow &&
                              displaySearchBox.type == MenuModalEnum.SUB_ATTRIBUTE &&
                              displaySearchBox.indexShow == subIndex
                            }
                            enter="transition ease-out duration-400"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-400"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <div
                              className="absolute right-0 left-0 max-h-[300px] w-full overflow-y-auto p-2 origin-top-right bg-[#292734] divide-y divide-gray-100 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none hide-scrollbar"
                              style={{ zIndex: 5 }}
                              onMouseLeave={() =>
                                setSearchBox({
                                  parent: index,
                                  type: MenuModalEnum.SUB_ATTRIBUTE,
                                  isShow: false,
                                  indexShow: subIndex,
                                })
                              }
                            >
                              <div className="flex flex-col gap-2" style={{ zIndex: 10 }}>
                                {subAtributes.map((sub_attr, sub_attr_index) => (
                                  <div
                                    className={`flex gap-5 items-center bg-gray-700 hover:bg-gray-700 cursor-pointer p-3 rounded-lg`}
                                    key={sub_attr_index}
                                    onClick={() => handleAttributeChange(index, subIndex, sub_attr)}
                                  >
                                    <p className="text-mg font-semibold">{sub_attr}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Transition>
                        </div>
                        <Button
                          customCSS={`text-xl p-2 bg-red-500 hover:scale-105 rounded-xl`}
                          type="button"
                          isActive={true}
                          isOutlinedButton={true}
                          onClick={() => handleRemoveInput(index, subIndex)}
                        >
                          <DeleteFive theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                        </Button>
                      </div>
                    </>
                  ))}
                </div>
                <Button
                  customCSS={`text-sm p-2 hover:scale-105 rounded-xl`}
                  type="button"
                  isActive={true}
                  isOutlinedButton={true}
                  onClick={() => handleAddInput(index)}
                >
                  <Plus theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
                  <p>Thêm thuộc tính</p>
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="col-span-2 min-h-[300px] flex justify-center items-center">
          <Button
            customCSS={`text-lg p-2 hover:scale-105 rounded-xl`}
            type="button"
            isActive={true}
            isOutlinedButton={true}
            onClick={handleAddAttribute}
          >
            <Plus theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" />
            <p>Thêm dịch vụ</p>
          </Button>
        </div>
      </div>

      <div className="text-center mt-20">
        {/* <Button
        isActive={false}
        isOutlinedButton={true}
        customCSS="w-[100px] text-xl p-2 rounded-xl hover:scale-105"
        onClick={() => handleClose()}
      >
        Hủy
      </Button> */}

        <Button
          customCSS="w-[150px] text-xl p-2 rounded-xl hover:scale-105"
          isActive={true}
          isOutlinedButton={true}
          onClick={() => handleUpdateSkillProvider()}
        >
          Xác minh
        </Button>
      </div>
    </>
  )
}
export default AddSkillForm
