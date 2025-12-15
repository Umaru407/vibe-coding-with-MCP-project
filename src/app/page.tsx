import UserCard from "@/components/UserCard";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="relative w-full max-w-3xl">
        {/* 主題切換按鈕 - 右上角 */}
        <div className="absolute -top-12 right-0">
          <ThemeToggle />
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center text-2xl">用戶資訊</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <UserCard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
