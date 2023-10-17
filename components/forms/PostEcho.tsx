"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EchoValidation } from "@/lib/validations/echo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { usePathname, useRouter } from "next/navigation";
import { createEcho } from "@/lib/actions/echo.actions";
import { useOrganization } from "@clerk/nextjs";

function PostEcho({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  // Form Validation
  const form = useForm({
    resolver: zodResolver(EchoValidation),
    defaultValues: {
      echo: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof EchoValidation>) => {
    await createEcho({
      text: values.echo,
      author: userId,
      communityId: organization ? organization.id : null,
      path: pathname,
    });

    router.push("/");
  };

  return (
    <Form {...form}>
      <form
        className="flex flex-col justify-start gap-10 mt-10"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Form Name */}
        <FormField
          control={form.control}
          name="echo"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-4">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl className="no_focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea rows={12} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-primary-500">
          Post Echo
        </Button>
      </form>
    </Form>
  );
}

export default PostEcho;
