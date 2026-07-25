import practiceRoutes from '../../src/data/practiceRoutes.js'; 
export default async function sitemap() {
  const baseUrl = 'https://bcspark.vercel.app';

  // ১. স্ট্যাটিক মেইন রুটসমূহ
  const staticPages = [
    '',
    '/t20',
    '/psychology-test-bangla',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.9,
  }));

  // ২. practiceRoutes থেকে ডায়নামিক ভাবে Active রুটগুলো নেওয়া
  const dynamicRoutes = [];

  Object.values(practiceRoutes).forEach((category) => {
    if (category.topics) {
      Object.values(category.topics).forEach((topic) => {
        // শুধু active: true থাকা রুটগুলো এবং বৈধ route স্ট্রিপ যুক্ত করবে
        if (topic.active && topic.route && topic.route.trim() !== '') {
          dynamicRoutes.push({
            url: `${baseUrl}${topic.route}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'weekly',
            priority: 0.8,
          });
        }
      });
    }
  });

  return [...staticPages, ...dynamicRoutes];
}