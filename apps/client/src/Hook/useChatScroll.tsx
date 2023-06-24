import { useEffect } from 'react'

function useChatScroll(divRef, newMessage) {
  useEffect(() => {
    if (divRef.current) {
      const container = divRef.current
      container.scrollTop = container?.scrollHeight
    }
  }, [newMessage])
}
export default useChatScroll
