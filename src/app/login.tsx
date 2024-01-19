'use client';

import React, {createContext, useRef, useState} from "react";
import LoginModal, {LoginModalType} from "@/components/login";
import {useWalletContext} from "@/context/wallet";


interface LoginContextProps {
  login: () => void
}

const LoginContext = createContext<LoginContextProps>({
  login: () => {
  }
})

export {LoginContext};

interface LoginContextProviderProps {
  children: React.ReactNode
}

export default function LoginContextProvider({children}: LoginContextProviderProps) {

  const loginModalRef = useRef<LoginModalType>(null);
  const {login, isLoggedIn} = useWalletContext();

  const [account, setAccount] = useState(null);

  const context = {
    login: () => {
      if(!isLoggedIn) {
        loginModalRef?.current?.login();
      } else {
        console.log('Payment');
      }
    }
  }

  const handleLogin = async (email: string) => {
    await login(email)
    loginModalRef?.current?.close();
  }
  return (
      <LoginContext.Provider value={context}>
        {children}
        <LoginModal ref={loginModalRef} onSubmit={handleLogin}/>
      </LoginContext.Provider>
  )
}