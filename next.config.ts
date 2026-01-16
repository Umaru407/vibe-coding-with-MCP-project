import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 優化套件匯入，減少 bundle size
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-avatar",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-label",
      "@radix-ui/react-navigation-menu",
      "@radix-ui/react-popover",
      "@radix-ui/react-progress",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tooltip",
    ],
  },
  // 避免將這些套件打包到伺服器 bundle 中
  serverExternalPackages: ["drizzle-orm", "postgres", "pg"],
};

export default nextConfig;
