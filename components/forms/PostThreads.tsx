"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { createThread } from "@/lib/actions/thread.actions";
import { ThreadValidation } from "@/lib/validations/thread";
// import { userValidation } from "@/lib/validations/user";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

function PostThreads({ userId }: { userId: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {

    const parentId = undefined; 

    await createThread({
      text: values.thread,
      author: userId,
      communityId: null,
      path: pathname,
      parentId,
    });
    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex justify-start flex-col gap-10 mt-10">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex gap-3 flex-col w-full">
              <FormLabel className="text-base-semibold text-light-2 ">
                Context
              </FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1 ">
                <Textarea rows={15} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-primary-500">
          Post thread
        </Button>
      </form>
    </Form>
  );
}

export default PostThreads;
