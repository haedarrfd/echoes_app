import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import EchoCard from "../cards/EchoCard";

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
  // Fetch Profile
  let result = await fetchUserPosts(accountId);
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
          community={echo.community}
          createdAt={echo.createdAt}
          comments={echo.children}
        />
      ))}
    </section>
  );
};

export default EchoesTab;
