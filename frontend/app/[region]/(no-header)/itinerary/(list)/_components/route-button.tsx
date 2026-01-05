import type { ComponentProps } from 'react'

import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { NaviButton } from '@/components/atoms/navi-button'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

const ItineraryRouteButton = ({ className, ...props }: ComponentProps<typeof NaviButton>) => (
    <NaviButton variant="secondary" className={cn('size-10 shadow-none', className)} {...props}>
        <FontAwesomeIcon icon={faArrowRight} />
    </NaviButton>
)

const ItineraryRouteButtonSkeleton = ({ className, ...props }: ComponentProps<'div'>) => (
    <Skeleton className={cn('bg-accent size-10 rounded-full', className)} {...props} />
)

export { ItineraryRouteButton, ItineraryRouteButtonSkeleton }
