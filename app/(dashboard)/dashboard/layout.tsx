import { notFound, redirect } from "next/navigation"

import { dashboardConfig } from "@/config/dashboard"
import { getCurrentUser } from "@/lib/session"
import { MainNav } from "@/components/main-nav"
import { DashboardNav } from "@/components/nav"
import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"
import Cart from "@/components/cart"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DashboardLayoutProps {
  children?: React.ReactNode
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const user = await getCurrentUser() as any
  if (!user) {
    redirect("/login")
  }

  if(user.userRole !== "ADMIN") {
    return notFound()
  }

  return (
    <div className="flex">
      <ScrollArea className="max-h-[100vh] -translate-y-4 w-full">
        <div className="flex min-h-screen flex-col">
          <header className="fixed px-10 py-4 backdrop-blur-md bg-background/70 z-50 top-0 left-0 right-0 h-24 border-b border-slate-300 dark:border-slate-700 shadow-sm">
            <div className="container flex h-20 items-center justify-between py-4">
              <MainNav items={dashboardConfig.mainNav} />
              {/* <Cart /> */}
              <UserAccountNav
                user={{
                  userRole: user.userRole,
                  name: user?.name as string,
                  image: user?.image || null,
                  email: user?.email || null,
                }}
              />
            </div>
          </header>
          <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr] mt-32">
            <aside className="hidden w-[200px] flex-col md:flex">
              <DashboardNav items={dashboardConfig.sidebarNav} />
            </aside>
            <main className="flex w-full flex-1 flex-col overflow-hidden my-4">
              {children}
            </main>
          </div>
          <SiteFooter className="border-t" />
        </div>
      </ScrollArea>
    </div>
  )
}