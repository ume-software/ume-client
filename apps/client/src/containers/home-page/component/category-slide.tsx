import React, { useRef, useState } from 'react'

import Image from 'next/legacy/image'

interface ICategoryProps {
  skills: any[]
}

const CategorySlide = (props: ICategoryProps) => {
  const boxList = useRef<any>(null)
  const outerBox = useRef<any>(null)
  const [translateXPosition, setTranslateXPosition] = useState<number>(0)
  const [pressed, setPressed] = useState<boolean>(false)
  const [startX, setStartX] = useState<number>(0)
  const [dataList, setDataList] = useState(props)
  const [hadAddTransition, setHadAddTransition] = useState<boolean>(false)
  const handleMouseDown = (e: React.MouseEvent) => {
    setStartX(e.clientX - translateXPosition)
    setPressed(true)
  }
  const timing = 500
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!pressed) return
    setHadAddTransition(false)
    const newtranslateXPosition = e.clientX - startX
    setNewtranslateXPosition(newtranslateXPosition)
  }
  const handleMouseUp = (e: React.MouseEvent) => {
    setPressed(false)
  }
  const setNewtranslateXPosition = (newtranslateXPosition: number) => {
    const childrenWidth = boxList.current.children[0].offsetWidth
    const cardDisplay = outerBox.current.offsetWidth / childrenWidth
    const minPositionToLeft = -(childrenWidth * (props.skills.length - cardDisplay))
    setTranslateXPosition(newtranslateXPosition)
    if (newtranslateXPosition > 0) setTranslateXPosition(0)
    if (newtranslateXPosition < minPositionToLeft) setTranslateXPosition(minPositionToLeft)
  }
  const handleChangeSkill = (numberChange: number) => {
    const childrenWidth = boxList.current.children[0].offsetWidth
    let newtranslateXPosition = translateXPosition - numberChange * childrenWidth
    newtranslateXPosition = Math.ceil(newtranslateXPosition / childrenWidth) * childrenWidth
    setHadAddTransition(true)
    setTranslateXPosition(newtranslateXPosition)
    setNewtranslateXPosition(newtranslateXPosition)
  }

  return (
    <>
      <div className="w-full mt-8 overflow-hidden" ref={outerBox}>
        <div
          className={`flex select-none duration-0 min-w-max ${hadAddTransition ? `duration-${500} ease-in-out` : ''}`}
          style={{ transform: `translateX(${translateXPosition}px)` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseUp}
          ref={boxList}
        >
          {props?.skills.map((item, index) => {
            return (
              <div
                tabIndex={index}
                className="mr-6 duration-500 ease-in-out cursor-pointer hover:scale-105"
                key={item.id}
              >
                <a href="#" draggable="false">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    key={item.id}
                    width={170}
                    height={250}
                    className="h-auto mb-2 rounded-lg pointer-events-none"
                  />
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default CategorySlide
