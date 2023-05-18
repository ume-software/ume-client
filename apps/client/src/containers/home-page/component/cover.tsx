import cover from 'public/cover.png'

import Image from 'next/legacy/image'

const Cover = () => {
  return (
    <>
      <div className="flex justify-center w-full mx-16">
        <Image priority className="object-fill w-full" src={cover} objectFit="cover" alt="cover"></Image>
      </div>
    </>
  )
}

export default Cover
