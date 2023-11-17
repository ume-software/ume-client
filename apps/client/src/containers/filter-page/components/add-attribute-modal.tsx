import { CheckSmall } from '@icon-park/react'
import { Button } from '@ume/ui'

import { Dispatch, SetStateAction } from 'react'

import { AttrbuteProps } from './iFilter'

const AddAttributeModal = (props: {
  attributeData: AttrbuteProps[]
  attributeFilter: AttrbuteProps[]
  setAttributeFilter: Dispatch<SetStateAction<AttrbuteProps[]>>
}) => {
  const addSubAttrToFilter = (attrData: AttrbuteProps, newSubAttr: string) => {
    const isIdExist = props.attributeFilter.find((attrFilter) => attrFilter.id == attrData.id)

    if (isIdExist) {
      props.setAttributeFilter((prevData) =>
        prevData.map((attr) =>
          attr.id === attrData.id
            ? {
                ...attr,
                subAttr: attr.subAttr.find((subAttrFind) => subAttrFind == newSubAttr)
                  ? attr.subAttr.filter((subAttrFind) => subAttrFind != newSubAttr)
                  : [...attr.subAttr, newSubAttr],
              }
            : attr,
        ),
      )
    } else {
      props.setAttributeFilter((prevData) => [
        ...prevData,
        { id: attrData.id, name: attrData.name, subAttr: [newSubAttr] },
      ])
    }
  }

  return (
    <>
      <div className="p-5 text-white">
        {props.attributeData.map((attrData) => (
          <div className="py-2" key={attrData.id}>
            <p className="text-lg font-bold">{attrData.name}: </p>
            <div className="grid grid-cols-3 justify-items-center py-5">
              {attrData.subAttr.map((subAttr, index) => (
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
                        !!props.attributeFilter.find((attrFilter) =>
                          attrFilter.subAttr.find((subAttrFilter) => subAttrFilter == subAttr),
                        )
                      }
                      className="appearance-none w-[13px] h-[13px] border bg-[#292734] rounded-sm checked:bg-purple-600 checked:border-transparent focus:outline-none focus:border-purple-300 focus:ring"
                      onChange={() => {}}
                    />
                    {!!props.attributeFilter.find((attrFilter) =>
                      attrFilter.subAttr.find((subAttrFilter) => subAttrFilter == subAttr),
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
                  <p className="text-md font-normal px-2 inline-block">{subAttr}</p>
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
          onClick={() => {}}
        >
          Lọc
        </Button>
      </div>
    </>
  )
}
export default AddAttributeModal
