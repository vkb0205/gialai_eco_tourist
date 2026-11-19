import "@/components/home/home.css"
import HomeHero from "@/components/home/HomeHero"
import TrustStrip from "@/components/home/TrustStrip"
import FeaturedTours from "@/components/home/FeaturedTours"
import RegionExplorer from "@/components/home/RegionExplorer"
import WhyUs from "@/components/home/WhyUs"
import CultureStory from "@/components/home/CultureStory"
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
