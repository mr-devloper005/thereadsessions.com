import { siteIdentity } from '@/config/site.identity'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'

const { recipe } = getFactoryState()
const productKind = getProductKind(recipe)
const envSiteName = process.env.NEXT_PUBLIC_BRAND_NAME || process.env.NEXT_PUBLIC_SITE_NAME || process.env.SITE_NAME || siteIdentity.name
const envTagline = process.env.NEXT_PUBLIC_SITE_TAGLINE || process.env.SITE_TAGLINE || siteIdentity.tagline
const envDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN || process.env.SITE_DOMAIN || siteIdentity.domain
const envBaseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || siteIdentity.url

export const slot4BrandConfig = {
  siteName: envSiteName,
  tagline: envTagline,
  domain: envDomain,
  baseUrl: envBaseUrl,
  productKind,
  ogImage: siteIdentity.ogImage,
  accents:
    productKind === 'visual'
      ? { primary: '#8df0c8', surface: '#07101f' }
      : productKind === 'editorial'
        ? { primary: '#241711', surface: '#fbf6ee' }
        : productKind === 'directory'
          ? { primary: '#0f172a', surface: '#f8fbff' }
          : { primary: '#5b2b3b', surface: '#f7f1ea' },
} as const
