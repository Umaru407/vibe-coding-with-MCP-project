import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { signOut } from "@/actions/auth-actions";
import { Button } from "../ui/button";

export default async function UserCard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-muted-foreground">您尚未登入。</p>
        <Button asChild>
          <Link href="/auth">登入</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name}
            className="ring-border h-12 w-12 rounded-full ring-2"
          />
        )}
        <div className="text-left">
          <p className="text-foreground font-semibold">{session.user.name}</p>
          <p className="text-muted-foreground text-sm">{session.user.email}</p>
        </div>
      </div>
      <form action={signOut}>
        <Button type="submit">登出</Button>
      </form>
    </div>
  );
}
