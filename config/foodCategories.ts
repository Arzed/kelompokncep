import { Foods } from "@prisma/client"

export const foodCategories = [
    {
      title: "MAKANAN",
      image: "/images/skateboard-one.webp",
      subcategories: [
        {
          title: "Makanan Berat",
          description: "Andalan ketika perut laper.",
          image: "/images/deck-one.webp",
          slug: "makanan-berat",
        },
        {
          title: "Snack",
          description: "Temani harimu dengan ngemil.",
          image: "/images/wheel-one.webp",
          slug: "snack",
        },
      ],
    },
    {
      title: "MINUMAN",
      image: "/images/clothing-one.webp",
      subcategories: [
        {
          title: "Jus",
          description: "Sejukkan harimu dengan jus yang fresh.",
          slug: "juice",
        },
        {
          title: "Coffe",
          description: "Mulai harimu dengan menikmati kopi.",
          slug: "coffe",
        },
      ],
    },
  ] satisfies {
    title: Foods["category"]
    image: string
    subcategories: {
      title: string
      description?: string
      image?: string
      slug: string
    }[]
  }[]