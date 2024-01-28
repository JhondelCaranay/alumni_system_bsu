import { GetCurrentUserType } from '@/actions/getCurrentUser';
import { Loader2 } from '@/components/ui/loader';
import { useQueryProcessor } from '@/hooks/useTanstackQuery';
import { GroupChatMessageSchemaType } from '@/schema/groupchat-message';
import { GroupChatSchemaType } from '@/schema/groupchats';
import React from 'react'
import InboxConversationItem from './InboxConversationItem';
import { useInboxGroupchatSocket } from '@/hooks/useInboxGroupchatSocket';
import { ConversationSchemaType } from '@/schema/conversation';
import { DirectMessage } from '@prisma/client';
import { UserWithProfile } from '@/types/types';
import { MessageSquareDashed } from 'lucide-react';
import { useInboxConversationSocket } from '@/hooks/useInboxConversationSocket';

type InboxConversationProps = {
  currentUser: GetCurrentUserType;
};

const InboxConversation:React.FC<InboxConversationProps> = ({currentUser}) => {

  const inboxConversationKey = `inbox-conversation:${currentUser?.id}:sort`

  useInboxConversationSocket({
    queryKey:  ["conversations", currentUser?.id],
    inboxKey: inboxConversationKey
  })
  
  const inboxes = useQueryProcessor<
    (ConversationSchemaType & { participants: UserWithProfile[], messages: DirectMessage[] })[]
  >("/conversations", { userId: currentUser?.id }, ["conversations", currentUser?.id], {
    enabled: !!currentUser?.id,
  });

  return (
    <div className="flex flex-col">
    {(() => {
      if (inboxes.status === "pending" || inboxes.isFetching) {
        return (
          <Loader2
            size={30}
            className="mx-auto mt-20"
            color="#3498db"
          ></Loader2>
        );
      }

      if (inboxes.status === "error") {
        return <div>errror...</div>;
      }

      if (inboxes.data.length <= 0) {
        return <div className='text-center font-semibold m-10 text-zinc-500 flex items-center justify-center gap-x-3'> <MessageSquareDashed className="w-10 h-10" />{" "} No messages yet</div>;
      }

      return inboxes.data.map((inbox) => (
        <InboxConversationItem data={inbox} key={inbox?.id} currentUser={currentUser} />
      ));
      
    })()}
  </div>
  )
}

export default InboxConversation