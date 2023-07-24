import { TextArea } from '@ume/ui'

import { useState } from 'react'

import { Form } from 'antd'
import { ThumbnailResponseTypeEnum } from 'ume-booking-service-openapi'

import { trpc } from '~/utils/trpc'

interface ThumbnailsProps {
  url: string | undefined
  type: string | undefined
}

const CreatePost = (props) => {
  const [content, setContent] = useState<string>('')
  const createNewPost = trpc.useMutation(['community.createNewPost'])
  const uploadImage = trpc.useMutation(['community.uploadImage'])
  const uploadAudio = trpc.useMutation(['community.uploadAudio'])
  const [mediaFiles, setMediaFiles] = useState<(File | FileList | ArrayBuffer | null)[]>([])

  // const onMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = e.target.files
  //   if (files) {
  //     for (const file of files) {
  //       const reader = new FileReader()
  //       if (file.type.startsWith('image/')) {
  //         // Image file
  //         reader.readAsDataURL(file)
  //       } else if (file.type.startsWith('video/')) {
  //         // Video file
  //         reader.readAsArrayBuffer(file)
  //       }
  //       reader.onload = () => {
  //         setMediaFiles((media) => [...media, reader.result])
  //       }
  //       reader.onerror = () => {
  //         console.log(reader.error)
  //       }
  //     }
  //   }
  // }

  const onMediaChange = (e) => {
    setMediaFiles((prevData) => [...(prevData || []), e.target.files])
  }

  const handleUploadImage = async (files: any[]) => {
    const thumbnails: ThumbnailsProps[] = []

    const formData = new FormData()
    files
      .filter((file) => typeof file === 'string')
      .forEach((imageFile, index) => {
        formData.append(`image${index}`, imageFile)
      })
    // Append video files to formData (assuming mediaFiles is an array of ArrayBuffers)
    files
      .filter((file) => file instanceof ArrayBuffer)
      .forEach((videoFile, index) => {
        const videoBlob = new Blob([videoFile], { type: 'video/*' })
        formData.append(`video${index}`, videoBlob)
      })
    try {
      uploadImage.mutate(files, {
        onSuccess(data) {
          thumbnails.push({ url: String(data.data), type: ThumbnailResponseTypeEnum.Image })
        },
      })
    } catch (error) {
      console.log(error)
    }
    return { thumbnails }
  }

  const handleCreateNewPost = () => {
    handleUploadImage(mediaFiles).then(({ thumbnails }) => {
      console.log(thumbnails)
    })

    // if (content != '') {
    //   try {
    //     createNewPost.mutate(
    //       {
    //         content: content,
    //         thumbnails: mediaFiles.map((src) => {
    //           if (typeof src === 'string') {
    //             return {
    //               url: src,
    //               type: ThumbnailResponseTypeEnum.Image,
    //             }
    //           } else if (src instanceof ArrayBuffer) {
    //             return {
    //               url: URL.createObjectURL(new Blob([src])),
    //               type: ThumbnailResponseTypeEnum.Video,
    //             }
    //           } else {
    //             return {
    //               url: undefined,
    //               type: undefined,
    //             }
    //           }
    //         }),
    //       },
    //       {
    //         onSuccess: (data) => {
    //           if (data.success) {
    //             notification.success({
    //               message: 'Tạo bài viết mới thành công!',
    //               description: 'Bài viết mới đã được tạo thành công.',
    //               placement: 'bottomLeft',
    //             })
    //             props.handleClose()
    //           }
    //         },
    //       },
    //     )
    //   } catch (error) {
    //     console.error('Failed to post comment:', error)
    //   }
    // }
  }

  return (
    <>
      <Form action="community" encType="multipart/form-data" onFinish={handleCreateNewPost}>
        <div className="max-h-[450px] flex flex-col text-white overflow-y-auto p-5 custom-scrollbar gap-5">
          <div className="flex flex-col gap-3">
            <label>Nội dung</label>
            <TextArea className="bg-[#413F4D]" rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="flex flex-col gap-3">
            <label>Hình ảnh</label>
            <input onChange={onMediaChange} type="file" name="file" multiple />
            {/* <div className="flex flex-col gap-2">
              {mediaFiles?.map((link, index) => {
                if (typeof link === 'string') {
                  // eslint-disable-next-line @next/next/no-img-element
                  return <img key={index} src={link} alt="ImageUpload" />
                } else if (link instanceof ArrayBuffer) {
                  const videoUrl = URL.createObjectURL(new Blob([link]))
                  return (
                    <video key={index} src={videoUrl} controls>
                      Your browser does not support the video tag.
                    </video>
                  )
                }
                return null
              })}
            </div> */}
          </div>
        </div>
        <div className="mt-3 p-5">
          <button
            className="rounded-lg w-full text-white bg-purple-700 py-1 font-semibold text-lg cursor-pointer hover:scale-105 text-center"
            type="submit"
          >
            Tạo bài viết
          </button>
        </div>
      </Form>
    </>
  )
}
export default CreatePost
