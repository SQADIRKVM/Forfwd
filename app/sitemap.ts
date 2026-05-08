import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://forfwd.com';
  return [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/resume-scan`, lastModified: new Date() },
    { url: `${baseUrl}/chat`, lastModified: new Date() },
    { url: `${baseUrl}/onboarding`, lastModified: new Date() },
  ];
}
