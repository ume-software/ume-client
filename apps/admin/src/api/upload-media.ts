import { getEnv } from '~/env'

import { ImageApi } from 'ume-service-openapi'

export const uploadImageVoucher = async (formData) => {
  try {
    const response = await new ImageApi({
      basePath: getEnv().baseUploadFileURL,
      isJsonMime: () => true,
    }).uploadImage(undefined, formData)
    return {
      data: response,
    }
  } catch (error) {
    throw error
  }
}

export const uploadImageServices = async (formData) => {
  try {
    const response = await new ImageApi({
      basePath: getEnv().baseUploadFileURL,
      isJsonMime: () => true,
    }).uploadImage(undefined, formData)
    return {
      data: response,
    }
  } catch (error) {
    throw error
  }
}

export const uploadImageAdminAccount = async (formData) => {
  try {
    const response = await new ImageApi({
      basePath: getEnv().baseUploadFileURL,
      isJsonMime: () => true,
    }).uploadImage(undefined, formData)
    return {
      data: response,
    }
  } catch (error) {
    throw error
  }
}

export const uploadBannerImage = async (formData) => {
  try {
    const response = await new ImageApi({
      basePath: getEnv().baseUploadFileURL,
      isJsonMime: () => true,
    }).uploadImage(undefined, formData)
    return {
      data: response,
    }
  } catch (error) {
    throw error
  }
}
