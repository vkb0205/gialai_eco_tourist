import { useEffect } from "react"
import Navigation from "@/components/layout/Navigation"
import Footer from "@/components/layout/Footer"
import HomePage from "@/pages/HomePage"
import ExplorePage from "@/pages/ExplorePage"
import ServicesPage from "@/pages/ServicesPage"
import CarRentalPage from "@/pages/CarRentalPage"
import { useHashRoute } from "@/lib/useHashRoute"

/**
 * Routing shell. Chrome is rendered once, around whichever page the hash
 * resolves to, so navigation state and the footer survive a route change.
 */
export default function App() {
  const route = useHashRoute()

  // Legacy `#section` links still land on the landing page; honour the anchor
  // once the sections have mounted.
  useEffect(() => {
    if (route.path !== "/" || !route.anchor) return
    const target = document.getElementById(route.anchor)
    if (target)
      requestAnimationFrame(() => target.scrollIntoView({ block: "start" }))
  }, [route.path, route.anchor])

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#183024]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#183024] focus:px-5 focus:py-3 focus:text-[11px] focus:font-bold focus:uppercase focus:tracking-[0.12em] focus:text-white"
      >
        Đến nội dung chính
      </a>
      <Navigation />
      <main id="main">
        {route.path === "/explore" ? (
          <ExplorePage query={route.query} />
        ) : route.path === "/car-rental" ? (
          <CarRentalPage query={route.query} />
        ) : route.path === "/services" ? (
          <ServicesPage />
        ) : (
          <HomePage />
        )}
      </main>
      <Footer />
    </div>
  )
}
