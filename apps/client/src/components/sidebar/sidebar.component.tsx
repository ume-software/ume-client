import { ArrowLeft, ArrowRight } from '@icon-park/react'
import { DrawerSidebar } from '@ume/ui'
import cover from 'public/cover.png'

import { useState } from 'react'

import { Drawer } from 'antd'
import Image, { StaticImageData } from 'next/legacy/image'

interface chatProps {
  imgSrc: string | StaticImageData
  name: string
  message?: {
    player?: { context: any; time: Date }[]
    me?: { context: any; time: Date }[]
  }
}

const chatTest: chatProps[] = [
  {
    imgSrc: cover,
    name: 'abc',
    message: {
      player: [
        { context: 'Player Message 1', time: new Date() },
        { context: 'Player Message 2', time: new Date() },
        { context: 'Player Message 3', time: new Date() },
      ],
      me: [
        { context: 'My Message 1', time: new Date() },
        { context: 'My Message 2', time: new Date() },
        { context: 'My Message 3', time: new Date() },
      ],
    },
  },
  {
    imgSrc: cover,
    name: 'abc',
    message: {
      player: [
        { context: 'Player Message 1', time: new Date() },
        { context: 'Player Message 2', time: new Date() },
        { context: 'Player Message 3', time: new Date() },
      ],
      me: [
        { context: 'My Message 1', time: new Date() },
        { context: 'My Message 2', time: new Date() },
        { context: 'My Message 3', time: new Date() },
      ],
    },
  },
  {
    imgSrc: cover,
    name: 'abc',
    message: {
      player: [
        { context: 'Player Message 1', time: new Date() },
        { context: 'Player Message 2', time: new Date() },
        { context: 'Player Message 3', time: new Date() },
      ],
      me: [
        { context: 'My Message 1', time: new Date() },
        { context: 'My Message 2', time: new Date() },
        { context: 'My Message 3', time: new Date() },
      ],
    },
  },
]

// const Sidebar = (props) => {
//   const [open, setOpen] = useState(false)

//   const showDrawer = () => {
//     setOpen(true)
//   }

//   const onClose = () => {
//     setOpen(false)
//   }

//   const drawerHeader = () => {
//     return (
//       <div className="inline-block p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400">
//         <ArrowRight onClick={onClose} theme="outline" size="40" fill="#fff" />
//       </div>
//     )
//   }
//   return (
//     <>
//       <div className="flex flex-col items-center justify-center gap-8 pt-10" style={{ width: 80 }}>
//         <div
//           className="inline-block p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400"
//           onClick={showDrawer}
//         >
//           <ArrowLeft onClick={onClose} theme="outline" size="40" fill="#fff" />
//         </div>
//         <div className="flex flex-col gap-3">
//           {chatTest.map((item, index) => (
//             <div style={{ width: 60, height: 60, position: 'relative' }}>
//               <Image
//                 className="absolute rounded-full"
//                 layout="fill"
//                 objectFit="cover"
//                 key={index}
//                 src={item.imgSrc}
//                 alt="avatar"
//               />
//             </div>
//           ))}
//         </div>

//         <Drawer title={drawerHeader()} className="" placement="right" closable={false} onClose={onClose} open={open}>
//           <div className="flex flex-col gap-3">
//             {chatTest.map((item, index) => (
//               <div style={{ width: 60, height: 60, position: 'relative' }}>
//                 <Image
//                   className="absolute rounded-full"
//                   layout="fill"
//                   objectFit="cover"
//                   key={index}
//                   src={item.imgSrc}
//                   alt="avatar"
//                 />
//               </div>
//             ))}
//           </div>
//         </Drawer>
//       </div>
//     </>
//   )
// }

const Sidebar = () => {
  const drawerHeader = () => {
    return (
      <div className="inline-block p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400">
        <ArrowLeft theme="outline" size="40" fill="#fff" />
      </div>
    )
  }
  return (
    <DrawerSidebar
      classNameButton="inline-block p-2 bg-gray-700 rounded-full cursor-pointer hover:bg-gray-500 active:bg-gray-400"
      childrenButton={<ArrowRight theme="outline" size="40" fill="#fff" />}
      classNameDrawer=""
      titleDrawer={drawerHeader()}
      childrenDrawer={`${(
        <div className="flex flex-col gap-3">
          {chatTest.map((item, index) => (
            <div style={{ width: 60, height: 60, position: 'relative' }}>
              <Image
                className="absolute rounded-full"
                layout="fill"
                objectFit="cover"
                key={index}
                src={item.imgSrc}
                alt="avatar"
              />
            </div>
          ))}
        </div>
      )}`}
    />
  )
}
export default Sidebar
