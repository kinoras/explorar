import type { ComponentProps } from 'react'

import Link from 'next/link'

import { faChevronLeft, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

const buttonConfig = {
    back: { icon: faChevronLeft, label: 'Back' },
    close: { icon: faXmark, label: 'Close' }
} as const

const NaviButton = ({
    appearance = 'close',
    href,
    className,
    ...props
}: ComponentProps<typeof Button> & {
    appearance?: keyof typeof buttonConfig
    href?: string
}) => {
    const { icon, label } = buttonConfig[appearance]

    const content = <FontAwesomeIcon icon={icon} size="lg" />

    return (
        <Button
            variant="outline"
            size="icon"
            className={cn('size-12 rounded-full shadow-[0_0_8px] shadow-black/10', className)}
            aria-label={label}
            asChild={!!href}
            {...props}
        >
            {href ? <Link href={href}>{content}</Link> : content}
        </Button>
    )
}

export { NaviButton }
