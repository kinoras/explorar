'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { faUpDown } from '@fortawesome/free-solid-svg-icons'

import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { ShelfActionButton, ShelfActions } from '@/components/ui/shelf'

const LocationsActions = ({ sort = 'ranking' }: { sort?: string }) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('sort', value)
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <ShelfActions>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <ShelfActionButton icon={faUpDown} aria-label="Sort locations" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-32" align="end">
                    <DropdownMenuCheckboxItem
                        checked={sort === 'ranking'}
                        onCheckedChange={() => handleSortChange('ranking')}
                    >
                        Ranking
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={sort === 'rating'}
                        onCheckedChange={() => handleSortChange('rating')}
                    >
                        Rating
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </ShelfActions>
    )
}

export { LocationsActions }
