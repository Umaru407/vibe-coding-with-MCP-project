"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function UserCard({ session }: { session: any }) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  if (!session) {
    return (
      <div className="flex flex-col gap-4">
        <p>You are not signed in.</p>
        <button
          onClick={() => router.push("/auth")}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex items-center gap-4">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="h-12 w-12 rounded-full"
          />
        )}
        <div className="text-left">
          <p className="font-semibold text-gray-900 dark:text-white">
            {session.user.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {session.user.email}
          </p>
        </div>
      </div>
      <button
        onClick={handleSignOut}
        className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}
