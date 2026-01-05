'use client'

import type { ComponentProps } from 'react'

import { useInView } from 'react-intersection-observer'

import { cn } from '@/lib/utils'

const PageHeader = ({
    floating = false,
    masking = false,
    className,
    containerClassName,
    children,
    ...props
}: ComponentProps<'header'> & {
    /** Whether the header should float over content. */
    floating?: boolean
    /** Whether to apply a masking effect over content. */
    masking?: boolean | number
    /** Additional class names for the container div. */
    containerClassName?: typeof className
}) => {
    const { ref, inView } = useInView({ initialInView: true })

    // Scroll threshold for masking
    const threshold = typeof masking === 'number' ? masking : 0
    // Whether the header is currently masked
    const isMasked =
        masking === true || // Always masked
        (typeof masking === 'number' && !inView) // When past threshold
    return (
        <>
            <header className={cn('sticky inset-x-0 top-0 z-50', className)} {...props}>
                <div
                    className={cn(
                        'flex flex-row justify-between p-4.5 transition-[background]',
                        // Floating
                        floating && 'absolute inset-x-0 top-0',
                        // Masking
                        'after:absolute after:inset-0 after:-z-1', // Positioning
                        'after:bg-linear-to-b after:from-white after:via-white/75 after:to-white/0', // Background
                        'after:transition-opacity after:duration-300', // Transition
                        isMasked ? 'after:opacity-100' : 'after:opacity-0', // Opacity
                        containerClassName
                    )}
                >
                    {children}
                </div>
            </header>
            <span ref={ref} className="absolute" style={{ top: threshold }} />
        </>
    )
}

export { PageHeader }
