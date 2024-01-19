import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import Header from "@/components/Header";
import LoginContextProvider from "@/app/login";
import React from "react";
import {WalletContextProvider} from "@/context/wallet";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Subfluid',
  description: '',
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
      <body className={inter.className}>
      <WalletContextProvider>
        <LoginContextProvider>
          <Header/>
          {children}
        </LoginContextProvider>
      </WalletContextProvider>
      </body>
    </html>
  )
}
