import React, { useRef, useState } from 'react'

import Image from 'next/image'

const CategorySlide = ({ data }) => {
  console.log(data)

  const boxList = useRef<any>(null)
  const outerBox = useRef<any>(null)
  const [translateXPosition, setTranslateXPosition] = useState<number>(0)
  const [pressed, setPressed] = useState<boolean>(false)
  const [startX, setStartX] = useState<number>(0)
  const [dataList, setDataList] = useState(data)
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
    const minPositionToLeft = -(childrenWidth * (data.length - cardDisplay))
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
        {/* <div className="flex justify-end px-3">
          <svg
            className="w-12 h-12 p-2 m-1 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            onClick={() => handleChangeSkill(-1)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            ></path>
          </svg>
          <svg
            className="w-12 h-12 p-2 m-1 bg-gray-800 rounded-full cursor-pointer hover:bg-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            onClick={() => handleChangeSkill(1)}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            ></path>
          </svg>
        </div> */}
        <div
          className={`flex select-none duration-0 min-w-max ${hadAddTransition ? `duration-${500} ease-in-out` : ''}`}
          style={{ transform: `translateX(${translateXPosition}px)` }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseUp}
          ref={boxList}
        >
          {dataList.map((item) => {
            return (
              <div className="mr-6 duration-500 ease-in-out cursor-pointer hover:scale-105" key={item.id}>
                <a href="#" draggable="false">
                  <Image
                    src={item.cateImg.src}
                    alt={item.cateName}
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
