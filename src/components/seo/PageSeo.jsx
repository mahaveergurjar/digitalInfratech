import { Helmet } from 'react-helmet-async';
import {
  absoluteUrl,
  buildTitle,
  DEFAULT_OG_IMAGE,
  seoDefaults,
  SITE_URL,
} from '../../config/seo';

export default function PageSeo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  noindex = false,
  jsonLd,
}) {
  const metaDescription = description || seoDefaults.description;
  const documentTitle = title ? buildTitle(title) : seoDefaults.title;
  const canonical = path ? absoluteUrl(path) : `${SITE_URL}/`;
  const ogImage = image?.startsWith('http') ? image : absoluteUrl(image || '/logo.png');

  const jsonLdBlocks = jsonLd
    ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]).filter(Boolean)
    : [];

  return (
    <Helmet>
      <html lang="en-IN" />
      <title>{documentTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonical} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Digital InfraTech" />
      <meta property="og:title" content={documentTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="en_IN" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={documentTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />

      {jsonLdBlocks.map((block, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
