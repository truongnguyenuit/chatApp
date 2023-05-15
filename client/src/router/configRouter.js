import React from 'react';
import { pathName } from "./pathName";
import AuthPage from "../pages/AuthPage/AuthPage";

export const configRouter = [
  {
    path: pathName.auth,
    page: <AuthPage />,
    private: false,
    admin: false,
  },
]