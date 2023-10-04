import { DeleteFive, Eyes, Left, Right } from '@icon-park/react'

import { useState } from 'react'

interface ITable {
  dataHeader: string[]
  dataBody: (string | undefined)[][]
  pageCount: number
  page: string
  setPage: (page: string) => void
  limit?: string
  totalItem: number
  watchAction: boolean
  deleteAction: boolean
}

const Table = ({
  dataHeader,
  dataBody,
  pageCount,
  page,
  setPage,
  limit,
  totalItem,
  watchAction,
  deleteAction,
}: ITable) => {
  const [position, setPosition] = useState<number>(1)

  const handleChangePage = (newPage: number) => {
    if (newPage > pageCount) {
      return
    }
    setPage(String(newPage))
  }

  const handleSlideLeft = () => {
    let slider = document.getElementById('slider')
    if (slider != null && pageCount / 5 <= position) {
      slider.scrollLeft = slider.scrollLeft - 143
      setPosition(position - 1)
    }
  }

  const handleSlideRight = () => {
    let slider = document.getElementById('slider')
    if (slider != null && pageCount / 5 >= position) {
      slider.scrollLeft = slider.scrollLeft + 143
      setPosition(position + 1)
    }
  }

  return (
    <>
      <div className="text-end font-semibold text-lg opacity-50">
        {Number(page) * Number(limit) - Number(limit)} - {((totalItem / pageCount) * Number(page)).toFixed(0)} trên{' '}
        {totalItem} giao dịch
      </div>
      <table className="w-full rounded-xl bg-[#292734] overflow-hidden">
        <thead className="bg-purple-600">
          <tr>
            {dataHeader.map((item, index) => (
              <th key={index} className="p-3 border-r-2 border-white border-opacity-20 last:border-r-0">
                {item}
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {dataBody.map((row, indexRow) => (
            <tr key={indexRow}>
              {row.map((content, indexContent) => (
                <td
                  key={indexContent}
                  className="text-center p-3  border-r-2 border-b-2 border-white border-opacity-5 last:border-r-0"
                >
                  {content || 'Không'}
                </td>
              ))}

              {(watchAction || deleteAction) && (
                <td className="text-center py-3 border-r-2 border-b-2 border-white border-opacity-5">
                  <div className="flex justify-center items-center gap-3">
                    <Eyes theme="outline" size="20" fill="#fff" strokeLinejoin="bevel" className="cursor-pointer" />
                    {deleteAction && (
                      <DeleteFive
                        theme="outline"
                        size="20"
                        fill="#fff"
                        strokeLinejoin="bevel"
                        className="cursor-pointer"
                      />
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {pageCount && (
        <>
          <div className="flex items-center justify-center gap-3">
            <div className="w-[46px] h-[46px]">
              {pageCount / 5 <= position && (
                <div
                  className={`w-full h-full flex justify-center items-center rounded-full border-2 border-white opacity-50 cursor-pointer hover:bg-white hover:bg-opacity-50`}
                  onClick={handleSlideLeft}
                >
                  <Left theme="filled" size="20" fill="#fff" strokeLinejoin="bevel" />
                </div>
              )}
            </div>
            <div
              id="slider"
              className="max-w-[230px] overflow-hidden flex justify-start items-center gap-3 mt-5 overflow-x-scroll scroll scroll-smooth hide-scrollbar"
            >
              {[...Array(pageCount)].map((_, index) => (
                <>
                  <div key={index}>
                    <div
                      className={`w-[36px] h-[36px] flex justify-center items-center rounded-full border-2 border-white cursor-pointer hover:bg-white hover:bg-opacity-50 ${
                        Number(page) == index + 1 ? 'bg-white text-black' : 'opacity-50'
                      }`}
                      onClick={() => handleChangePage(index + 1)}
                    >
                      {index + 1}
                    </div>
                  </div>
                </>
              ))}
            </div>
            <div className="w-[46px] h-[46px]">
              {pageCount / 5 >= position && (
                <div
                  className={`w-full h-full flex justify-center items-center rounded-full border-2 border-white opacity-50 cursor-pointer hover:bg-white hover:bg-opacity-50`}
                  onClick={handleSlideRight}
                >
                  <Right theme="filled" size="20" fill="#fff" strokeLinejoin="bevel" />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  )
}
export default Table
