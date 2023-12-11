import { redirect } from "next/navigation"

// import { authOptions } from "@/lib/auth"
// import { db } from "@/lib/db"
// import { getCurrentUser } from "@/lib/session"
import { EmptyPlaceholder } from "@/components/empty-placeholder"
import { DashboardHeader } from "@/components/header"
// import { PostCreateButton } from "@/components/post-create-button"
// import { PostItem } from "@/components/post-item"
import { DashboardShell } from "@/components/shell"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { AddFoodForm } from "@/components/food/add-food-form"
import DataTable from "@/components/menu-list"
import { columns } from "./columns"
import db from '@/lib/db'

export const metadata = {
  title: "Dashboard",
}

export default async function DashboardPage() {
  const data = await db.foods.findMany({
    orderBy: {
      namaMakanan: { sort: 'asc', nulls: ""}
    }
  });
  // const topping = await db.topping.findMany()
//   const user = await getCurrentUser()

//   if (!user) {
//     redirect(authOptions?.pages?.signIn || "/login")
//   }

//   const posts = await db.post.findMany({
//     where: {
//       authorId: user.id,
//     },
//     select: {
//       id: true,
//       title: true,
//       published: true,
//       createdAt: true,
//     },
//     orderBy: {
//       updatedAt: "desc",
//     },
//   })

  return (
    <DashboardShell>
      <DashboardHeader heading="Menu" text="Buat dan Atur Menu">
        {/* <PostCreateButton /> */}
        <AddFoodForm />
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
      <div className="divide-y divide-border rounded-md border">
        <DataTable columns={columns} data={data} />
      </div>
    </DashboardShell>
  )
}