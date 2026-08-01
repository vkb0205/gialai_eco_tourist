export type BlogStory = {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  location: string;
  excerpt: string;
  image: string;
  highlight: string;
};

export const blogStories: BlogStory[] = [
  {
    id: 'kon-ka-kinh-after-rain',
    title: 'Sau cơn mưa ở Kon Ka Kinh, cả đoàn đi chậm lại',
    category: 'Nhật ký đường rừng',
    date: '18.07.2026',
    readTime: '6 phút đọc',
    location: 'Kbang · Gia Lai',
    excerpt: 'Một lối mòn ướt, tiếng chim gọi qua tầng cây và buổi picnic được dời đến bên suối. Chuyến đi đã nhắc chúng tôi rằng rừng luôn có nhịp riêng.',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=85&w=1600',
    highlight: '12 người · 4 giờ dưới tán cổ thụ',
  },
  {
    id: 'bien-ho-first-light',
    title: 'Buổi sớm đầu tiên của mùa gió trên Biển Hồ',
    category: 'Hành trình đã đi',
    date: '04.07.2026',
    readTime: '4 phút đọc',
    location: 'Pleiku · Gia Lai',
    excerpt: 'Trước khi quán cà phê ven hồ mở cửa, chúng tôi đã có một khoảng trời xanh, hàng thông im lặng và ánh sáng đầu ngày trên mặt nước.',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=85&w=1200',
    highlight: '05:10 · điểm hẹn sớm nhất tháng 7',
  },
  {
    id: 'jrai-weaving-stories',
    title: 'Những hoa văn được kể lại bên khung dệt Jrai',
    category: 'Gặp người bản địa',
    date: '22.06.2026',
    readTime: '7 phút đọc',
    location: 'Ia Grai · Gia Lai',
    excerpt: 'Một buổi trưa bên nhà rông, nghệ nhân Y H’Linh chỉ cho chúng tôi cách ký ức của buôn làng đi vào từng sợi chỉ.',
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=85&w=1200',
    highlight: '1 nghệ nhân · 17 năm giữ nghề',
  },
  {
    id: 'pleiku-coffee-harvest',
    title: 'Mẻ rang đầu mùa và một ngày cùng cà phê Pleiku',
    category: 'Nông trại & ẩm thực',
    date: '09.06.2026',
    readTime: '5 phút đọc',
    location: 'Pleiku · Gia Lai',
    excerpt: 'Từ quả chín trên cành đến mùi hạt vừa nổ trong máy rang, chuyến đi nhỏ mở ra một cách thưởng thức Robusta chậm hơn.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&q=85&w=1200',
    highlight: '3 cách pha · 1 mẻ rang thủ công',
  },
  {
    id: 'phu-cuong-waterfall',
    title: 'Theo vệt sương đến thác Phú Cường',
    category: 'Hành trình đã đi',
    date: '27.05.2026',
    readTime: '5 phút đọc',
    location: 'Chư Sê · Gia Lai',
    excerpt: 'Buổi sáng qua vườn tiêu và rừng cao su kết thúc ở những bậc đá phủ dương xỉ, nơi cả đoàn ngồi lại lâu hơn dự kiến.',
    image: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&q=85&w=1200',
    highlight: '8 km · nhịp đi nhẹ, nhiều điểm dừng',
  },
  {
    id: 'chu-dang-ya-earth',
    title: 'Đất đỏ Chư Đăng Ya và những cánh đồng đổi mùa',
    category: 'Nhật ký đường rừng',
    date: '11.05.2026',
    readTime: '6 phút đọc',
    location: 'Chư Păh · Gia Lai',
    excerpt: 'Cung đường núi lửa không chỉ để ngắm xa. Chúng tôi dừng lại để nghe chuyện mùa vụ và nhìn bàn tay người dân chạm vào đất bazan.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=85&w=1200',
    highlight: '1 núi lửa · nhiều câu chuyện mùa màng',
  },
];
