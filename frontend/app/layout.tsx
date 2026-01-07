import type { Metadata } from 'next'
import { Geist_Mono, Inter, Noto_Sans_HK } from 'next/font/google'

import { cn } from '@/lib/utils'

import './globals.css'

const latinSans = Inter({
    variable: '--font-latin-sans',
    subsets: ['latin']
})

const latinMono = Geist_Mono({
    variable: '--font-latin-mono',
    subsets: ['latin']
})

const cjkSans = Noto_Sans_HK({
    variable: '--font-cjk-sans',
    subsets: ['latin']
})

export const metadata: Metadata = {
    title: 'Explore Hong Kong | Macau',
    description: 'A travel itinerary planner for Hong Kong and Macau.'
}

const RootLayout = async ({ children }: LayoutProps<'/'>) => {
    return (
        <html lang="en">
            <body
                className={cn(
                    latinSans.variable,
                    latinMono.variable,
                    cjkSans.variable,
                    'border-border outline-ring/50', // Default outline colors
                    'text-foreground bg-neutral-50 antialiased **:font-sans!', // Appearance settings
                    'flex min-h-dvh justify-center' // Root layout
                )}
            >
                <div id="root" className="bg-background w-full max-w-lg">
                    {children}
                </div>
            </body>
        </html>
    )
}

export default RootLayout
