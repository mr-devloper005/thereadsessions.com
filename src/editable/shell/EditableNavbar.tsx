'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, UserPlus, LogIn, X, PlusCircle, UserCircle, LogOut } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const brandName = globalContent.site.name
  const navItems = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled).map((task) => ({ label: task.label, href: task.route })),
    []
  )

  useEffect(() => {
    setHydrated(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[var(--slot4-surface-bg)]/92 text-[var(--slot4-page-text)] backdrop-blur-2xl">
      <nav className="mx-auto flex min-h-[72px] w-full max-w-[var(--slot4-container, 1180px)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3">
          <img src="/favicon.png?v=20260413" alt={brandName} className="h-8 w-8 object-contain" />
          <span className="hidden min-w-0 sm:block">
            <span className="block max-w-[190px] truncate text-xl font-extrabold tracking-tight">{brandName}</span>
            <span className="block max-w-[190px] truncate text-[10px] font-bold uppercase tracking-[0.18em] opacity-55">{globalContent.nav?.tagline || SITE_CONFIG.tagline}</span>
          </span>
        </Link>

        <form action="/search" className="mx-auto hidden min-w-0 flex-1 justify-center md:flex">
          <label className="relative flex w-full max-w-md items-center rounded-full border border-black/[0.06] bg-[var(--slot4-panel-bg)] px-4 py-2.5 shadow-sm">
            <Search className="h-4 w-4 opacity-55" />
            <input name="q" type="search" placeholder="Search articles" className="min-w-0 flex-1 bg-transparent px-3 text-sm font-semibold outline-none placeholder:text-current/45" />
          </label>
        </form>

        <div className="hidden items-center gap-2 lg:flex">
          {navItems.slice(0, 4).map((item) => {
            const active = hydrated && pathname && (pathname === item.href || pathname.startsWith(`${item.href}/`))
            return (
              <Link key={item.href} href={item.href} className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${active ? 'bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)]' : 'hover:bg-black/5'}`}>
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {session ? (
            <>
              <Link href="/create" className="hidden items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-4 py-2.5 text-sm font-extrabold text-[var(--slot4-dark-text)] shadow-sm sm:inline-flex"><PlusCircle className="h-4 w-4" /> Write</Link>
              <Link href="/create" className="hidden max-w-[180px] items-center gap-2 truncate rounded-full border border-black/[0.06] bg-[var(--slot4-surface-bg)] px-3 py-2 text-sm font-extrabold hover:bg-black/5 sm:inline-flex"><UserCircle className="h-4 w-4 shrink-0" /> <span className="truncate">{session.name}</span></Link>
              <button type="button" onClick={logout} className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-extrabold hover:bg-black/5 sm:inline-flex"><LogOut className="h-4 w-4" /> Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-extrabold hover:bg-black/5 sm:inline-flex"><LogIn className="h-4 w-4" /> Login</Link>
              <Link href="/signup" className="hidden items-center gap-2 rounded-full bg-[var(--slot4-dark-bg)] px-4 py-2.5 text-sm font-extrabold text-[var(--slot4-dark-text)] shadow-sm sm:inline-flex"><UserPlus className="h-4 w-4" /> Sign up</Link>
            </>
          )}
          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full border border-black/[0.06] bg-[var(--slot4-surface-bg)] p-2 lg:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-black/[0.06] bg-[var(--slot4-surface-bg)] px-4 py-4 lg:hidden">
          <form action="/search" className="mb-4 flex rounded-xl border border-black/[0.06] bg-[var(--slot4-panel-bg)] px-3 py-2">
            <Search className="mt-1 h-4 w-4 opacity-55" />
            <input name="q" type="search" placeholder="Search articles" className="min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
          </form>
          {session ? <div className="mb-3 rounded-xl border border-black/[0.06] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm font-extrabold">Signed in as {session.name}</div> : null}
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, ...navItems, { label: 'Contact', href: '/contact' }, ...(session ? [{ label: 'Write article', href: '/create' }] : [{ label: 'Login', href: '/login' }, { label: 'Sign up', href: '/signup' }])].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl border border-black/[0.06] bg-[var(--slot4-surface-bg)] px-4 py-3 text-sm font-extrabold">
                {item.label}
              </Link>
            ))}
            {session ? <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-xl border border-black/[0.06] bg-[var(--slot4-surface-bg)] px-4 py-3 text-left text-sm font-extrabold">Logout</button> : null}
          </div>
        </div>
      ) : null}
    </header>
  )
}
