'use client';

import Image from "next/image";
import Link from "next/link";
import {useContext, useEffect} from "react";
import {LoginContext} from "@/app/login";
import {useWalletContext} from "@/context/wallet";
import Avatar from "react-avatar";


export default function Header() {

  const loginContext = useContext(LoginContext);
  const {isLoggedIn, username, logout} = useWalletContext();

  return (
      <div
          className="border-b-[1px] h-[72px] flex flex-row items-center px-[32px] justify-between sticky top-0 bg-[#FFFFFF]">
        <div className="flex flex-row items-center">
          <Link href="/">
            <Image src={"logo.svg"} alt="logo" width={135} height={37}/>
          </Link>
          <span className="text-[#C3C3C3] ml-[16px]">Powered by Aave</span>
        </div>

        <div className="flex flex-row items-center">
          <button
              className="w-[133px] h-[44px] rounded-[100px] bg-[#1A1A1A] text-[#FFF] flex flex-row items-center justify-center"
              onClick={loginContext.login}>
            <Image className="mr-[8px]" src="subscribe.svg" alt="subscribe" width={12} height={12}/>
            Subscribe
          </button>

          {
            isLoggedIn ? (
                <button onClick={logout}>
                  <Avatar className={"ml-[8px]"} value={username?.slice(0, 2)?.toUpperCase()}
                          size={'44px'} round={"50%"}/>
                </button>
            ) : null
          }
        </div>
      </div>
  )
}