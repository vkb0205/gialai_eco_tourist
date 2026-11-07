import { lazy, Suspense, useEffect } from "react"
import Navigation from "@/components/layout/Navigation"
import Footer from "@/components/layout/Footer"
import HomePage from "@/pages/HomePage"
import { useHashRoute } from "@/lib/useHashRoute"

// The landing page ships in the main bundle; every other route loads on demand.
const ExplorePage = lazy(() => import("@/pages/ExplorePage"))
const ServicesPage = lazy(() => import("@/pages/ServicesPage"))
const CarRentalPage = lazy(() => import("@/pages/CarRentalPage"))
const TourDetailsPage = lazy(() => import("@/pages/TourDetailsPage"))

/** Reserves the page's height while a route chunk loads, so the footer never jumps up. */
function PageLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[70vh] items-center justify-center px-6 pt-[78px] text-sm text-[#566259]"
    >
      Đang tải trang…
    </div>
  )
}

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
    <div className="min-h-screen bg-[#ffffff] text-[#183024]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[#1f7a3a] focus:px-5 focus:py-3 focus:text-xs focus:font-bold focus:uppercase focus:tracking-[0.12em] focus:text-white"
      >
        Đến nội dung chính
      </a>
      <Navigation />
      <main id="main">
        <Suspense fallback={<PageLoading />}>
          {route.path === "/explore" ? (
            <ExplorePage query={route.query} />
          ) : route.path === "/tour" ? (
            <TourDetailsPage query={route.query} />
          ) : route.path === "/car-rental" ? (
            <CarRentalPage query={route.query} />
          ) : route.path === "/services" ? (
            <ServicesPage query={route.query} />
          ) : (
            <HomePage />
          )}
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
