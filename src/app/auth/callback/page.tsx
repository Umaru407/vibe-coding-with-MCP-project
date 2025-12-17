import { auth } from "@/lib/auth";
import { pool } from "@/lib/db";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthCallbackPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth");
  }

  try {
    // Check if user has password set
    const result = await pool.query(
      `SELECT * FROM account WHERE "userId" = $1 AND "providerId" = 'credential'`,
      [session.user.id]
    );

    if (result.rows.length > 0) {
      redirect("/");
    }
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }
  }

  // If no password (or error), redirect to set password page
  redirect("/auth/set-password");
}
