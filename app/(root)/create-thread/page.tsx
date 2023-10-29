import PostThreads from "@/components/forms/PostThreads";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();

  if (!user) return null;

    const userInfo = await fetchUser(user.id);

  if (userInfo?.onboarded === false) redirect("/onboarding");
  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <PostThreads userId={userInfo._id} />
    </>
  );
}
