export interface OrderByProps {
  key: string
  name: string
}
export interface GenderProps {
  key: string | undefined
  name: string
}
export interface AttrbuteProps {
  id: string
  name: string
  subAttr: string[]
  [key: string]: any
}
