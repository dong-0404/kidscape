// Nội dung trang chủ KidScape — tách riêng để dễ chỉnh sửa

// Điều hướng chính — `hash` là id section trên trang chủ, `to` là route riêng.
export const navLinks = [
  { label: 'Trang chủ', to: '/', hash: 'home' },
  { label: 'Sản phẩm', to: '/products' },
  { label: 'Khám phá 10 loài', hash: 'kham-pha' },
  { label: 'Hướng dẫn', hash: 'huong-dan' },
  { label: 'Tin tức', to: '/blog' },
  { label: 'Giới thiệu', hash: 'vi-sao' },
  { label: 'Liên hệ', hash: 'lien-he' },
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

// Sản phẩm được quản lý ở backend (Product model) và đọc qua /api/products.
// Dữ liệu mẫu ban đầu được seed ở backend/seed/seed.js.

// LƯU Ý: số điện thoại / email / địa chỉ vẫn lấy từ file thiết kế — cần đối
// chiếu với thông tin thật trước khi lên production. Các link social đã xác nhận.
export const footerInfo = {
  tagline: 'Đồng hành cùng con khám phá thế giới tự nhiên',
  phone: '0968 123 456',
  email: 'hello@kidscape.com.vn',
  facebook: 'facebook.com/KidScape05',
  address: 'Hà Nội, Việt Nam',
  socials: [
    { label: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/KidScape05' },
    { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/kidscape05_official' },
    { label: 'TikTok', icon: 'tiktok', href: 'https://www.tiktok.com/@kidscape05' },
  ],
}

// 4 cột liên kết ở footer. `widget: true` mở trợ lý chat thay vì điều hướng.
export const footerColumns = [
  {
    heading: 'Sản phẩm',
    links: [
      { label: 'Sa bàn KidScape', to: '/products' },
      { label: 'Khám phá 10 loài', hash: 'kham-pha' },
      { label: 'Phụ kiện & Sticker', to: '/products' },
    ],
  },
  {
    heading: 'Hỗ trợ',
    links: [
      { label: 'Hướng dẫn sử dụng', hash: 'huong-dan' },
      { label: 'Bảo hành', hash: 'an-toan' },
      { label: 'Đổi trả & hoàn tiền', hash: 'cam-ket' },
      { label: 'Tư vấn cùng trợ lý', widget: true },
    ],
  },
  {
    heading: 'Về KidScape',
    links: [
      { label: 'Giới thiệu', hash: 'vi-sao' },
      { label: 'Câu chuyện thương hiệu', hash: 'vi-sao' },
      { label: 'Tin tức', to: '/blog' },
      { label: 'Liên hệ', hash: 'lien-he' },
    ],
  },
]
