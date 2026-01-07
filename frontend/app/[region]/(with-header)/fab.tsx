import type { ComponentProps } from 'react'

import { faClipboardList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { RegionLink } from '@/components/atoms/region-link'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

const FloatingActionButton = ({ className, ...props }: ComponentProps<typeof Button>) => {
    return (
        <Button
            className={cn('size-14 rounded-full shadow-[0_0_8px] shadow-black/10', className)}
            variant="theme"
            size="icon-lg"
            asChild
            {...props}
        >
            <RegionLink href="/itinerary">
                <FontAwesomeIcon icon={faClipboardList} size="xl" />
            </RegionLink>
        </Button>
    )
}

export { FloatingActionButton }
