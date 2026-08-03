// ============================================================
// Nội dung trang sản phẩm — bám theo file thiết kế trong /SanPham.
// Product model ở backend chưa có giá / thư viện ảnh / bộ sưu tập sắp ra mắt,
// nên phần đó nằm ở đây; khi model bổ sung trường thì thay bằng dữ liệu API.
// ============================================================

const IMG = '/assets/product'
const HOME = '/assets/home'

// Slug của sản phẩm chủ lực — dùng để ghép dữ liệu tĩnh vào bản ghi từ API.
export const FLAGSHIP_SLUG = 'sa-ban-10-loai-dong-vat'

// Ảnh tổng bộ: hiển thị mặc định ở khung lớn, KHÔNG nằm trong dải thumbnail
// (bám đúng file thiết kế). Bấm vào khung lớn để quay lại ảnh này.
export const heroImage = {
  src: `${IMG}/gallery-1.webp`,
  alt: 'Trọn bộ sa bàn, mô hình và thẻ thông tin KidScape',
}

// Thứ tự thumbnail lấy theo file thiết kế: sa bàn → mô hình → bản đồ & thẻ → thẻ hướng dẫn.
export const gallery = [
  { src: `${IMG}/gallery-2.webp`, thumb: `${IMG}/gallery-2-thumb.webp`, alt: 'Sa bàn gỗ nhiều tầng địa hình' },
  { src: `${IMG}/gallery-3.webp`, thumb: `${IMG}/gallery-3-thumb.webp`, alt: 'Bộ mô hình 10 loài động vật quý hiếm' },
  { src: `${IMG}/gallery-4.webp`, thumb: `${IMG}/gallery-4-thumb.webp`, alt: 'Bản đồ môi trường sống và thẻ Những người bạn Sách Đỏ' },
  { src: `${IMG}/gallery-6.webp`, thumb: `${IMG}/gallery-6-thumb.webp`, alt: 'Thẻ bảo hành và hướng dẫn bảo quản' },
  { src: `${IMG}/gallery-7.webp`, thumb: `${IMG}/gallery-7-thumb.webp`, alt: 'Bộ sticker 10 loài động vật' },
  { src: `${IMG}/gallery-5.webp`, thumb: `${IMG}/gallery-5-thumb.webp`, alt: 'Poster hành trình giải cứu muôn loài' },
]

// Tiêu đề 3 dòng, mỗi dòng một màu như thiết kế.
export const heading = {
  line1: 'Bộ đồ chơi KidScape',
  line2: '10 loài động vật quý hiếm',
  line3: 'Việt Nam',
  tagline: 'Học qua chơi – Khám phá thiên nhiên – Yêu Việt Nam',
}

// TODO: chuyển sang trường giá của Product model khi backend bổ sung.
export const offer = {
  price: 1190000,
  listPrice: 1490000,
}

export const specs = [
  { value: '3-6', label: 'Tuổi\n3-6', tone: 'red' },
  { icon: `${HOME}/icon-chip-sound.png`, label: 'Âm thanh\nsinh động' },
  { icon: `${HOME}/icon-chip-brain.png`, label: 'Học qua\ntrải nghiệm' },
  { icon: `${HOME}/icon-chip-leaf.png`, label: 'Chất liệu\nan toàn' },
]

export const comingSoon = [
  { slug: 'dong-vat-tien-su', name: 'Động vật\nthời tiền sử', img: `${IMG}/soon-dong-vat-tien-su.webp` },
  { slug: 'dia-ly-viet-nam', name: 'Địa lý Việt Nam', img: `${IMG}/soon-dia-ly-viet-nam.webp` },
  { slug: 'co-may-dieu-ky', name: 'Những cỗ máy\ndiệu kỳ', img: `${IMG}/soon-co-may-dieu-ky.webp` },
  { slug: 'muon-nghe', name: 'Muôn nghề\nquanh em', img: `${IMG}/soon-muon-nghe.webp` },
  { slug: 'he-mat-troi', name: 'Du hành\nHệ Mặt Trời', img: `${IMG}/soon-he-mat-troi.webp` },
]

export const formatVnd = (n) => n.toLocaleString('vi-VN')

export const discountPercent = Math.round((1 - offer.price / offer.listPrice) * 100)
