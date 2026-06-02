import Link from 'next/link'
import { ArrowRight, BookOpen, Clock3, Search, Sparkle } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { globalContent } from '@/editable/content/global.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function getExcerpt(post?: SitePost | null, limit = 140) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function getCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Article'
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function SectionHeader({ eyebrow, title, href }: { eyebrow: string; title: string; href?: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{eyebrow}</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">{title}</h2>
      </div>
      {href ? (
        <Link href={href} className="inline-flex items-center gap-2 rounded-full border border-black/[0.08] bg-white px-5 py-3 text-sm font-black transition hover:-translate-y-0.5 hover:shadow-sm">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}

function PremiumStoryCard({ post, href, index, large = false }: { post: SitePost; href: string; index: number; large?: boolean }) {
  return (
    <Link href={href} className={`group block overflow-hidden rounded-xl border border-black/[0.07] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(31,31,31,0.12)] ${large ? 'lg:row-span-2' : ''}`}>
      <div className={`relative overflow-hidden bg-[var(--slot4-media-bg)] ${large ? 'aspect-[16/11]' : 'aspect-[16/10]'}`}>
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className={large ? 'p-6 sm:p-7' : 'p-5'}>
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
          <span>{getCategory(post)}</span>
          <span className="h-1 w-1 rounded-full bg-current" />
          <span>Read {String(index + 1).padStart(2, '0')}</span>
        </div>
        <h3 className={`mt-3 line-clamp-3 font-black leading-tight tracking-tight text-[var(--slot4-page-text)] ${large ? 'text-3xl sm:text-4xl' : 'text-xl'}`}>{post.title}</h3>
        <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.mutedText}`}>{getExcerpt(post, large ? 190 : 120)}</p>
      </div>
    </Link>
  )
}

function DigestRow({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid grid-cols-[74px_minmax(0,1fr)] gap-4 border-b border-black/[0.07] py-4 last:border-b-0">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0">
        <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${pal.accentText}`}>Editor's note {index + 1}</p>
        <h3 className="mt-1 line-clamp-2 text-base font-black leading-tight tracking-tight">{post.title}</h3>
        <p className={`mt-2 line-clamp-2 text-xs leading-5 ${pal.mutedText}`}>{getExcerpt(post, 82)}</p>
      </div>
    </Link>
  )
}

function TextOnlyPick({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group block rounded-xl border border-black/[0.07] bg-white p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(31,31,31,0.10)]">
      <p className={`text-[11px] font-black uppercase tracking-[0.2em] ${pal.accentText}`}>No. {String(index + 1).padStart(2, '0')}</p>
      <h3 className="mt-3 line-clamp-3 text-xl font-black leading-tight tracking-tight">{post.title}</h3>
      <p className={`mt-4 line-clamp-3 text-sm leading-7 ${pal.mutedText}`}>{getExcerpt(post, 120)}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] opacity-65 transition group-hover:opacity-100">
        Read article <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const heroTitle = pagesContent.home.hero.title.join(' ') || `Come for the ${taskLabel(primaryTask).toLowerCase()}. Stay for the connection.`
  const lead = posts[0]
  const side = posts.slice(1, 4)

  return (
    <section className={`${pal.creamBg} border-b border-black/[0.07]`}>
      <div className="mx-auto max-w-[1180px] px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pb-16">
        <div className="border-b border-black pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{pagesContent.home.hero.badge}</p>
            <p className="text-xs font-black uppercase tracking-[0.22em] opacity-55">{globalContent.site.name}</p>
          </div>
          <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">{heroTitle}</h1>
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1fr)] lg:items-end">
            <p className={`max-w-2xl text-base leading-8 ${pal.mutedText} sm:text-lg`}>{pagesContent.home.hero.description}</p>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <Link href={primaryRoute} className={dc.button.primary}>{pagesContent.home.hero.primaryCta.label} <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/search" className={dc.button.secondary}>{pagesContent.home.hero.secondaryCta.label}</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.75fr)]">
          {lead ? (
            <Link href={postHref(primaryTask, lead, primaryRoute)} className="group grid overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-[0_22px_70px_rgba(31,31,31,0.10)] md:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[330px] overflow-hidden bg-[var(--slot4-media-bg)]">
                <img src={getEditablePostImage(lead)} alt={lead.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex min-h-[330px] flex-col justify-between p-6 sm:p-8">
                <div>
                  <p className={`${dc.type.eyebrow} ${pal.accentText}`}>Cover story</p>
                  <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">{lead.title}</h2>
                  <p className={`mt-5 text-sm leading-7 ${pal.mutedText}`}>{getExcerpt(lead, 210)}</p>
                </div>
                <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">
                  Start reading <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ) : (
            <div className="rounded-xl border border-black/[0.08] bg-white p-8 shadow-sm">
              <p className={`${dc.type.eyebrow} ${pal.accentText}`}>Cover story</p>
              <p className="mt-4 text-3xl font-black leading-tight">Fresh articles will appear here as soon as the archive updates.</p>
            </div>
          )}

          <aside className="rounded-xl border border-black/[0.07] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 border-b border-black/[0.07] pb-4">
              <Sparkle className="h-4 w-4 text-[var(--slot4-accent)]" />
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Editor picks</h2>
            </div>
            <div>
              {side.map((post, index) => <DigestRow key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(4, 10)
  if (!railPosts.length) return null

  return (
    <section className={`${pal.warmBg} border-b border-black/[0.06]`}>
      <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="The digest" title="A premium reading queue, curated for a slower scroll." href={primaryRoute} />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {railPosts.map((post, index) => <PremiumStoryCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index + 4} />)}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const featured = posts.slice(10, 16).length ? posts.slice(10, 16) : posts.slice(0, 6)
  if (!featured.length) return null

  return (
    <section className={`${pal.grayBg} border-b border-black/[0.06]`}>
      <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Featured essays" title={`Must-read ${taskLabel(primaryTask).toLowerCase()} with stronger hierarchy and calmer spacing.`} />
        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {featured.slice(0, 5).map((post, index) => (
            <PremiumStoryCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index + 10} large={index === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const timePosts = timeSections.flatMap((section) => section.posts)
  const sourcePosts = timePosts.length ? timePosts : posts.slice(16)
  const lead = sourcePosts[0] || posts[0]
  const indexPosts = sourcePosts.slice(1, 9).length ? sourcePosts.slice(1, 9) : posts.slice(6, 14)
  const topicLabels = timeSections.length
    ? timeSections.slice(0, 5).map((section) => section.title)
    : ['Culture', 'Technology', 'Writing', 'Ideas', 'Life']

  return (
    <section className={pal.creamBg}>
      <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="rounded-xl border border-black/[0.07] bg-[var(--slot4-dark-bg)] p-6 text-white lg:sticky lg:top-24 lg:self-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="mt-6 text-3xl font-black leading-tight tracking-tight">Browse by editorial mood.</h2>
            <p className="mt-4 text-sm leading-7 text-white/68">Search the archive or follow a topic lane built from the newest article stream.</p>
            <form action="/search" className="mt-6 rounded-xl border border-white/15 bg-white/10 p-2">
              <label className="flex items-center gap-2 rounded-lg bg-white px-3 py-3 text-[var(--slot4-page-text)]">
                <Search className="h-4 w-4 opacity-50" />
                <input name="q" placeholder="Search articles" className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-current/40" />
              </label>
            </form>
            <div className="mt-6 flex flex-wrap gap-2">
              {topicLabels.map((topic) => (
                <Link key={topic} href={`/search?q=${encodeURIComponent(topic)}`} className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white/75 transition hover:bg-white hover:text-[var(--slot4-page-text)]">
                  {topic}
                </Link>
              ))}
            </div>
          </aside>

          <div className="min-w-0">
            {lead ? (
              <Link href={postHref(primaryTask, lead, primaryRoute)} className="group grid overflow-hidden rounded-xl border border-black/[0.07] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(31,31,31,0.12)] md:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-[280px] overflow-hidden bg-[var(--slot4-media-bg)]">
                  <img src={getEditablePostImage(lead)} alt={lead.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6 sm:p-8">
                  <p className={`${dc.type.eyebrow} ${pal.accentText}`}>Current feature</p>
                  <h3 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">{lead.title}</h3>
                  <p className={`mt-5 text-sm leading-7 ${pal.mutedText}`}>{getExcerpt(lead, 190)}</p>
                  <span className="mt-7 inline-flex items-center gap-2 text-sm font-black">
                    Continue <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ) : null}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {indexPosts.map((post, index) => <TextOnlyPick key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className={`${pal.panelBg} scroll-mt-24 border-t border-black/[0.07]`}>
      <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-xl border border-black/[0.07] bg-white p-7 shadow-[0_20px_60px_rgba(31,31,31,0.08)] md:grid-cols-[1fr_auto] md:items-center md:p-9">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--slot4-accent)]">
              <Clock3 className="h-4 w-4" />
              {pagesContent.home.cta.badge}
            </div>
            <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl">{pagesContent.home.cta.title}</h2>
            <p className={`mt-4 max-w-2xl text-base leading-8 ${pal.mutedText}`}>{pagesContent.home.cta.description}</p>
          </div>
          <div className="flex flex-wrap gap-3 md:justify-end">
            <Link href="/article" className={dc.button.primary}>{pagesContent.home.cta.primaryCta.label}</Link>
            <Link href="/contact" className={dc.button.secondary}>{pagesContent.home.cta.secondaryCta.label}</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
