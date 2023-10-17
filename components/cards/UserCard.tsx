"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

interface UserCardProps {
  id: string;
  name: string;
  username: string;
  imgUrl: string;
  personType: string;
  addingStyles?: string;
}

const UserCard = ({
  id,
  name,
  username,
  imgUrl,
  personType,
  addingStyles,
}: UserCardProps) => {
  const router = useRouter();

  return (
    <article className={`user_card ${addingStyles}`}>
      <div className="user_card_avatar">
        <div className="relative h-12 w-12">
          <Image
            src={imgUrl}
            alt="Logo"
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">{username}</p>
        </div>
      </div>

      <Button
        className="user_card_btn"
        onClick={() => {
          if (personType === "User") {
            router.push(`/profile/${id}`);
          } else {
            router.push(`/communities/${id}`);
          }
        }}
      >
        View
      </Button>
    </article>
  );
};

export default UserCard;
