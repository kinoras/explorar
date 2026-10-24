import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

const Skeleton = ({ className, ...props }: ComponentProps<'div'>) => {
    return (
        <div
            data-slot="skeleton"
            className={cn('animate-pulse rounded-md bg-inactive', className)}
            {...props}
        />
    )
}

export { Skeleton }
