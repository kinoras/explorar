import type { Metadata } from 'next'
import { Geist, Geist_Mono, Noto_Sans_HK } from 'next/font/google'

import { cn } from '@/lib/utils'

import '../globals.css'

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
                <div id="root" className="mx-auto w-full max-w-120 md:max-w-5xl">
                    {children}
                </div>
            </body>
        </html>
    )
}

export default PortalLayout
