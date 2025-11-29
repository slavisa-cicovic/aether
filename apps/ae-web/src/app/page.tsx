import { redirect } from "next/navigation";
import { getServerAuthToken } from "@/lib/auth/session";
import { LandingPage } from "@/sections/landing/landing-page";

export default async function Home() {
  const token = await getServerAuthToken();
  if (token) {
    redirect("/dashboard");
  }

  return <LandingPage />;
}
