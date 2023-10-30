import { AddPicture, DeleteFive } from '@icon-park/react'
import { Button, TextArea } from '@ume/ui'
import { uploadAudioBooking, uploadImageBooking } from '~/apis/upload-media'

import { ChangeEvent, FormEvent, useEffect, useId, useState } from 'react'

import { notification } from 'antd'
import { ThumbnailResponseTypeEnum } from 'ume-service-openapi'

import { trpc } from '~/utils/trpc'

interface ThumbnailsProps {
  url: string | undefined
  type: string | undefined
}

const CreatePost = (props: any) => {
  const index = useId()
  const [content, setContent] = useState<string>('')
  const createNewPost = trpc.useMutation(['community.createNewPost'])
  const [mediaFiles, setMediaFiles] = useState<File[] | undefined>()
  const [removeMedia, setRemoveMedia] = useState<boolean>(false)

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement
    if (fileInput.files && fileInput.files.length > 0) {
      const newFiles: File[] = []
      for (let i = 0; i < fileInput.files.length; i++) {
        newFiles.push(fileInput.files[i])
      }
      // setMediaFiles((prevData) => [...(prevData || []), ...newFiles])
      setMediaFiles(newFiles)
      setRemoveMedia(false)
    }
  }

  const handleUploadFiles = async (files: HTMLFormElement) => {
    const thumbnails: ThumbnailsProps[] = []
    const formData = new FormData(files)
    const inputFiles = formData.getAll('files')

    const images = new FormData()
    const videos = new FormData()

    if (!removeMedia) {
      for (const file of inputFiles) {
        if (file instanceof File) {
          if (file.type.startsWith('image/')) {
            images.append('file', file, file.name)
          } else if (file.type.startsWith('video/')) {
            videos.append('file', file, file.name)
          }
        }
      }

      try {
        if (images.getAll('file').length > 0) {
          const responseData = await uploadImageBooking(images)
          if (responseData?.data?.data?.results) {
            responseData?.data?.data?.results.map((image) => {
              thumbnails.push({ url: image, type: ThumbnailResponseTypeEnum.Image })
            })
          }
        }
        if (videos.getAll('file').length > 0) {
          const responseData = await uploadAudioBooking(videos)
          if (responseData?.data?.data?.results) {
            responseData?.data?.data?.results.map((video) => {
              thumbnails.push({ url: video, type: ThumbnailResponseTypeEnum.Video })
            })
          }
        }
      } catch (error) {}
      return { thumbnails }
    } else {
      return { thumbnails: [] }
    }
  }

  const handleCreateNewPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const fileUpload = await handleUploadFiles(e.currentTarget)

    if (!(content == '' && (await fileUpload).thumbnails.length == 0)) {
      try {
        createNewPost.mutate(
          {
            content: content,
            thumbnails: fileUpload.thumbnails,
          },
          {
            onSuccess: (data) => {
              if (data.success) {
                notification.success({
                  message: 'Tạo bài viết mới thành công!',
                  description: 'Bài viết mới đã được tạo thành công.',
                  placement: 'bottomLeft',
                })
                props.handleClose()
              }
            },
          },
        )
      } catch (error) {
        console.error('Failed to post comment:', error)
      }
    }
  }
  useEffect(() => {
    if (removeMedia) {
      setMediaFiles(undefined)
    }
  }, [removeMedia])

  return (
    <>
      <form onSubmit={handleCreateNewPost} className="px-5 py-3">
        <div className="max-h-[450px] flex flex-col text-white overflow-y-auto p-5 custom-scrollbar gap-5">
          <div className="flex flex-col gap-3">
            <label>Nội dung</label>
            <TextArea className="bg-[#413F4D]" rows={5} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <div className="relative flex flex-col gap-3">
            <div className="relative flex items-center justify-between">
              <label>Hình ảnh</label>
              <div className="relative cursor-pointer w-fit">
                {!mediaFiles ? (
                  <label className="z-10 flex items-center justify-start gap-2 p-3 bg-purple-600 rounded-lg hover:bg-gray-700">
                    <AddPicture theme="filled" size="15" fill="#FFFFFF" strokeLinejoin="bevel" />
                    Chọn ảnh
                  </label>
                ) : (
                  <div className="p-2 rounded-full hover:bg-gray-700" onClick={() => setRemoveMedia(true)}>
                    <DeleteFive theme="filled" size="20" fill="#FFFFFF" strokeLinejoin="bevel" />
                  </div>
                )}
                <div className={`absolute w-full h-full top-0 left-0 ${mediaFiles && '-z-10'}`}>
                  <input
                    className="w-full h-full opacity-0"
                    type="file"
                    name="files"
                    onChange={(e) => handleMediaChange(e)}
                    multiple
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {!removeMedia &&
                mediaFiles?.map((file: File) => {
                  if (file.type.startsWith('image/')) {
                    // eslint-disable-next-line @next/next/no-img-element
                    return <img key={index} src={URL.createObjectURL(file)} alt="ImageUpload" />
                  } else if (file.type.startsWith('video/')) {
                    const videoUrl = URL.createObjectURL(file)
                    return (
                      <video key={index} src={videoUrl} controls>
                        Your browser does not support the video tag.
                      </video>
                    )
                  }
                  return null
                })}
            </div>
          </div>
        </div>
        <div className="p-5 mt-3 w-full text-center">
          <Button
            customCSS={`!rounded-2xl w-full min-w-[170px] !text-white py-2 font-semibold text-lg ${
              !(content === '' && !mediaFiles) && 'hover:scale-105'
            }`}
            type="submit"
            isActive={true}
            isOutlinedButton={!(content === '' && !mediaFiles)}
            isLoading={createNewPost.isLoading}
          >
            Tạo bài viết
          </Button>
        </div>
      </form>
    </>
  )
}
export default CreatePost
