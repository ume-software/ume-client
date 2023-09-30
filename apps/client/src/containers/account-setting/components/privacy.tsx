import { Button } from '@ume/ui'
import ImgForEmpty from 'public/img-for-empty.png'

import Image from 'next/legacy/image'

const Privacy = () => {
  return (
    <>
      <div className="w-full px-10">
        <p className="text-4xl font-bold">Quyền riêng tư</p>
        <div className="w-[60%] mt-10 p-5">
          <p className="text-2xl font-semibold">Danh sách chặn</p>
          <div className="space-y-7 bg-zinc-800 p-3 mt-5 rounded-2xl">
            <div className="flex justify-between items-center border-b border-white border-opacity-30">
              <div className="flex items-center gap-5">
                <div className="relative w-[70px] h-[70px]">
                  <Image
                    className="absolute rounded-lg"
                    layout="fill"
                    objectFit="cover"
                    src={ImgForEmpty}
                    alt="Personal Image"
                  />
                </div>
                <div>
                  <p className="text-lg">Tên</p>
                  <p className="text-md opacity-50">Block lúc nào</p>
                </div>
              </div>
              <Button isActive={true} isOutlinedButton={true} customCSS="p-2">
                Bỏ chặn
              </Button>
            </div>
            <div className="flex justify-between items-center border-b border-white border-opacity-30">
              <div className="flex items-center gap-5">
                <div className="relative w-[70px] h-[70px]">
                  <Image
                    className="absolute rounded-lg"
                    layout="fill"
                    objectFit="cover"
                    src={ImgForEmpty}
                    alt="Personal Image"
                  />
                </div>
                <div>
                  <p className="text-lg">Tên</p>
                  <p className="text-md opacity-50">Block lúc nào</p>
                </div>
              </div>
              <Button isActive={true} isOutlinedButton={true} customCSS="p-2">
                Bỏ chặn
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
export default Privacy
