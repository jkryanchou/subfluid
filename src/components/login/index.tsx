'use client';

import Modal, {ModelType} from "@/components/model";
import classNames from "classnames";
import React, {useImperativeHandle, useRef, useState} from "react";
import Image from "next/image";

function OperationButton({ className, children, ...rest }: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
  return (
      <button
          className={classNames("w-[106px] h-[44px] rounded-[12px] font-semibold text-[14px]", className)}
          {...rest}
      >
        {children}
      </button>
  )
}

export declare interface LoginModalType {
  login: () => void
}

function LoginModal(props: any, ref: React.Ref<LoginModalType>) {
  const modalRef = useRef<ModelType>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    modalRef?.current?.close();
  }

  useImperativeHandle(ref, () => {
    return {
      login: () => {
        console.log('show')
        modalRef?.current?.show();
      }
    }
  }, [modalRef])


  const renderLoading = () => {
    return (
        <div className={"flex flex-col items-center justify-center"}>
          <Image className="animate-spin-fast	mt-[40px]" src="/logo-icon.svg" alt="logo" width={58} height={58} />

          <div className="flex flex-row items-center mb-[20px] mt-[77px]">
            <Image src="/icon/powered.svg" alt="powered" width={22} height={22} />
            <span className="text-[#C3C3C3] text-[18px] ml-[8px]">Powered by Aave</span>
          </div>
        </div>
    )
  }

  const handleSubmit = () => {
    console.log('submit');
  }

  const renderContent = () => {
    return (
        <>
          <h2 className="text-[28px] leading-[32px] font-bold	">What is your email ?</h2>

          <form onSubmit={handleSubmit}>
            <input
                type="email"
                placeholder={"Type your email..."}
                className={"w-full h-[56px] bg-[#F7F3FD] border-[1px] border-[#8D50DB] px-[16px] rounded-[12px] mt-[42px]"}
            />

            <div className="flex flex-row justify-end mt-[42px]">
              <OperationButton className="bg-[#E2C8F1] mr-[12px]" onClick={handleClose}>Close</OperationButton>
              <OperationButton className="bg-[#333333] text-white" type="submit">Login</OperationButton>
            </div>
          </form>
        </>
    )
  }

  return (
    <Modal ref={modalRef} onClose={handleClose} closable={!loading}>
      <div>
        {loading ? renderLoading() : renderContent()}
      </div>
    </Modal>
  )
}

export default React.forwardRef<LoginModalType>(LoginModal)