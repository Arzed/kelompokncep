import { User } from "@prisma/client"
import type { Icon } from "lucide-react"
import { type FileWithPath } from "react-dropzone"

import { Icons } from "@/components/icons"

export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
  label?: string
  description?: string
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export type MainNavItem = NavItemWithOptionalChildren

// export type MainNavItem = NavItem

export type SidebarNavItem = {
  title: string
  disabled?: boolean
  external?: boolean
  icon?: keyof typeof Icons
} & (
  | {
    href: string
      items?: never
    }
  | {
      href?: string
      items: NavLink[]
    }
    )
    
    export type SiteConfig = {
      name: string
      description: string
      // url: string
  // ogImage: string
  // links: {
    //   twitter: string
    //   github: string
    // }
}

export type DocsConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type MarketingConfig = {
  mainNav: MainNavItem[]
}

export type DashboardConfig = {
  mainNav: MainNavItem[]
  sidebarNav: SidebarNavItem[]
}

export type SubscriptionPlan = {
  name: string
  description: string
  stripePriceId: string
}

export type UserSubscriptionPlan = SubscriptionPlan &
Pick<User, "stripeCustomerId" | "stripeSubscriptionId"> & {
  stripeCurrentPeriodEnd: number
  isPro: boolean
}

export type FileWithPreview = FileWithPath & {
  preview: string
}

export interface StoredFile {
  id: string
  name: string
  url: string
}