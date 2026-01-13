import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans_HK } from 'next/font/google'

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

import { cn } from '@/lib/utils'

import '../globals.css'

// Prevent icon from flashing on load
// See: https://fontawesome.com/docs/web/use-with/react/use-with#nextjs
config.autoAddCss = false

const sans = Geist({ variable: '--font-latin-sans', subsets: ['latin'] })
const mono = Geist_Mono({ variable: '--font-latin-mono', subsets: ['latin'] })
const cjk = Noto_Sans_HK({ variable: '--font-cjk-sans', subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Explore Hong Kong | Macau',
    description: 'A travel itinerary planner for Hong Kong and Macau.'
}

const PortalLayout = async ({ children }: LayoutProps<'/'>) => {
    return (
        <html lang="en">
            <body className={cn(sans.variable, mono.variable, cjk.variable)}>
                <div className="mx-auto w-full max-w-120 px-4 md:max-w-5xl md:px-9 lg:px-14">
                    {children}
                </div>
            </body>
        </html>
    )
}

export default PortalLayout
