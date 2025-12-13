import type { ComponentProps } from 'react'

import { faStar, faStarHalf } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { cn } from '@/lib/utils'

const FullStar = () => <FontAwesomeIcon icon={faStar} />

const HalfStar = () => <FontAwesomeIcon icon={faStarHalf} />

const RatingStars = ({
    rating,
    scale = 5,
    className,
    ...props
}: ComponentProps<'span'> & { rating: number; scale?: number }) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating - fullStars >= 0.5

    return (
        <span className={cn('relative *:flex *:gap-px', className)} {...props}>
            {/* Rating stars */}
            <span className="absolute z-10 [&_svg]:text-yellow-400">
                {[...Array(fullStars)].map((_, index) => (
                    <FullStar key={index} />
                ))}
                {halfStar && <HalfStar />}
            </span>

            {/* Background stars */}
            <span className="select-none [&_svg]:text-neutral-200">
                {[...Array(scale)].map((_, index) => (
                    <FullStar key={index} />
                ))}
            </span>
        </span>
    )
}

export { RatingStars }
