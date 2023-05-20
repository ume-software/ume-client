import cover from 'public/cover.png'

import Image from 'next/legacy/image'

//TODO: fix this component to use dynamic
const Cover = () => {
  return (
    <>
      <div className="flex justify-center w-full">
        <Image className="object-fill w-full" src={cover} objectFit="cover" alt="cover"></Image>
      </div>
    </>
  )
}

export default Cover
