'use client'

import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { catchError, isArrayOfFile } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { foodFormSchema } from "@/lib/validation/food"
import * as z from 'zod'
import { set, useForm } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
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
import { FoodCategory, Foods } from "@prisma/client"
import { Zoom } from "@/components/zoom-image"
import Image from "next/image"
import { FileWithPreview } from "@/types"
import { FileDialog } from "@/components/file-dialog"
import { OurFileRouter } from "@/app/api/uploadthing/core"
import { generateReactHelpers } from '@uploadthing/react/hooks'
import { updateProductAction } from '@/app/_actions/food'
import { toast as SonnerToast, toast } from 'sonner'
import { Edit } from "lucide-react"
import { useRouter } from "next/navigation"

type FormData = z.infer<typeof foodFormSchema>

interface UpdateMenuFormProps {
    food: Foods | null
}

const { useUploadThing } = generateReactHelpers<OurFileRouter>()

export function UpdateMenuForm({food}: UpdateMenuFormProps) {
    const router = useRouter()
    const [files, setFiles] = React.useState<FileWithPreview[] | null>(null)
    const [isPending, startTransition] = React.useTransition()
    const images = food?.gambar
    const gambar = [
        {
            name: `IMG: ${food?.namaMakanan}`,
            url: `${images}`
        }
    ]
  
    React.useEffect(() => {
        setFiles(
            gambar.map((image) => {
              const file = new File([], image.name, {
                type: "image",
              })
              const fileWithPreview = Object.assign(file, {
                preview: image.url,
              })
    
              return fileWithPreview
            })
          )
    }, [food])
  
    const { isUploading, startUpload } = useUploadThing('foodImage')
  
    const form = useForm<FormData>({
      resolver: zodResolver(foodFormSchema),
      defaultValues: {
        category: food?.category,
      },
    })
  
    const previews = form.watch("gambar") as FileWithPreview[] | null
    // const subcategories = getSubcategories(form.watch("category"))
  
    function onSubmit(data: FormData) {
      startTransition(async () => {
        try {
        //   await checkProductAction({
        //     name: data.name,
        //     id: product.id,
        //   })
  
          const images = isArrayOfFile(data.gambar)
            ? await startUpload(data.gambar).then((res) => {
                const formattedImages = res?.map((image) => ({
                  id: image.key,
                  name: image.key.split("_")[1] ?? image.key,
                  url: image.url,
                }))
                return formattedImages?.map(images => images.url).toString() ?? null
              })
            : null
  
          await updateProductAction({
            ...data,
            id: food?.id as string,
            gambar: images
          })
  
          toast.success("Product updated successfully.")
          form.reset()
          setFiles(null)
          router.push('/dashboard')
        } catch (err) {
          catchError(err)
        }
      })
    }
  
  return (
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
                defaultValue={food?.namaMakanan}
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
                defaultValue={food?.deskripsi as string}
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
                    onValueChange={(value: typeof field.value) =>
                        field.onChange(value)
                    }
                    defaultValue={food?.category}
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
            {/* <FormField
            control={form.control}
            name="subcategory"
            render={({ field }) => (
                <FormItem className="w-full">
                <FormLabel>Subcategory</FormLabel>
                <FormControl>
                    <Select
                    value={field.value?.toString()}
                    onValueChange={field.onChange}
                    >
                    <SelectTrigger>
                        <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        {subcategories.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                            {option.label}
                            </SelectItem>
                        ))}
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            /> */}
        </div>
        <div className="flex flex-col items-start gap-6 sm:flex-row">
            <FormItem className="w-full">
            <FormLabel>Harga</FormLabel>
            <FormControl>
                <Input
                placeholder="Harga menu."
                {...form.register("harga", {valueAsNumber: true})}
                defaultValue={food?.harga}
                />
            </FormControl>
            <UncontrolledFormMessage
                message={form.formState.errors.harga?.message}
            />
            </FormItem>
            {/* <FormItem className="w-full">
            <FormLabel>Stok</FormLabel>
            <FormControl>
                <Input
                type="number"
                inputMode="numeric"
                placeholder="Type product inventory here."
                {...form.register("stok", {
                    valueAsNumber: true,
                })}
                />
            </FormControl>
            <UncontrolledFormMessage
                message={form.formState.errors.stok?.message}
            />
            </FormItem> */}
        </div>
        <FormItem className="flex w-full flex-col gap-1.5">
            <FormLabel>Images</FormLabel>
            {/* {!isUploading && previews?.length ? (
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
            ) : null} */}
            {!isUploading && food?.gambar ? (
            <div className="flex items-center gap-2">
                <Zoom>
                    <Image
                    src={food.gambar}
                    alt={food.namaMakanan}
                    className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                    width={80}
                    height={80}
                    />
                </Zoom>
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
            Perbarui
            <span className="sr-only">Add Product</span>
        </Button>
        </form>
    </Form>
  )
}
