import React from 'react'
import AuthForm from '../components/AuthForm'

const LoginPage = () => {
  
  return (
    <div className='flex h-full w-full justify-center items-center bg-[url(/assets/CIT_1.jpg)] bg-cover bg-bottom'>
      <div className='w-full h-full absolute bg-[#000000a2]' />
      <AuthForm />
    </div>
  )
}

export default LoginPage