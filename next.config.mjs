/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: "/student",
        destination: "/portal",
        permanent: false,
      },
      {
        source: "/student/dashboard",
        destination: "/portal",
        permanent: false,
      },
      {
        source: "/student/complaints",
        destination: "/portal/complaints",
        permanent: false,
      },
      {
        source: "/student/complaints/new",
        destination: "/portal/new",
        permanent: false,
      },
      {
        source: "/student/anti-ragging",
        destination: "/portal/anti-ragging",
        permanent: false,
      },
      {
        source: "/student/lost-found",
        destination: "/portal/lost-found",
        permanent: false,
      },
      {
        source: "/admin/dashboard",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/hod/dashboard",
        destination: "/hod",
        permanent: false,
      },
    ]
  },
}

export default nextConfig
