import type { ComponentProps } from 'react'

import { RatingStars } from '@/components/atoms/rating-stars'
import { Skeleton } from '@/components/ui/skeleton'

import { formatRatingNumber } from '@/services/location/utils'

import { cn } from '@/lib/utils'

const LocationMeta = ({
    name,
    category,
    rating,
    address,
    className,
    ...props
}: ComponentProps<'div'> & {
    name: string
    category: string
    rating?: number
    address: string
}) => (
    <div className={cn('flex flex-col gap-1.5 py-4 **:leading-tight', className)} {...props}>
        <h1 className="text-2xl font-bold tracking-tight">{name}</h1>
        <p className="text-subtitle line-clamp-1 text-sm">{address}</p>
        <p className="text-subtitle flex items-center gap-1 text-sm">
            <span className="tabular-nums">{formatRatingNumber(rating)}</span>
            <RatingStars rating={rating ?? 0} className="mb-px [&_svg]:size-3.5!" />
            <span>·</span>
            <span>{category}</span>
        </p>
    </div>
)

const LocationMetaSkeleton = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn('flex flex-col gap-1.5 py-4', className)} {...props}>
        <Skeleton className="mt-px mb-0.5 h-7 w-3/4" />
        <Skeleton className="my-px h-3.75 w-2/3" />
        <Skeleton className="my-px h-3.75 w-1/2" />
    </div>
)

export { LocationMeta, LocationMetaSkeleton }
