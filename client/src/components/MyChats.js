import React, { useState, useEffect } from 'react'
import { ChatState } from './../Context/ChatProvider';
import { useToast, Box, Button, Stack, Text } from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import axios from 'axios';
// import GroupChatModal from './GroupChatModal';
import ChatLoading from './ChatLoading';
import setAuthToken from '../untils/setAuthToken';
import { getSender } from './../config/chatLogic';
import GroupChatModal from './GroupChatModal';
var socket, selectedChatCompare;
import io from "socket.io-client";
import { ENDPOINT } from './../pages/AuthPage/AuthPage';

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  // const [demo, setDemo] = useState()

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      setAuthToken(user.token)
      const { data } = await axios.get(`${ENDPOINT}/api/chat/`);
      setChats(data.chats)

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      h='89vh'
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >



      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="91%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll" paddingRight="10px">

            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text mb='0px'>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                    {/* {chat.chatName} */}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs" mb='0px'>
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>

    </Box>
  );
};

export default MyChats