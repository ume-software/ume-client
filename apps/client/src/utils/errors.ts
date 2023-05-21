import { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc'

export function getTRPCErrorTypeFromErrorStatus(errorStatus): TRPC_ERROR_CODE_KEY {
  if (errorStatus == '400') {
    return 'BAD_REQUEST'
  } else if (errorStatus == '401') {
    return 'UNAUTHORIZED'
  } else if (errorStatus == '403') {
    return 'FORBIDDEN'
  } else if (errorStatus == '404') {
    return 'NOT_FOUND'
  } else if (errorStatus == '408') {
    return 'TIMEOUT'
  } else {
    return 'INTERNAL_SERVER_ERROR'
  }
}
