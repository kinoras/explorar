'use client'

import { type ReactNode, useEffect, useState } from 'react'

import dayjs from 'dayjs'
import type { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

import { dayjsToDate } from '@/services/date'

import { itineraryConfigs } from '@/lib/config'

const formatPeriod = (dateRange?: DateRange): string =>
    !dateRange?.from || !dateRange?.to // No dates selected
        ? 'Select duration'
        : dayjs(dateRange.from).isSame(dayjs(dateRange.to), 'day') // Single day
          ? `${dayjs(dateRange.from).format('MMM D')}`
          : `${dayjs(dateRange.from).format('MMM D')} – ${dayjs(dateRange.to).format('MMM D')}`

const DurationDialog = ({
    duration: [start, end],
    setDuration,
    children: trigger
}: {
    duration: [start: string, end: string]
    setDuration: (start: string, end: string) => void
    children?: ReactNode
}) => {
    const [isOpen, setIsOpen] = useState(false)
    const [dateRange, setDateRange] = useState<DateRange | undefined>()
    const { durationLimits, periodLimits } = itineraryConfigs

    useEffect(() => {
        setDateRange({
            from: dayjs(start).toDate(),
            to: dayjs(end).toDate()
        })
    }, [start, end])

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open)
        // Reset date range on open to clear unconfirmed changes (not on close to prevent flicker)
        if (open) {
            setDateRange({
                from: dayjs(start).toDate(),
                to: dayjs(end).toDate()
            })
        }
    }

    const handleSave = () => {
        if (dateRange?.from && dateRange?.to) {
            setDuration(
                dayjsToDate(dayjs(dateRange.from)), // Start date
                dayjsToDate(dayjs(dateRange.to)) // End date
            )
            setIsOpen(false) // Close dialog after saving
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="w-80 border-none p-4.5 *:data-[slot=dialog-close]:p-1!">
                <DialogHeader className="text-left">
                    <DialogTitle className="flex flex-col gap-1.5">
                        <span className="text-sm font-normal text-neutral-500">
                            Duration of Stay
                        </span>
                        <span>{formatPeriod(dateRange)}</span>
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Select your desired start and end dates for the itinerary.
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <Calendar
                    mode="range"
                    className="w-full p-0"
                    defaultMonth={dateRange?.from}
                    selected={dateRange}
                    onSelect={setDateRange}
                    // Styles
                    formatters={{ formatWeekdayName: (date) => dayjs(date).format('ddd') }}
                    classNames={{ month: 'block space-y-4 *:w-full' }} // Workaround: Safari not adjusting flexbox height
                    // Selection limits
                    min={durationLimits.min}
                    max={durationLimits.max}
                    disabled={{
                        before: dayjs().add(periodLimits.start, 'days').toDate(),
                        after: dayjs().add(periodLimits.end, 'days').toDate()
                    }}
                />
                <Separator />
                <DialogFooter className="sm:flex-col">
                    <Button
                        variant="theme"
                        className="rounded-xl"
                        onClick={handleSave}
                        disabled={
                            dayjs(start).isSame(dayjs(dateRange?.from), 'day') &&
                            dayjs(end).isSame(dayjs(dateRange?.to), 'day')
                        }
                    >
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export { DurationDialog }
