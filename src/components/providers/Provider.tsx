"use client"
import React from 'react'
import QueryProvider from './QueryProvider'
import ToastProvider from './ToastProvider'
import { SessionProvider } from 'next-auth/react'
import ModalProvider from './ModalProvider'

const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ToastProvider />
      <QueryProvider>
      <SessionProvider>
        <ModalProvider />
          {children}
      </SessionProvider>
        <SessionProvider>{children}</SessionProvider>
      </QueryProvider>
    </>
  );
};

export default Provider;
