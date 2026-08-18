'use client'

import Link from 'next/link'
import { ArrowUpRight, LogOut, UserCircle } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const brandName = globalContent.site.name

  return (
    <footer className="border-t border-black/[0.06] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/favicon.png?v=20260413" alt={brandName} className="h-8 w-8 object-contain" />
            <span className="text-lg font-extrabold tracking-tight">{brandName}</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-7 opacity-70">{globalContent.footer?.description || SITE_CONFIG.description}</p>
        </div>

        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-[0.22em] opacity-55">Explore</h3>
          <div className="mt-4 grid gap-2">
            {taskLinks.map((task) => (
              <Link key={task.key} href={task.route} className="inline-flex items-center gap-2 text-sm font-bold opacity-75 hover:opacity-100">
                {task.label} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-[0.22em] opacity-55">Site</h3>
          <div className="mt-4 grid gap-2">
            {session ? <span className="inline-flex items-center gap-2 text-sm font-bold opacity-75"><UserCircle className="h-4 w-4" /> {session.name}</span> : null}
            {[
              ['About', '/about'],
              ['Contact', '/contact'],
              ...(session ? [['Write article', '/create']] : [['Login', '/login'], ['Sign up', '/signup']]),
            ].map(([label, href]) => (
              <Link key={href} href={href} className="text-sm font-bold opacity-75 hover:opacity-100">{label}</Link>
            ))}
            {session ? <button type="button" onClick={logout} className="inline-flex items-center gap-2 text-left text-sm font-bold opacity-75 hover:opacity-100"><LogOut className="h-4 w-4" /> Logout</button> : null}
          </div>
        </div>
      </div>
      <div className="border-t border-black/[0.06] px-4 py-5 text-center text-xs font-bold opacity-55">
        Copyright {year} {brandName}. All rights reserved.
      </div>
    </footer>
  )
}
