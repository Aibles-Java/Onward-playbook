/** @type {import('next').NextConfig} */

// Khi build cho GitHub Pages, đặt biến môi trường GITHUB_PAGES=true.
// Repo là project page nên site phục vụ dưới đường dẫn con /Onward-playbook.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "Onward-playbook";

const nextConfig = {
  reactStrictMode: true,
  // Xuất HTML tĩnh vào thư mục ./out để host trên GitHub Pages.
  output: "export",
  // GitHub Pages phục vụ theo thư mục -> cần trailing slash để tìm index.html.
  trailingSlash: true,
  // GitHub Pages không có trình tối ưu ảnh của Next.
  images: { unoptimized: true },
  ...(isGithubPages
    ? { basePath: `/${repoName}`, assetPrefix: `/${repoName}/` }
    : {}),
};

export default nextConfig;
