import { type Metadata } from "next"
import { notFound } from "next/navigation"
import db from "@/lib/db"
import { UpdateMenuForm } from "@/components/food/update-menu-form"
import { DashboardShell } from "@/components/shell"
import { DashboardHeader } from "@/components/header"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import Link from "next/link"
import { cn } from "@/lib/utils"
// import { ProductPager } from "@/components/pagers/product-pager"

export const metadata: Metadata = {
  // metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Product",
  description: "Manage your product",
}

interface UpdateProductPageProps {
  params: {
    menu: string
  }
}

export default async function UpdateProductPage({ params }: UpdateProductPageProps) {
  const food = await db.foods.findFirst({
    where: {
      id: params.menu
    }
  })

  // if (!food) {
  //   notFound()
  // }

  return (
    <DashboardShell>
      <DashboardHeader heading="Edit" text="Buat dan Atur Menu">
        {/* <PostCreateButton /> */}
        {/* <AddFoodForm /> */}
        <Link href="/dashboard" className={cn(buttonVariants({variant: "outline"}), 'flex')}>
          <Icons.chevronLeft className="h-5 w-5 mr-2" />
          Kembali
        </Link>
      </DashboardHeader>
      {/* <div>
        {posts?.length ? (
          <div className="divide-y divide-border rounded-md border">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any posts yet. Start creating content.
            </EmptyPlaceholder.Description>
            <PostCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div> */}
      <div className="divide-y divide-border rounded-md border p-5">
        <UpdateMenuForm food={food} />
      </div>
    </DashboardShell>
  )
}
