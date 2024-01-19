'use client';

import Modal, {ModelType} from "@/components/model";
import React, {Ref, useCallback, useEffect, useImperativeHandle, useRef, useState} from "react";
import Image from "next/image";
import styles from './index.module.scss';
import Link from "next/link";
import {useWalletContext} from "@/context/wallet";
import {AlchemyTokenAbi, tokenContractAddress} from "@/config/token-contract";
import {encodeFunctionData, Hash} from "viem";
import {mod} from "@noble/curves/abstract/modular";


interface SubscribeModalProps {
}

export declare interface SubscribeModalType {
  open: () => void,
  close: () => void
}

interface PlanItem {
  name: string,
  price: string,
  features: string[]
}

function Plan({plan, active}: {plan: PlanItem, active?: boolean}) {
  return (
      <label className={styles['plan-item']}>
        <input type="radio" name="plan" value={plan.name} defaultChecked={active} />
        <div className="plan-selector w-[218px] h-[291px] mx-[12px] flex flex-col rounded-[12px] p-[20px] border-[2px] border-[#D6D6D6]">
          <h3 className="text-[18px] font-bold leading-[22px] text-[#333333]">{plan.name}</h3>
          <p className="text-[14px] text-[#8D50DB] leading-[16px] font-semibold mt-[6px]">{plan.price}</p>

          <div className="text-[12px] text-[#909090] mt-[6px]">
            {
              plan.features.map((item, index) => (
                  <div className="mt-[12px] leading-[14px] flex flex-row items-start" key={`${item}-${index}`}>
                    <Image className="mr-[5px]" src={"icon/check.svg"} alt={"feature"} width={15} height={15} />
                    <span>{item}</span>
                  </div>
              ))
            }
          </div>
        </div>
      </label>
  )
}

function SubscribeModal(props: any, ref: Ref<SubscribeModalType>) {
  const modalRef = useRef<ModelType>(null);
  const [subscribed, setSubscribed] = useState<boolean>(false);
  const [currentPlanName, setCurrentPlanName] = useState<string>('None');
  const { provider } = useWalletContext();

  const plans: PlanItem[] = [
    {
      name: 'Monthly',
      price: '33 GHO/month',
      features: [
          'Lörem ipsum saska prostat. Suprasm adöbel nuheten fabel tratres. ',
          'Lörem ipsum saska prostat.',
          'Lörem ipsum saska prostat. Suprasm adöbel nuheten fabel tratres. '
      ]
    },
    {
      name: 'Annual',
      price: '66 GHO/month',
      features: [
          'Lörem ipsum saska prostat. Suprasm adöbel nuheten fabel tratres. ',
          'Lörem ipsum saska prostat.',
          'Lörem ipsum saska prostat. Suprasm adöbel nuheten fabel tratres. ',
          'Lörem ipsum saska prostat. Suprasm adöbel nuheten fabel tratres. '
      ]
    },
    {
      name: 'None',
      price: 'Free',
      features: [
          'Lörem ipsum saska prostat. Suprasm adöbel nuheten fabel tratres. ',
          'Lörem ipsum saska prostat.',
          'Lörem ipsum saska prostat. Suprasm adöbel nuheten fabel tratres. ',
          'Lörem ipsum saska prostat. Suprasm adöbel nuheten fabel tratres. '
      ]
    }
  ]

  useEffect(() => {
    modalRef?.current?.show();
  }, [modalRef])

  const currentPlan = plans.find(item => item.name === currentPlanName);


  useImperativeHandle(ref, () => {
    return {
      open: () => {
        modalRef?.current?.show();
      },
      close: () => {
        modalRef?.current?.close()
      }
    }
  })

  const handleClose = () => {
    modalRef?.current?.close();
  }

  const handleSubscribe = useCallback(async () => {
    if (!provider) {
      throw new Error("Provider not initialized");
    }
    const uoHash = await provider.sendUserOperation({
      target: tokenContractAddress,
      data: encodeFunctionData({
        abi: AlchemyTokenAbi,
        functionName: "mint",
        args: [await provider.getAddress()],
      }),
    });

    console.log('transaction hash: ', uoHash.hash)
    let txHash: Hash;
    try {
      txHash = await provider.waitForUserOperationTransaction(uoHash.hash);
      console.log('txHash', txHash);
    } catch (e) {
      return;
    }

    setSubscribed(true);
  }, [provider]);

  if(subscribed) {
    return (
        <Modal ref={modalRef} closable={false}>
          <div className="flex flex-col items-center">
            <div className="flex flex-row justify-between w-full pb-[20px] border-b-[1px] border-[#D6D6D6]">
              <div className="w-full flex flex-row items-center">
                <Image src={"/article/avatar.png"} alt={'avatar'} width={32} height={32}/>
                <p className="ml-[12px]">ribmaster</p>
              </div>

              <div className="flex flex-row items-center">
                <span className="text-[20px] text-[#333333] font-bold">{currentPlan?.name}</span>
                <span className="ml-[16px] text-[#8D50DB] font-semibold text-[14px]">{currentPlan?.price}</span>
              </div>
            </div>

            <div className="mt-[80px] flex flex-col items-center">
              <Image src={"icon/success.svg"} alt={"success"} width={64} height={64} />
              <p className="font-bold text-[28px] leading-[34px] mt-[16px]">Subscribed</p>

              <button className={"w-[300px] h-[44px] rounded-[12px] bg-[#333333] text-[#FFFFFF] text-[14px] leading-[16px] mt-[56px]"} onClick={handleClose}>
                Continue reading
              </button>

              <div className="flex flex-row items-center mt-[95px]">
                <Image src="/icon/powered.svg" alt="powered" width={22} height={22}/>
                <span className="text-[#C3C3C3] text-[18px] ml-[8px]">Powered by Aave</span>
              </div>
            </div>

          </div>
        </Modal>
    )
  }

  return (
      <Modal ref={modalRef} contentClassName="!w-[800px]">
        <div className="flex flex-col items-center">
          <div className="w-full flex flex-col items-center">
            <Image src={"/article/avatar.png"} alt={'avatar'} width={64} height={64}/>
            <p className="mt-[8px]">ribmaster</p>
          </div>

          <div className="flex flex-row justify-center mt-[36px]">
            {plans.map(item => <Plan key={item.name} plan={item} active={item.name === currentPlanName} />)}
          </div>

          <button className={"w-[300px] h-[44px] rounded-[12px] bg-[#333333] text-[#FFFFFF] text-[14px] leading-[16px] mt-[36px]"} onClick={handleSubscribe}>
            Subscribe
          </button>

          <p className="text-[#C3C3C3] mt-[12px] text-[12px] leading-[14px]">
            <span>By registering you agree to Subfluid's</span>
            <Link href={"/"}>Terms of Service</Link>
          </p>
        </div>
      </Modal>
  )
}

export default React.forwardRef<SubscribeModalType, SubscribeModalProps>(SubscribeModal)