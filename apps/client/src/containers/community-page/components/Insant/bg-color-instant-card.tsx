export interface BackgroundColorProps {
  key: string
  color: string
}

export const backgroundColors: BackgroundColorProps[] = [
  { key: '1', color: 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500' },
  { key: '2', color: 'bg-gradient-to-r from-blue-400 via-blue-500 to-teal-400' },
  { key: '3', color: 'bg-gradient-to-r from-green-400 via-green-500 to-yellow-400' },
  { key: '4', color: 'bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500' },
]
