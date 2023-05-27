import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, rest: NextApiResponse) {
  return rest.status(200).json({ message: 'ok' })
}
