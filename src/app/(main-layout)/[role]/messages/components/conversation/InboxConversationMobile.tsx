import { GetCurrentUserType } from '@/actions/getCurrentUser';
import { Hint } from '@/components/hint';
import { Loader2 } from '@/components/ui/loader';
import { useQueryProcessor } from '@/hooks/useTanstackQuery';
import { GroupChatMessageSchemaType } from '@/schema/groupchat-message';
import { GroupChatSchemaType } from '@/schema/groupchats';
import React from 'react'
import InboxConversationItemMobile from './InboxConversationItemMobile';
import { useInboxGroupchatSocket } from '@/hooks/useInboxGroupchatSocket';
import { ConversationSchemaType } from '@/schema/conversation';
import { UserWithProfile } from '@/types/types';
import { DirectMessage } from '@prisma/client';
import { useInboxConversationSocket } from '@/hooks/useInboxConversationSocket';


type Props = {
    currentUser: GetCurrentUserType;
  };

const InboxConversationMobile:React.FC<Props> = ({currentUser}) => {

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

          return inboxes.data.map((inbox) => {
            const otherUser = inbox?.participants?.find((user) => user.id != currentUser?.id)
            return <Hint label={`${otherUser?.profile.firstname} ${otherUser?.profile.lastname} `} side="right" key={inbox.id}>
              <InboxConversationItemMobile data={inbox} currentUser={currentUser} />
            </Hint>
          });
        })()}
      </div>
  )
}

export default InboxConversationMobile