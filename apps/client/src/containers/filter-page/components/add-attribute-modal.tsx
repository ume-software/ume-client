import { CheckSmall } from '@icon-park/react'
import { Button } from '@ume/ui'

import { Dispatch, SetStateAction, useState } from 'react'

import { AttrbuteProps, SubAttributeProps } from './iFilter'

const AddAttributeModal = (props: {
  setIsModalFilterVisible: Dispatch<SetStateAction<boolean>>
  attributeData: AttrbuteProps[]
  attributeFilter: AttrbuteProps[]
  setAttributeFilter: Dispatch<SetStateAction<AttrbuteProps[]>>
}) => {
  const [displayAttrFilter, setDisplayAttrFilter] = useState<AttrbuteProps[]>(props.attributeFilter)

  const addSubAttrToFilter = (attrData: AttrbuteProps, newSubAttr: SubAttributeProps) => {
    const isIdExist = displayAttrFilter.find((attrFilter) => attrFilter.id == attrData.id)

    if (isIdExist) {
      setDisplayAttrFilter((prevData) =>
        prevData.map((attr) =>
          attr.id === attrData.id
            ? {
                ...attr,
                subAttr: attr?.subAttr?.find((subAttrFind) => subAttrFind.subAttrId == newSubAttr.subAttrId)
                  ? attr.subAttr.filter((subAttrFind) => subAttrFind.subAttrId != newSubAttr.subAttrId)
                  : [...(attr.subAttr as any), newSubAttr],
              }
            : attr,
        ),
      )
    } else {
      setDisplayAttrFilter((prevData) => [...prevData, { id: attrData.id, name: attrData.name, subAttr: [newSubAttr] }])
    }
  }

  return (
    <>
      <div className="max-h-[55vh] p-5 text-white overflow-y-auto custom-scrollbar">
        {props.attributeData.map((attrData) => (
          <div className="py-2" key={attrData.id}>
            <p className="text-lg font-bold">{attrData.name}: </p>
            <div className="grid grid-cols-3 justify-items-center py-5">
              {attrData?.subAttr?.map((subAttr, index) => (
                <div
                  className="col-span-1 cursor-pointer"
                  key={index}
                  onClick={() => {
                    addSubAttrToFilter(attrData, subAttr)
                  }}
                  onKeyDown={() => {}}
                >
                  <div className="relative inline-block">
                    <input
                      type="checkbox"
                      checked={
                        !!displayAttrFilter.find(
                          (attrFilter) =>
                            attrFilter.id == attrData.id &&
                            attrFilter?.subAttr?.find((subAttrFilter) => subAttrFilter.subAttrId == subAttr.subAttrId),
                        )
                      }
                      className="appearance-none w-[13px] h-[13px] border bg-[#292734] rounded-sm checked:bg-purple-600 checked:border-transparent focus:outline-none focus:border-purple-300 focus:ring"
                      onChange={() => {}}
                    />
                    {!!displayAttrFilter.find(
                      (attrFilter) =>
                        attrFilter.id == attrData.id &&
                        attrFilter?.subAttr?.find((subAttrFilter) => subAttrFilter.subAttrId == subAttr.subAttrId),
                    ) && (
                      <CheckSmall
                        theme="outline"
                        size="15"
                        fill="#FFF"
                        strokeLinejoin="bevel"
                        className="absolute top-1 left-0"
                      />
                    )}
                  </div>
                  <p className="text-md font-normal px-2 inline-block">{subAttr.subAttrViValue}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center py-5 border-t border-3 border-white border-opacity-30 drop-shadow-md">
        <Button
          isActive={true}
          isOutlinedButton={true}
          customCSS="py-2 px-7 rounded-xl hover:scale-105"
          type="button"
          onClick={() => {
            props.setAttributeFilter(displayAttrFilter)
            props.setIsModalFilterVisible(false)
          }}
        >
          Áp dụng
        </Button>
      </div>
    </>
  )
}
export default AddAttributeModal
