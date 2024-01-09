import React from 'react'
import ForumDetailClient from './components/ForumDetailClient'
import getCurrentUser from '@/actions/getCurrentUser';
import { redirect } from 'next/navigation';

const page = async () => {

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return redirect("/");
    }
  return (
    <ForumDetailClient currentUser={currentUser} />
  )
}

export default page