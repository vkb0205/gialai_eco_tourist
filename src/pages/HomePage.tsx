import "@/components/home/home.css"
import HomeHero from "@/pages/HomeHeroStorage"
import TrustStrip from "@/components/home/TrustStrip"
import FeaturedTours from "@/pages/FeaturedToursStorage"
import RegionExplorer from "@/pages/RegionExplorerStorage"
import WhyUs from "@/components/home/WhyUs"
import CultureStory from "@/pages/CultureStoryStorage"
import ContactBand from "@/components/home/ContactBand"
import ContactDock from "@/components/ui/ContactDock"

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <TrustStrip />
      <FeaturedTours />
      <RegionExplorer />
      <WhyUs />
      <CultureStory />
      <ContactBand />
      <ContactDock />
    </>
  )
}
