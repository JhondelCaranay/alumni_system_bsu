import { queryFn } from '@/hooks/useTanstackQuery';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import React from 'react'
import UserIdPageClient from './components/UserIdPageClient';

type UserIdPageProps = {
    params: {
        userId: string;
    };
}

const UserIdPage:React.FC<UserIdPageProps> = async ({params: {userId}}) => {

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["users", userId],
    queryFn: () => queryFn(`/users/${userId}`),
  });
    
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
        <UserIdPageClient />        
    </HydrationBoundary>
  )
}

export default UserIdPage