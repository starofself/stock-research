import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure bundled content/data files are included in serverless functions on Vercel
  outputFileTracingIncludes: {
    "/**": ["./content/**/*", "./data/**/*"],
  },
  async rewrites() {
    return {
      // beforeFiles: 파일시스템/동적 라우트보다 먼저 검사된다.
      // starfolio.io 루트는 이 저장소의 주도주 스크리너(public/leader)를 서빙한다.
      // 주소는 그대로 starfolio.io 로 남는다(리다이렉트가 아니라 rewrite).
      // leader.starfolio.io 는 손대지 않은 채 그대로 살아 있다 — 되돌리려면 이 블록을
      // redirects() 의 { source: "/", destination: "https://leader.starfolio.io", permanent: false } 로 바꾸면 된다.
      beforeFiles: [{ source: "/", destination: "/leader/index.html" }],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
