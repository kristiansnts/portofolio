import { Header } from '../header'
import { Footer } from '../footer'

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative mx-auto w-full max-w-screen-sm flex-1 px-4 pt-20">
      <Header />
      {children}
      <Footer />
    </div>
  )
}
