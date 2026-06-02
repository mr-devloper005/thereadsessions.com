import Link from 'next/link'
import { ArrowRight, BookOpen, ChevronLeft, Clock3 } from 'lucide-react'
import type { SitePost, SiteFeedPagination } from '@/lib/site-connector'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { ArticleListCard, getEditablePostImage, getEditableExcerpt, postHref } from '@/editable/cards/PostCards'

export function EditableArticleArchive({ posts, pagination, category = 'all', basePath = '/article' }: { posts: SitePost[]; pagination: SiteFeedPagination; category?: string; basePath?: string }) {
  const voice = taskPageVoices.article
  const page = pagination.page || 1
  const pageHref = (nextPage: number) => `${basePath}?${new URLSearchParams({ ...(category && category !== 'all' ? { category } : {}), page: String(nextPage) }).toString()}`
  const lead = page === 1 ? posts[0] : null
  const side = page === 1 ? posts.slice(1, 3) : []
  const listPosts = page === 1 ? posts.slice(3) : posts
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-10 sm:pt-14 lg:pt-16`}>
        <div className="border-b border-black pb-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{voice.eyebrow}</p>
            <span className={`inline-flex items-center gap-2 rounded-full border ${pal.border} bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.18em]`}><BookOpen className="h-4 w-4" /> Article archive</span>
          </div>
          <h1 className="mt-5 max-w-5xl text-5xl font-black leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">{voice.headline}</h1>
          <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)] lg:items-end">
            <p className={`max-w-2xl text-base font-semibold leading-8 ${pal.mutedText}`}>{voice.description}</p>
            <form action={basePath} className="grid gap-3 rounded-xl border border-black/[0.07] bg-white/80 p-3 shadow-sm sm:grid-cols-[1fr_auto] lg:max-w-xl lg:justify-self-end">
              <select name="category" defaultValue={category || 'all'} className={`min-w-0 rounded-lg bg-[var(--slot4-page-bg)] px-4 py-3 text-sm font-bold ${pal.panelText} outline-none`}>
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className={`rounded-lg ${pal.darkBg} px-6 py-3 text-sm font-black text-white`}>Filter</button>
            </form>
          </div>
        </div>
        {lead ? (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.75fr)]">
            <Link href={postHref('article', lead, basePath)} className="group grid overflow-hidden rounded-xl border border-black/[0.07] bg-white shadow-[0_22px_70px_rgba(31,31,31,0.10)] md:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[340px] overflow-hidden bg-[var(--slot4-media-bg)]">
                <img src={getEditablePostImage(lead)} alt={lead.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
              </div>
              <div className="flex min-h-[340px] flex-col justify-between p-6 sm:p-8">
                <div>
                  <p className={`${dc.type.eyebrow} ${pal.accentText}`}>Lead article</p>
                  <h2 className="mt-4 text-3xl font-black leading-tight tracking-tight sm:text-4xl">{lead.title}</h2>
                  <p className={`mt-5 text-sm font-semibold leading-7 ${pal.mutedText}`}>{getEditableExcerpt(lead, 210)}</p>
                </div>
                <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-5 py-3 text-sm font-black text-white">Start reading <ArrowRight className="h-4 w-4" /></span>
              </div>
            </Link>
            <aside className="rounded-xl border border-black/[0.07] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-black/[0.07] pb-4"><Clock3 className="h-4 w-4 text-[var(--slot4-accent)]" /><h2 className="text-sm font-black uppercase tracking-[0.2em]">Editor shortlist</h2></div>
              {side.map((post, index) => (
                <Link key={post.id || post.slug} href={postHref('article', post, basePath)} className="group grid grid-cols-[76px_minmax(0,1fr)] gap-4 border-b border-black/[0.07] py-4 last:border-b-0">
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-[var(--slot4-media-bg)]"><img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
                  <div className="min-w-0"><p className={`${dc.type.eyebrow} ${pal.accentText}`}>Pick {index + 1}</p><h3 className="mt-1 line-clamp-2 text-base font-black leading-tight tracking-tight">{post.title}</h3><p className={`mt-2 line-clamp-2 text-xs font-semibold leading-5 ${pal.mutedText}`}>{getEditableExcerpt(post, 82)}</p></div>
                </Link>
              ))}
            </aside>
          </div>
        ) : null}
      </section>

      <section className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        {listPosts.length ? (
          <div className="grid gap-5">
            {listPosts.map((post, index) => <ArticleListCard key={post.id} post={post} href={postHref('article', post, basePath)} index={index + (page - 1) * pagination.limit + (lead ? 3 : 0)} />)}
          </div>
        ) : posts.length ? null : (
          <div className={`${dc.surface.soft} p-8 text-center`}>
            <h2 className="text-3xl font-black tracking-[-0.05em]">No articles found</h2>
            <p className={`mt-3 text-sm leading-7 ${pal.softMutedText}`}>Try another category or return to all articles.</p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {pagination.hasPrevPage ? <Link href={pageHref(page - 1)} className={`rounded-full border ${pal.border} bg-white px-5 py-3 text-sm font-black`}>Previous</Link> : null}
          <span className={`rounded-xl ${pal.darkBg} px-5 py-3 text-sm font-black text-white`}>Page {page} of {pagination.totalPages || 1}</span>
          {pagination.hasNextPage ? <Link href={pageHref(page + 1)} className={`rounded-full border ${pal.border} bg-white px-5 py-3 text-sm font-black`}>Next</Link> : null}
        </div>
      </section>
    </main>
  )
}

export function EditableArticleDetailShell({ slug, post }: { slug: string; post: SitePost | null }) {
  const voice = taskPageVoices.article
  return (
    <main className={dc.shell.page}>
      <section className={`${dc.shell.section} pt-10 sm:pt-14 lg:pt-16`}>
        <div className={`grid gap-6 rounded-xl border ${pal.border} bg-white p-6 shadow-[0_20px_60px_rgba(24,20,17,0.08)] lg:grid-cols-[minmax(0,1fr)_300px] lg:p-10`}>
          <div className="min-w-0">
            <Link href="/article" className={`inline-flex items-center gap-2 rounded-full border ${pal.border} px-4 py-2 text-sm font-black ${pal.panelText}`}><ChevronLeft className="h-4 w-4" /> Articles</Link>
            <p className={`${dc.type.eyebrow} mt-8 ${pal.accentText}`}>{voice.eyebrow}</p>
            <h1 className={`mt-4 max-w-4xl text-4xl font-black leading-tight tracking-tight ${pal.panelText} sm:text-5xl lg:text-6xl`}>{post?.title || pagesContent.detailPages.article.fallbackTitle}</h1>
          </div>
          <aside className={`min-w-0 rounded-xl ${pal.darkBg} p-6 text-white`}>
            <p className={`${dc.type.eyebrow} ${pal.accentSoftText}`}>Reading note</p>
            <p className="mt-4 text-sm leading-7 text-white/72">{voice.secondaryNote}</p>
            <Link href="/contact" className={`mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black ${pal.panelText}`}>Contact <ArrowRight className="h-4 w-4" /></Link>
          </aside>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pb-24">
        <div className={`rounded-xl border ${pal.border} bg-white p-6 shadow-[0_20px_60px_rgba(24,20,17,0.08)] sm:p-8 lg:p-10`}>
          <p className={`text-sm leading-8 ${pal.softMutedText}`}>{post?.summary || `Article detail content for ${slug} will render through the editable detail page.`}</p>
        </div>
      </section>
    </main>
  )
}
