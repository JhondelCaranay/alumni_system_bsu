"use client";
import React from "react";
import QueryProvider from "./QueryProvider";
import ToastProvider from "./ToastProvider";
import { SessionProvider } from "next-auth/react";

const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <ToastProvider />
      <QueryProvider>
        <SessionProvider>{children}</SessionProvider>
      </QueryProvider>
    </>
  );
};

export default Provider;
