import Link from "next/link"

import { marketingConfig } from "@/config/marketing"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { MainNav } from "@/components/main-nav"
import { SiteFooter } from "@/components/site-footer"
import { UserAccountNav } from "@/components/user-account-nav"
import { getCurrentUser } from "@/lib/session"
import { notFound, redirect } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MobileNav } from "@/components/mobile-nav"
import { siteConfig } from "@/config/site"
import { dashboardConfig } from "@/config/dashboard"

interface MarketingLayoutProps {
  children: React.ReactNode
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  const user = await getCurrentUser() as any
  return (
    <div className="flex">
      <ScrollArea className="max-h-[100vh] w-full rounded-md border">
        <header className="fixed px-10 backdrop-blur-sm bg-background/75 z-50 top-0 left-0 right-0 h-20 border-b border-slate-300 dark:border-slate-700 shadow-sm">
          <div className="flex h-20 items-center justify-between py-6">
            <MainNav items={marketingConfig.mainNav} />
            <MobileNav
              mainNavItems={marketingConfig.mainNav}
            />
            <nav>
              {user ? (
                <UserAccountNav
                  user={{
                  userRole: user.userRole,
                  name: user?.name as string,
                  image: user?.image || null,
                  email: user?.email || null,
                }}
                />
                ) : (
                <Link href={"/login?callbackUrl=/"} className={cn(buttonVariants({variant: 'outline'}), )}>Login</Link>
              )
              }
            </nav>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
        <SiteFooter className="-translate-y-0" />
      </ScrollArea>
    </div>
  )
}