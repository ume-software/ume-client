export interface OrderByProps {
  key: string
  name: string
}
export interface GenderProps {
  key: string | undefined
  name: string
}

export interface OnlineProps {
  key: boolean | undefined
  name: string
}

export interface SubAttributeProps {
  subAttrId: string
  subAttrValue: string
  subAttrViValue?: string
}
export interface AttrbuteProps {
  id: string
  name: string
  subAttr?: SubAttributeProps[]
  [key: string]: any
}
