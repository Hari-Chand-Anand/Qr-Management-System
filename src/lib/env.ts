export const envPublic = {
  companyName: process.env.NEXT_PUBLIC_COMPANY_NAME ?? "Company",
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL ?? "",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000",
  defaultWaNumber: process.env.NEXT_PUBLIC_DEFAULT_WA_NUMBER ?? "",
  defaultWaTemplate:
    process.env.NEXT_PUBLIC_DEFAULT_WA_TEMPLATE ??
    "Hi, I need technical help for [Machine Name] (Machine ID: [Machine ID]).",
  companyWebsiteUrl:
    process.env.NEXT_PUBLIC_COMPANY_WEBSITE_URL ?? "https://dukesewing.com/",
  companyYoutubeUrl:
    process.env.NEXT_PUBLIC_COMPANY_YOUTUBE_URL ?? "https://www.youtube.com/@HCA_Co",
  companyInstagramUrl:
    process.env.NEXT_PUBLIC_COMPANY_INSTAGRAM_URL ??
    "https://www.instagram.com/duke_sewing_machine",
};
