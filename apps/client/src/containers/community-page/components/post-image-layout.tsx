import Image from 'next/legacy/image'
import { ThumbnailResponseTypeEnum } from 'ume-service-openapi'

const PostImageLayout = (props) => {
  const MAX_VISIBLE_IMAGES = 2
  const remainingImages = props.data?.length - MAX_VISIBLE_IMAGES
  return (
    <div key={props.data.url} className="w-full h-fit">
      {props.data?.length === 1 ? (
        <div className="relative max-w-[800px] h-[500px]">
          {props.data[0]?.type === ThumbnailResponseTypeEnum.Image ? (
            <Image
              className="absolute"
              layout="fill"
              objectFit="cover"
              src={props.data[0]?.url}
              alt={props.data[0]?.type}
            />
          ) : (
            <video controls>
              <source src={props.data[0]?.url} type="video/mp4" />
              <source src={props.data[0]?.url} type="video/ogg" />
            </video>
          )}
        </div>
      ) : (
        <>
          <div className="w-full flex gap-1">
            {props.data?.slice(0, MAX_VISIBLE_IMAGES).map((media, index) => (
              <div className="relative w-full h-[250px]" key={index}>
                {media.type === ThumbnailResponseTypeEnum.Image ? (
                  <Image className="absolute" layout="fill" objectFit="cover" src={media.url} alt={media.type} />
                ) : (
                  <div className="h-full overflow-clip">
                    <video controls>
                      <source src={media.url} type="video/mp4" />
                      <source src={media.url} type="video/ogg" />
                    </video>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="w-full pt-1">
            {remainingImages > 0 && (
              <div className="relative w-full h-[250px]">
                {props.data[MAX_VISIBLE_IMAGES]?.type === ThumbnailResponseTypeEnum.Image ? (
                  <Image
                    className="absolute"
                    layout="fill"
                    objectFit="cover"
                    src={props.data[MAX_VISIBLE_IMAGES].url}
                    alt="props.data[MAX_VISIBLE_IMAGES].type"
                  />
                ) : (
                  <div className="h-full overflow-clip">
                    <video controls>
                      <source src={props.data[MAX_VISIBLE_IMAGES]?.url} type="video/mp4" />
                      <source src={props.data[MAX_VISIBLE_IMAGES]?.url} type="video/ogg" />
                    </video>
                  </div>
                )}

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
