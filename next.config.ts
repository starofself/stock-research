import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure bundled content/data files are included in serverless functions on Vercel
  outputFileTracingIncludes: {
    "/**": ["./content/**/*", "./data/**/*"],
  },
  async rewrites() {
    return {
      // beforeFiles: 파일시스템/동적 라우트보다 먼저 검사된다.
      // 루트(starfolio.io/)는 주도주 스크리너(public/leader)를 그대로 보여준다.
      // 기존 리서치 대시보드는 /ko · /en 에 그대로 남아 있다.
      beforeFiles: [{ source: "/", destination: "/leader/index.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
