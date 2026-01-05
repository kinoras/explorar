import type { ComponentProps } from 'react'

import { SmartImage } from '@/components/atoms/smart-image'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

import { RouteMapMarker, RouteMapMarkerSkeleton } from './map-marker'

const blockStyles = {
    root: 'flex items-center gap-2.5',
    marker: 'mr-1 font-medium ring-6',
    cover: 'size-10 shrink-0 rounded-xl object-cover',
    content: 'flex flex-1 flex-col gap-0.75 leading-tight'
}

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
    <li className={cn(blockStyles.root, className)} {...props}>
        {/* Index */}
        <RouteMapMarker size="md" className={blockStyles.marker} children={index} />

        {/* Cover image */}
        <SmartImage
            src={image ?? ''}
            alt={name ?? ''}
            height={40}
            width={40}
            className={blockStyles.cover}
        />

        {/* Text content */}
        <div className={blockStyles.content}>
            <h3 className="line-clamp-1 font-medium">{name}</h3>
            <p className="line-clamp-1 text-xs text-neutral-500">{address}</p>
        </div>
    </li>
)

const RouteLocationSkeleton = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn(blockStyles.root, className)} {...props}>
        {/* Index */}
        <RouteMapMarkerSkeleton size="md" className={blockStyles.marker} />
        {/* Cover image */}
        <Skeleton className={blockStyles.cover} />
        {/* Text content */}
        <div className={cn(blockStyles.content, 'gap-1.5')}>
            <Skeleton className="h-4.5 w-3/5" />
            <Skeleton className="h-3 w-5/6" />
        </div>
    </div>
)

export { RouteLocation, RouteLocationSkeleton }
