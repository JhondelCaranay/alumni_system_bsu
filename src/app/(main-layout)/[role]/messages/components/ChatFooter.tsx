"use client";
import EmojiPicker from "@/components/EmojiPicker";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const ChatFooter = () => {
  const form = useForm({});

  const onSubmit: SubmitHandler<any> = () => {};

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        autoComplete="off"
        className="flex flex-col p-2 py-5 gap-y-5"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className=" border-t border-b">
              <FormControl>
                <Textarea
                  className="resize-none"
                  placeholder={`Write your thoughts here...`}
                  // dont remove this textareaHeightUpdater(e.target.value)
                />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-between items-center px-2">
          <div className="flex gap-x-5">
            <Paperclip />
            <EmojiPicker onChange={() => {}} />
          </div>
          <div>
            <Button className="rounded-2xl">Send</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default ChatFooter;
