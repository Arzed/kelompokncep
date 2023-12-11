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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { catchError, cn, isArrayOfFile } from "@/lib/utils"
import { useToast } from "../ui/use-toast"
import { zodResolver } from "@hookform/resolvers/zod"
import { foodFormSchema } from "@/lib/validation/food"
import * as z from 'zod'
import { useForm } from "react-hook-form"
import { ChangeEvent, useState, useTransition } from "react"
import axios from 'axios';
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "@/components/ui/form"
import { FoodCategory } from "@prisma/client"
import { Zoom } from "@/components/zoom-image"
import Image from "next/image"
import { FileWithPreview } from "@/types"
import { FileDialog } from "@/components/file-dialog"
import { OurFileRouter } from "@/app/api/uploadthing/core"
import { generateReactHelpers } from '@uploadthing/react/hooks'
import { addFoodAction } from '@/app/_actions/food'
import { toast as SonnerToast } from 'sonner'
import { Checkbox } from "../ui/checkbox"

type FormData = z.infer<typeof foodFormSchema>

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function AddFoodForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(foodFormSchema)
  })
  const [files, setFiles] = useState<FileWithPreview[] | null>(null)
  const [cat, setCat] = useState<string>("")
  const [isPending, startTransition] = useTransition()
  // const [isUploading, setIsUploading] = useState<boolean>(false)
  const { isUploading, startUpload } = useUploadThing("foodImage")
  // const session = useSession()
  const { toast } = useToast()
  const previews = form.watch("gambar") as FileWithPreview[] | null
  const subcategories = {
      makanan: [
        {
          value: "makanan berat"
        },
        {
          value: "snack"
        }
      ],
      minuman: [
        {
          value: 'juice'
        },
        {
          value: 'coffe'
        }
      ]
  }

  async function onSubmit(data: FormData) {
    startTransition(async () => {
      try {
        // await checkFoodAction({
        //   name: data.namaMakanan,
        // })

        const gambar = isArrayOfFile(data.gambar)
          ? await startUpload(data.gambar).then((res) => {
              const formattedImages = res?.map((image) => ({
                id: image.key,
                name: image.key.split("_")[1] ?? image.key,
                url: image.url,
              }))
              return formattedImages?.map(image => image.url).toString() ?? null
            })
          : null

        await addFoodAction({
          ...data,
          // storeId,
          gambar,
        })

        SonnerToast.success("Menu berhasil di tambahkan")
        
        form.reset()
        setFiles(null)
      } catch (err) {
        catchError(err)
      }
    })
  }

  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          Tambahkan
          <Icons.add className="w-4 h-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Tambahkan</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            className="grid w-full max-w-2xl gap-5"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  aria-invalid={!!form.formState.errors.namaMakanan}
                  placeholder="Type product name here."
                  {...form.register("namaMakanan")}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.namaMakanan?.message}
              />
            </FormItem>
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type product description here."
                  {...form.register("deskripsi")}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.deskripsi?.message}
              />
            </FormItem>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value: typeof field.value) => {
                          field.onChange(value)
                          setCat(value)
                        }}
                      >
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder={field.value} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {Object.values(FoodCategory).map(
                              (option) => (
                                <SelectItem
                                  key={option}
                                  value={option}
                                  className="capitalize"
                                >
                                  {option}
                                </SelectItem>
                              )
                            )}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subCategory"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Subcategory</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.toString()}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="capitalize">
                          <SelectValue placeholder="Select a subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {cat.toLocaleLowerCase() === "makanan" ?
                            (subcategories.makanan.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="capitalize">
                                {option.value}
                              </SelectItem>
                            ))) : subcategories.minuman.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="capitalize">
                                {option.value}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col items-start gap-6 sm:flex-row">
              <FormItem className="w-full">
                <FormLabel>Harga</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Harga menu."
                    {...form.register("harga", {valueAsNumber: true})}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.harga?.message}
                />
              </FormItem>
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="mt-2">
                    <FormLabel className="flex">
                      Stok
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Icons.help className="h-4 w-4 ml-2" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="flex justify-between space-x-4">
                            <div className="space-y-1">
                              <h4 className="text-sm font-semibold">Stok</h4>
                              <p className="text-sm">
                                Checklist menandakan ketersediaan barang
                              </p>
                            </div>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* <FormItem className="mt-2">
                <FormLabel className="flex">
                  
                </FormLabel>
                <FormControl>
                  <Checkbox
                    {...form.register("isAvailable")}
                  />
                </FormControl>
                <UncontrolledFormMessage
                  message={form.formState.errors.isAvailable?.message}
                />
              </FormItem> */}
            </div>
            <FormItem className="flex w-full flex-col gap-1.5">
              <FormLabel>Images</FormLabel>
              {!isUploading && previews?.length ? (
                <div className="flex items-center gap-2">
                  {previews.map((file) => (
                    <Zoom key={file.name}>
                      <Image
                        src={file.preview}
                        alt={file.name}
                        className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                        width={80}
                        height={80}
                      />
                    </Zoom>
                  ))}
                </div>
              ) : null}
              <FormControl>
                <FileDialog
                  setValue={form.setValue}
                  name="gambar"
                  maxFiles={1}
                  maxSize={1024 * 1024 * 4}
                  files={files}
                  setFiles={setFiles}
                  isUploading={isUploading}
                  disabled={isPending}
                />
              </FormControl>
              <UncontrolledFormMessage
                message={form.formState.errors.gambar?.message}
              />
            </FormItem>
            <Button className="w-fit" disabled={isPending}>
              {isPending && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Tambahkan
              <span className="sr-only">Add Product</span>
            </Button>
          </form>
        </Form>
        
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
