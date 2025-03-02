/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    // 只在生产构建时启用静态导出
    ...(process.env.NODE_ENV === 'production' ? {
        output: 'export',
        distDir: 'build',
        basePath: '/analysis',  // 添加这行，设置基础路径
        assetPrefix: '/analysis/',
    } : {}),
};

export default nextConfig;
