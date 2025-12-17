import { Header } from './header'

import { parseRegion } from '@/services/region'

const HeaderLayout = async ({ children, params }: LayoutProps<'/[region]'>) => (
    <>
        <Header region={parseRegion((await params).region)} />
        {children}
    </>
)

export default HeaderLayout
