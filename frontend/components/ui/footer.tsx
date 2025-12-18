import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

const Footer = ({
    outline = 'none',
    blur = false,
    className,
    children,
    ...props
}: ComponentProps<'footer'> & {
    /** Type of outline to apply. */
    outline?: 'border' | 'shadow' | 'none'
    /** Whether to apply a blur backdrop effect. */
    blur?: boolean
}) => {
    return (
        <footer
            data-slot="footer"
            className={cn(
                'border-border sticky bottom-0 z-10 bg-white',
                outline === 'border' && 'border-t',
                outline === 'shadow' && 'shadow-[0_-4px_12px] shadow-black/10',
                blur && 'backdrop-blur supports-backdrop-filter:bg-white/80',
                className
            )}
            {...props}
        >
            {children}
        </footer>
    )
}

export { Footer }
