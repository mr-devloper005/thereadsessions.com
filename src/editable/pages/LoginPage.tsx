import type { Metadata } from 'next'
import Link from 'next/link'
import { BookOpen, PenLine, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        <section className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-[1180px] items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:px-8">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] opacity-55">{pagesContent.auth.login.badge}</p>
            <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-lg text-sm leading-8 opacity-70">{pagesContent.auth.login.description}</p>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {[
                { icon: BookOpen, label: 'Resume reading' },
                { icon: PenLine, label: 'Draft articles' },
                { icon: Search, label: 'Search topics' },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-black/[0.06] bg-white/75 p-4 text-sm font-extrabold shadow-sm">
                  <item.icon className="mb-3 h-5 w-5 text-[var(--slot4-accent)]" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-black/[0.06] bg-white/85 p-6 shadow-[0_18px_70px_rgba(0,0,0,0.14)] backdrop-blur sm:p-8">
            <h2 className="text-2xl font-extrabold tracking-[-0.04em]">{pagesContent.auth.login.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-5 text-sm opacity-70">New here? <Link href="/signup" className="font-extrabold underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
