import { DeleteFive, Eyes, Left, Right, Write } from '@icon-park/react'
import ImgForEmpty from 'public/img-for-empty.png'

import { ReactNode, useState } from 'react'

import Image from 'next/legacy/image'

interface ITable {
  dataHeader: string[]
  dataBody: (ReactNode | undefined)[][]
  page: string
  setPage: (page: string) => void
  limit?: string
  totalItem: number
  contentItem: string
  watchAction: boolean
  onWatch: (id?: number) => void
  editAction: boolean
  onEdit: (id?: number) => void
  deleteAction: boolean
  onDelete: (id?: number) => void
}

const Table = ({
  dataHeader,
  dataBody,
  page,
  setPage,
  limit,
  totalItem,
  contentItem,
  watchAction,
  onWatch,
  onEdit,
  editAction,
  deleteAction,
  onDelete,
}: ITable) => {
  const [position, setPosition] = useState<number>(1)

  const handleChangePage = (newPage: number) => {
    if (newPage > Number(newPage) * Number(limit)) {
      return
    }
    setPage(String(newPage))
  }

  const handleSlideLeft = () => {
    let slider = document.getElementById('slider')
    if (slider != null) {
      slider.scrollLeft = slider.scrollLeft - 143
      setPosition(position - 1)
    }
  }

  const handleSlideRight = () => {
    let slider = document.getElementById('slider')
    if (slider != null && totalItem / 10 >= position) {
      slider.scrollLeft = slider.scrollLeft + 143
      setPosition(position + 1)
    }
  }

  return (
    <>
      <div className="text-lg font-semibold opacity-50 text-end">
        {Number(page) * Number(limit) - Number(limit) != 0 ? Number(page) * Number(limit) - Number(limit) : 1} -{' '}
        {totalItem > Number(limit) * Number(page) ? (Number(limit) * Number(page)).toFixed(0) : totalItem} trên{' '}
        {totalItem} {contentItem}
      </div>
      <table className="w-full rounded-xl bg-[#292734] overflow-hidden">
        {totalItem <= 0 ? (
          <div className="w-full h-full text-center">
            <Image layout="intrinsic" src={ImgForEmpty} alt="Personal Image" width={800} height={500} />
          </div>
        ) : (
          <>
            <thead className="bg-purple-600">
              <tr>
                {dataHeader.map((item) => (
                  <th key={item} className="p-3 border-r-2 border-white border-opacity-20 last:border-r-0">
                    {item}
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>

            <tbody>
              {dataBody.map((row, indexRow) => (
                <tr key={`row-${indexRow}`}>
                  {row.map((content, indexContent) => (
                    <td
                      key={`row-${indexRow}-content-${indexContent}`}
                      className="p-3 text-center border-b-2 border-r-2 border-white border-opacity-5 last:border-r-0"
                    >
                      {content ?? 'Không'}
                    </td>
                  ))}

                  {(watchAction ?? deleteAction) && (
                    <td className="py-3 text-center border-b-2 border-r-2 border-white border-opacity-5">
                      <div className="flex items-center justify-center gap-3">
                        <Eyes
                          theme="outline"
                          size="20"
                          fill="#fff"
                          strokeLinejoin="bevel"
                          className="cursor-pointer"
                          onClick={() => onWatch(Number(page) * indexRow)}
                        />
                        {editAction && (
                          <Write
                            theme="outline"
                            size="20"
                            fill="#fff"
                            strokeLinejoin="bevel"
                            className="cursor-pointer"
                            onClick={() => onEdit(Number(page) * indexRow)}
                          />
                        )}
                        {deleteAction && (
                          <DeleteFive
                            theme="outline"
                            size="20"
                            fill="#fff"
                            strokeLinejoin="bevel"
                            className="cursor-pointer"
                            onClick={() => onDelete(Number(page) * indexRow)}
                          />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </>
        )}
      </table>
      <div className="flex items-center justify-center gap-3">
        <div className="w-[46px] h-[46px]">
          {Number((Number(totalItem) / Number(limit)).toFixed(0)) > 1 &&
            Number((Number(totalItem) / Number(limit)).toFixed(0)) / 5 <= position && (
              <div
                className={`w-full h-full flex justify-center items-center rounded-full border-2 border-white opacity-50 cursor-pointer hover:bg-white hover:bg-opacity-50`}
                onClick={handleSlideLeft}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    handleSlideLeft()
                  }
                }}
              >
                <Left theme="filled" size="20" fill="#fff" strokeLinejoin="bevel" />
              </div>
            )}
        </div>
        <div
          id="slider"
          className="max-w-[230px] overflow-hidden flex justify-start items-center gap-3 mt-5 overflow-x-scroll scroll scroll-smooth hide-scrollbar"
        >
          {Number((Number(totalItem) / Number(limit)).toFixed(0)) > 1 ? (
            [...Array(Number((Number(totalItem) / Number(limit)).toFixed(0)))].map((_, index) => (
              <div key={`row-${index}`}>
                <div
                  className={`w-[36px] h-[36px] flex justify-center items-center rounded-full border-2 border-white cursor-pointer hover:bg-white hover:bg-opacity-50 ${
                    Number(page) == index + 1 ? 'bg-white text-black' : 'opacity-50'
                  }`}
                  onClick={() => handleChangePage(index + 1)}
                  onKeyDown={(event) => {}}
                >
                  {index + 1}
                </div>
              </div>
            ))
          ) : (
            <div
              className={`w-[36px] h-[36px] flex justify-center items-center rounded-full border-2 border-white cursor-pointer hover:bg-white hover:bg-opacity-50 bg-white text-black`}
            >
              1
            </div>
          )}
        </div>
        <div className="w-[46px] h-[46px]">
          {Number((Number(totalItem) / Number(limit)).toFixed(0)) / 5 >= position && (
            <div
              className={`w-full h-full flex justify-center items-center rounded-full border-2 border-white opacity-50 cursor-pointer hover:bg-white hover:bg-opacity-50`}
              onClick={handleSlideRight}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  handleSlideRight()
                }
              }}
            >
              <Right theme="filled" size="20" fill="#fff" strokeLinejoin="bevel" />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default Table
