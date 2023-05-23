import React from 'react';
import { pathName } from "./pathName";
import AuthPage from "../pages/AuthPage/AuthPage";
import ChatPage from '../pages/ChatPage/ChatPage';
export const configRouter = [
  {
    path: pathName.auth,
    page: <AuthPage />,
    private: false,
    admin: false,
  },
  {
    path: pathName.chat,
    page: <ChatPage/>,
    privat: false,
    admin: false
  }
]