'use client'

import { Swiper, SwiperSlide } from 'swiper/react'

import { SmartImage } from '@/components/atoms/smart-image'
import { Skeleton } from '@/components/ui/skeleton'

const LocationCarousel = ({ images }: { images: string[] }) => {
    return (
        <Swiper className="w-full">
            {images.map((src, index) => (
                <SwiperSlide key={index}>
                    <SmartImage
                        src={src}
                        alt={`Image ${index + 1}`}
                        width={600}
                        height={400}
                        className="h-56 w-full object-cover"
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

const LocationCarouselSkeleton = () => {
    return <Skeleton className="h-56 w-full rounded-none" />
}

export { LocationCarousel, LocationCarouselSkeleton }
