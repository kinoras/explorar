import type { WeeklyHours } from '@/types/location'

import { DataList, DataListSkeleton } from '../_components/list'
import { DataSection, DataSectionSkeleton } from '../_components/section'

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
                    value: hours[index]?.formatted ?? 'Closed'
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
