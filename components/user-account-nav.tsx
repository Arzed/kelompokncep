"use client"

import Link from "next/link"
import { User } from "@prisma/client"
import { signOut } from "next-auth/react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user-avatar"

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email" | "userRole">
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name, image: user.image || null }}
          className="h-8 w-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name}</p>
            {user.email && (
              <p className="w-[200px] truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          {user.userRole === "ADMIN" ? (
            <Link href="/dashboard">Dashboard</Link>
          ) : (
            // <Link href="#">Profil</Link>
            <div className="cursor-not-allowed">Profil</div>
          )}
        </DropdownMenuItem>
        {/* <DropdownMenuItem asChild>
          {user.userRole === "ADMIN" && (
            // <Link href="/dashboard/orders">Orders</Link>
            <div className="cursor-not-allowed">Orders</div>
            )}
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          {user.userRole === "ADMIN" && (
            // <Link href="/dashboard/settings">Settings</Link>
            <div className="cursor-not-allowed">Settings</div>
          )}
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault()
            signOut(
              // callbackUrl: `${window.location.origin}/login`,
            )
          }}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
