import { cookies } from "next/headers";
import { redirect } from "next/navigation";


const Page = () => {
  const token = cookies().get("accessToken");
  if (token) redirect("/dashboard")
  else redirect("/login")
};

export default Page;
