import mangDenImage from "@/imports/tours/mang-den.webp"
import konTumChurchImage from "@/imports/tours/kon-tum-church.webp"
import buonDonImage from "@/imports/tours/buon-don.webp"
import drayNurImage from "@/imports/tours/dray-nur.webp"
import hoLakImage from "@/imports/tours/ho-lak.webp"
import coffeeImage from "@/imports/tours/coffee-buon-ma-thuot.webp"
import bienHoImage from "@/imports/homepage/bien-ho.jpeg"
import k50Image from "@/imports/homepage/k50-waterfall.png"
import konPringImage from "@/imports/homepage/kon-pring-village.jpg"
import festivalImage from "@/imports/photos/festival-cong-chieng-2026.webp"

export type TourImageCredit = {
  label: string
  href: string
}

export const imageCredits = {
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
  bienHo: {
    label: "Gia Lai Eco Tourist · Biển Hồ Pleiku",
    href: "#/explore",
  },
  k50: {
    label: "Thác K50 Khu bảo tồn thiên nhiên Kon Chư Răng",
    href: "#/explore",
  },
  konPring: {
    label: "Làng du lịch cộng đồng Kon Pring, Măng Đen",
    href: "#/explore",
  },
  festival: {
    label: "Không gian văn hoá Cồng Chiêng Tây Nguyên",
    href: "#/explore",
  },
} satisfies Record<string, TourImageCredit>

/**
 * Mapping of tour slug to a distinct, matching image asset.
 * No two visible cards share an image unless they are truly the same destination.
 */
export const tourImageBySlug: Record<string, string> = {
  "pleiku-kon-tum-mang-den-3n2d-ghep-doan": mangDenImage,
  "hanoi-pleiku-mang-den-cot-moc-3n2d": bienHoImage,
  "hanoi-pleiku-mang-den-cot-moc-buon-ma-thuot-3n2d": festivalImage,
  "ha-noi-pleiku-mang-den-buon-ma-thuot-3n2d": coffeeImage,
  "buon-ma-thuot-buon-don-nui-da-voi-ho-lak-3n2d": hoLakImage,
  "pleiku-kon-tum-mang-den-buon-ma-thuot-4n3d-ghep-doan": konTumChurchImage,
  "hanoi-buon-ma-thuot-pleiku-4n3d": buonDonImage,
  "hanoi-pleiku-buon-ma-thuot-hai-phong-4n3d": drayNurImage,
  "hanoi-pleiku-mang-den-cot-moc-kon-ka-kinh-4n3d": k50Image,
  "pleiku-mang-den-kon-tum-buon-ma-thuot-5n4d-4sao": konPringImage,
}

export const tourImageCreditBySlug: Record<string, TourImageCredit> = {
  "pleiku-kon-tum-mang-den-3n2d-ghep-doan": imageCredits.mangDen,
  "hanoi-pleiku-mang-den-cot-moc-3n2d": imageCredits.bienHo,
  "hanoi-pleiku-mang-den-cot-moc-buon-ma-thuot-3n2d": imageCredits.festival,
  "ha-noi-pleiku-mang-den-buon-ma-thuot-3n2d": imageCredits.coffee,
  "buon-ma-thuot-buon-don-nui-da-voi-ho-lak-3n2d": imageCredits.hoLak,
  "pleiku-kon-tum-mang-den-buon-ma-thuot-4n3d-ghep-doan": imageCredits.konTumChurch,
  "hanoi-buon-ma-thuot-pleiku-4n3d": imageCredits.buonDon,
  "hanoi-pleiku-buon-ma-thuot-hai-phong-4n3d": imageCredits.drayNur,
  "hanoi-pleiku-mang-den-cot-moc-kon-ka-kinh-4n3d": imageCredits.k50,
  "pleiku-mang-den-kon-tum-buon-ma-thuot-5n4d-4sao": imageCredits.konPring,
}

/**
 * Text for the soft placeholder when an authentic image has not been shot yet.
 * Never displays a wrong or misleading photo.
 */
export const tourPlaceholderBySlug: Record<string, string> = {
  "hanoi-pleiku-cot-moc-buon-ma-thuot-2n1d": "Cột mốc ngã ba biên giới Việt - Lào - Campuchia",
  "hue-mang-den-kon-tum-pleiku-3n2d": "Lăng tẩm và sông Hương, Huế",
  "buon-ma-thuot-buon-don-dray-nur-ho-lak-4n3d": "Núi đá voi Yang Tao & buôn làng Đắk Lắk",
  "mu-cang-chai-mua-lua-chin": "Ruộng bậc thang Mù Cang Chải",
  "cho-phien-bac-ha-va-ban-ta-van": "Chợ phiên Bắc Hà & thung lũng Mường Hoa",
  "fansipan-duong-tram-ton": "Đỉnh Fansipan & rừng đỗ quyên",
  "cao-nguyen-da-dong-van": "Đèo Mã Pí Lèng & cao nguyên đá Đồng Văn",
  "ho-ba-be-thuyen-doc-moc": "Hồ Ba Bể trên thuyền độc mộc",
  "thac-ban-gioc-va-nguom-ngao": "Thác Bản Giốc & động Ngườm Ngao",
  "hue-lang-tam-song-huong": "Lăng tẩm và sông Hương, Huế",
  "hoi-an-lang-rau-tra-que": "Làng rau Trà Quế, Hội An",
}
