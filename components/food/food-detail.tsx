'use client'

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "../icons"
import { cn } from "@/lib/utils"
import { useToast } from "../ui/use-toast"
import * as z from 'zod'
import { useState } from "react"
// import axios from 'axios';
import { Textarea } from "../ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from "next/image"
import { format } from "@/lib/currency"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Checkbox } from "../ui/checkbox"
import { Separator } from "../ui/separator"
import { EmptyPlaceholder } from "../empty-placeholder"

interface FoodDetailProps {
  food: {
    namaMakanan: string
    harga: number
    deskripsi: string | null
    category: string
    gambar: string | null
    isAvailable: boolean
  }
}

export function FoodDetail({ food } : FoodDetailProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full rounded bg-yellow-400 p-4 text-sm font-medium dark:text-black transition hover:scale-105"
          disabled={!food.isAvailable}
        >
          Tambahkan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        {/* <DialogHeader>
          <DialogTitle className="capitalize">{food.namaMakanan}</DialogTitle>
        </DialogHeader> */}
        <div className="flex">
          <div className="flex font-sans">
            <form className="flex-auto p-6">
              <p className="my-2 flex-auto capitalize text-xl font-semibold text-gray-900">
                {food.namaMakanan}
              </p>
              <div className="my-2 text-lg font-semibold text-black-500">
                {format(food.harga)}
              </div>
              <Separator className="my-4" />
              <RadioGroup defaultValue="comfortable">
                <p>Optional</p>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="r1" />
                  <Label htmlFor="r1">Biasa <span className="text-foreground/60">Gratis</span></Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comfortable" id="r2" />
                  <Label htmlFor="r2">Pedas <span className="text-foreground/60">Gratis</span></Label>
                </div>
              </RadioGroup>
              <Separator className="my-4" />
              <p>Topping</p>
              <div className="flex my-2 items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Telor
                </label>
              </div>
              {/* <div className="flex my-2 items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Bakso
                </label>
              </div>
              <div className="flex my-2 items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Sosis
                </label>
              </div> */}
            </form>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={() => console.log(food)} >
            {/* {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )} */}
            Tambahkan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
