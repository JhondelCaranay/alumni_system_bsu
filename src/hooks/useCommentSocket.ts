import { useSocket } from "@/components/providers/SocketProvider";
import { CommentSchemaType } from "@/schema/comment";
import { UserWithProfile } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type ChatSocketProps = {
    postId:string;
    queryKey: (string| any)[];
}

export const useCommentSocket = ({postId, queryKey}: ChatSocketProps) => {

    const {socket,isConnected} = useSocket();
    const queryClient = useQueryClient();
    const router = useRouter()

    useEffect(() => {
        if(!socket) {
            return;
        }
        socket.on(postId, (data:CommentSchemaType & {user:UserWithProfile}) => {
            console.log('new comments in key:', postId, data)
        })

        return () => {
            socket.off(postId)
            // socket.off(updateKey)
        }
    }, [])
}