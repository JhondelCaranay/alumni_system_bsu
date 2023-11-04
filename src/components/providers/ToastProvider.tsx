import {Toaster} from "react-hot-toast"
import { Toaster as ShadcnToaster } from "@/components/ui/toaster"
import React from 'react'

const ToastProvider = () => {
  return (
    <>
      <Toaster />
      <ShadcnToaster />
    </>
  )
}

export default ToastProvider