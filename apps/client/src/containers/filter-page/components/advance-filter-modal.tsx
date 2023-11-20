import { CloseSmall } from '@icon-park/react'
import { Modal } from '@ume/ui'

import AddAttributeModal from './add-attribute-modal'

const AdvanceFilterModal = ({
  isModalFilterVisible,
  setIsModalFilterVisible,
  attrbuteData,
  attributeFilter,
  setAttributeFilter,
}) => {
  const advanceFilterModal = Modal.useEditableForm({
    onOK: () => {},
    onClose: () => setIsModalFilterVisible(false),
    show: isModalFilterVisible,
    title: <p className="text-white">Thuộc tính</p>,
    form: (
      <AddAttributeModal
        setIsModalFilterVisible={setIsModalFilterVisible}
        attributeData={attrbuteData}
        attributeFilter={attributeFilter}
        setAttributeFilter={setAttributeFilter}
      />
    ),
    backgroundColor: '#15151b',
    closeWhenClickOutSide: true,
    closeButtonOnConner: (
      <CloseSmall
        onClick={() => setIsModalFilterVisible(false)}
        onKeyDown={() => {}}
        tabIndex={1}
        className=" bg-[#3b3470] rounded-full cursor-pointer top-2 right-2 hover:rounded-full hover:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25 "
        theme="outline"
        size="24"
        fill="#FFFFFF"
      />
    ),
  })
  return <>{advanceFilterModal}</>
}
export { AdvanceFilterModal }
