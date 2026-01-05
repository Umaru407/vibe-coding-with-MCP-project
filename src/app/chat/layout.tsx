import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { withAuth } from "@/lib/auth-hoc";

function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-hidden relative h-full">
      <SidebarProvider className="h-full min-h-0">
        <ChatSidebar className="h-full relative" />
        <SidebarInset className="h-full overflow-hidden">
          {/* 手機版 header，顯示 sidebar 開關按鈕 */}
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4 md:hidden">
            <SidebarTrigger />
            <span className="text-sm font-medium">對話</span>
          </header>
          <main className="flex-1 overflow-auto h-full">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default withAuth(ChatLayout);
