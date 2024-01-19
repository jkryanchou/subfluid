'use client';

import Modal, {ModelType} from "@/components/model";
import classNames from "classnames";
import React, {useImperativeHandle, useRef, useState} from "react";
import Image from "next/image";
import {connectSolProvider} from "@lit-protocol/auth-browser/src/lib/chains/sol";
import ModalLoading from "@/components/model/loading";

function OperationButton(
    {
      className,
      children,
      ...rest
    }: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
) {
  return (
      <button
          className={classNames("w-[106px] h-[44px] rounded-[12px] font-semibold text-[14px]", className)}
          {...rest}
      >
        {children}
      </button>
  )
}

interface LoginModalProps {
  onSubmit: (email: string) => Promise<void>
}

export declare interface LoginModalType {
  login: () => void,
  close: () => void
}

function LoginModal({onSubmit}: LoginModalProps, ref: React.Ref<LoginModalType>) {
  const modalRef = useRef<ModelType>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    modalRef?.current?.close();
  }

  useImperativeHandle(ref, () => {
    return {
      login: () => {
        modalRef?.current?.show();
      },
      close: () => {
        modalRef?.current?.close();
      }
    }
  }, [modalRef])


  const renderLoading = () => <ModalLoading/>

  const renderContent = () => {
    return (
        <>
          <h2 className="text-[28px] leading-[32px] font-bold	">What is your email ?</h2>

          <form onSubmit={async (event) => {
            try {
              event.preventDefault();
              event.stopPropagation();
              const data = new FormData(event.currentTarget);
              const email = data.get("email")
              if (email) {
                setLoading(true);
                await onSubmit(email.toString());
                setLoading(false);
              }
            } catch (ex) {
              setLoading(false);
            }
          }}>
            <input
                type="email"
                name="email"
                placeholder={"Type your email..."}
                className={"w-full h-[56px] bg-[#F7F3FD] border-[1px] border-[#8D50DB] px-[16px] rounded-[12px] mt-[42px]"}
            />

            <div className="flex flex-row justify-end mt-[42px]">
              <OperationButton className="bg-[#E2C8F1] mr-[12px]"
                               onClick={handleClose}>Close</OperationButton>
              <OperationButton className="bg-[#333333] text-white"
                               type="submit">Login</OperationButton>
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

export default React.forwardRef<LoginModalType, LoginModalProps>(LoginModal)