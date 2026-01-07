export default function UnauthorizedPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md p-8 text-center">
        <div className="mb-6">
          <div className="bg-destructive/10 text-destructive mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-8 w-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-3xl font-bold">存取被拒絕</h1>
          <p className="text-muted-foreground mb-6">
            您沒有足夠的權限存取此頁面
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="/"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block w-full rounded-md px-4 py-2 transition-colors"
          >
            返回首頁
          </a>
          <a
            href="/auth"
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground inline-block w-full rounded-md border px-4 py-2 transition-colors"
          >
            重新登入
          </a>
        </div>

        <div className="bg-muted mt-8 rounded-lg p-4 text-left text-sm">
          <p className="mb-2 font-semibold">可能的原因：</p>
          <ul className="text-muted-foreground list-inside list-disc space-y-1">
            <li>您的帳戶角色不符合頁面要求</li>
            <li>您沒有存取該資源的權限</li>
            <li>請確認您使用正確的帳戶登入</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
