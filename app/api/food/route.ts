import { NextResponse } from "next/server";

import db from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { toast } from "sonner";


export async function POST(req: Request) {
    const user = await getCurrentUser();

    if(!user) {
        throw new Error("Unauthorized, Please Sign in first")
    }
  try {
    const body = await req.json();

    console.log(body)

    const { 
    namaMakanan,
    harga,
    category,
    deskripsi,
    gambar,
   } = body;

    if (!user) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const productWithSameName = await db.foods.findFirst({
      where: {
        namaMakanan: namaMakanan
      }
    })
  
    if (productWithSameName) {
      throw new Error(`Makanan dengan nama ${productWithSameName} sudah ada`)
    }

    const food = await db.foods.create({
      data: {
        namaMakanan,
        harga,
        category,
        deskripsi,
        gambar,
      },
    });

    return NextResponse.json(food);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// export async function GET(
//   req: Request,
//   { params }: { params: { storeId: string } }
// ) {
//   try {

//     const { searchParams } = new URL(req.url);
//     const categoryId = searchParams.get("categoryId") || undefined;
//     const colorId = searchParams.get("colorId") || undefined;
//     const sizeId = searchParams.get("sizeId") || undefined;
//     const isFeatured = searchParams.get("isFeatured");

//     if (!params.storeId) {
//       return new NextResponse("Store id is required", { status: 400 });
//     }

//     const products = await prismadb.product.findMany({
//       where: {
//         storeId: params.storeId,
//         categoryId,
//         colorId,
//         sizeId,
//         isFeatured: isFeatured ? true : undefined,
//         isArchived: false
//       },
//       include: {
//         images: true,
//         category: true,
//         color: true,
//         size: true
//       },
//       orderBy: {
//         createdAt: "desc"
//       }
//     });

//     return NextResponse.json(products);
//   } catch (error) {
//     console.log("[PRODUCTS_GET]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
