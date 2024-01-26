import React from 'react'
import ChatBox from '../components/ChatBox'
import getCurrentUser from '@/actions/getCurrentUser';
import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

const page = async () => {
  const currentUser = await getCurrentUser();
  const queryClient = new QueryClient();
  if (!currentUser) {
    return redirect("/");
  }
  return (
    <ChatBox currentUser={currentUser} />
  )
}
export default page