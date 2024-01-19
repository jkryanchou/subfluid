import Image from "next/image";
import React from "react";


export default function ModalLoading() {
  return (
      <div className={"flex flex-col items-center justify-center"}>
        <Image className="animate-spin-fast	mt-[40px]" src="/logo-icon.svg" alt="logo" width={58}
               height={58}/>

        <div className="flex flex-row items-center mb-[20px] mt-[77px]">
          <Image src="/icon/powered.svg" alt="powered" width={22} height={22}/>
          <span className="text-[#C3C3C3] text-[18px] ml-[8px]">Powered by Aave</span>
        </div>
      </div>
  )
}