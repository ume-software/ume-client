import EmptyErrorPic from 'public/empty_error.png'

import Image from 'next/image'

export const locale = {
  emptyText: (
    <div className="flex flex-col items-center justify-center w-full h-full text-2xl font-bold text-white">
      <Image height={600} alt="empty data" src={EmptyErrorPic} />
      Không có data
    </div>
  ),
}
