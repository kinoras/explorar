import type { ComponentProps, ReactNode } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

const DataList = ({
    ratio = '1:2',
    items,
    className,
    ...props
}: ComponentProps<'ul'> & {
    ratio?: `${number}:${number}`
    items: { key: ReactNode; value: ReactNode }[]
}) => {
    const [keyRatio, valueRatio] = ratio.split(':').map(Number)
    return (
        <ul className={cn('flex flex-col gap-1 text-sm', className)} {...props}>
            {items.map(({ key, value }, index) => (
                <li key={index} className="flex">
                    <span className="text-subtitle" style={{ flex: keyRatio }}>
                        {key}
                    </span>
                    <span className="sr-only">: </span>
                    <span style={{ flex: valueRatio }}>{value}</span>
                </li>
            ))}
        </ul>
    )
}

const DataListSkeleton = ({
    ratio = '1:2',
    itemsCount = 3,
    className,
    ...props
}: ComponentProps<'ul'> & {
    ratio?: `${number}:${number}`
    itemsCount?: number
}) => (
    <ul className={cn('flex flex-col gap-1 text-sm', className)} {...props}>
        {Array.from({ length: itemsCount }).map((_, index) => (
            <li key={index} className="flex">
                {ratio.split(':').map((value, index) => (
                    <span key={index} style={{ flex: Number(value) }}>
                        <Skeleton className="my-0.75 h-3.5 w-2/3" />
                    </span>
                ))}
            </li>
        ))}
    </ul>
)

export { DataList, DataListSkeleton }
