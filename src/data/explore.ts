export type ExplorePackage = {
  title: string;
  category: string;
  duration: string;
  pace: string;
  price: string;
  image: string;
  copy: string;
};

export type ExploreDestination = {
  id: string;
  name: string;
  provinceId: string;
  aliases: string[];
  summary: string;
  isSelectable: boolean;
};

export type ExploreRegion = {
  id: string;
  label: string;
  title: string;
  eyebrow: string;
  copy: string;
  mapTransform: string;
  provinceIds: string[];
  provinceNames: string[];
  provinceAliases?: Record<string, string[]>;
  destinations: ExploreDestination[];
  packages: ExplorePackage[];
};

export const exploreRegions: ExploreRegion[] = [
  {
    id: 'central-highlands',
    label: 'Tây Nguyên',
    title: 'Cao nguyên xanh, nhịp đi chậm.',
    eyebrow: 'Gia Lai · Kon Tum · Đắk Lắk',
    copy: 'Chọn Tây Nguyên để bắt đầu với những cung đường bazan, hồ núi lửa, rừng nguyên sinh và nông trại cà phê do người địa phương dẫn dắt.',
    mapTransform: 'translate(-31%, -31%) scale(2.35)',
    provinceIds: ['VN28', 'VN30', 'VN33', 'VN72'],
    provinceNames: ['Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông'],
    provinceAliases: {
      VN30: ['Pleiku', 'Plei Ku', 'Bien Ho', 'Biển Hồ', 'Tơ Nưng', 'T’Nưng'],
      VN28: ['Kon Ka Kinh'],
      VN33: ['Buôn Ma Thuột', 'Dak Lak'],
      VN72: ['Dak Nong'],
    },
    destinations: [
      { id: 'bien-ho-tnung', name: 'Biển Hồ T’Nưng', provinceId: 'VN30', aliases: ['Bien Ho', 'Tnưng', 'Pleiku'], summary: 'Hồ núi lửa xanh mát gần Pleiku.', isSelectable: true },
      { id: 'kon-ka-king', name: 'Vườn quốc gia Kon Ka Kinh', provinceId: 'VN28', aliases: ['Kon Ka Kinh', 'rừng nguyên sinh'], summary: 'Rừng nguyên sinh và trekking nhẹ ở Tây Nguyên.', isSelectable: true },
      { id: 'pleiku-coffee', name: 'Cà phê Pleiku', provinceId: 'VN30', aliases: ['coffee', 'ca phe', 'Robusta'], summary: 'Trải nghiệm nông trại và rang cà phê cao nguyên.', isSelectable: true },
    ],
    packages: [
      { title: 'Bình minh trên Biển Hồ T’Nưng', category: 'Hồ núi lửa', duration: '2-3 giờ', pace: 'Rất dễ', price: '$28.50', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80', copy: 'Khởi hành trước nắng sớm, băng qua triền thông và dừng lại bên ly cà phê ven hồ của người địa phương.' },
      { title: 'Đi bộ giữa rừng Kon Ka Kinh', category: 'Rừng nguyên sinh', duration: '3-4 giờ', pace: 'Dễ', price: '$42.00', image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80', copy: 'Một cung đường mát rượi dưới tán cây cổ thụ, tiếng chim rừng và bữa picnic nhỏ bên dòng suối trong.' },
      { title: 'Một ngày cùng cà phê Pleiku', category: 'Cà phê cao nguyên', duration: '3 giờ', pace: 'Thưởng thức', price: '$19.80', image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=80', copy: 'Hái quả chín đúng mùa, xem rang thủ công và nếm Robusta theo ba cách pha thân thuộc của cao nguyên.' },
    ],
  },
  {
    id: 'northern-mountains',
    label: 'Miền núi Bắc Bộ',
    title: 'Ruộng bậc thang và bản làng trên mây.',
    eyebrow: 'Lào Cai · Hà Giang · Điện Biên',
    copy: 'Những hành trình nhiều sương, dốc núi và chợ phiên; phù hợp cho nhóm thích nhiếp ảnh, trekking nhẹ và lưu trú cộng đồng.',
    mapTransform: 'translate(8%, 19%) scale(2.7)',
    provinceIds: ['VN01', 'VN02', 'VN03', 'VN04', 'VN05', 'VN06', 'VN07', 'VN71'],
    provinceNames: ['Lai Chau', 'Lào Cai', 'Hà Giang', 'Cao Bằng', 'Son La', 'Yên Bái', 'Tuyên Quang', 'Điện Biên'],
    provinceAliases: { VN02: ['Sa Pa', 'Sapa'], VN03: ['Ha Giang'], VN71: ['Dien Bien'] },
    destinations: [
      { id: 'ha-giang-pass', name: 'Đèo đá Hà Giang', provinceId: 'VN03', aliases: ['Ha Giang', 'cao nguyên đá'], summary: 'Cung đường núi và thung lũng đá tai mèo.', isSelectable: true },
      { id: 'sa-pa-terraces', name: 'Ruộng bậc thang Sa Pa', provinceId: 'VN02', aliases: ['Sapa', 'Sa Pa', 'ruong bac thang'], summary: 'Trekking nhẹ qua ruộng bậc thang và bản làng.', isSelectable: true },
    ],
    packages: [
      { title: 'Sớm mai trên đèo đá Hà Giang', category: 'Cung đường núi', duration: '2 ngày', pace: 'Vừa phải', price: '$86.00', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80', copy: 'Đi qua các cung đèo đẹp, dừng ở bản nhỏ và ngắm ánh sáng sớm phủ lên những thung lũng đá tai mèo.' },
      { title: 'Lối mòn ruộng bậc thang Sa Pa', category: 'Trekking nhẹ', duration: '1 ngày', pace: 'Dễ', price: '$54.00', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80', copy: 'Đi bộ cùng hướng dẫn viên bản địa qua ruộng bậc thang, nhà gỗ và những bữa cơm nấu tại bản.' },
    ],
  },
  {
    id: 'central-coast',
    label: 'Duyên hải miền Trung',
    title: 'Di sản, đèo gió và làng biển.',
    eyebrow: 'Huế · Đà Nẵng · Quảng Nam · Phú Yên',
    copy: 'Mỗi hành trình có nhịp đi mở: sáng trong phố cổ, chiều qua đèo gió, tối nghe biển và thưởng thức bữa ăn địa phương.',
    mapTransform: 'translate(-28%, -15%) scale(2.1)',
    provinceIds: ['VN24', 'VN25', 'VN26', 'VNDN', 'VN27', 'VN29', 'VN31', 'VN32', 'VN34', 'VN36'],
    provinceNames: ['Quảng Bình', 'Quảng Trị', 'Thừa Thiên - Huế', 'Đà Nẵng', 'Quàng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận'],
    provinceAliases: { VN27: ['Hoi An', 'Hội An', 'Quảng Nam'], VN26: ['Hue', 'Huế'], VN32: ['Phu Yen'] },
    destinations: [
      { id: 'hoi-an-old-town', name: 'Phố cổ Hội An', provinceId: 'VN27', aliases: ['Hoi An', 'Quang Nam'], summary: 'Di sản phố cổ, xưởng thủ công và ẩm thực ven sông.', isSelectable: true },
      { id: 'hue-garden', name: 'Vườn nhà Huế', provinceId: 'VN26', aliases: ['Hue', 'lăng tẩm'], summary: 'Vườn nhà, lịch sử và bữa cơm Huế chậm rãi.', isSelectable: true },
      { id: 'quy-nhon-phu-yen', name: 'Đường biển Quy Nhơn - Phú Yên', provinceId: 'VN32', aliases: ['Quy Nhon', 'Phu Yen', 'biển'], summary: 'Cung đường biển, làng chài và bãi đá.', isSelectable: true },
    ],
    packages: [
      { title: 'Một ngày giữa phố cổ Hội An', category: 'Di sản', duration: '1 ngày', pace: 'Thư thả', price: '$48.00', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80', copy: 'Đi bộ qua nhà cổ, xưởng thủ công và bữa tối bên sông với nhịp chậm, ít điểm dừng nhưng nhiều thời gian cảm nhận.' },
      { title: 'Đường biển Quy Nhơn - Phú Yên', category: 'Biển và làng chài', duration: '8 giờ', pace: 'Dễ', price: '$52.00', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80', copy: 'Một cung đường ven biển, ghé làng chài, bãi đá và những quán nhỏ nấu hải sản theo mùa.' },
      { title: 'Huế qua vườn nhà và lăng tẩm', category: 'Ẩm thực · lịch sử', duration: '6 giờ', pace: 'Rất dễ', price: '$39.00', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80', copy: 'Đi giữa vườn nhà Huế, nghe chuyện gia đình, thưởng thức bữa cơm nhỏ và thăm một lăng tẩm yên tĩnh.' },
    ],
  },
  {
    id: 'southern-delta',
    label: 'Nam Bộ',
    title: 'Sông nước, miệt vườn và thành phố phương Nam.',
    eyebrow: 'TP.HCM · An Giang · Cần Thơ · Cà Mau',
    copy: 'Từ nhịp đô thị đến kênh rạch, chợ nổi và rừng ngập mặn; các gói tour ưu tiên trải nghiệm đời sống ven sông.',
    mapTransform: 'translate(-14%, -61%) scale(2.55)',
    provinceIds: ['VNSG', 'VN44', 'VN45', 'VN46', 'VN47', 'VN49', 'VN50', 'VN51', 'VN52', 'VN55', 'VN59', 'VN73'],
    provinceNames: ['Hồ Chí Minh city', 'An Giang', 'Ðong Tháp', 'Tiền Giang', 'Kiên Giang', 'Vĩnh Long', 'Bến Tre', 'Trà Vinh', 'Sóc Trăng', 'Bạc Liêu', 'Cà Mau', 'Hau Giang'],
    provinceAliases: { VN50: ['Ben Tre'], VN59: ['Ca Mau'], VN73: ['Hau Giang', 'Hậu Giang'], VNSG: ['Saigon', 'Sài Gòn', 'TPHCM'] },
    destinations: [
      { id: 'floating-market', name: 'Chợ nổi miền Tây', provinceId: 'VN73', aliases: ['cho noi', 'Hậu Giang', 'Can Tho'], summary: 'Bữa sáng trên sông và xưởng nhỏ ven kênh.', isSelectable: true },
      { id: 'ben-tre-garden', name: 'Miệt vườn Bến Tre', provinceId: 'VN50', aliases: ['Ben Tre', 'xe đạp'], summary: 'Đạp xe qua vườn dừa, cầu nhỏ và nhà dân.', isSelectable: true },
      { id: 'ca-mau-mangrove', name: 'Rừng ngập mặn mũi Cà Mau', provinceId: 'VN59', aliases: ['Ca Mau', 'rừng ngập mặn'], summary: 'Đi thuyền xuyên rừng ngập mặn cuối đất Việt.', isSelectable: true },
    ],
    packages: [
      { title: 'Chợ nổi và bữa sáng trên sông', category: 'Sông nước', duration: '4 giờ', pace: 'Rất dễ', price: '$32.00', image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&q=80', copy: 'Lên thuyền sớm, ăn sáng trên sông và ghé một xưởng nhỏ ven kênh trước khi nắng lên cao.' },
      { title: 'Miệt vườn Bến Tre bằng xe đạp', category: 'Miệt vườn', duration: '5 giờ', pace: 'Dễ', price: '$36.00', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80', copy: 'Đạp xe qua vườn dừa, cầu nhỏ và nhà dân; dừng lại cho một bữa trưa giản dị nấu bằng nguyên liệu quanh vườn.' },
      { title: 'Rừng ngập mặn mũi Cà Mau', category: 'Sinh thái', duration: '1 ngày', pace: 'Vừa phải', price: '$58.00', image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=80', copy: 'Đi thuyền xuyên rừng ngập mặn, gặp hộ giữ rừng và hiểu thêm về vùng đất cuối cùng của Việt Nam.' },
    ],
  },
];
