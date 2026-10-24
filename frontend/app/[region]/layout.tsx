import type { Metadata } from 'next'
import { Geist_Mono, Inter, Noto_Sans_HK } from 'next/font/google'
import { redirect } from 'next/navigation'

import { stringToRegion, validateRegion } from '@/services/region'

import { defaultRegion, getAppConfigByRegion } from '@/lib/config'
import { AppProvider } from '@/lib/context'
import { cn } from '@/lib/utils'

import '../globals.css'

// Fonts
const sans = Inter({ variable: '--font-latin-sans', subsets: ['latin'] })
const mono = Geist_Mono({ variable: '--font-latin-mono', subsets: ['latin'] })
const cjk = Noto_Sans_HK({ variable: '--font-cjk-sans', subsets: ['latin'] })

const RegionLayout = async ({ children, modal, sheet, params }: LayoutProps<'/[region]'>) => {
    const { region } = await params

    // If the region is invalid, redirect to the default region
    if (!validateRegion(region)) {
        redirect(`/${defaultRegion}`)
    }

    return (
        <html lang="en">
            <body className={cn(sans.variable, mono.variable, cjk.variable, 'bg-neutral-50')}>
                <div id="root" className="w-full max-w-lg bg-background">
                    <AppProvider region={region}>
                        {modal}
                        {sheet}
                        {children}
                    </AppProvider>
                </div>
            </body>
        </html>
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
