import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import UserCard from "@/components/UserCard";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col items-center justify-between p-24 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold mb-8 text-indigo-600">
          Better Auth + Supabase
        </h1>
        <UserCard session={session} />
      </main>
    </div>
  );
}
