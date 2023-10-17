"use client";

import { deleteEcho } from "@/lib/actions/echo.actions";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

interface DeleteEchoProps {
  echoId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteEcho({
  echoId,
  currentUserId,
  authorId,
  parentId,
  isComment,
}: DeleteEchoProps) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId || pathname === "/") return null;

  return (
    <Image
      src="/assets/delete.svg"
      alt="delete"
      width={20}
      height={20}
      className="cursor-pointer object-contain"
      onClick={async () => {
        await deleteEcho(JSON.parse(echoId), pathname);
        if (!parentId || !isComment) {
          router.push("/");
        }
      }}
    />
  );
}

export default DeleteEcho;
