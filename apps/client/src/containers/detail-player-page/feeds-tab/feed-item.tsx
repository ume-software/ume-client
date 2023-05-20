import { Comment, Like } from '@icon-park/react'

import Image from 'next/legacy/image'
import Link from 'next/link'

const FeedItem = (props: { data }) => {
  return (
    <>
      <div className="relative w-full flex justify-around">
        <Link href={`${props.data.feedLink}`}>
          <div
            style={{
              width: '350px',
              height: '350px',
              overflow: 'hidden',
              background: 'white',
              borderRadius: 30,
              position: 'relative',
            }}
          >
            <Image
              className="absolute"
              layout="fill"
              objectFit="cover"
              src={props.data.imgSrc}
              alt="Feed Image"
            ></Image>
          </div>
        </Link>
        <div
          className="absolute bottom-5 left-0 pl-5 pt-2 pb-2 pr-3 rounded-r-xl flex gap-5"
          style={{ background: 'gray' }}
        >
          <div className="flex items-center gap-3 ">
            <Like theme={`${props.data.like ? 'filled' : 'outline'}`} size="25" fill="#FFFFFF" />
            <p className="text-xl font-medium">{props.data.numberLike || 0}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`${props.data.feedLink}`}>
              <Comment theme="outline" size="25" fill="#FFFFFF" />
            </Link>
            <p className="text-xl font-medium">{props.data.numberCom || 0}</p>
          </div>
        </div>
      </div>
    </>
  )
}
export default FeedItem
