import { Suspense } from 'react'

import { faChevronRight, faUpDown } from '@fortawesome/free-solid-svg-icons'

import {
    Shelf,
    ShelfActionButton,
    ShelfActions,
    ShelfContent,
    ShelfHeader,
    ShelfTitle
} from '@/components/ui/shelf'

import type { Region } from '@/services/region'

import { Categories, CategoriesSkeleton } from './categories'
import { Locations, LocationsSkeleton } from './locations'

const Home = async ({ params }: PageProps<'/[region]'>) => {
    const region = (await params).region as Region

    return (
        <main>
            <Shelf>
                <ShelfHeader>
                    <ShelfTitle>by Category</ShelfTitle>
                    <ShelfActions>
                        <ShelfActionButton
                            icon={faChevronRight}
                            aria-label="Browse all categories"
                        />
                    </ShelfActions>
                </ShelfHeader>
                <ShelfContent
                    className="flex gap-x-2.5 overflow-x-scroll *:shrink-0 *:basis-[calc(50%-5px)]!"
                    style={{ scrollbarWidth: 'none' }}
                >
                    <Suspense fallback={<CategoriesSkeleton itemsCount={2} />}>
                        <Categories region={region} />
                    </Suspense>
                </ShelfContent>
            </Shelf>

            <Shelf>
                <ShelfHeader>
                    <ShelfTitle>by Location</ShelfTitle>
                    <ShelfActions>
                        <ShelfActionButton icon={faUpDown} aria-label="Sort locations" />
                    </ShelfActions>
                </ShelfHeader>
                <ShelfContent className="space-y-4.5">
                    <Suspense fallback={<LocationsSkeleton itemsCount={4} />}>
                        <Locations region={region} />
                    </Suspense>
                </ShelfContent>
            </Shelf>
        </main>
    )
}

export default Home
