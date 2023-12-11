import getCurrentUser from '@/actions/getCurrentUser';
import { queryFn } from '@/hooks/useTanstackQuery';
import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';
import React from 'react'
import JobDetailPage from './components/JobDetailClient';

const page = async () => {

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["discussions"],
    queryFn: () => queryFn("/posts", { type: "feed" }),
  });

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return redirect("/");
  }

  return (
    <>
      <JobDetailPage currentUser={currentUser} />
    </>
  )
}

export default page