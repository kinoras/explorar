import { Suspense } from 'react'

import { faChevronRight } from '@fortawesome/free-solid-svg-icons'

import { LocationsList } from '@/components/custom/locations-list'
import {
    Shelf,
    ShelfActionButton,
    ShelfActions,
    ShelfContent,
    ShelfHeader,
    ShelfTitle
} from '@/components/ui/shelf'

import { stringToLocationSortOption } from '@/services/location-utils'
import { stringToRegion } from '@/services/region'

import { unifySearchParam } from '@/lib/utils'

import { Categories, CategoriesSkeleton } from './categories'
import { LocationsActions } from './locations-actions'

const Home = async ({ params, searchParams }: PageProps<'/[region]'>) => {
    // Extract and parse page props
    const { region: _region } = await params
    const { sort: _sort } = await searchParams

    const region = stringToRegion(_region)
    const sort = stringToLocationSortOption(unifySearchParam(_sort)[0])

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
                    <LocationsActions sort={sort} />
                </ShelfHeader>
                <ShelfContent className="space-y-4.5">
                    <LocationsList region={region} sort={sort} />
                </ShelfContent>
            </Shelf>
        </main>
    )
}

export default Home
