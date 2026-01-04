import type { ComponentProps } from 'react'

import { SmartImage } from '@/components/atoms/smart-image'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

import { RouteMapMarker, RouteMapMarkerSkeleton } from './map-marker'

const RouteLocation = ({
    className,
    index,
    image,
    name,
    address,
    ...props
}: ComponentProps<'li'> & {
    index?: number
    image?: string
    name?: string
    address?: string
}) => (
    <li className={cn('flex items-center gap-2.5', className)} {...props}>
        {/* Index */}
        <RouteMapMarker size="md" className="mr-1 font-medium ring-6" children={index} />

        {/* Cover image */}
        <SmartImage
            src={image ?? ''}
            alt={name ?? ''}
            height={40}
            width={40}
            className="size-10 shrink-0 rounded-xl object-cover"
        />

        {/* Text content */}
        <div className="flex flex-col gap-0.75 leading-tight">
            <h3 className="line-clamp-1 font-medium">{name}</h3>
            <p className="line-clamp-1 text-xs text-neutral-500">{address}</p>
        </div>
    </li>
)

const RouteLocationSkeleton = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn('flex items-center gap-2.5', className)} {...props}>
        {/* Index */}
        <RouteMapMarkerSkeleton size="md" className="mr-1 ring-6" />
        {/* Cover image */}
        <Skeleton className="size-10 rounded-xl" />
        {/* Text content */}
        <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4.5 w-3/5 rounded-md" />
            <Skeleton className="h-3 w-5/6 rounded-md" />
        </div>
    </div>
)

export { RouteLocation, RouteLocationSkeleton }
