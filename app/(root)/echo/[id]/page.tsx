import EchoCard from "@/components/cards/EchoCard";
import Comment from "@/components/forms/Comment";
import { fetchEchoById } from "@/lib/actions/echo.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const echo = await fetchEchoById(params.id);

  return (
    <section className="relative">
      {/* display the post you want to comment on  */}
      <div>
        <EchoCard
          id={echo._id}
          currentUserId={user.id}
          parentId={echo.parentId}
          content={echo.text}
          author={echo.author}
          community={echo.community}
          createdAt={echo.createdAt}
          comments={echo.children}
        />
      </div>

      {/* Form Comment */}
      <div className="mt-7">
        <Comment
          echoId={echo.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-10">
        {/* Display the Comment */}
        {echo.children.map((childItem: any) => (
          <EchoCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};

export default Page;
