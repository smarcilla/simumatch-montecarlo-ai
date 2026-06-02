import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(
  "./src/infrastructure/ui/i18n/request.ts"
);

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default withNextIntl(nextConfig);
