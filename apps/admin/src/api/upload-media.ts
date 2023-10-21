import { getEnv } from '~/env'

import { AudioApi, FileApi, ImageApi } from 'ume-service-openapi'

export const uploadImageVoucher = async (formData) => {
  try {
    const response = await new ImageApi({
      basePath: getEnv().baseUmeServiceURL,
      isJsonMime: () => true,
    }).uploadImage(undefined, formData)
    return {
      data: response,
    }
  } catch (error) {}
}
