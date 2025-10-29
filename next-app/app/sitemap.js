export default async function sitemap() {
  const baseUrl = 'https://iptv-access.com'
  
  // Fetch dynamic plans for sitemap
  let plans = []
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const response = await fetch(`${apiUrl}/plans`, { 
      next: { revalidate: 3600 },
      cache: 'no-store'
    })
    if (response.ok) {
      plans = await response.json()
    }
  } catch (error) {
    console.error('Failed to fetch plans for sitemap:', error)
  }

  // Get unique device tabs
  const deviceTabs = [...new Set(plans.map(p => p.device_tab))]

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/#pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...deviceTabs.map((tab) => ({
      url: `${baseUrl}/#pricing-${tab.replace(/\s+/g, '-').toLowerCase()}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    })),
  ]
}
