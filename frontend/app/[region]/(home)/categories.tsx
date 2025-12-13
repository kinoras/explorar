import { use } from 'react'

import { CategoryTile, CategoryTileSkeleton } from '@/components/custom/category-tile'

import { getCategoriesByRegion } from '@/services/category'
import type { Region } from '@/services/region'

const Categories = ({ region }: { region: Region }) => {
    const categories = use(getCategoriesByRegion(region))

    return (
        <>
            {categories.map(({ key, name, image }) => (
                <CategoryTile
                    key={key}
                    href={`/${region}/categories/${key}`}
                    // Data fields below
                    name={name}
                    image={image}
                />
            ))}
        </>
    )
}

const CategoriesSkeleton = ({ itemsCount }: { itemsCount: number }) => {
    return (
        <>
            {Array.from({ length: itemsCount }).map((_, index) => (
                <CategoryTileSkeleton key={index} />
            ))}
        </>
    )
}

export { Categories, CategoriesSkeleton }
