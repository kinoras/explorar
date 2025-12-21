import type { ComponentProps } from 'react'

import { RatingStars } from '@/components/atoms/rating-stars'
import { RegionLink } from '@/components/atoms/region-link'
import { SmartImage } from '@/components/atoms/smart-image'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

const LocationEntry = ({
    className,
    identifier,
    image,
    name,
    description,
    ratingNumber = 0,
    ratingString = 'N/A',
    category,
    ...props
}: Omit<ComponentProps<typeof RegionLink>, 'href'> & {
    identifier: string
    image?: string
    name?: string
    description?: string
    ratingNumber?: number
    ratingString?: string
    category?: string
}) => {
    return (
        <RegionLink
            className={cn('flex items-center gap-2.5', className)}
            href={`/locations/${identifier}`}
            {...props}
        >
            {/* Cover image */}
            <SmartImage
                src={image ?? ''}
                alt={name ?? ''}
                height={80}
                width={80}
                className="size-20 rounded-xl object-cover"
            />
            {/* Text content */}
            <div className="flex flex-col gap-0.5 **:leading-snug">
                <h3 className="line-clamp-1 font-medium">{name}</h3>
                <p className="line-clamp-2 text-sm text-neutral-500">{description}</p>
                <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <span className="tabular-nums">{ratingString}</span>
                    <RatingStars rating={ratingNumber} className="[&_svg]:size-3" />
                    <span>·</span>
                    <span>{category}</span>
                </div>
            </div>
        </RegionLink>
    )
}

const LocationEntrySkeleton = ({ className, ...props }: ComponentProps<'div'>) => {
    return (
        <div className={cn('flex items-center gap-2.5', className)} {...props}>
            {/* Cover image */}
            <Skeleton className="size-20 rounded-xl" />
            {/* Text content */}
            <div className="flex flex-1 flex-col gap-1.75">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-3 w-full rounded-md" />
                <Skeleton className="h-3 w-5/6 rounded-md" />
                <Skeleton className="mt-auto h-3 w-1/2 rounded-md" />
            </div>
        </div>
    )
}

export { LocationEntry, LocationEntrySkeleton }
