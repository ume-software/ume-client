import Image from 'next/legacy/image'

const PostImageLayout = (props) => {
  const MAX_VISIBLE_IMAGES = 2
  const remainingImages = props.data?.length - MAX_VISIBLE_IMAGES
  return (
    <div key={props.data.id} className="w-full h-fit">
      {props.data?.length === 1 ? (
        <div className="relative max-w-[800px] h-[500px]">
          <Image
            className="absolute"
            layout="fill"
            objectFit="cover"
            src={props.data[0]?.url}
            alt={props.data[0]?.type}
          />
        </div>
      ) : (
        <>
          <div className="w-full flex gap-1">
            {props.data?.slice(0, MAX_VISIBLE_IMAGES).map((image, index) => (
              <div className="relative w-full h-[250px]">
                <Image
                  className="absolute"
                  key={index}
                  layout="fill"
                  objectFit="cover"
                  src={image.url}
                  alt={image.type}
                />
              </div>
            ))}
          </div>
          <div className="w-full pt-1">
            {remainingImages > 0 && (
              <div className="relative w-full h-[250px]">
                <Image
                  className="absolute"
                  layout="fill"
                  objectFit="cover"
                  src={props.data[MAX_VISIBLE_IMAGES].url}
                  alt="props.data[MAX_VISIBLE_IMAGES].type"
                />
                {remainingImages != 1 && (
                  <div className="absolute top-0 left-0 bottom-0 right-0 bg-[#00000090]">
                    <div className="h-full flex justify-center items-center">
                      <p className="text-2xl font-semibold">+{remainingImages} more</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
export default PostImageLayout
