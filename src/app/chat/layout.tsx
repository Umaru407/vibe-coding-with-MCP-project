import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { withAuth } from "@/lib/auth-hoc";

function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex overflow-hidden w-full">
      <ChatSidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}

export default withAuth(ChatLayout);
