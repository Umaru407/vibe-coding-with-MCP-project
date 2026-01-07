import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { withAuth } from "@/lib/auth-hoc";

function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-full flex-1 overflow-hidden">
      <SidebarProvider className="h-full min-h-0">
        <ChatSidebar className="relative h-full" />
        <SidebarInset className="h-full overflow-hidden">
          {/* 手機版 header，顯示 sidebar 開關按鈕 */}
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 md:hidden">
            <SidebarTrigger />
            <span className="text-sm font-medium">對話</span>
          </header>
          <main className="h-full flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default withAuth(ChatLayout);
