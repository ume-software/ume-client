import { useEffect } from 'react'

function useChatScroll(divRef, newMessage) {
  useEffect(() => {
    if (divRef.current) {
      const container = divRef.current
      container.scrollTop = container?.scrollHeight
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage])
}
export default useChatScroll
