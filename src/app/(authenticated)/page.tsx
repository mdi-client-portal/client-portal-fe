import Image from "next/image";
import { auth } from "@/auth";
import SignOutButton from "@/components/common/buttons/signout";
// import { signOut } from "next-auth/react";

export default async function Home() {
  const session = await auth();
  console.log(session);

  return <>ini Dashboard</>;
}
