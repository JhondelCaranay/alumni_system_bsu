"use client";
import EmojiPicker from "@/components/EmojiPicker";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { mutationFn, useMutateProcessor } from "@/hooks/useTanstackQuery";
import {
  CreateGroupChatMessageSchema,
  CreateGroupChatMessageSchemaType,
} from "@/schema/groupchat-message";
import { GroupChatSchemaType } from "@/schema/groupchats";
import { UserWithProfile } from "@/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Paperclip } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type ChatFooterProps = {
  data: GroupChatSchemaType & { users: UserWithProfile[] };
};

const ChatFooter: React.FC<ChatFooterProps> = ({ data }) => {
  const form = useForm<CreateGroupChatMessageSchemaType>({
    resolver: zodResolver(CreateGroupChatMessageSchema),
    defaultValues: {
      groupChatId: data.id,
      message: "",
    },
    mode: "all",
  });

  // const sendMessage = useMutateProcessor<CreateGroupChatMessageSchemaType, unknown>(`/groupchat/${data.id}/messages`, null,'POST', ['groupchat', data.id, 'messages'])
  const sendMessage = useMutation({
    mutationFn: (value: CreateGroupChatMessageSchemaType) =>
      mutationFn(`/groupchat/${data.id}/messages`, null, "POST", value),
  });

  const onSubmit: SubmitHandler<CreateGroupChatMessageSchemaType> = (values) => {
    sendMessage.mutate(values, {
      onSuccess(data, variables, context) {
        const chatbody = document.querySelector('#chatbody');
        if(chatbody) {
          chatbody.scrollTop = chatbody.scrollHeight;

        }
        form.setValue('message', '')
      },
      onError(error, variables, context) {
        console.error(error)
      },
    })
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex flex-col p-2 py-5 gap-y-5"
      >
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem className=" border-t border-b">
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none"
                  placeholder={`Write your thoughts here...`}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center px-2">
          <div className="flex gap-x-5">
            {/* <Paperclip /> */}
            <EmojiPicker
              onChange={(emoji) =>
                form.setValue(
                  "message",
                  `${form.getValues("message")}${emoji.native}`
                )
              }
            />
          </div>
          <div>
            <Button className="rounded-2xl text-white">Send</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ChatFooter;
