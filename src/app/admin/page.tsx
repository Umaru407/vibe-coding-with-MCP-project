import { withAdminAuth } from "@/components/auth-hoc";

/**
 * Admin 專屬頁面
 * 只有 admin 角色可以訪問此頁面
 */
function AdminPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">管理員控制台</h1>
      <p className="text-muted-foreground">此頁面只有 admin 角色才能訪問。</p>
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h2 className="text-lg font-semibold mb-2">管理功能</h2>
        <ul className="list-disc list-inside space-y-1">
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
