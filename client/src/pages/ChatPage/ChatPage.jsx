import React,{ useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box } from '@chakra-ui/layout'
import backgroundImage from '../../image/background.png'
import SideDrawer from '../../components/SideDrawer'
// import Mychats from '../../components/MyChats'
import MyChats from '../../components/MyChats'
import ChatBox from '../../components/ChatBox'
const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState()
  return (
    <div className='h-screen w-screen bg-no-repeat bg-cover bg-center' style={{ backgroundImage: `url(${backgroundImage})` }}>
      {user && <SideDrawer />}
      <Box display="flex" justifyContent="space-between" w="100%" p="10px">
        {user && <MyChats fetchAgain={fetchAgain}/>}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      </Box>
    </div>
  )
}

export default ChatPage