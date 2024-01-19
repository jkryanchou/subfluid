'use client';

import React, {Ref, useEffect, useImperativeHandle, useState} from "react";
import styles from './index.module.scss';
import Image from "next/image";
import classNames from "classnames";

export declare interface ModelProps {
  onClose?: () => void
  children: React.ReactNode,
  closable?: boolean,
  contentClassName?: string
}

export declare interface ModelType {
  close: () => void
  show: () => void
}

function Modal({
                 onClose,
                 closable = true,
                 contentClassName,
                 children
               }: ModelProps, ref: Ref<ModelType>) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const container = document.querySelector("body");
    if (!container) {
      return;
    }

    if (visible) {
      container.style.overflowY = 'hidden';
    } else {
      container.style.overflowY = 'auto';
    }

  }, [visible]);

  useImperativeHandle(ref, () => {
    return {
      close() {
        setVisible(false);
      },
      show() {
        setVisible(true);
      }
    }
  })

  if (!visible) {
    return null;
  }

  return (
      <div className={styles.modal}>
        <div className={styles.overlay}/>
        <div className={classNames(styles.content, contentClassName)}>
          {
            closable ? (
                <button className="p-[20px] absolute top-0 right-0" onClick={() => {
                  if (onClose) {
                    onClose()
                  } else {
                    setVisible(false);
                  }
                }}>
                  <Image src={"/icon/model-close.svg"} alt="Close" width={28} height={28}/>
                </button>
            ) : null
          }


          {children}
        </div>
      </div>
  )
}

export default React.forwardRef(Modal)