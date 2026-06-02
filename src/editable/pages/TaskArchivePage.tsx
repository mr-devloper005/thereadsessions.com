import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, BookOpen, Bookmark, BriefcaseBusiness, Building2, Camera, Clock3, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 lg:grid-cols-3', promise: 'Readable editorial cards with room for headlines, images, topics, and useful excerpts.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Directory cards highlight company identity, location, contacts, and service details.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Offer-board cards prioritize price, location, condition, and quick action.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Gallery-first browsing with strong visuals and compact captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Bookmark cards stay mostly text-based so saved resources scan quickly.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards surface file context, download intent, and summary.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards focus on identity, short bio, and direct discovery.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = { '--archive-bg': preset.colors.background, '--archive-text': preset.colors.foreground, '--archive-surface': preset.colors.surface, '--archive-accent': preset.colors.accent } as CSSProperties
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category

  if (task === 'article') {
    return <ArticleArchiveView posts={posts} pagination={pagination} category={category} basePath={basePath} archiveVars={archiveVars} categoryLabel={categoryLabel} />
  }
  if (task === 'profile') {
    return <ProfileArchiveView posts={posts} pagination={pagination} category={category} basePath={basePath} archiveVars={archiveVars} categoryLabel={categoryLabel} />
  }

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto grid max-w-[1180px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8 lg:py-16">
          <div className="rounded-xl border border-[var(--editable-border)] bg-[var(--archive-surface)] p-7 shadow-[0_18px_54px_rgba(15,23,42,0.08)] sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[var(--archive-accent)]"><Icon className="h-4 w-4" /> {label}</div>
            <h1 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">{voice?.headline || `Browse ${label}`}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 opacity-70">{voice?.description || SITE_CONFIG.description}</p>
            <div className="mt-6 rounded-xl border border-[var(--editable-border)] bg-white/55 p-4 text-sm font-bold leading-7 opacity-75">{deck.promise}</div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={basePath} className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">Browse all</Link>
              <Link href="/search" className="rounded-full border border-[var(--editable-border)] px-5 py-3 text-sm font-black">Search articles</Link>
            </div>
          </div>

          <form action={basePath} className="self-end rounded-xl border border-[var(--editable-border)] bg-white/70 p-5 shadow-sm backdrop-blur">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-55"><Filter className="h-4 w-4" /> Filter</div>
            <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-xl border border-[var(--editable-border)] bg-white px-4 text-sm font-bold outline-none">
              <option value="all">All categories</option>
              {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
            <button className="mt-3 h-12 w-full rounded-xl bg-[var(--archive-text)] text-sm font-black text-[var(--archive-bg)]">Apply</button>
            <p className="mt-3 text-xs font-bold opacity-55">Showing: {categoryLabel}</p>
          </form>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--editable-border)] bg-white/60 p-10 text-center">
              <Search className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No posts found</h2>
              <p className="mt-2 text-sm opacity-65">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
            <span className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArticleArchiveView({
  posts,
  pagination,
  category,
  basePath,
  archiveVars,
  categoryLabel,
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
  archiveVars: CSSProperties
  categoryLabel: string
}) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const lead = page === 1 ? posts[0] : null
  const side = page === 1 ? posts.slice(1, 3) : []
  const archivePosts = page === 1 ? posts.slice(3) : posts

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto max-w-[1180px] px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16">
          <div className="border-b border-black pb-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--archive-accent)]">{voice.eyebrow}</p>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em]">
                <BookOpen className="h-4 w-4" /> {categoryLabel}
              </span>
            </div>
            <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">{voice.headline}</h1>
            <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-end">
              <p className="max-w-2xl text-base font-semibold leading-8 opacity-70">{voice.description}</p>
              <form action={basePath} className="grid gap-3 rounded-xl border border-[var(--editable-border)] bg-white/80 p-3 shadow-sm sm:grid-cols-[1fr_auto] lg:max-w-xl lg:justify-self-end">
                <label className="flex min-w-0 items-center gap-2 rounded-lg bg-[var(--archive-bg)] px-4 py-3">
                  <Filter className="h-4 w-4 opacity-50" />
                  <select name="category" defaultValue={category} className="min-w-0 flex-1 bg-transparent text-sm font-black outline-none">
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                </label>
                <button className="rounded-lg bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">Apply</button>
              </form>
            </div>
          </div>

          {lead ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.75fr)]">
              <Link href={`${basePath}/${lead.slug}`} className="group grid overflow-hidden rounded-xl border border-[var(--editable-border)] bg-white shadow-[0_22px_70px_rgba(15,23,42,0.10)] md:grid-cols-[1.05fr_0.95fr]">
                <div className="relative min-h-[340px] overflow-hidden bg-black/5">
                  <img src={getImage(lead)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                </div>
                <div className="flex min-h-[340px] flex-col justify-between p-6 sm:p-8">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--archive-accent)]">Lead article</p>
                    <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">{lead.title}</h2>
                    <p className="mt-5 text-sm font-semibold leading-7 opacity-65">{getSummary(lead)}</p>
                  </div>
                  <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">
                    Start reading <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              <aside className="rounded-xl border border-[var(--editable-border)] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-[var(--editable-border)] pb-4">
                  <Clock3 className="h-4 w-4 text-[var(--archive-accent)]" />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em]">Editor shortlist</h2>
                </div>
                <div>
                  {side.map((post, index) => <ArticleDigestCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} index={index} />)}
                </div>
              </aside>
            </div>
          ) : null}
        </section>

        <section className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6 lg:px-8">
          {archivePosts.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {archivePosts.map((post, index) => <ArticleArchiveCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} index={index + (lead ? 3 : 0)} />)}
            </div>
          ) : posts.length ? null : (
            <div className="rounded-xl border border-dashed border-[var(--editable-border)] bg-white/70 p-10 text-center">
              <Search className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-black tracking-tight">No articles found</h2>
              <p className="mt-2 text-sm font-semibold opacity-65">Try another category or return to all articles.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
            <span className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArticleDigestCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid grid-cols-[76px_minmax(0,1fr)] gap-4 border-b border-[var(--editable-border)] py-4 last:border-b-0">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-black/5">
        <img src={getImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--archive-accent)]">Pick {index + 1}</p>
        <h3 className="mt-1 line-clamp-2 text-base font-black leading-tight tracking-tight">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs font-semibold leading-5 opacity-60">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ProfileArchiveView({
  posts,
  pagination,
  category,
  basePath,
  archiveVars,
  categoryLabel,
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
  archiveVars: CSSProperties
  categoryLabel: string
}) {
  const voice = taskPageVoices.profile
  const page = pagination.page || 1
  const lead = page === 1 ? posts[0] : null
  const side = page === 1 ? posts.slice(1, 4) : []
  const archiveProfiles = page === 1 ? posts.slice(4) : posts

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto max-w-[1180px] px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pb-16">
          <div className="grid gap-8 border-b border-black pb-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--archive-accent)]">{voice.eyebrow}</p>
              <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">{voice.headline}</h1>
              <p className="mt-6 max-w-3xl text-base font-semibold leading-8 opacity-70">{voice.description}</p>
            </div>
            <form action={basePath} className="rounded-xl border border-[var(--editable-border)] bg-white/80 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] opacity-55"><Filter className="h-4 w-4" /> Profile filter</div>
              <select name="category" defaultValue={category} className="mt-4 h-12 w-full rounded-lg bg-[var(--archive-bg)] px-4 text-sm font-black outline-none">
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="mt-3 h-12 w-full rounded-lg bg-[var(--archive-text)] text-sm font-black text-[var(--archive-bg)]">Apply</button>
              <p className="mt-3 text-xs font-bold opacity-55">Showing: {categoryLabel}</p>
            </form>
          </div>

          {lead ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.8fr)]">
              <Link href={`${basePath}/${lead.slug}`} className="group grid overflow-hidden rounded-xl border border-[var(--editable-border)] bg-white shadow-[0_22px_70px_rgba(15,23,42,0.10)] md:grid-cols-[330px_minmax(0,1fr)]">
                <div className="flex min-h-[340px] items-center justify-center bg-[var(--archive-bg)] p-8">
                  <div className="relative h-52 w-52 overflow-hidden rounded-full border border-[var(--editable-border)] bg-white shadow-[0_18px_44px_rgba(15,23,42,0.12)]">
                    {getImages(lead)[0] ? <img src={getImages(lead)[0]} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <UserRound className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 opacity-35" />}
                  </div>
                </div>
                <div className="flex min-h-[340px] flex-col justify-between p-6 sm:p-8">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-[var(--archive-accent)]">Featured profile</p>
                    <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">{lead.title}</h2>
                    {getField(lead, ['role', 'designation', 'company', 'location']) ? <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] opacity-55">{getField(lead, ['role', 'designation', 'company', 'location'])}</p> : null}
                    <p className="mt-5 text-sm font-semibold leading-7 opacity-65">{getSummary(lead)}</p>
                  </div>
                  <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">
                    View profile <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              <aside className="rounded-xl border border-[var(--editable-border)] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-2 border-b border-[var(--editable-border)] pb-4">
                  <UserRound className="h-4 w-4 text-[var(--archive-accent)]" />
                  <h2 className="text-sm font-black uppercase tracking-[0.2em]">Notable profiles</h2>
                </div>
                <div>
                  {side.map((post, index) => <ProfileDigestCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} index={index} />)}
                </div>
              </aside>
            </div>
          ) : null}
        </section>

        <section className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6 lg:px-8">
          {archiveProfiles.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {archiveProfiles.map((post, index) => <ProfileArchiveCard key={post.id || post.slug} post={post} href={`${basePath}/${post.slug}`} index={index + (lead ? 4 : 0)} />)}
            </div>
          ) : posts.length ? null : (
            <div className="rounded-xl border border-dashed border-[var(--editable-border)] bg-white/70 p-10 text-center">
              <UserRound className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="mt-4 text-3xl font-black tracking-tight">No profiles found</h2>
              <p className="mt-2 text-sm font-semibold opacity-65">Try another category or return to all profiles.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
            <span className="rounded-full bg-[var(--archive-text)] px-5 py-3 text-sm font-black text-[var(--archive-bg)]">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--editable-border)] bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ProfileDigestCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group grid grid-cols-[70px_minmax(0,1fr)] gap-4 border-b border-[var(--editable-border)] py-4 last:border-b-0">
      <div className="relative aspect-square overflow-hidden rounded-full bg-[var(--archive-bg)] ring-1 ring-[var(--editable-border)]">
        {avatar ? <img src={avatar} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <UserRound className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 opacity-35" />}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--archive-accent)]">Profile {index + 1}</p>
        <h3 className="mt-1 line-clamp-2 text-base font-black leading-tight tracking-tight">{post.title}</h3>
        {role ? <p className="mt-2 line-clamp-1 text-xs font-black uppercase tracking-[0.14em] opacity-55">{role}</p> : null}
      </div>
    </Link>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className="group overflow-hidden rounded-xl border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(15,23,42,0.11)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-black/5">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">{category}</span>
      </div>
      <div className="p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--archive-accent)]">Article {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-2 text-xl font-black leading-tight tracking-tight">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm font-semibold leading-7 opacity-65">{getSummary(post)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] opacity-60 transition group-hover:opacity-100">
          Read article <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-[var(--editable-border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--archive-bg)] ring-1 ring-[var(--editable-border)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--archive-text)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--archive-bg)]">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[var(--editable-border)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 opacity-65">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold opacity-70 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[var(--archive-text)] p-5 text-[var(--archive-bg)]">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-black leading-[1] tracking-[-0.07em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold opacity-75">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt="" className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-80" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-65">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] border border-[var(--editable-border)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--archive-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-black leading-tight tracking-[-0.04em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.7rem] border border-[var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:bg-[var(--archive-text)] hover:text-[var(--archive-bg)]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[2rem] border border-[var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[var(--archive-text)] p-5 text-[var(--archive-bg)]"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[var(--archive-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-black leading-tight tracking-[-0.05em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-65">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href, index = 0 }: { post: SitePost; href: string; index?: number }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-xl border border-[var(--editable-border)] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(15,23,42,0.11)]">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-[var(--archive-bg)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">Profile {String(index + 1).padStart(2, '0')}</span>
        <ArrowRight className="h-4 w-4 opacity-35 transition group-hover:translate-x-1 group-hover:opacity-100" />
      </div>
      <div className="mx-auto mt-7 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full bg-[var(--archive-bg)] ring-1 ring-[var(--editable-border)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
      </div>
      <h2 className="mt-6 text-center text-2xl font-black leading-tight tracking-tight">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-center text-sm font-semibold leading-7 opacity-65">{getSummary(post)}</p>
    </Link>
  )
}
