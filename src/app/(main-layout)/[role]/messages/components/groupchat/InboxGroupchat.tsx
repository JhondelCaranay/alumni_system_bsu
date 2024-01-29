import { GetCurrentUserType } from '@/actions/getCurrentUser';
import { Loader2 } from '@/components/ui/loader';
import { useQueryProcessor } from '@/hooks/useTanstackQuery';
import { GroupChatMessageSchemaType } from '@/schema/groupchat-message';
import { GroupChatSchemaType } from '@/schema/groupchats';
import React, { useEffect } from 'react'
import InboxItem from './InboxGroupchatItem';
import { useInboxGroupchatSocket } from '@/hooks/useInboxGroupchatSocket';
import { MessageSquareDashed } from 'lucide-react';

type InboxGroupchatProps = {
  currentUser: GetCurrentUserType;
};

const InboxGroupchat:React.FC<InboxGroupchatProps> = ({currentUser}) => {

  const inboxGroupchatKey = `inbox-groupchat:${currentUser?.id}:sort`

  useInboxGroupchatSocket({
    queryKey:  ["groupchats", currentUser?.id],
    inboxKey: inboxGroupchatKey
  })
  
  const inboxes = useQueryProcessor<
    (GroupChatSchemaType & { messages: GroupChatMessageSchemaType[] })[]
  >("/groupchats", { userId: currentUser?.id }, ["groupchats", currentUser?.id], {
    enabled: !!currentUser?.id,
  });

  useEffect(() => {
    inboxes.refetch()
  }, [])
  
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
        <InboxItem data={inbox} key={inbox?.id} />
      ));
    })()}
  </div>
  )
}

export default InboxGroupchat