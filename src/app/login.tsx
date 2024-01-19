'use client';

import React, {createContext, useRef, useState} from "react";
import LoginModal, {LoginModalType} from "@/components/login";


interface LoginContextProps {
  account: null,
  setAccount: (account: any) => void,
  login: () => void
}

const LoginContext= createContext<LoginContextProps>({
  account: null,
  setAccount: (account: any) => {},
  login: () => {}
})

export { LoginContext };

interface LoginContextProviderProps {
  children: React.ReactNode
}

export default function LoginContextProvider({children}: LoginContextProviderProps) {

  const loginModalRef = useRef<LoginModalType>(null);

  const [account, setAccount] = useState(null);

  const context = {
    account: account,
    setAccount: (acc: any) => {
      setAccount(acc);
    },
    login: () => {
      loginModalRef?.current?.login()
    }
  }
  return (
      <LoginContext.Provider value={context} >
        {children}
        <LoginModal ref={loginModalRef} />
      </LoginContext.Provider>
  )
}