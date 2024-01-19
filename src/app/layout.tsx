import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.scss'
import Header from "@/components/Header";
import LoginContextProvider from "@/app/login";

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
        <LoginContextProvider>
          <Header />
          {children}
        </LoginContextProvider>
      </body>
    </html>
  )
}
