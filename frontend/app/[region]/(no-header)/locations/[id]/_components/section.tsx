import type { ComponentProps } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

const DataSection = ({
    title,
    className,
    children,
    ...props
}: ComponentProps<'section'> & { title: string }) => (
    <section className={cn('my-4.5', className)} {...props}>
        <h2 className="mb-1.5 text-lg font-semibold">{title}</h2>
        {children}
    </section>
)

const DataSectionSkeleton = ({ className, children, ...props }: ComponentProps<'section'>) => (
    <section className={cn('my-5.5', className)} {...props}>
        <Skeleton className="mb-2.75 h-5 w-20" />
        {children}
    </section>
)

export { DataSection, DataSectionSkeleton }
