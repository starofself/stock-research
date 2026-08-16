import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure bundled content/data files are included in serverless functions on Vercel
  outputFileTracingIncludes: {
    "/**": ["./content/**/*", "./data/**/*"],
  },
  async redirects() {
    return [
      // starfolio.io 루트로 들어오면 운영 중인 주도주 스크리너로 보낸다.
      // permanent:false(307) — 브라우저가 영구 캐시하지 않아 언제든 되돌릴 수 있다.
      // 이 저장소의 앱 소스는 /leader 에 그대로 있고 거기서 계속 고친다.
      { source: "/", destination: "https://leader.starfolio.io", permanent: false },
    ];
  },
};

export default nextConfig;
