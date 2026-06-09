// Nội dung trang chủ KidScape — tách riêng để dễ chỉnh sửa

export const navLinks = [
  { label: 'Trang chủ', href: '/#home' },
  { label: 'Về chúng tôi', href: '/#about' },
  { label: 'Sản phẩm', to: '/products' },
  { label: 'Chatbot', widget: true },
  { label: 'Tin tức', to: '/blog' },
  { label: 'Đối tác', href: '/#partners' },
  { label: 'Liên hệ', href: '/#contact' },
]

export const coreValues = [
  {
    icon: '🧒',
    title: 'Trẻ em là trung tâm',
    desc: 'Mọi sản phẩm và hoạt động đều xuất phát từ nhu cầu phát triển của trẻ.',
  },
  {
    icon: '🧩',
    title: 'Học tập qua trải nghiệm',
    desc: 'Tin rằng trải nghiệm thực tế là cách học hiệu quả và bền vững nhất.',
  },
  {
    icon: '💡',
    title: 'Sáng tạo và đổi mới',
    desc: 'Liên tục đổi mới để tạo ra những trải nghiệm giáo dục hấp dẫn, phù hợp với từng giai đoạn phát triển của trẻ.',
  },
  {
    icon: '🛡️',
    title: 'An toàn và trách nhiệm',
    desc: 'Đảm bảo an toàn cho trẻ và đề cao trách nhiệm trong việc mang đến giá trị phát triển tích cực, bền vững.',
  },
  {
    icon: '🤝',
    title: 'Đồng hành và kết nối',
    desc: 'Xây dựng sự gắn kết bền chặt giữa phụ huynh và trẻ trong từng khoảnh khắc.',
  },
]

export const whyReasons = [
  {
    icon: '👐',
    title: 'Phát triển đa giác quan',
    desc: 'Học hỏi thông qua chạm — quan sát — lắng nghe trong cùng một trải nghiệm.',
  },
  {
    icon: '🌱',
    title: 'Học qua trải nghiệm',
    desc: 'Trẻ chủ động khám phá thay vì ghi nhớ thụ động, kiến thức được khắc sâu.',
  },
  {
    icon: '🔍',
    title: 'Kích thích trí tò mò',
    desc: 'Khơi gợi sự hứng thú và khả năng khám phá thế giới xung quanh.',
  },
  {
    icon: '📵',
    title: 'Hạn chế thiết bị điện tử',
    desc: 'Đưa trẻ rời màn hình, đến với hoạt động chơi thật, chạm thật.',
  },
]

// Sản phẩm được quản lý ở backend (Product model) và đọc qua /api/products.
// Dữ liệu mẫu ban đầu được seed ở backend/seed/seed.js.

// Câu hỏi thường gặp ở trang sản phẩm.
export const productFaqs = [
  {
    q: 'Sản phẩm phù hợp với độ tuổi nào?',
    a: 'Các sản phẩm của KidScape được thiết kế dành riêng cho trẻ từ 3 đến 6 tuổi.',
  },
  {
    q: 'Đồ chơi của KidScape có an toàn cho bé không?',
    a: 'An toàn của trẻ luôn được KidScape đặt lên hàng đầu: chất liệu phù hợp lứa tuổi, được lựa chọn kỹ lưỡng. Phụ huynh nên chơi cùng bé để trải nghiệm thêm trọn vẹn và an toàn.',
  },
  {
    q: 'Vì sao gọi là đồ chơi "đa giác quan"?',
    a: 'Mỗi sản phẩm kết hợp nhìn — nghe — chạm — tương tác trong cùng một trải nghiệm, giúp bé học hỏi chủ động thay vì ghi nhớ thụ động.',
  },
  {
    q: 'Bố mẹ có cần chơi cùng bé không?',
    a: 'Rất nên! Đồng hành cùng bé khi chơi giúp tăng sự gắn kết và để bố mẹ cùng khám phá thế giới qua đôi mắt của con.',
  },
  {
    q: 'Làm sao để mua hoặc nhận tư vấn?',
    a: 'Bạn có thể nhắn cho trợ lý KidScape ngay trên trang, hoặc gửi email tới hello@kidscape.vn để được hỗ trợ.',
  },
]

export const footerInfo = {
  address: 'Tầng 5, Tòa nhà Sáng Tạo, 123 Đường Khám Phá, Quận 1, TP. Hồ Chí Minh',
  email: 'hello@kidscape.vn',
  socials: [
    { label: 'Facebook', short: 'f', href: '#' },
    { label: 'TikTok', short: 'tik', href: '#' },
    { label: 'Instagram', short: 'ig', href: '#' },
  ],
}
