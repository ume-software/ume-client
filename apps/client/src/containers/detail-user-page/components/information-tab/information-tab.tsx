import { People, Gamepad, Down, Right } from '@icon-park/react'
import { Button } from 'antd'
import Image, { ImageProps } from 'next/legacy/image'
import ImgForEmpty from 'public/img-for-empty.png'
import { useState } from 'react'

interface games extends ImageProps {
    name: string
}

interface contentProps {
    title?: string,
    content?: string
}

const gamesData: games[] = [
    {
        src: ImgForEmpty,
        name: 'Valorant'
    },
    {
        src: ImgForEmpty,
        name: 'Valorant'
    },
    {
        src: ImgForEmpty,
        name: 'Valorant'
    },
    {
        src: ImgForEmpty,
        name: 'Game gì đó tên dài vl asdasdasfdad'
    }
]

const content: contentProps = {
    title: 'Hé lô các bạn',
    content: `Xin chào các user thân yêu đã ghé thăm playerduo của Mìn nha.
            Cả nhà thân yêu ơi, nt fb cả pld không thấy Mìn trả lời thì gọi Mìn nha: 0935623471 Cảm ơn ạ
            ❥Nhận: >Liên Minh, Farmtogether, TFTsvViet, TFT sv NA,cờ tỷ phú,audition.
            >Mở nhạc theo yêu cầu, mở phim theo yêu cầu (có tài khoản netflix).
            >Call video = x4 x5 x6 x7 x8 x9 x10 x11 x12 x13 x14 x15 x16
            ❥Không nhận: Các game bắn súng và không nhận hát ( Đơn giản vì em mù âm nhạc).
            ❥Sở thích: Anime, phim, chơi game,....
            ❥Tính tình hiền lành,thật thà và ngoan ngoãn như cún.
            ❥Không nợ, không donate sau. Vì niềm zui đôi bên.
            ❥Khách mến thì cho Tiểu Mìn xin 1 phiếu theo dõi trên Playerduo nhen.
            ❥Thời gian rảnh: Từ khi ngủ dậy.
            ❥❥❥Nhắn tin playerduo không được thì vui lòng gửi tin vào fb này giúp Mìn nha: https://www.facebook.com/1212dobietai`
}

const InformationTab = (props) => {

    const [gamesToggle, setGamesToggle] = useState(false)

    const handleGamesToggle = () => {
        console.log({ gamesToggle });

        setGamesToggle(!gamesToggle)
    }

    return (
        <>
            <div className='w-full grid grid-cols-10 gap-10 px-10'>
                <div className='col-span-2'>
                    <div className='bg-zinc-800 rounded-3xl p-10'>
                        <div className='flex flex-col gap-10'>
                            <div className='flex items-center gap-2 cursor-pointer'>
                                <People theme="outline" size="18" fill="#fff" />
                                <p className='font-nunito font-semibold text-xl'>Đôi chút về tui nè</p>
                            </div>
                            <div className='flex flex-col gap-5 cursor-pointer'>
                                <div className='flex flex-row items-center gap-2' onClick={handleGamesToggle}>
                                    <Gamepad theme="outline" size="18" fill="#fff" />
                                    <p className='font-nunito font-semibold text-xl'>Đôi chút về tui nè</p>
                                    {
                                        gamesToggle ?
                                            <Down theme="outline" size="20" fill="#fff" /> : <Right theme="outline" size="20" fill="#fff" />
                                    }
                                </div>
                                <div className={`pl-5 gap-3 ${gamesToggle ? 'flex flex-col items-start' : 'hidden'}`} >
                                    {gamesData.map((item, index) => (
                                        <div key={index} className={`flex flex-row items-center gap-3 hover:bg-gray-700 p-1 rounded-xl`}>
                                            <Image src={item.src} width={60} height={60}></Image>
                                            <p className='font-nunito font-semibold text-xl truncate' style={{ width: '200px', height: '28px', zIndex: 4 }}>{item.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-5'>
                    <div className='flex flex-col gap-8'>
                        <div className='bg-zinc-800 rounded-3xl p-10'>
                            <div className='flex flex-col gap-10'>
                                <p className='font-inter font-bold text-4xl'>{content.title}</p>
                                <span className='font-roboto font-normal text-lg leading-9'>{content.content}</span>
                            </div>
                        </div>
                        <div className='bg-zinc-800 rounded-3xl p-10'>
                            <div className='flex flex-col gap-10'>
                                <p className='font-inter font-bold text-4xl'>{content.title}</p>
                                <span className='font-roboto font-normal text-lg leading-9'>{content.content}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-span-3'>
                    <div className='flex flex-col gap-10'>
                        <div className='bg-zinc-800 rounded-3xl p-10'>
                            <Image src={ImgForEmpty}></Image>
                        </div>
                        <div className='my-10 flex flex-col gap-5'>
                            <button type='button' className='rounded-full w-full text-purple-700 border-2 border-purple-700 py-2 font-nunito font-bold text-2xl hover:-translate-y-1'>Chat</button>
                            <button type='button' className='rounded-full w-full text-white bg-purple-700 py-2 font-nunito font-bold text-2xl hover:-translate-y-1'>Order</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default InformationTab
