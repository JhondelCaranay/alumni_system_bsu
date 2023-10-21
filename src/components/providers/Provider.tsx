"use client"
import React from 'react'
import QueryProvider from './QueryProvider'
import ToastProvider from './ToastProvider'
import { SessionProvider } from 'next-auth/react'
import ModalProvider from './ModalProvider'
import { ThemeProvider } from 'next-themes'

const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ToastProvider />
      <ThemeProvider attribute='class' defaultTheme='system' enableSystem={true} storageKey='bsu-alumni-system'>
      <QueryProvider>
      <SessionProvider>
        <ModalProvider />
          {children}
      </SessionProvider>
      </QueryProvider>
      </ThemeProvider>
    </>
  );
};

export default Provider;
