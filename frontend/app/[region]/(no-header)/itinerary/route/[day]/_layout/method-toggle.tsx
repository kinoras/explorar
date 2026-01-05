'use client'

import type { ComponentProps } from 'react'

import type { IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { faBusSimple, faCar, faPersonWalking } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

import { stringToTransitMethod } from '@/services/route-utils'

import { useRouteMethod } from '../_hooks/context'

const RouteMethodToogleItem = ({
    icon,
    ...props
}: ComponentProps<typeof ToggleGroupItem> & { icon: IconDefinition }) => {
    return (
        <ToggleGroupItem
            className="size-10 rounded-full! text-neutral-400 transition-colors"
            {...props}
        >
            <FontAwesomeIcon icon={icon} size="lg" />
        </ToggleGroupItem>
    )
}

const RouteMethodToggle = () => {
    const { method, setMethod } = useRouteMethod()

    const handleToggleChange = (value: string) => {
        const method = stringToTransitMethod(value)
        setMethod(method)
    }

    return (
        <ToggleGroup
            type="single"
            className="border-border gap-1 rounded-full border bg-white px-[3.5px] py-0.75"
            value={method}
            onValueChange={handleToggleChange}
        >
            <RouteMethodToogleItem value="transit" aria-label="Transit" icon={faBusSimple} />
            <RouteMethodToogleItem value="driving" aria-label="Driving" icon={faCar} />
            <RouteMethodToogleItem value="walking" aria-label="Walking" icon={faPersonWalking} />
        </ToggleGroup>
    )
}

export { RouteMethodToggle }
