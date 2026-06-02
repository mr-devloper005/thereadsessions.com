'use client'

import { Mail, MessageSquareText, PenLine, Sparkles } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function ContactPage() {
  const lanes = [
    { icon: PenLine, title: 'Article pitches', body: 'Send essay ideas, explainers, interviews, opinion pieces, and recurring column concepts.' },
    { icon: MessageSquareText, title: 'Corrections and feedback', body: 'Flag article issues, source updates, broken links, or clarity problems in published pieces.' },
    { icon: Sparkles, title: 'Contributor support', body: 'Ask about formatting, author details, publishing workflow, or editorial fit before submitting.' },
  ]

  return (
    <EditableSiteShell className="bg-[var(--editable-page-bg,#fbfaf7)] text-[var(--editable-page-text,#1f1f1f)]">
      <main className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight sm:text-5xl">{pagesContent.contact.title}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 opacity-70">{pagesContent.contact.description}</p>
            <div className="mt-8 space-y-4">
              {lanes.map((lane) => (
                <div key={lane.title} className="rounded-xl border border-[var(--editable-border)] bg-white/80 p-5 shadow-sm">
                  <lane.icon className="h-5 w-5" />
                  <h2 className="mt-3 text-xl font-black tracking-tight">{lane.title}</h2>
                  <p className="mt-2 text-sm leading-7 opacity-70">{lane.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--editable-border)] bg-white p-7 shadow-[0_18px_54px_rgba(15,23,42,0.08)]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--slot4-accent)]"><Mail className="h-4 w-4" /> Editorial inbox</div>
            <h2 className="mt-5 text-2xl font-black tracking-tight">{pagesContent.contact.formTitle}</h2>
            <p className="mt-2 text-sm leading-7 opacity-65">Include article links, draft context, or the topic you want us to review.</p>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
