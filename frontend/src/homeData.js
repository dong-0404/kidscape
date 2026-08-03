// ============================================================
// Nội dung trang chủ KidScape — bám theo thiết kế "Sa bàn tương tác".
// Tách riêng để marketing chỉnh sửa mà không đụng vào layout.
// ============================================================

const IMG = '/assets/home'

// --- Hero -----------------------------------------------------
export const heroChips = [
  { value: '3-6', label: 'Tuổi', tone: 'red' },
  { icon: `${IMG}/icon-chip-sound.png`, label: 'Âm thanh\nsinh động', tone: 'blue' },
  { icon: `${IMG}/icon-chip-brain.png`, label: 'Học qua\ntrải nghiệm', tone: 'orange' },
  { icon: `${IMG}/icon-chip-leaf.png`, label: 'Chất liệu\nan toàn', tone: 'green' },
]

// --- Cách chơi 3 bước ----------------------------------------
export const playSteps = [
  {
    n: 1,
    img: `${IMG}/step-1.webp`,
    title: 'Chọn một con vật',
    desc: 'Bé chọn mô hình con vật mình muốn tìm hiểu.',
    tone: 'red',
  },
  {
    n: 2,
    img: `${IMG}/step-2.webp`,
    title: 'Tìm môi trường sống',
    desc: 'Quan sát sa bàn và tìm môi trường phù hợp.',
    tone: 'yellow',
  },
  {
    n: 3,
    img: `${IMG}/step-3.webp`,
    title: 'Đặt đúng vị trí & lắng nghe',
    desc: 'Đặt con vật vào đúng nơi, sa bàn sẽ phát âm thanh và câu chuyện thú vị.',
    tone: 'green',
  },
]

// --- 10 loài động vật quý hiếm -------------------------------
export const animals = [
  { slug: 'bao-gam', name: 'Báo gấm', habitat: 'Rừng thường xanh' },
  { slug: 'sao-la', name: 'Sao la', habitat: 'Rừng Trường Sơn' },
  { slug: 'son-duong', name: 'Sơn dương', habitat: 'Núi đá vôi' },
  { slug: 'cao-do', name: 'Cáo đỏ', habitat: 'Rừng và đồng cỏ' },
  { slug: 'gau-ngua', name: 'Gấu ngựa', habitat: 'Rừng núi cao' },
  { slug: 'vooc-mong-trang', name: 'Voọc mông trắng', habitat: 'Núi đá vôi' },
  { slug: 'doi-moi', name: 'Đồi mồi', habitat: 'Rạn san hô' },
  { slug: 'ca-heo-hong', name: 'Cá heo hồng', habitat: 'Vùng cửa sông' },
  { slug: 'ca-voi-xanh', name: 'Cá voi xanh', habitat: 'Đại dương khơi' },
  { slug: 'seu-dau-do', name: 'Sếu đầu đỏ', habitat: 'Đồng cỏ ngập nước' },
].map((a) => ({ ...a, img: `${IMG}/animal-${a.slug}.webp` }))

// --- Vì sao ba mẹ chọn KidScape ------------------------------
export const whyChoose = [
  {
    icon: `${IMG}/icon-interactive.png`,
    title: 'Thiết kế tương tác',
    desc: 'Sa bàn phát âm thanh khi đặt đúng vị trí, tạo hứng thú khám phá cho bé.',
  },
  {
    icon: `${IMG}/icon-hands-on.png`,
    title: 'Học qua trải nghiệm',
    desc: 'Kết hợp nhìn – nghe – chạm, giúp trẻ ghi nhớ tự nhiên và lâu hơn.',
  },
  {
    icon: `${IMG}/icon-safe-material.png`,
    title: 'Chất liệu an toàn',
    desc: 'Gỗ tự nhiên, sơn gốc nước, bo tròn cạnh, an toàn cho bé 3 – 6 tuổi.',
  },
  {
    icon: `${IMG}/icon-education.png`,
    title: 'Nội dung chuẩn giáo dục',
    desc: 'Nội dung được nghiên cứu kỹ lưỡng về 10 loài động vật quý hiếm Việt Nam.',
  },
]

// --- An toàn / Bảo hành --------------------------------------
export const safetyPoints = [
  'Gỗ tự nhiên cao cấp',
  'Sơn gốc nước an toàn',
  'Bo tròn mọi cạnh chi tiết',
  'Kiểm định chất lượng',
  'Phù hợp trẻ 3-6 tuổi',
]

export const warrantyPoints = [
  'Bảo hành lỗi kỹ thuật',
  'Hỗ trợ kỹ thuật tận nơi',
  'Đổi mới nếu sản phẩm lỗi kỹ thuật',
]

export const testimonials = [
  {
    name: 'Chị Thu Trang',
    city: 'Hà Nội',
    stars: 5,
    quote: 'Bé nhà mình rất thích! Âm thanh sinh động, thiết kế đẹp và nội dung rất bổ ích.',
  },
  {
    name: 'Anh Hoàng Nam',
    city: 'TP. HCM',
    stars: 5,
    quote: 'Sản phẩm chắc chắn, an toàn. Bé vừa chơi vừa học rất hiệu quả.',
  },
  {
    name: 'Chị Minh Anh',
    city: 'Đà Nẵng',
    stars: 5,
    quote: 'Món quà ý nghĩa giúp con yêu thiên nhiên hơn mỗi ngày.',
  },
]

// --- Khối đặt mua --------------------------------------------
// TODO: Product model chưa có trường giá — số liệu dưới đây lấy từ file thiết kế.
export const offer = {
  listPrice: '1.490.000đ',
  salePrice: '1.190.000',
  currency: 'đ',
  note: 'Miễn phí giao hàng toàn quốc',
}

// --- Cam kết dịch vụ (dải trắng trước footer) ----------------
export const servicePoints = [
  { icon: `${IMG}/icon-shipping.png`, title: 'Giao hàng', desc: 'toàn quốc' },
  { icon: `${IMG}/icon-inspect.png`, title: 'Kiểm tra hàng', desc: 'trước khi thanh toán' },
  { icon: `${IMG}/icon-return.png`, title: 'Đổi trả trong 7 ngày', desc: 'nếu có lỗi' },
  { icon: `${IMG}/icon-payment.png`, title: 'Thanh toán linh hoạt', desc: 'COD, chuyển khoản' },
]
