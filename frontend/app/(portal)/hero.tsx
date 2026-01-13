'use client'

import Image from 'next/image'
import Link from 'next/link'

import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'

const slides = [
    {
        title: 'Hong Kong',
        color: 'text-red-600',
        description: 'Discover the vibrant fusion of East and West in the Pearl of the Orient.',
        href: '/hk',
        image: '/assets/portal/hong-kong.webp' // https://www.flickr.com/photos/nickstenning/7058622/ (processed)
    },
    {
        title: 'Macau',
        color: 'text-emerald-600',
        description: 'Experience the blend of Portuguese heritage and modern entertainment.',
        href: '/mo',
        image: '/assets/portal/macau.webp' // https://unsplash.com/photos/e5WtiFXDbuA (processed)
    }
]

const PortalHero = () => {
    return (
        <section className="w-full">
            <Swiper
                id="portal-hero"
                className="h-auto md:h-70 lg:h-80"
                // Behaviors
                allowTouchMove={false}
                loop={true}
                speed={200}
                // Extensions
                modules={[Autoplay, EffectFade, Pagination]}
                effect="fade"
                pagination={{ clickable: true }}
                autoplay={{ delay: 4500 }}
                onAutoplayTimeLeft={(swiper, _, percentage) => {
                    swiper.el.style.setProperty('--autoplay-progress', (1 - percentage).toFixed(2))
                }}
            >
                {slides.map(({ title, color, description, href, image }) => (
                    <SwiperSlide
                        key={href}
                        className={cn(
                            'flex! flex-col-reverse gap-8 md:flex-row-reverse', // Layout
                            'px-2 pt-4 pb-10 sm:py-6 md:py-0', // Slide padding
                            'bg-white **:transition-all' // Appearance
                        )}
                    >
                        {/* Cover */}
                        <Image
                            src={image}
                            alt="" // Decorative
                            height={512}
                            width={384}
                            className={cn(
                                'pointer-events-none select-none', // Interaction
                                'aspect-5/4 flex-0 shrink-0 object-contain' // Layout
                            )}
                        />

                        {/* Content */}
                        <div className="flex flex-col items-start justify-center gap-3 text-balance sm:flex-1 md:pb-4.5">
                            <h2 className="-ml-0.5 text-5xl font-bold tracking-tight md:-ml-0.75 md:text-6xl lg:text-7xl">
                                <span className="block">Explore</span>
                                <span className={color}>{title}</span>
                            </h2>
                            <p className="text-base md:text-lg lg:text-xl">{description}</p>
                            <Button
                                className={cn(
                                    'text-theme! text-lg font-bold hover:font-extrabold md:text-lg lg:text-xl', // Font
                                    '-mb-1 -ml-2 gap-1.5 px-2! hover:gap-2' // Spacing
                                )}
                                variant="ghost"
                                asChild
                            >
                                <Link href={href} target="_blank">
                                    <span>Start Exploring</span>
                                    <FontAwesomeIcon icon={faArrowRight} size="sm" />
                                </Link>
                            </Button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}

export { PortalHero }
