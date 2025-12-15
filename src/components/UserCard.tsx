import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { signOut } from "@/actions/auth-actions";
import { Button } from "./ui/button";

export default async function UserCard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex flex-col gap-4 items-center">
        <p className="text-muted-foreground">您尚未登入。</p>
        <Button asChild>
          <Link href="/auth">登入</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex items-center gap-4">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="h-12 w-12 rounded-full ring-2 ring-border"
          />
        )}
        <div className="text-left">
          <p className="font-semibold text-foreground">{session.user.name}</p>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </div>
      </div>
      <form action={signOut}>
        <Button type="submit" variant="destructive">
          登出
        </Button>
      </form>
    </div>
  );
}
