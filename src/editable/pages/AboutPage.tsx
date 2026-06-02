import { pagesContent } from '@/editable/content/pages.content'
import { globalContent } from '@/editable/content/global.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--editable-page-bg,#fffaf3)] px-4 py-14 text-[var(--editable-page-text,#241915)] sm:px-6 lg:px-8">
        <section className="mx-auto grid max-w-[1180px] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <article className="rounded-xl border border-[var(--editable-border)] bg-white/85 p-8 shadow-sm lg:p-12">
            <p className="text-xs font-black uppercase tracking-[0.24em] opacity-55">{pagesContent.about.badge}</p>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl">About {globalContent.site.name}</h1>
            <p className="mt-5 max-w-2xl text-base leading-8 opacity-70">{pagesContent.about.description}</p>
            <div className="mt-8 space-y-4 text-sm leading-8 opacity-75">
              {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </article>
          <aside className="space-y-4">
            {pagesContent.about.values.map((value) => (
              <div key={value.title} className="rounded-xl border border-[var(--editable-border)] bg-white/75 p-6 shadow-sm">
                <h2 className="text-xl font-black tracking-[-0.04em]">{value.title}</h2>
                <p className="mt-3 text-sm leading-7 opacity-70">{value.description}</p>
              </div>
            ))}
            <div className="rounded-xl border border-[var(--editable-border)] bg-[var(--slot4-accent-soft)] p-6">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Editorial scope</p>
              <p className="mt-3 text-sm font-bold leading-7 opacity-75">Essays, analysis, explainers, interviews, and practical guides all share one clear reading system.</p>
            </div>
          </aside>
        </section>
      </main>
    </EditableSiteShell>
  )
}
