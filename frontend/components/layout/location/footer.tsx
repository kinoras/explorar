import type { ComponentProps } from 'react'

import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '@/components/ui/button'
import { Footer } from '@/components/ui/footer'

import { cn } from '@/lib/utils'

const blockStyles = {
    root: 'flex gap-2 p-4',
    button: 'bg-theme flex h-12 flex-1 items-center gap-2 rounded-xl'
}

const LocationFooterAction = ({ className, ...props }: ComponentProps<typeof Button>) => (
    <Button className={cn(blockStyles.button, className)} {...props}>
        <FontAwesomeIcon icon={faPlus} />
        <span>Add to My List</span>
    </Button>
)

const LocationFooter = () => (
    <Footer className={blockStyles.root} outline="shadow">
        <LocationFooterAction />
    </Footer>
)

const LocationFooterSkeleton = () => (
    <Footer className={blockStyles.root} outline="shadow">
        <LocationFooterAction disabled />
    </Footer>
)

export { LocationFooter, LocationFooterSkeleton }
