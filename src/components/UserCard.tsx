import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { signOut } from "@/actions/auth-actions";

export default async function UserCard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex flex-col gap-4">
        <p>您尚未登入。</p>
        <Link
          href="/auth"
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 text-center"
        >
          登入
        </Link>
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
      <form action={signOut}>
        <button
          type="submit"
          className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          登出
        </button>
      </form>
    </div>
  );
}
