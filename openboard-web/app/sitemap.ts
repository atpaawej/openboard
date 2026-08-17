import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/siteConfig';
import { docsData, blogsData, comparisonsData, integrationsData } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/docs/mcp-tools`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/security`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Dynamic Docs routes
  const docRoutes: MetadataRoute.Sitemap = docsData.map((doc) => ({
    url: `${baseUrl}/docs/${doc.slug}`,
    lastModified: new Date(doc.lastUpdated),
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // Dynamic Blog routes
  const blogRoutes: MetadataRoute.Sitemap = blogsData.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: new Date(blog.publishedDate),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // Dynamic Comparison routes
  const comparisonRoutes: MetadataRoute.Sitemap = comparisonsData.map((compare) => ({
    url: `${baseUrl}/compare/${compare.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  // Dynamic Integration routes
  const integrationRoutes: MetadataRoute.Sitemap = integrationsData.map((integ) => ({
    url: `${baseUrl}/integrations/${integ.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [
    ...staticRoutes,
    ...docRoutes,
    ...blogRoutes,
    ...comparisonRoutes,
    ...integrationRoutes,
  ];
}
