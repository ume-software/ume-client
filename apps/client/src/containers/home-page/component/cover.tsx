import cover from 'public/cover.png'

import Image from 'next/legacy/image'

const Cover = () => {
  return (
    <>
      <div className="w-full flex justify-center">
        <Image className="w-full object-fill" src={cover} objectFit="cover" alt="cover"></Image>
      </div>
    </>
  )
}

export default Cover
