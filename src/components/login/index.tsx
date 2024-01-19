'use client';

import Modal, {ModelType} from "@/components/model";
import styles from './index.module.scss';
import classNames from "classnames";
import React, {useImperativeHandle, useRef} from "react";

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

  return (
    <Modal ref={modalRef} onClose={handleClose}>
      <div className={styles['login-modal']}>
        <h2 className="text-[28px] leading-[32px] font-bold	">What is your email ?</h2>

        <input
          type={"email"}
          placeholder={"Type your email..."}
          className={"w-full h-[56px] bg-[#F7F3FD] border-[1px] border-[#8D50DB] px-[16px] rounded-[12px] mt-[42px]"}
        />

        <div className="flex flex-row justify-end mt-[42px]">
          <OperationButton className="bg-[#E2C8F1] mr-[12px]" onClick={handleClose}>Close</OperationButton>
          <OperationButton className="bg-[#333333] text-white">Login</OperationButton>
        </div>
      </div>
    </Modal>
  )
}

export default React.forwardRef<LoginModalType>(LoginModal)