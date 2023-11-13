import BidvLogo from 'public/bidv-logo.png'
import ImgForEmpty from 'public/img-for-empty.png'
import MomoLogo from 'public/momo-logo.png'
import TpbankLogo from 'public/tpbank-logo.png'
import VnPayLogo from 'public/vnpay-logo.png'
import ZaloPayLogo from 'public/zalopay-logo.png'

import { StaticImageData } from 'next/legacy/image'
import { UserPaymentSystemRequestPlatformEnum } from 'ume-service-openapi'

interface PaymentPlatform {
  key: string
  imgSrc: StaticImageData
}
export const paymentPlat: PaymentPlatform[] = [
  { key: UserPaymentSystemRequestPlatformEnum.Momo, imgSrc: MomoLogo },
  { key: UserPaymentSystemRequestPlatformEnum.Bidv, imgSrc: BidvLogo },
  { key: UserPaymentSystemRequestPlatformEnum.Tpb, imgSrc: TpbankLogo },
  { key: UserPaymentSystemRequestPlatformEnum.Vnpay, imgSrc: VnPayLogo },
  { key: UserPaymentSystemRequestPlatformEnum.Zalopay, imgSrc: ZaloPayLogo },
]
