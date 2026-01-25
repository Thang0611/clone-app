/**
 * SEO Utilities
 * Centralized SEO configuration and helpers
 */

import type { Metadata, Viewport } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://getcourses.net';
const SITE_NAME = 'GetCourses';
const DEFAULT_DESCRIPTION = 'Tải khóa học Udemy, Coursera, LinkedIn Learning về Google Drive. 9000+ khóa học có sẵn, cập nhật hàng tuần. Giá chỉ 50k.';
const DEFAULT_KEYWORDS = [
  'khóa học online',
  'udemy',
  'coursera',
  'linkedin learning',
  'tải khóa học',
  'khóa học giá rẻ',
  'online course',
  'học online',
  'giáo dục trực tuyến',
  'getcourses',
  'khóa học udemy giá rẻ',
  'download khóa học',
];

export interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  noindex?: boolean;
  nofollow?: boolean;
}

/**
 * Generate metadata for pages
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description = DEFAULT_DESCRIPTION,
    keywords = DEFAULT_KEYWORDS,
    image = `${SITE_URL}/images/logo.webp`,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    noindex = false,
    nofollow = false,
  } = config;

  const fullTitle = title 
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} - Tải Khóa Học Online Chỉ từ 30k`;

  const pageUrl = url || SITE_URL;
  const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  // OpenGraph only supports 'website' or 'article', map 'product' to 'website'
  const ogType = type === 'product' ? 'website' : type;

  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    
    // Open Graph
    openGraph: {
      type: ogType as 'website' | 'article',
      url: pageUrl,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'vi_VN',
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@getcourses', // Update with actual Twitter handle
    },

    // Robots
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // Additional metadata
    alternates: {
      canonical: pageUrl,
    },

    // Verification (add your verification codes)
    verification: {
      // google: 'your-google-verification-code',
      // yandex: 'your-yandex-verification-code',
      // yahoo: 'your-yahoo-verification-code',
    },

    // App metadata
    applicationName: SITE_NAME,
    referrer: 'origin-when-cross-origin',
    
    // Icons for browser tab and PWA
    icons: {
      icon: [
        { url: '/images/icon-logo.webp', type: 'image/webp' },
      ],
      apple: [
        { url: '/icon.png', type: 'image/png' },
      ],
    },
    // Note: colorScheme and themeColor moved to viewport export (Next.js 16+ requirement)
  };
}

/**
 * Generate viewport configuration
 * Next.js 16+ requires colorScheme and themeColor to be in viewport export, not metadata
 */
export function generateViewport(): Viewport {
  return {
    colorScheme: 'light',
    themeColor: '#4F46E5', // Indigo color
  };
}

/**
 * Generate structured data (JSON-LD) for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.webp`,
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      // Add social media links
      // 'https://www.facebook.com/getcourses',
      // 'https://twitter.com/getcourses',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'getcourses.net@gmail.com',
      availableLanguage: ['Vietnamese'],
    },
  };
}

/**
 * Generate structured data for Course
 */
export function generateCourseSchema(course: {
  name: string;
  description: string;
  provider: string;
  image?: string;
  url?: string;
  price?: number;
  priceCurrency?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.name,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider,
    },
    ...(course.image && {
      image: course.image.startsWith('http') ? course.image : `${SITE_URL}${course.image}`,
    }),
    ...(course.url && { url: course.url }),
    ...(course.price && {
      offers: {
        '@type': 'Offer',
        price: course.price,
        priceCurrency: course.priceCurrency || 'VND',
        availability: 'https://schema.org/InStock',
      },
    }),
    ...(course.rating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: course.rating,
        reviewCount: course.reviewCount || 0,
      },
    }),
  };
}

/**
 * Generate structured data for Article/Blog Post
 */
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  image?: string;
  url?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    ...(article.image && {
      image: article.image.startsWith('http') ? article.image : `${SITE_URL}${article.image}`,
    }),
    ...(article.url && { url: article.url }),
    ...(article.datePublished && { datePublished: article.datePublished }),
    ...(article.dateModified && { dateModified: article.dateModified }),
    author: {
      '@type': 'Person',
      name: article.author || SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/logo.webp`,
      },
    },
  };
}

/**
 * Generate BreadcrumbList structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate FAQPage structured data
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
