import { SERVICE_CATEGORY_META } from '../data/serviceCategoryMeta.js';
import { brand, featuredProducts, serviceCards } from '../data/siteContent.js';

export const SITE_URL = 'https://www.digitalinfratech.in';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.png`;

const defaultTitle = `${brand.shortName} — Home Services & Paints, Lucknow`;
const defaultDescription =
  'Book verified electricians, plumbers, painters, carpenters, AC repair & cleaning in Lucknow. Premium paint supplies with 40-min delivery.';

export function absoluteUrl(path = '/') {
  if (!path || path === '/') return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function buildTitle(pageTitle) {
  if (!pageTitle) return defaultTitle;
  return `${pageTitle} | ${brand.shortName}`;
}

export const homeJsonLd = () => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: brand.name,
      url: SITE_URL,
      email: brand.supportEmail,
      telephone: brand.phone,
      logo: DEFAULT_OG_IMAGE,
      areaServed: {
        '@type': 'City',
        name: brand.city,
      },
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#localbusiness`,
      name: brand.name,
      image: DEFAULT_OG_IMAGE,
      url: SITE_URL,
      telephone: brand.phone,
      email: brand.supportEmail,
      priceRange: '₹₹',
      address: {
        '@type': 'PostalAddress',
        addressLocality: brand.city,
        postalCode: brand.pincode,
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 26.8467,
        longitude: 80.9462,
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '20:00',
      },
      sameAs: [
        brand.social.instagram,
        brand.social.youtube,
        brand.social.linkedin,
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: brand.shortName,
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-IN',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
});

export function productJsonLd(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.short,
    image: product.image ? absoluteUrl(product.image) : DEFAULT_OG_IMAGE,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: 'https://schema.org/InStock',
      url: absoluteUrl(`/product/${product.slug}`),
    },
  };
}

export function serviceJsonLd(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.summary,
    provider: { '@id': `${SITE_URL}/#localbusiness` },
    areaServed: brand.city,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: service.priceFrom,
    },
  };
}

/** Paths included in sitemap.xml (generated at build). */
export function getSitemapPaths() {
  const paths = ['/', '/products', '/services', '/search'];

  SERVICE_CATEGORY_META.forEach((cat) => {
    paths.push(`/services/${cat.id}`);
  });

  featuredProducts.forEach((p) => {
    paths.push(`/product/${p.slug}`);
  });

  serviceCards.forEach((s) => {
    paths.push(`/service/${s.slug}`);
  });

  return paths;
}

export function buildSitemapXml() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = getSitemapPaths()
    .map((path) => {
      const loc = absoluteUrl(path);
      const priority =
        path === '/'
          ? '1.0'
          : path.startsWith('/services/') || path.startsWith('/product/')
            ? '0.8'
            : '0.9';
      const changefreq =
        path === '/' || path === '/products' || path === '/services' ? 'weekly' : 'monthly';
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

export const seoDefaults = {
  title: defaultTitle,
  description: defaultDescription,
};
