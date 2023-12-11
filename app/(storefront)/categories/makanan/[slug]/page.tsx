import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { FoodDetail } from '@/components/food/food-detail';
import { format } from '@/lib/currency';
import db from '@/lib/db'
import Image from 'next/image';

export const fetchFoodsByCategory = async (subCategory: string) => {
    const foods = await db.foods.findMany({
      where: {
        category: "MAKANAN",
        subCategory: subCategory,
      },
    });
    
    return foods;
  };

export default async function FoodCategoryPage({ params }: { params: { slug: string }}) {
  const foods = await fetchFoodsByCategory(params.slug.replace("-", " "))
  return (
      <section
        id="features"
        className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            {params.slug}
          </h2>
          {/* <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque rhoncus magna neque, id lacinia ipsum rhoncus vel. Praesent ornare gravida nunc a dictum. Donec quis dui nec tellus ullamcorper congue
          </p> */}
        </div>
        <div className="grid justify-center gap-4 sm:grid-cols-2 md:max-w-[84rem] md:grid-cols-4">
          {foods.map((food) => (
            <div className="flex h-[480px] flex-col justify-between rounded-md p-6 bg-slate-100 dark:bg-slate-800" key={food.id}>
              <div className="group relative block overflow-hidden">
                <button
                    className="absolute end-4 top-4 z-10 rounded-full bg-white p-1.5 text-gray-900 transition hover:text-gray-900/75"
                >
                    <span className="sr-only">Wishlist</span>

                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-4 w-4"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                    />
                    </svg>
                </button>

                {food.gambar ? 
                  <Image
                      src={`${food.gambar}`}
                      alt=""
                      width={300}
                      height={300}
                      className="h-54 w-full transition object-cover duration-500 hover:scale-105 sm:h-64"
                  />
                  :
                  <EmptyPlaceholder className="min-h-54 w-full">
                    <EmptyPlaceholder.Icon name="image" />
                    <EmptyPlaceholder.Title>No Image</EmptyPlaceholder.Title>
                    <EmptyPlaceholder.Description>
                      Menu Ini tidak memiliki gambar
                    </EmptyPlaceholder.Description>
                    {/* <PostCreateButton variant="outline" /> */}
                  </EmptyPlaceholder>
                }


                <div className="relative p-6">
                    {/* <span
                    className="whitespace-nowrap bg-yellow-400 px-3 py-1.5 text-xs dark:text-black font-medium"
                    >
                    New
                    </span> */}

                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white capitalize">{food.namaMakanan}</h3>

                    <p className="mt-1.5 text-sm text-gray-700 dark:text-white">{format(food.harga)}</p>

                    {/* <Button className="block w-full mt-4 h-14 bg-yellow-400 transition hover:bg-yellow-300 dark:text-black hover:scale-105">Tambahkan</Button> */}

                    <form className="mt-4">
                      <FoodDetail food={food} />
                    </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
  )
}