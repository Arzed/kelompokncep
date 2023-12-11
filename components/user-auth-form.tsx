"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form";
import { userAuthSchema } from "@/lib/validation/auth"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn, useSession } from 'next-auth/react'
import * as z from 'zod';
import { useToast } from "./ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type FormData = z.infer<typeof userAuthSchema>

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
  })
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get("callbackUrl") as string
  const { toast } = useToast()

  async function onSubmit(data: FormData) {
    setIsLoading(true)

    console.log(data)
    
    const signInResult = await signIn('credentials', { 
    ...data, 
    callbackUrl: callbackUrl,
    // redirect: false,
    })

    setIsLoading(false)

    if (signInResult?.error) {
      return toast({
        title: "Username/Password invalid",
        description: "Masukkan username atau password yang benar",
        variant: 'destructive',
      })
    }

    if (signInResult?.ok) {
      console.log("success")
      // router.push('/')
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="name">
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="username"
            autoCapitalize="none"
            autoCorrect="off"
            disabled={isLoading || isGoogleLoading}
            {...register("name")}
          />
          {errors?.name && (
            <p className="px-1 text-xs text-red-600">
              {errors.name.message}
            </p>
          )}
          <Label className="sr-only" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            placeholder="*********"
            type="password"
            autoCapitalize="none"
            disabled={isLoading || isGoogleLoading}
            {...register("password")}
          />
          {errors?.name && (
            <p className="px-1 text-xs text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>
        <button type="submit" className={cn(buttonVariants())} disabled={isLoading}>
          {isLoading && (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          )}
          Sign In
        </button>
      </div>
    </form>
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
    </div>
    <button
      type="button"
      className={cn(buttonVariants({ variant: "outline" }))}
      onClick={() => {
        setIsGoogleLoading(true)
        signIn("google")
      }}
      disabled={isLoading || isGoogleLoading}
    >
      {isGoogleLoading ? (
        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <svg className="mr-2" fill="#000000" height="1rem" width="1rem" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
          viewBox="0 0 210 210" xmlSpace="preserve">
        <path d="M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40
          c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105
          S0,162.897,0,105z"/>
        </svg>
      )}{" "}
      Google
    </button>
  </div>
  )
}