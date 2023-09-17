import { getEnv } from '~/env'

import { AudioApi, FileApi, ImageApi } from 'ume-service-openapi'

export const uploadImageBooking = async (formData) => {
  console.log('formdata=====>', formData)

  try {
    const response = await new ImageApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).uploadImage(undefined, formData)
    return {
      data: response,
    }
  } catch (error) {
    console.log('error at catch', error)
  }
}

export const uploadAudioBooking = async (formData) => {
  try {
    const response = await new AudioApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).uploadAudio(undefined, formData)
    return {
      data: response,
    }
  } catch (error) {
    console.log('error at catch', error)
  }
}

export const uploadFileBooking = async (formData) => {
  try {
    const response = await new FileApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).uploadFile(formData)
    return {
      data: response,
    }
  } catch (error) {
    console.log('error at catch', error)
  }
}
