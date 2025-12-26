import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { withUserAuth } from "@/lib/auth-hoc";

/**
 * 使用者個人資料頁面
 * 允許 admin 和 user 角色訪問
 */
async function UserProfilePage() {
  // 取得 session（HOC 已確保使用者已登入）
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">使用者個人資料</h1>
      <div className="bg-card p-6 rounded-lg shadow-sm border h-[1200px]">
        <p className="text-lg">
          歡迎，<span className="font-semibold">{session!.user.name}</span>！
        </p>
        <p className="text-muted-foreground mt-2">
          Email: {session!.user.email}
        </p>
        <p className="text-muted-foreground mt-1">
          角色: <span className="font-medium">{session!.user.role}</span>
        </p>
        {session!.user.image && (
          <img
            src={session!.user.image}
            alt={session!.user.name}
            className="w-20 h-20 rounded-full mt-4"
          />
        )}
      </div>
    </div>
  );
}

// 使用 withUserAuth HOC 保護此頁面（允許 admin 和 user）
export default withUserAuth(UserProfilePage);
