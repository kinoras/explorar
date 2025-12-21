import { DataList, DataListSkeleton } from '@/components/atoms/data-list'
import { DataSection, DataSectionSkeleton } from '@/components/atoms/data-section'

import type { WeeklyHours } from '@/types/location'

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const LocationHours = ({ hours }: { hours?: WeeklyHours }) => (
    <DataSection title="Hours">
        {hours === undefined ? (
            <DataList items={[{ key: 'Every Day', value: 'Open 24 hours' }]} />
        ) : (
            <DataList
                className="tabular-nums"
                items={weekdays.map((day, index) => ({
                    key: day,
                    value: hours[index] ? `${hours[index].open} – ${hours[index].close}` : 'Closed'
                }))}
            />
        )}
    </DataSection>
)

const LocationHoursSkeleton = () => (
    <DataSectionSkeleton>
        <DataListSkeleton />
    </DataSectionSkeleton>
)

export { LocationHours, LocationHoursSkeleton }
