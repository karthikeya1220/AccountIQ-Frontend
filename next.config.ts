import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Add headers to enforce HTTPS
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Enforce HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Prevent clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Prevent MIME type sniffing
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // XSS Protection
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Referrer Policy
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // CSP - Allow Supabase and external resources
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; connect-src 'self' https://xtbbkwpjtksclmragqos.supabase.co https://*.supabase.co https://cdn.jsdelivr.net; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; font-src 'self' data: https://cdn.jsdelivr.net;",
          },
        ],
      },
    ];
  },

  // Redirect HTTP to HTTPS in production
  async redirects() {
    return process.env.NODE_ENV === "production"
      ? [
          {
            source: "/:path*",
            destination: "https://:host/:path*",
            permanent: true,
          },
        ]
      : [];
  },
};

export default nextConfig;
