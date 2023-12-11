import { FoodCategory } from "@prisma/client"
import * as z from "zod"

export const foodFormSchema = z.object({
  namaMakanan: z.string(),
  harga: z.number().min(1000, { message : "Nominal harga terendah adalah Rp. 1.000"}),
  deskripsi: z.string().optional(),
  category: z.nativeEnum(FoodCategory, { required_error: "Masukkan kategori menu"}),
  subCategory: z.string().optional(),
  gambar: z
  .unknown()
  .refine((val) => {
    if (!Array.isArray(val)) return false
    if (val.some((file) => !(file instanceof File))) return false
    return true
  }, "Gambar tidak boleh kosong")
  .optional(),
  isAvailable: z.boolean()
})

export const getFoodSchema = z.object({
  id: z.string(),
})

export const ChangeStockSchema = z.object({
  id: z.string(),
  isAvailable: z.boolean()
})