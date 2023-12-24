import { getEnv } from '~/env'

import { AudioApi, FileApi, ImageApi } from 'ume-upload-service-openapi'

export const uploadImage = async (formData) => {
  try {
    const response = await new ImageApi({
      basePath: getEnv().baseUploadServiceURL,
      isJsonMime: () => true,
    }).uploadImage(formData)
    return {
      data: response,
    }
  } catch (error) {
    console.error('error at catch', error)
  }
}

export const uploadAudio = async (formData) => {
  try {
    const response = await new AudioApi({
      basePath: getEnv().baseUploadServiceURL,
      isJsonMime: () => true,
    }).uploadAudio(undefined, formData)
    return {
      data: response,
    }
  } catch (error) {
    console.error('error at catch', error)
  }
}

export const uploadFile = async (formData) => {
  try {
    const response = await new FileApi({
      basePath: getEnv().baseUploadServiceURL,
      isJsonMime: () => true,
    }).uploadFile(undefined, formData)
    return {
      data: response,
    }
  } catch (error) {
    console.error('error at catch', error)
  }
}
