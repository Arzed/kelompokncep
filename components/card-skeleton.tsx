import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return (
    <Card className="">
      <CardHeader className="gap-2">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-7 w-4/5" />
      </CardHeader>
      <CardContent className="h-10" />
      <CardFooter className="justify-center">
        <Skeleton className="h-12 w-full" />
      </CardFooter>
    </Card>
  )
}
