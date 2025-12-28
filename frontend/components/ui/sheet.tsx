'use client'

import type { ComponentProps } from 'react'

import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as SheetPrimitive from '@radix-ui/react-dialog'

import { cn } from '@/lib/utils'

const Sheet = ({ ...props }: ComponentProps<typeof SheetPrimitive.Root>) => {
    return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

const SheetTrigger = ({ ...props }: ComponentProps<typeof SheetPrimitive.Trigger>) => {
    return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

const SheetClose = ({ ...props }: ComponentProps<typeof SheetPrimitive.Close>) => {
    return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

const SheetPortal = ({ ...props }: ComponentProps<typeof SheetPrimitive.Portal>) => {
    return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

const SheetOverlay = ({ className, ...props }: ComponentProps<typeof SheetPrimitive.Overlay>) => {
    return (
        <SheetPrimitive.Overlay
            data-slot="sheet-overlay"
            className={cn(
                'fixed inset-0 z-50 bg-black/50',
                'data-[state=open]:animate-in data-[state=open]:fade-in-0', // Entering animation
                'data-[state=closed]:fade-out-0 data-[state=closed]:animate-out', // Exiting animation
                className
            )}
            {...props}
        />
    )
}

const SheetContent = ({
    className,
    children,
    side = 'right',
    showCloseButton = true,
    ...props
}: ComponentProps<typeof SheetPrimitive.Content> & {
    side?: 'top' | 'right' | 'bottom' | 'left'
    showCloseButton?: boolean
}) => {
    return (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Content
                data-slot="sheet-content"
                className={cn(
                    'bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out',
                    'data-[state=open]:animate-in data-[state=open]:duration-400', // Entering animation
                    'data-[state=closed]:animate-out data-[state=closed]:duration-250', // Exiting animation
                    side === 'right' &&
                        'data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm',
                    side === 'left' &&
                        'data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm',
                    side === 'top' &&
                        'data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b',
                    side === 'bottom' &&
                        'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t',
                    className
                )}
                {...props}
            >
                {children}
                {showCloseButton && (
                    <SheetPrimitive.Close
                        className={cn(
                            'ring-offset-background absolute top-4 right-4 rounded-md opacity-70 transition-opacity hover:opacity-100',
                            "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", // Icon
                            'disabled:pointer-events-none', // Disabled variant
                            /* States */
                            'data-[state=open]:bg-accent data-[state=open]:text-muted-foreground', // Opening
                            'focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-hidden' // Focus
                        )}
                    >
                        <FontAwesomeIcon icon={faXmark} />
                        <span className="sr-only">Close</span>
                    </SheetPrimitive.Close>
                )}
            </SheetPrimitive.Content>
        </SheetPortal>
    )
}

const SheetHeader = ({ className, ...props }: ComponentProps<'div'>) => {
    return (
        <div
            data-slot="sheet-header"
            className={cn('flex flex-col gap-1.5 p-4', className)}
            {...props}
        />
    )
}

const SheetFooter = ({ className, ...props }: ComponentProps<'div'>) => {
    return (
        <div
            data-slot="sheet-footer"
            className={cn('mt-auto flex flex-col gap-2 p-4', className)}
            {...props}
        />
    )
}

const SheetTitle = ({ className, ...props }: ComponentProps<typeof SheetPrimitive.Title>) => {
    return (
        <SheetPrimitive.Title
            data-slot="sheet-title"
            className={cn('text-foreground font-semibold', className)}
            {...props}
        />
    )
}

const SheetDescription = ({
    className,
    ...props
}: ComponentProps<typeof SheetPrimitive.Description>) => {
    return (
        <SheetPrimitive.Description
            data-slot="sheet-description"
            className={cn('text-muted-foreground text-sm', className)}
            {...props}
        />
    )
}

export {
    Sheet,
    SheetTrigger,
    SheetClose,
    SheetContent,
    SheetHeader,
    SheetFooter,
    SheetTitle,
    SheetDescription
}
