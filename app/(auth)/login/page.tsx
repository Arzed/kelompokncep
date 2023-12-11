/* eslint-disable react/jsx-no-undef */
import { Metadata } from "next"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { UserAuthForm } from "@/components/user-auth-form"
import Image from "next/image"
import { getCurrentUser } from "@/lib/session"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
}

export default async function LoginPage() {
  const user = await getCurrentUser()
  if(user) {
    redirect('/')
  }
  return (
    <div className="container relative h-[700px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden sm:h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <Image src='/login.jpg' alt="mart" width={900} height={1400} className="absolute h-[100vh] inset-0 w-full" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Icons.logo />
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto my-32 sm:my-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Selamat datang kembali
            </h1>
            <p className="text-sm text-muted-foreground">
              Silahkan masukkan username dan password
            </p>
          </div>
          <UserAuthForm />
        </div>
      </div>
    </div>
  )
}