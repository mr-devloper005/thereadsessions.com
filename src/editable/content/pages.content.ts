import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Thoughtful articles for curious readers',
      description: 'Explore essays, explainers, opinions, interviews, and curated article picks through a calm reading-first experience.',
      openGraphTitle: 'Thoughtful articles for curious readers',
      openGraphDescription: 'Discover essays, explainers, opinions, and editorial picks through a focused article archive.',
      keywords: ['article site', 'essay platform', 'editorial publication', 'reading archive'],
    },
    hero: {
      badge: 'Independent article journal',
      title: ['Read sharper essays,', 'ideas, and field notes.'],
      description: 'A clean publication experience for long-form articles, practical explainers, cultural notes, and reader-friendly opinion pieces.',
      primaryCta: { label: 'Read latest articles', href: '/article' },
      secondaryCta: { label: 'Search the archive', href: '/search' },
      searchPlaceholder: 'Search essays, topics, authors, and ideas',
      focusLabel: 'Editorial focus',
      featureCardBadge: 'today in reading',
      featureCardTitle: 'Fresh articles guide the rhythm of the homepage.',
      featureCardDescription: 'Recent reads, editor picks, and topic lanes stay easy to scan without stretching the layout.',
    },
    intro: {
      badge: 'About the publication',
      title: 'Built for article discovery without the noise.',
      paragraphs: [
        'This site is shaped around the reading journey: clear headlines, useful summaries, balanced cards, and enough breathing room for every article to feel intentional.',
        'Readers can start with a feature, scan editor picks, search by topic, or move through the latest archive without fighting oversized panels or stretched layouts.',
        'Every page keeps the same purpose: help people find a good article, understand why it matters, and continue reading with less friction.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Reading-first homepage with a stronger editorial hierarchy.',
        'Article cards designed for headlines, excerpts, topics, and imagery.',
        'Search, archive, and detail pages that feel consistent and compact.',
        'Lightweight member access for publishing and returning readers.',
      ],
      primaryLink: { label: 'Browse articles', href: '/article' },
      secondaryLink: { label: 'Search topics', href: '/search' },
    },
    cta: {
      badge: 'Keep reading',
      title: 'Find the next article worth your attention.',
      description: 'Browse the latest reads, search the archive, or sign in to prepare a new article for publication.',
      primaryCta: { label: 'Browse Articles', href: '/article' },
      secondaryCta: { label: 'Contact editors', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'Our editorial promise',
    title: 'A calmer, clearer way to read articles online.',
    description: `${slot4BrandConfig.siteName} is built as an article-first publication where thoughtful writing, useful summaries, and clean browsing matter more than noise.`,
    paragraphs: [
      'We design every surface around the reader: quick scanning for busy moments, generous article pages for deeper attention, and topic-driven paths for discovery.',
      'The publication is made for essays, explainers, interviews, practical guides, and opinion pieces that deserve a layout with restraint.',
      'Our goal is simple: make the next good read easier to find, easier to start, and easier to finish.',
    ],
    values: [
      {
        title: 'Reading-first layouts',
        description: 'Headlines, excerpts, images, and metadata are balanced so readers can scan quickly and settle into longer pieces comfortably.',
      },
      {
        title: 'Editorial clarity',
        description: 'Every page uses direct language, useful topic cues, and fewer distractions to help articles feel trustworthy and easy to follow.',
      },
      {
        title: 'A compact archive',
        description: 'Search and listing pages keep a normal readable width, avoiding the stretched feel that makes article sites harder to browse.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Reach the editorial desk.',
    description: 'Send article pitches, correction requests, partnership notes, contributor questions, or feedback about the reading experience.',
    formTitle: 'Send an editorial note',
  },

  search: {
    metadata: {
      title: 'Search',
      description: 'Search articles, topics, categories, and authors across the site.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find articles by topic, title, or idea.',
      description: 'Use keywords, categories, and article types to discover essays, explainers, interviews, and reading notes.',
      placeholder: 'Search by keyword, topic, author, or title',
    },
    resultsTitle: 'Latest articles in the archive',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to draft a new article.',
      description: 'Use your account to open the publishing workspace and prepare article submissions for the site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create a clean article submission.',
      description: 'Add a title, summary, feature image, category, and body copy so the article is ready for review.',
    },
    formTitle: 'Article details',
    submitLabel: 'Submit article',
    successTitle: 'Article submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for returning readers and contributors.',
      badge: 'Reader access',
      title: 'Welcome back to the reading desk.',
      description: 'Sign in to continue from your account, prepare article submissions, and keep the publishing workspace close at hand.',
      formTitle: 'Sign in',
      submitLabel: 'Sign in',
      noAccount: 'No reader account matched these details. Create an account first, then sign in.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for readers and article contributors.',
      badge: 'Join the publication',
      title: 'Create your reader account.',
      description: 'Start a simple member profile for reading, contributor access, and future article submissions.',
      formTitle: 'Create reader account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested articles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit Official Site',
    },
  },
} as const
