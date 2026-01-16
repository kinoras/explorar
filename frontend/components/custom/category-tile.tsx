import type { ComponentProps } from 'react'

import { RegionLink } from '@/components/atoms/region-link'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

const CategoryTile = ({
    className,
    identifier,
    name,
    count,
    image,
    ...props
}: Omit<ComponentProps<typeof RegionLink>, 'href'> & {
    identifier: string
    name: string
    count?: number
    image?: string
}) => {
    return (
        <RegionLink
            className={cn('relative h-30 overflow-hidden rounded-xl', className)}
            href={`/locations?categories=${identifier}`}
            {...props}
        >
            {/* Content layer */}
            <div
                className={cn(
                    'absolute inset-0 z-10', // Positioning
                    'from-theme/50 to-theme/75 bg-linear-to-b text-white *:leading-tight', // Appearance
                    'flex flex-col justify-end gap-px p-3' // Layout
                )}
            >
                <h3 className="text-lg font-semibold tracking-tight">{name}</h3>
                <p className="text-sm">{count} locations</p>
            </div>

            {/* Background image layer */}
            <span
                className="block size-full bg-cover bg-center"
                style={{ backgroundImage: `url('${image}')` }}
            />
        </RegionLink>
    )
}

const CategoryTileSkeleton = ({ className, ...props }: ComponentProps<'div'>) => {
    return <Skeleton className={cn('h-30 rounded-xl', className)} {...props} />
}

export { CategoryTile, CategoryTileSkeleton }
