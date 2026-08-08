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
// `ratio` = rộng/cao của vùng ảnh, đo từ alpha bounding box của từng file .webp.
// Cần nó để chuẩn hoá kích thước theo DIỆN TÍCH: nếu chỉ ép cùng chiều cao thì
// con dài (đồi mồi, cá voi) chiếm diện tích gấp đôi con cao gầy (sếu) và trông
// to hơn hẳn. Khi thay asset thì đo lại tỉ lệ này.
const animalList = [
  { slug: 'bao-gam', name: 'Báo gấm', habitat: 'Rừng thường xanh', ratio: 1.182 },
  { slug: 'sao-la', name: 'Sao la', habitat: 'Rừng Trường Sơn', ratio: 0.966 },
  { slug: 'son-duong', name: 'Sơn dương', habitat: 'Núi đá vôi', ratio: 0.96 },
  { slug: 'cao-do', name: 'Cáo đỏ', habitat: 'Rừng và đồng cỏ', ratio: 1.173 },
  { slug: 'gau-ngua', name: 'Gấu ngựa', habitat: 'Rừng núi cao', ratio: 0.839 },
  { slug: 'vooc-mong-trang', name: 'Voọc mông trắng', habitat: 'Núi đá vôi', ratio: 0.794 },
  { slug: 'doi-moi', name: 'Đồi mồi', habitat: 'Rạn san hô', ratio: 1.886 },
  { slug: 'ca-heo-hong', name: 'Cá heo hồng', habitat: 'Vùng cửa sông', ratio: 1.064 },
  { slug: 'ca-voi-xanh', name: 'Cá voi xanh', habitat: 'Đại dương khơi', ratio: 1.728 },
  { slug: 'seu-dau-do', name: 'Sếu đầu đỏ', habitat: 'Đồng cỏ ngập nước', ratio: 0.679 },
]

// Cùng diện tích cho mọi loài: h = √(A/r). Lấy con hẹp nhất làm mốc scale = 1
// (cao đầy khung), các con còn lại nhỏ lại theo đúng tỉ lệ căn bậc hai.
const narrowest = Math.min(...animalList.map((a) => a.ratio))

export const animals = animalList.map((a) => ({
  ...a,
  img: `${IMG}/animal-${a.slug}.webp`,
  scale: Number(Math.sqrt(narrowest / a.ratio).toFixed(3)),
}))

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
  // Tên hiển thị 2 dòng: dòng đầu xanh, "Sách Đỏ" xuống dòng và tô đỏ.
  name: 'Những người bạn',
  nameAccent: 'Sách Đỏ',
  listPrice: '1.200.000',
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
