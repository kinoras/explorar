import { ComponentProps } from 'react'

import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { cn } from '@/lib/utils'

const UpRightArrow = ({
    align = 'middle',
    className,
    ...props
}: Omit<ComponentProps<typeof FontAwesomeIcon>, 'icon'> & {
    align?: 'top' | 'middle' | 'bottom'
}) => (
    <FontAwesomeIcon
        icon={faArrowRight}
        className={cn(
            '-ml-[0.1em] -rotate-45 text-[0.67em]',
            align === 'top' && '-translate-y-[12.5%]',
            align === 'bottom' && 'translate-y-[12.5%]',
            className
        )}
        {...props}
    />
)

export { UpRightArrow }
