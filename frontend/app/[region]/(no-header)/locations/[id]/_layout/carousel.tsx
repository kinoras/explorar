'use client'

import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { SmartImage } from '@/components/atoms/smart-image'
import { Skeleton } from '@/components/ui/skeleton'

const LocationCarousel = ({ images }: { images: string[] }) => {
    return (
        <Swiper
            id="location-carousel"
            className="w-full"
            modules={[Pagination]}
            pagination={{ clickable: true }}
        >
            {images.map((src, index) => (
                <SwiperSlide key={index}>
                    <SmartImage
                        src={src}
                        alt={`Image ${index + 1}`}
                        width={600}
                        height={400}
                        className="h-64 w-full object-cover"
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

const LocationCarouselSkeleton = () => {
    return <Skeleton className="h-64 w-full rounded-none" />
}

export { LocationCarousel, LocationCarouselSkeleton }
