import type { ComponentProps } from 'react'

import { NaviButton } from '@/components/atoms/navi-button'
import { DialogClose, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { cn } from '@/lib/utils'

const LocationModalHeader = ({
    title,
    className,
    ...props
}: ComponentProps<typeof DialogHeader>) => {
    return (
        <DialogHeader className={cn('sticky inset-x-0 top-0 z-50', className)} {...props}>
            <DialogTitle className="sr-only">{title}</DialogTitle>
            <DialogClose className="absolute top-4.25 left-4.25" autoFocus={false} asChild>
                <NaviButton appearance="close" />
            </DialogClose>
        </DialogHeader>
    )
}
export { LocationModalHeader }
