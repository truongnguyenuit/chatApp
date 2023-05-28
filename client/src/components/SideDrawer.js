import React, { useState, useEffect } from 'react'
import { Box } from '@chakra-ui/layout'
import {
  Tooltip, HStack, Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Spinner,
  useToast
} from '@chakra-ui/react'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from '@chakra-ui/react';
import { ChatState } from '../Context/ChatProvider';
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { useNavigate } from "react-router-dom";
import ProfileModal from './ProfileModal'
import ChatLoading from './ChatLoading';
import UserListItem from './userAvatar/UserListItem';
import axios from 'axios'
import setAuthToken from '../untils/setAuthToken';
import io from "socket.io-client";
import { ENDPOINT } from './../pages/AuthPage/AuthPage';
var socket, selectedChatCompare;

const SideDrawer = () => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate()

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/")
  }

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      setAuthToken(user.token)

      const { data } = await axios.get(`${ENDPOINT}/api/auth?search=${search}`);

      setLoading(false);
      setSearchResult(data);

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {

    try {
      setLoadingChat(true);
      setAuthToken(user.token)
      const { data } = await axios.post(`${ENDPOINT}/api/chat`, { userId });
      
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats])
        socket.emit("have new connect", userId)
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    socket = io(ENDPOINT);
  }, []);
  return (
    <>
      <Box
        display='flex'
        flexDirection="row"
        justifyContent='space-between'
        alignItems='center'
        bg="white"
        w="10 0%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
          <Button variant="ghost" onClick={onOpen}>
            <HStack>
              <span className="fa-solid fa-magnifying-glass"></span>
              <Text d={{ base: "none", md: 'flex' }} px="4">Search User</Text>
            </HStack>
          </Button>
        </Tooltip>

        <Text fontSize='2xl' fontFamily="Work sans" mb='0px'>
          Talk-A-Tive
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon fontSize="2xl" m="1" />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size='sm' cursor="pointer" name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={() => logOutHandler()}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>

      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            Search User
          </DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search User"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                onClick={handleSearch}
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>

  )
}

export default SideDrawer