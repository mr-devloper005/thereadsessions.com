import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const HTML_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  cent: '¢', pound: '£', yen: '¥', euro: '€', copy: '©', reg: '®',
  trade: '™', mdash: '—', ndash: '–', lsquo: '‘', rsquo: '’',
  ldquo: '“', rdquo: '”', bull: '•', hellip: '…', prime: '′',
  Prime: '″', laquo: '«', raquo: '»', larr: '←', rarr: '→',
  uarr: '↑', darr: '↓', iexcl: '¡', iquest: '¿', sect: '§', para: '¶',
  micro: 'µ', middot: '·', cedil: '¸', ordf: 'ª', ordm: 'º', sup1: '¹',
  sup2: '²', sup3: '³', frac14: '¼', frac12: '½', frac34: '¾',
  times: '×', divide: '÷', deg: '°', not: '¬', plusmn: '±',
  agrave: 'à', aacute: 'á', acirc: 'â', atilde: 'ã', auml: 'ä', aring: 'å',
  egrave: 'è', eacute: 'é', ecirc: 'ê', euml: 'ë',
  igrave: 'ì', iacute: 'í', icirc: 'î', iuml: 'ï',
  ograve: 'ò', oacute: 'ó', ocirc: 'ô', otilde: 'õ', ouml: 'ö', oslash: 'ø',
  ugrave: 'ù', uacute: 'ú', ucirc: 'û', uuml: 'ü',
  ntilde: 'ñ', ccedil: 'ç', szlig: 'ß', thorn: 'þ', eth: 'ð', yuml: 'ÿ',
  Agrave: 'À', Aacute: 'Á', Acirc: 'Â', Atilde: 'Ã', Auml: 'Ä', Aring: 'Å',
  Egrave: 'È', Eacute: 'É', Ecirc: 'Ê', Euml: 'Ë',
  Igrave: 'Ì', Iacute: 'Í', Icirc: 'Î', Iuml: 'Ï',
  Ograve: 'Ò', Oacute: 'Ó', Ocirc: 'Ô', Otilde: 'Õ', Ouml: 'Ö', Oslash: 'Ø',
  Ugrave: 'Ù', Uacute: 'Ú', Ucirc: 'Û', Uuml: 'Ü',
  Ntilde: 'Ñ', Ccedil: 'Ç', Yacute: 'Ý',
}
const _fromCodePoint = (code: number, fallback: string) => { try { return code > 0 && code < 0x10ffff ? String.fromCodePoint(code) : fallback } catch { return fallback } }
const _decodeEntities = (value: string) => value
  .replace(/&#x([0-9a-f]+);/gi, (m, hex) => _fromCodePoint(parseInt(hex, 16), m))
  .replace(/&#(\d+);/g, (m, dec) => _fromCodePoint(Number(dec), m))
  .replace(/&([a-z]+\d*);/gi, (m, name) => HTML_ENTITIES[name] ?? m)
const _removeTags = (value: string) => value
  .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<\/?(p|div|br|hr|li|ul|ol|tr|td|th|h[1-6]|blockquote|section|article|header|footer|nav|main|aside|figure|figcaption|details|summary|dt|dd)\b[^>]*>/gi, ' ')
  .replace(/<[^>]*>/g, ' ')
const toPlainText = (value: unknown) => {
  if (typeof value !== 'string' || !value) return ''
  return _removeTags(_decodeEntities(_removeTags(value))).replace(/\s+/g, ' ').trim()
}
const compactText = (value: unknown) => toPlainText(value).toLowerCase()
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => toPlainText(post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || '')

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 5 === 0

  return (
    <Link href={href} className={`group block overflow-hidden rounded-xl border border-black/[0.06] bg-[var(--slot4-surface-bg)] shadow-sm transition hover:-translate-y-1 hover:shadow-[0_18px_70px_rgba(0,0,0,0.14)] ${strong ? 'md:col-span-2' : ''}`}>
      {image ? (
        <div className={`relative overflow-hidden bg-black ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-[var(--slot4-surface-bg)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-black">{taskLabel}</span>
        </div>
      ) : null}
      <div className="p-5 sm:p-6">
        {!image ? <span className="rounded-full bg-[var(--slot4-page-text)] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white">{taskLabel}</span> : null}
        <h2 className="mt-4 line-clamp-3 text-2xl font-extrabold leading-tight tracking-tight text-[var(--slot4-page-text)]">{post.title}</h2>
        {summary ? <p className="mt-4 line-clamp-3 text-sm font-semibold leading-7 text-[var(--slot4-page-text)]/65">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] opacity-60 group-hover:opacity-100">Open result <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const feed = await fetchSiteFeed(1000, { fresh: true, category: category || undefined, task: task || undefined })
  const posts = feed?.posts?.length ? feed.posts : []
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 rounded-xl border border-black/[0.06] bg-[var(--slot4-surface-bg)]/75 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur md:grid-cols-[0.85fr_1.15fr] lg:p-10">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] opacity-55">{pagesContent.search.hero.badge}</p>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{pagesContent.search.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base font-semibold leading-8 opacity-70">{pagesContent.search.hero.description}</p>
            </div>
            <form action="/search" className="self-end rounded-xl border border-black/[0.06] bg-[var(--slot4-page-bg)] p-4 sm:p-5">
              <label className="flex items-center gap-3 rounded-xl border border-black/[0.06] bg-[var(--slot4-surface-bg)] px-4 py-3">
                <Search className="h-5 w-5 opacity-45" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-current/35" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-xl border border-black/[0.06] bg-[var(--slot4-surface-bg)] px-4 py-3">
                  <Filter className="h-4 w-4 opacity-45" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-current/35" />
                </label>
                <select name="task" defaultValue={task} className="rounded-xl border border-black/[0.06] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm font-extrabold outline-none">
                  <option value="">All article lanes</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[var(--slot4-page-text)] px-6 text-sm font-extrabold uppercase tracking-[0.18em] text-[var(--slot4-page-bg)] transition hover:-translate-y-0.5" type="submit">Search</button>
            </form>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] opacity-50">{results.length} results</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-black/[0.06] bg-[var(--slot4-surface-bg)] px-5 py-3 text-sm font-extrabold">Browse latest <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-xl border border-dashed border-black/[0.06] bg-[var(--slot4-surface-bg)]/70 p-10 text-center">
              <p className="text-2xl font-extrabold tracking-[-0.04em]">No matching posts found.</p>
              <p className="mt-3 text-sm font-semibold opacity-60">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
