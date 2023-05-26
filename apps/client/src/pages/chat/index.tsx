import dynamic from 'next/dynamic'

const Chat = dynamic(() => import('~/containers/chat/chat.container'), {
    ssr: false,
})

const ChatPage = (props) => {
    return <Chat {...props} />
}

export default ChatPage
