import type { ComponentProps, ReactNode } from 'react'

import { type IconDefinition, faClock, faMap } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { RegionLink } from '@/components/atoms/region-link'
import { SmartImage } from '@/components/atoms/smart-image'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

import type { LocationID } from '@/types/location'

const IconLabel = ({ icon, content }: { icon: IconDefinition; content?: ReactNode }) => (
    <p className="flex items-center gap-1 text-xs text-neutral-500">
        <FontAwesomeIcon icon={icon} />
        <span className="line-clamp-1">{content}</span>
    </p>
)

const ItineraryLocation = ({
    className,
    identifier,
    image,
    name,
    address,
    hours,
    ...props
}: Omit<ComponentProps<typeof RegionLink>, 'href'> & {
    identifier: LocationID
    image?: string
    name?: string
    address?: string
    hours?: string
}) => (
    <RegionLink
        className={cn('flex items-center gap-2.5', className)}
        href={`/locations/${identifier}`}
        {...props}
    >
        {/* Text content */}
        <SmartImage
            src={image ?? ''}
            alt={name ?? ''}
            height={60}
            width={60}
            className="size-15 rounded-xl object-cover"
        />
        {/* Content */}
        <div className="flex flex-col gap-0.75 leading-tight">
            <h3 className="line-clamp-1 font-medium">{name}</h3>
            <IconLabel icon={faMap} content={address} />
            {hours ? (
                <IconLabel icon={faClock} content={hours} />
            ) : (
                <p className="text-xs text-red-500">Closed this day</p>
            )}
        </div>
    </RegionLink>
)

const ItineraryLocationSkeleton = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn('flex items-center gap-2.5', className)} {...props}>
        {/* Cover image */}
        <Skeleton className="size-15 rounded-xl" />
        {/* Text content */}
        <div className="flex flex-1 flex-col gap-1.5">
            <Skeleton className="h-4.5 w-3/5 rounded-md" />
            <Skeleton className="h-3 w-5/6 rounded-md" />
            <Skeleton className="mt-auto h-3 w-1/2 rounded-md" />
        </div>
    </div>
)

export { ItineraryLocation, ItineraryLocationSkeleton }
