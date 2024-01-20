'use client';

import React, {createContext, useRef, useState} from "react";
import LoginModal, {LoginModalType} from "@/components/login";
import {useWalletContext} from "@/context/wallet";
import SubscribeModal, {SubscribeModalType} from "@/components/subscribe";


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
  const subscribeModalRef = useRef<SubscribeModalType>(null);
  const {login, isLoggedIn} = useWalletContext();

  const [account, setAccount] = useState(null);

  const context = {
    login: () => {
      if (!isLoggedIn) {
        loginModalRef?.current?.login();
      } else {
        subscribeModalRef?.current?.open();
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
        <SubscribeModal ref={subscribeModalRef}/>
      </LoginContext.Provider>
  )
}