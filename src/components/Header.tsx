'use client';

import Image from "next/image";
import Link from "next/link";
import {useContext} from "react";
import {LoginContext} from "@/app/login";


export default function Header() {

  const loginContext = useContext(LoginContext);

  return (
      <div className="border-b-[1px] h-[72px] flex flex-row items-center px-[32px] justify-between sticky top-0 bg-[#FFFFFF]">
        <div className="flex flex-row items-center">
          <Link href="/">
            <Image src={"logo.svg"} alt="logo" width={135} height={37} />
          </Link>
          <span className="text-[#C3C3C3] ml-[16px]">Powered by Aave</span>
        </div>

        <div>
          <button className="w-[133px] h-[44px] rounded-[100px] bg-[#1A1A1A] text-[#FFF] flex flex-row items-center justify-center" onClick={loginContext.login}>
            <Image className="mr-[8px]" src="subscribe.svg" alt="subscribe" width={12} height={12} />
            Subscribe
          </button>
        </div>
      </div>
  )
}