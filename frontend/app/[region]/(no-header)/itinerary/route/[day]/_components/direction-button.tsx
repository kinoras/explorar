import type { ComponentProps } from 'react'

import Link from 'next/link'

import { faDiamondTurnRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { NaviButton } from '@/components/atoms/navi-button'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

import type { Coordinates } from '@/types/location'
import type { TransitMethod } from '@/types/route'

const formDirectionUrl = (origin: Coordinates, destination: Coordinates, method: TransitMethod) => {
    const baseURI = 'https://www.google.com/maps/dir/'
    const queryString = new URLSearchParams({
        api: '1',
        origin: origin.join(','),
        destination: destination.join(','),
        travelmode: method
    }).toString()
    return `${baseURI}?${queryString}`
}

const RouteDirectionButton = ({
    origin,
    destination,
    method,
    className,
    ...props
}: ComponentProps<typeof NaviButton> & {
    origin: Coordinates
    destination: Coordinates
    method: TransitMethod
}) => (
    <NaviButton
        variant="secondary"
        className={cn('bg-theme-accent text-theme size-9.5 shadow-none', className)}
        asChild
        {...props}
    >
        <Link
            href={formDirectionUrl(origin, destination, method)}
            target="_blank"
            rel="noopener noreferrer"
        >
            <FontAwesomeIcon icon={faDiamondTurnRight} className="size-4.25!" />
            {/* <FontAwesomeIcon icon={faSquare} className="absolute size-4.5! rotate-45" />
            <FontAwesomeIcon icon={faTurnDown} className="size-2.25! translate-x-px -rotate-90" /> */}
        </Link>
    </NaviButton>
)

const RouteDirectionButtonSkeleton = ({ className, ...props }: ComponentProps<'div'>) => (
    <Skeleton className={cn('size-9.5 rounded-full', className)} {...props} />
)

export { RouteDirectionButton, RouteDirectionButtonSkeleton }
