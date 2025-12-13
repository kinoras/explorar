import type { ComponentProps } from 'react'

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { cn } from '@/lib/utils'

import { Button } from './button'

const Shelf = ({ ...props }: ComponentProps<'section'>) => <section className="my-6" {...props} />

const ShelfHeader = ({ ...props }: ComponentProps<'div'>) => (
    <div className="mb-3 flex items-center justify-between px-4.5" {...props} />
)

const ShelfTitle = ({ ...props }: ComponentProps<'h2'>) => (
    <h2 className="text-xl font-bold tracking-tight" {...props} />
)

const ShelfActions = ({ ...props }: ComponentProps<'div'>) => (
    <div className="-my-0.5 -mr-1.5 flex items-center gap-2" {...props} />
)

const ShelfActionButton = ({
    className,
    icon,
    ...props
}: Omit<ComponentProps<typeof Button>, 'children'> & {
    icon: IconDefinition
}) => (
    <Button size="icon-sm" variant="ghost" className={cn('text-neutral-400', className)} {...props}>
        <FontAwesomeIcon icon={icon} />
    </Button>
)

const ShelfContent = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn('mt-3 px-4.5', className)} {...props} />
)

export { Shelf, ShelfTitle, ShelfHeader, ShelfActions, ShelfActionButton, ShelfContent }
