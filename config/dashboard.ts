import { DashboardConfig } from "@/types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Documentation",
      href: "/docs",
      disabled: true
    },
    {
      title: "Support",
      href: "/support",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Dashboard",
      href: "/Dashboard",
      icon: 'home',
    },
    // {
    //   title: "Settings",
    //   href: "/dashboard/settings",
    //   icon: "settings",
    // },
  ],
}
