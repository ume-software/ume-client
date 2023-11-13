import { useEffect } from 'react'

import { trpc } from '~/utils/trpc'

export const LogoutPage = () => {
  const util = trpc.useContext()

  useEffect(() => {
    util.refetchQueries(['identity.identityInfo'])
  }, [util])
  return <></>
}
