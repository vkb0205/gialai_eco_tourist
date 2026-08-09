export type Service = {
  id: number
  slug: string
  category: string
  title: string
  description: string
  icon: string
  features: string[]
  cta: string
  ctaHref: string
}

const services: Service[] = [
  {
    id: 1,
    slug: "thue-xe",
    category: "Di chuyển",
    title: "Thuê xe",
    description:
      "Xe đời mới, có tài xế địa phương hoặc tự lái. Đưa đón sân bay, di chuyển giữa các điểm tham quan.",
    icon: "🚐",
    features: [
      "Xe 4-45 chỗ, đời mới",
      "Tài xế người địa phương am hiểu cung đường",
      "Đưa đón sân bay Pleiku",
      "Linh hoạt lịch trình theo yêu cầu",
    ],
    cta: "Đặt xe ngay",
    ctaHref: "#contact",
  },
  {
    id: 2,
    slug: "ve-may-bay",
    category: "Di chuyển",
    title: "Vé máy bay",
    description:
      "Săn vé máy bay giá tốt đến Pleiku, Buôn Ma Thuột và các sân bay lân cận Tây Nguyên.",
    icon: "✈️",
    features: [
      "Vé nội địa & quốc tế",
      "Hỗ trợ đổi/hoàn vé linh hoạt",
      "Ưu đãi cho đoàn từ 5 người",
      "Tích hợp trọn gói với tour du lịch",
    ],
    cta: "Tìm vé tốt nhất",
    ctaHref: "#contact",
  },
  {
    id: 3,
    slug: "khach-san",
    category: "Lưu trú",
    title: "Khách sạn",
    description:
      "Từ homestay nhà sàn truyền thống đến resort nghỉ dưỡng giữa rừng thông — chúng tôi có lựa chọn phù hợp.",
    icon: "🏡",
    features: [
      "Homestay làng dân tộc Bahnar, Jrai",
      "Resort cao cấp view hồ, view núi",
      "Đặt phòng giá ưu đãi",
      "Hỗ trợ đặc biệt cho đoàn lớn",
    ],
    cta: "Chọn nơi nghỉ",
    ctaHref: "#contact",
  },
  {
    id: 4,
    slug: "visa",
    category: "Thủ tục",
    title: "Visa",
    description:
      "Dịch vụ làm visa nhanh chóng, hỗ trợ du khách quốc tế đến Việt Nam và người Việt đi nước ngoài.",
    icon: "📋",
    features: [
      "Visa du lịch, công tác",
      "Xử lý hồ sơ trong 3-5 ngày",
      "Hỗ trợ gia hạn visa",
      "Tư vấn thủ tục miễn phí",
    ],
    cta: "Tư vấn visa",
    ctaHref: "#contact",
  },
  {
    id: 5,
    slug: "khac",
    category: "Khác",
    title: "Dịch vụ khác",
    description:
      "Các nhu cầu đặc thù khác: bảo hiểm du lịch, cho thuê thiết bị cắm trại, tổ chức sự kiện ngoài trời, và hơn thế nữa.",
    icon: "✨",
    features: [
      "Bảo hiểm du lịch quốc tế",
      "Cho thuê thiết bị cắm trại, trekking",
      "Tổ chức sự kiện, teambuilding ngoài trời",
      "Tư vấn thiết kế hành trình theo yêu cầu",
    ],
    cta: "Liên hệ tư vấn",
    ctaHref: "#contact",
  },
]

export default services
