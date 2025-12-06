import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { ScrollProgress } from './ScrollProgress'
import { Footer } from './Footer'

export function Layout() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
