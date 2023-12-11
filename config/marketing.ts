import { MainNavItem, MarketingConfig } from "@/types"
import { foodCategories } from "./foodCategories"
import { slugify } from "@/lib/utils"

export const marketingConfig: MarketingConfig = {
  mainNav: [
    ...foodCategories.map((category) => ({
      title: category.title,
      items: [
        ...category.subcategories.map((subcategory) => ({
          title: subcategory.title,
          href: `/categories/${slugify(category.title)}/${subcategory.slug}`,
          description: subcategory.description,
          items: [],
        })),
      ],
    })),
    {
      title: "About us",
      href: "/about"
    }
  ] satisfies MainNavItem[],
}
