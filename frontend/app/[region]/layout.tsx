import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { stringToRegion, validateRegion } from '@/services/region'

import { defaultRegion } from '@/lib/config'
import { getAppConfigByRegion } from '@/lib/config'
import { RegionProvider } from '@/lib/context'

const RegionLayout = async ({ children, modal, sheet, params }: LayoutProps<'/[region]'>) => {
    const { region } = await params

    // If the region is invalid, redirect to the default region
    if (!validateRegion(region)) {
        redirect(`/${defaultRegion}`)
    }

    return (
        <RegionProvider region={region}>
            {modal}
            {sheet}
            {children}
        </RegionProvider>
    )
}

export const generateMetadata = async ({ params }: PageProps<'/[region]'>): Promise<Metadata> => {
    const { region } = await params
    const { title, description } = getAppConfigByRegion(stringToRegion(region))
    return {
        title: { default: title, template: `%s | ${title}` },
        description: description
    }
}

export default RegionLayout
