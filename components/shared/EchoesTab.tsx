import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import EchoCard from "../cards/EchoCard";
import { fetchCommunityPosts } from "@/lib/actions/community.actions";

interface Result {
  name: string;
  image: string;
  id: string;
  echos: {
    _id: string;
    text: string;
    parentId: string | null;
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
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface EchoesTabProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const EchoesTab = async ({
  currentUserId,
  accountId,
  accountType,
}: EchoesTabProps) => {
  let result: Result;

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) redirect("/");

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.echos.map((echo: any) => (
        <EchoCard
          key={echo._id}
          id={echo._id}
          currentUserId={currentUserId}
          parentId={echo.parentId}
          content={echo.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: echo.author.name,
                  image: echo.author.image,
                  id: echo.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : echo.community
          }
          createdAt={echo.createdAt}
          comments={echo.children}
        />
      ))}
    </section>
  );
};

export default EchoesTab;
