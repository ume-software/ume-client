import cover from 'public/cover.png'
import Image from 'next/legacy/image'


const Cover = () => {
    return (
        <div>
            <div className="mx-20">
                <Image className="w-full" src={cover} alt="cover"></Image>
            </div>
        </div>
    )
}

export default Cover