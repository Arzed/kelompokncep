"use server"

import { type z } from 'zod'
import db from '@/lib/db'
import { ChangeStockSchema, foodFormSchema, getFoodSchema } from "@/lib/validation/food"
import { StoredFile } from '@/types'
import { FoodCategory } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { Prisma, PrismaClient } from "@prisma/client";
import { catchError } from '@/lib/utils'
// import { massageProductClient } from "../../../helpers/massageProductClient";

export async function checkFoodAction(data: { namaMakanan: string; id?: string }) {
    // const productWithSameName = await db.foods.findFirst({
    //   where: data.id
    //     ? and(not(eq(products.id, input.id)), eq(products.name, input.name))
    //     : eq(products.name, input.name),
    // })

    const productWithSameName = await db.foods.findFirst({
      where: {
        id: data.id,
        namaMakanan: data.namaMakanan
      }
    })
  
    if (productWithSameName) {
      throw new Error("Menu dengan nama tersebut sudah ada.")
    }
  }

export async function addFoodAction(data: z.infer<typeof foodFormSchema>) {
      console.log(data)
    const productWithSameName = await db.foods.findFirst({
      where: {
        namaMakanan: data.namaMakanan
      }
    })
  
    if (productWithSameName) {
      throw new Error(`Makanan dengan nama ${data.namaMakanan} sudah ada`)
    }

    // try {
      // } catch (error) {
        //     console.error(error)
    // }

    
    // await db.foods.create({
    await db.foods.create({
        data: data as any
    })
    //   ...data,
    //   storeId: data.storeId,
    //   gambar: data.gambar,
    // })
  
    revalidatePath(`/dashboard`)
}

export async function deleteProductAction( data: z.infer<typeof getFoodSchema> ) {
    // await db.delete(products).where(and(eq(products.id, input.id), eq(products.storeId, input.storeId)))
    const foods = await db.foods.delete({
      where: {
        id: data.id
      }
    })
    revalidatePath('/dashboard')
}

export async function updateProductAction(
  data: z.infer<typeof foodFormSchema> & {
    id: string
    gambar: string | null
  }
) {
  const food = await db.foods.findFirst({
    // where: {and(eq(products.id, input.id), eq(products.storeId, input.storeId)),
  // }
    where: {
      id: data.id
    }
  })

  if (!food) {
    throw new Error("Menu tidak di temukan.")
  }
  await db.foods.update({
    where: {
      id: data.id
    },
    data: data
  })

  revalidatePath(`/dashboard`)
}

export async function changeStock(
  data: z.infer<typeof ChangeStockSchema>) {
    const food = await db.foods.findFirst({
      where: {
        id: data.id
      }
    })

    if(!food) {
      throw new Error("Menu tidak ditemukan")
    }

    await db.foods.update({
      where: {
        id: data.id
      },
      data: {
        isAvailable: !data.isAvailable
      }
    })

    revalidatePath('/dashboard')
}

export async function getMenuById(menuId: string) {

  try {
    const food = await db.foods.findFirst({
      where: { id: menuId }
    })
  
    return food
  } catch (error) {
    console.error(error)
  }
}

export async function getToppingByCategory(category: FoodCategory) {
  try {
    const topping = await db.topping.findMany({
      where: {
        toppingType: category
      }
    })
    return topping
  } catch (error) {
    catchError(error)
  }
}