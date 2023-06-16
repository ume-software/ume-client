import { format, formatDistanceToNow } from 'date-fns'

const TimeFormat = ({ date }) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}
export { TimeFormat }
