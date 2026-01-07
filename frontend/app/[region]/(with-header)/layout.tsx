import { FloatingActionButton } from './fab'
import { Header } from './header'

const HeaderLayout = ({ children }: LayoutProps<'/[region]'>) => (
    <div className="flex flex-col">
        <Header />
        {children}
        <FloatingActionButton className="sticky bottom-4.5 z-50 mr-4.5 self-end" />
    </div>
)

export default HeaderLayout
