import mangDenImage from "@/imports/tours/mang-den.jpg"
import konTumChurchImage from "@/imports/tours/kon-tum-church.jpg"
import buonDonImage from "@/imports/tours/buon-don.jpg"
import drayNurImage from "@/imports/tours/dray-nur.jpg"
import hoLakImage from "@/imports/tours/ho-lak.jpg"
import coffeeImage from "@/imports/tours/coffee-buon-ma-thuot.jpg"

export type TourImageCredit = {
  label: string
  href: string
}

/**
 * Licensed destination photography used until the agency supplies its own
 * originals. The source and license details are recorded here so replacing
 * these images later is traceable.
 *
 * Sources:
 * - Măng Đen: Wikimedia Commons, CC BY-SA 3.0.
 * - Kon Tum wooden church: Wikimedia Commons, CC BY-SA 3.0.
 * - Buôn Đôn: Wikimedia Commons, CC BY-SA 3.0.
 * - Dray Nur: Wikimedia Commons, CC BY 2.0.
 * - Hồ Lắk: Wikimedia Commons, CC BY-SA 3.0.
 * - Buôn Ma Thuột coffee tree: Wikimedia Commons, CC BY-SA 3.0.
 */
export const tourImageBySlug: Record<string, string> = {
  "pleiku-kon-tum-mang-den-3n2d-ghep-doan": mangDenImage,
  "hanoi-pleiku-mang-den-cot-moc-3n2d": mangDenImage,
  "hanoi-pleiku-mang-den-cot-moc-buon-ma-thuot-3n2d": mangDenImage,
  "ha-noi-pleiku-mang-den-buon-ma-thuot-3n2d": coffeeImage,
  "buon-ma-thuot-buon-don-nui-da-voi-ho-lak-3n2d": hoLakImage,
  "pleiku-kon-tum-mang-den-buon-ma-thuot-4n3d-ghep-doan": konTumChurchImage,
  "hanoi-buon-ma-thuot-pleiku-4n3d": buonDonImage,
  "hanoi-pleiku-buon-ma-thuot-hai-phong-4n3d": drayNurImage,
  "hanoi-pleiku-mang-den-cot-moc-kon-ka-kinh-4n3d": mangDenImage,
  "pleiku-mang-den-kon-tum-buon-ma-thuot-5n4d-4sao": konTumChurchImage,
  "hanoi-pleiku-cot-moc-buon-ma-thuot-2n1d": coffeeImage,
  "hue-mang-den-kon-tum-pleiku-3n2d": konTumChurchImage,
  "buon-ma-thuot-buon-don-dray-nur-ho-lak-4n3d": drayNurImage,
}

const credits = {
  mangDen: {
    label: "Wikimedia Commons · Weendang · CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Mang_den.jpg",
  },
  konTumChurch: {
    label: "Wikimedia Commons · Rdavout · CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Kontum_wooden_catholic_church.jpg",
  },
  buonDon: {
    label: "Wikimedia Commons · Đỗ Tuấn Hưng · CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Bandon05.JPG",
  },
  drayNur: {
    label: "Wikimedia Commons · Sketyl · CC BY 2.0",
    href: "https://commons.wikimedia.org/wiki/File:Dray_Nur_Waterfall_(49483244536).jpg",
  },
  hoLak: {
    label: "Wikimedia Commons · Nguyễn Đông Sơn · CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Lak_Lake.jpg",
  },
  coffee: {
    label: "Wikimedia Commons · DXLINH · CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Coffee_tree_in_Buon_Me_Thuot_city.jpg",
  },
} satisfies Record<string, TourImageCredit>

export const tourImageCreditBySlug: Record<string, TourImageCredit> = {
  "pleiku-kon-tum-mang-den-3n2d-ghep-doan": credits.mangDen,
  "hanoi-pleiku-mang-den-cot-moc-3n2d": credits.mangDen,
  "hanoi-pleiku-mang-den-cot-moc-buon-ma-thuot-3n2d": credits.mangDen,
  "ha-noi-pleiku-mang-den-buon-ma-thuot-3n2d": credits.coffee,
  "buon-ma-thuot-buon-don-nui-da-voi-ho-lak-3n2d": credits.hoLak,
  "pleiku-kon-tum-mang-den-buon-ma-thuot-4n3d-ghep-doan": credits.konTumChurch,
  "hanoi-buon-ma-thuot-pleiku-4n3d": credits.buonDon,
  "hanoi-pleiku-buon-ma-thuot-hai-phong-4n3d": credits.drayNur,
  "hanoi-pleiku-mang-den-cot-moc-kon-ka-kinh-4n3d": credits.mangDen,
  "pleiku-mang-den-kon-tum-buon-ma-thuot-5n4d-4sao": credits.konTumChurch,
  "hanoi-pleiku-cot-moc-buon-ma-thuot-2n1d": credits.coffee,
  "hue-mang-den-kon-tum-pleiku-3n2d": credits.konTumChurch,
  "buon-ma-thuot-buon-don-dray-nur-ho-lak-4n3d": credits.drayNur,
}
