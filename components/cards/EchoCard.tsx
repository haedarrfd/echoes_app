import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DeleteEcho from "../forms/DeleteEcho";

interface EchoCardProps {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const EchoCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}: EchoCardProps) => {
  return (
    <article
      className={`flex w-full flex-col rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          {/* Profile/Image Author */}
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-12 w-12">
              <Image
                src={author.image}
                alt="Profile Image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            {/* Divider */}
            <div className="echo_card_bar" />
          </div>

          {/* Name of the author */}
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-4">
                <Image
                  src="/assets/heart-gray.svg"
                  alt="Heart"
                  width={25}
                  height={25}
                  className="cursor-pointer object-contain"
                />
                <Link href={`/echo/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt="Reply"
                    width={25}
                    height={25}
                    className="cursor-pointer object-contain"
                  />
                </Link>
                <Image
                  src="/assets/repost.svg"
                  alt="Repost"
                  width={25}
                  height={25}
                  className="cursor-pointer object-contain"
                />
                <Image
                  src="/assets/share.svg"
                  alt="Share"
                  width={25}
                  height={25}
                  className="cursor-pointer object-contain"
                />
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/echo/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} Repl{comments.length > 1 ? "ies" : "y"}
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Delete Echo */}
        <DeleteEcho
          echoId={JSON.stringify(id)}
          currentUserId={currentUserId}
          authorId={author.id}
          parentId={parentId}
          isComment={isComment}
        />
      </div>

      {/* Show comment logo */}
      {!isComment && comments.length > 0 && (
        <div className="ml-1 mt-3 flex items-center gap-3">
          {comments.slice(0, 2).map((comment, index) => (
            <Image
              key={index}
              src={comment.author.image}
              alt={`user-${index}`}
              width={25}
              height={25}
              className={`${index !== 0 && "-ml-5"} rounded-full object-cover`}
            />
          ))}

          <Link href={`/echo/${id}`}>
            <p className="mt-1 text-subtle-medium text-gray-1">
              {comments.length} Repl{comments.length > 1 ? "ies" : "y"}
            </p>
          </Link>
        </div>
      )}

      {!isComment && community && (
        <Link
          href={`/communities/${community.id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}{" "}
            {community && `- ${community.name} Community`}
          </p>

          <Image
            src={community.image}
            alt={community.name}
            width={20}
            height={20}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
};

export default EchoCard;
