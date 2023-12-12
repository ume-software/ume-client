export enum RechargeEnum {
  REDIRECT_URL = 'REDIRECT_URL',
  QR = 'QR',
}

export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  PRIVATE = 'PRIVATE',
}

export enum MenuModalEnum {
  SERVICE = 'SERVICE',
  ATTRIBUTE = 'ATTRIBUTE',
  SUB_ATTRIBUTE = 'SUB_ATTRIBUTE',
}

export enum ActionEnum {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  WITHDRAW = 'WITHDRAW',
  CANCEL_WITHDRAW_REQ = ' CANCEL_WITHDRAW_REQ',
  DELETE_WITHDRAW_ACC = ' DELETE_WITHDRAW_ACC',
  DONATE = 'DONATE',
  END_SOON = 'END_SOON',
}

export enum ComplainEnum {
  COMPLAIN_TO_ME = 'COMPLAIN_TO_ME',
  COMPLAIN_OF_ME = 'COMPLAIN_OF_ME',
}

export enum BookingHistoryEnum {
  BOOKING_FOR_USER = 'BOOKING_FOR_USER',
  BOOKING_FOR_PROVIDER = 'BOOKING_FOR_PROVIDER',
}

export enum BookingHistoryStatusEnum {
  PROVIDER_ACCEPT = 'PROVIDER_ACCEPT',
  PROVIDER_CANCEL = 'PROVIDER_CANCEL',
  USER_FINISH_SOON = 'USER_FINISH_SOON',
}
