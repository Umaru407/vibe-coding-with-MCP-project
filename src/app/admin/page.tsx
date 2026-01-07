import { withAdminAuth } from "@/lib/auth-hoc";

/**
 * Admin 專屬頁面
 * 只有 admin 角色可以訪問此頁面
 */
function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="mb-4 text-2xl font-bold">管理員控制台</h1>
      <p className="text-muted-foreground">此頁面只有 admin 角色才能訪問。</p>
      <div className="bg-muted mt-6 rounded-lg p-4">
        <h2 className="mb-2 text-lg font-semibold">管理功能</h2>
        <ul className="list-inside list-disc space-y-1">
          <li>使用者管理</li>
          <li>系統設定</li>
          <li>資料分析</li>
        </ul>
      </div>
    </div>
  );
}

// 使用 withAdminAuth HOC 保護此頁面
export default withAdminAuth(AdminPage);
