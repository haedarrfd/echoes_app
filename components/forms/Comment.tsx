"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentValidation } from "@/lib/validations/echo";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { addCommentToEcho } from "@/lib/actions/echo.actions";

interface CommentProps {
  echoId: string;
  currentUserImg: string;
  currentUserId: string;
}

const Comment = ({ echoId, currentUserImg, currentUserId }: CommentProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Form Validation
  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      echo: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToEcho(
      echoId,
      values.echo,
      JSON.parse(currentUserId),
      pathname
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form className="comment_form" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form Comment */}
        <FormField
          control={form.control}
          name="echo"
          render={({ field }) => (
            <FormItem className="flex items-center w-full gap-4">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile Image"
                  width={50}
                  height={50}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Comment..."
                  className="no_focus text-light-1 outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment_form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
