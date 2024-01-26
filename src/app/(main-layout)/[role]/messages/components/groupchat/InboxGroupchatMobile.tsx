import { GetCurrentUserType } from '@/actions/getCurrentUser';
import { Hint } from '@/components/hint';
import { Loader2 } from '@/components/ui/loader';
import { useQueryProcessor } from '@/hooks/useTanstackQuery';
import { GroupChatMessageSchemaType } from '@/schema/groupchat-message';
import { GroupChatSchemaType } from '@/schema/groupchats';
import React from 'react'
import InboxGroupchatItemMobile from './InboxGroupchatItemMobile';
import { useInboxGroupchatSocket } from '@/hooks/useInboxGroupchatSocket';


type Props = {
    currentUser: GetCurrentUserType;
  };

const InboxGroupchatMobile:React.FC<Props> = ({currentUser}) => {


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

          return inboxes.data.map((inbox) => (
            <Hint label={inbox.name} side="right" key={inbox.id}>
              <InboxGroupchatItemMobile data={inbox} />
            </Hint>
          ));
        })()}
      </div>
  )
}

export default InboxGroupchatMobile