const isProd = process.env.NODE_ENV === "production";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL;

const nextConfig = {
  basePath: isProd ? process.env.NEXT_PUBLIC_BASE_PATH : "",
  reactStrictMode: false,
  allowedDevOrigins: ["192.168.29.66"],

  images: {
    // Chat avatars/media come from the shared Firestore user directory —
    // mobile users' profileurl/message URLs can live on any host (Firebase
    // Storage, social CDNs, ...), so images can't be limited to a fixed
    // domain whitelist. Plain-http is included because demo/staging
    // deployments (demo.divinetechs.com) serve media without TLS.
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};


export default nextConfig;
