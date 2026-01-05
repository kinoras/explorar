'use client'

import { createContext, useContext, useState } from 'react'

import { defaultTransitMethod } from '@/lib/config'

import type { TransitMethod } from '@/types/route'

type RouteMethodContextType = {
    method: TransitMethod
    setMethod: (method: TransitMethod) => void
}

const RouteMethodContext = createContext<RouteMethodContextType | undefined>(undefined)

export const RouteMethodProvider = ({ children }: { children: React.ReactNode }) => {
    const [method, setMethod] = useState<TransitMethod>(defaultTransitMethod)

    return (
        <RouteMethodContext.Provider value={{ method, setMethod }}>
            {children}
        </RouteMethodContext.Provider>
    )
}

export const useRouteMethod = () => {
    const context = useContext(RouteMethodContext)
    if (!context) {
        throw new Error('useRouteMethod must be used within a RouteMethodProvider')
    }
    return context
}
