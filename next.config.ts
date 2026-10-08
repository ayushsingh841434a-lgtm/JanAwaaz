import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Evidence uploads are stored on local disk (see UPLOAD_DIR).
  // For multi-instance production deployments, point uploads at object storage.
  experimental: {},
};

export default nextConfig;
