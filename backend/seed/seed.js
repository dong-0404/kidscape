import { config } from '../src/config/env.js'
import { connectDB, disconnectDB } from '../src/config/db.js'
import Admin from '../src/models/Admin.js'
import KnowledgeBase from '../src/models/KnowledgeBase.js'
import ChatbotSuggestion from '../src/models/ChatbotSuggestion.js'
import Product from '../src/models/Product.js'
import Category from '../src/models/Category.js'
import Blog from '../src/models/Blog.js'

const EXAMPLE_PASSWORD = 'ChangeMe123!'

// Create-only: never overwrites an existing admin's (possibly rotated) password.
async function seedAdmin() {
  const { name, email, password } = config.seedAdmin

  // Never create a public admin with the repo-known example password in production.
  if (config.isProd && (!password || password === EXAMPLE_PASSWORD)) {
    console.error(
      '✗ Bỏ qua seed: SEED_ADMIN_PASSWORD chưa được đặt hoặc đang là giá trị mẫu. ' +
        'Hãy đặt mật khẩu mạnh rồi deploy lại.'
    )
    return
  }

  const existing = await Admin.findOne({ email })
  if (existing) {
    console.log(`• Admin "${email}" đã tồn tại — bỏ qua (không ghi đè mật khẩu).`)
    return
  }

  const passwordHash = await Admin.hashPassword(password)
  await Admin.create({ name, email, passwordHash })
  console.log(`✓ Đã tạo admin: ${email}`)

  if (password === EXAMPLE_PASSWORD) {
    console.warn('⚠ Mật khẩu admin đang là giá trị mẫu — hãy đổi ngay sau khi đăng nhập!')
  }
}

// Grounding knowledge for the chatbot (voice drawn from frontend/src/data.js).
const KB_SEED = [
  {
    title: 'KidScape là gì',
    content:
      'KidScape là thương hiệu đồ chơi giáo dục đa giác quan dành cho trẻ 3-6 tuổi. Mọi sản phẩm giúp trẻ học hỏi thông qua chạm, quan sát và lắng nghe trong cùng một trải nghiệm, khơi gợi trí tò mò và hạn chế thời gian dùng thiết bị điện tử.',
    order: 1,
  },
  {
    title: 'Giá trị cốt lõi',
    content:
      'KidScape lấy trẻ em làm trung tâm, đề cao học tập qua trải nghiệm thực tế, sáng tạo và đổi mới liên tục, an toàn và trách nhiệm, đồng hành và kết nối giữa phụ huynh với trẻ trong từng khoảnh khắc.',
    order: 2,
  },
  {
    title: 'Sản phẩm: Những Người Bạn Sách Đỏ',
    content:
      'Bộ sách tương tác đa giác quan với hình ảnh sống động, âm thanh vui nhộn và các chi tiết chạm. Bộ sách kể những câu chuyện về tình bạn dành cho bé 3-6 tuổi.',
    order: 3,
  },
  {
    title: 'Sản phẩm: Hộp Khám Phá Sắc Màu',
    content:
      'Đồ chơi cảm giác gồm các khối ghép nhiều chất liệu, giúp bé nhận biết màu sắc, hình khối và rèn luyện vận động tinh qua đôi tay.',
    order: 4,
  },
  {
    title: 'Sản phẩm: Vườn Âm Thanh Kỳ Diệu',
    content:
      'Bộ nhạc cụ mini khơi dậy thính giác và cảm thụ nhịp điệu, cho bé bước đầu làm quen với âm nhạc.',
    order: 5,
  },
  {
    title: 'Độ tuổi và an toàn',
    content:
      'Sản phẩm KidScape được thiết kế cho trẻ 3-6 tuổi, đặt an toàn của trẻ lên hàng đầu với chất liệu phù hợp lứa tuổi. Phụ huynh nên chơi cùng bé để tăng sự gắn kết và đảm bảo trải nghiệm an toàn.',
    order: 6,
  },
  {
    title: 'Liên hệ KidScape',
    content:
      'Email: hello@kidscape.vn. Địa chỉ: Tầng 5, Tòa nhà Sáng Tạo, 123 Đường Khám Phá, Quận 1, TP. Hồ Chí Minh. Bạn có thể theo dõi KidScape trên Facebook, TikTok và Instagram.',
    order: 7,
  },
]

const SUGGESTION_SEED = [
  {
    question: 'KidScape là gì?',
    answer:
      'KidScape là thương hiệu đồ chơi giáo dục đa giác quan cho trẻ 3-6 tuổi, giúp bé học qua chạm, quan sát và lắng nghe — vừa chơi vừa phát triển toàn diện.',
    order: 1,
  },
  {
    question: 'KidScape có những sản phẩm nào?',
    answer:
      'KidScape có Những Người Bạn Sách Đỏ (bộ sách tương tác), Hộp Khám Phá Sắc Màu (đồ chơi cảm giác) và Vườn Âm Thanh Kỳ Diệu (đồ chơi âm nhạc).',
    order: 2,
  },
  {
    question: 'Sản phẩm phù hợp với độ tuổi nào?',
    answer: 'Các sản phẩm của KidScape được thiết kế dành cho trẻ từ 3 đến 6 tuổi.',
    order: 3,
  },
  {
    question: 'Đồ chơi của KidScape có an toàn không?',
    answer:
      'Có ạ! An toàn của trẻ luôn được KidScape đặt lên hàng đầu, với chất liệu phù hợp lứa tuổi 3-6. Phụ huynh nên chơi cùng bé để trải nghiệm thêm vui và an toàn.',
    order: 4,
  },
  {
    question: 'Làm sao để liên hệ với KidScape?',
    answer:
      'Bạn có thể gửi email tới hello@kidscape.vn, hoặc ghé Tầng 5, Tòa nhà Sáng Tạo, 123 Đường Khám Phá, Quận 1, TP. Hồ Chí Minh nhé!',
    order: 5,
  },
]

// Create-only: only seeds when the collection is empty (entrypoint runs every boot).
async function seedChatbot() {
  const kbCount = await KnowledgeBase.countDocuments()
  if (kbCount === 0) {
    await KnowledgeBase.insertMany(KB_SEED)
    console.log(`✓ Đã tạo ${KB_SEED.length} mục tri thức (KB) mẫu.`)
  } else {
    console.log(`• Đã có ${kbCount} mục tri thức — bỏ qua seed KB.`)
  }

  const sCount = await ChatbotSuggestion.countDocuments()
  if (sCount === 0) {
    await ChatbotSuggestion.insertMany(SUGGESTION_SEED)
    console.log(`✓ Đã tạo ${SUGGESTION_SEED.length} câu hỏi gợi ý mẫu.`)
  } else {
    console.log(`• Đã có ${sCount} câu hỏi gợi ý — bỏ qua seed.`)
  }
}

// Initial product catalogue (1 real flagship + 2 upcoming teasers).
const PRODUCT_SEED = [
  {
    slug: 'nhung-nguoi-ban-sach-do',
    name: 'Những Người Bạn Sách Đỏ',
    tag: 'Bộ sách tương tác',
    desc: 'Bộ sách đa giác quan với hình ảnh sống động, âm thanh vui nhộn và các chi tiết chạm — kể những câu chuyện về tình bạn cho bé 3-6 tuổi.',
    longDesc:
      'Những Người Bạn Sách Đỏ là bộ sách tương tác đa giác quan của KidScape, nơi mỗi trang sách là một thế giới để bé chạm vào, lắng nghe và khám phá. Hình ảnh sống động cùng âm thanh vui nhộn và các chi tiết chạm được thiết kế tỉ mỉ giúp bé vừa nghe kể chuyện, vừa tự tay trải nghiệm. Qua những câu chuyện ấm áp về tình bạn, bé phát triển ngôn ngữ, cảm xúc và các giác quan một cách tự nhiên — học mà như đang chơi.',
    color: '#FF6B6B',
    emoji: '📕',
    ageRange: '3 – 6 tuổi',
    highlights: [
      { icon: '👀', title: 'Hình ảnh sống động', desc: 'Màu sắc tươi vui, thân thiện với trẻ nhỏ.' },
      { icon: '🔊', title: 'Âm thanh vui nhộn', desc: 'Tiếng động và giai điệu khơi gợi thính giác.' },
      { icon: '✋', title: 'Chi tiết chạm đa giác quan', desc: 'Nhiều chất liệu cho bé sờ và cảm nhận.' },
      { icon: '❤️', title: 'Câu chuyện về tình bạn', desc: 'Nuôi dưỡng cảm xúc và sự đồng cảm.' },
    ],
    develops: ['Ngôn ngữ', 'Cảm xúc', 'Giác quan'],
    status: 'available',
    order: 1,
  },
  {
    slug: 'hop-kham-pha-sac-mau',
    name: 'Hộp Khám Phá Sắc Màu',
    tag: 'Đồ chơi cảm giác',
    desc: 'Khối ghép nhiều chất liệu giúp bé nhận biết màu sắc, hình khối và rèn luyện vận động tinh.',
    color: '#4ECDC4',
    emoji: '🎨',
    status: 'upcoming',
    order: 2,
  },
  {
    slug: 'vuon-am-thanh-ky-dieu',
    name: 'Vườn Âm Thanh Kỳ Diệu',
    tag: 'Đồ chơi âm nhạc',
    desc: 'Bộ nhạc cụ mini khơi dậy thính giác và cảm thụ nhịp điệu, cho bé làm quen với âm nhạc.',
    color: '#FFB23E',
    emoji: '🎵',
    status: 'upcoming',
    order: 3,
  },
]

// Create-only: seeds the catalogue once (when empty).
async function seedProducts() {
  const count = await Product.countDocuments()
  if (count === 0) {
    await Product.insertMany(PRODUCT_SEED)
    console.log(`✓ Đã tạo ${PRODUCT_SEED.length} sản phẩm mẫu.`)
  } else {
    console.log(`• Đã có ${count} sản phẩm — bỏ qua seed sản phẩm.`)
  }
}

// Blog categories from the brief.
const CATEGORY_SEED = [
  { name: 'Động vật quý hiếm', slug: 'dong-vat-quy-hiem', order: 1 },
  { name: 'Giáo dục trẻ em', slug: 'giao-duc-tre-em', order: 2 },
  { name: 'Bảo tồn thiên nhiên', slug: 'bao-ton-thien-nhien', order: 3 },
  { name: 'Hoạt động KidScape', slug: 'hoat-dong-kidscape', order: 4 },
]

const BLOG_SEED = [
  {
    slug: 'kham-pha-nhung-nguoi-ban-sach-do',
    title: 'Khám phá “Những Người Bạn Sách Đỏ” cùng bé',
    excerpt:
      'Hành trình làm quen với các loài động vật quý hiếm qua bộ sách đa giác quan của KidScape.',
    content:
      '<p>“Những Người Bạn Sách Đỏ” đưa bé đến gần hơn với thế giới động vật quý hiếm qua hình ảnh sống động, âm thanh vui nhộn và những chi tiết chạm thú vị.</p><h2>Vì sao chọn sách đa giác quan?</h2><p>Trẻ 3-6 tuổi học hỏi tốt nhất khi được <strong>nhìn — nghe — chạm</strong> cùng lúc. Mỗi trang sách là một cơ hội để bé khám phá và ghi nhớ tự nhiên.</p>',
    category: 'dong-vat-quy-hiem',
    tags: ['sách đỏ', 'động vật', 'đa giác quan'],
    author: 'KidScape',
    featured: true,
    order: 1,
    publishedAt: new Date('2026-05-20'),
  },
  {
    slug: 'meo-dong-hanh-cung-be-khi-choi',
    title: '5 mẹo đồng hành cùng bé khi chơi đồ chơi giáo dục',
    excerpt: 'Những gợi ý nhỏ giúp ba mẹ biến giờ chơi thành giờ học đầy gắn kết.',
    content:
      '<p>Đồng hành cùng con khi chơi không chỉ giúp bé an toàn mà còn tăng sự gắn kết gia đình.</p><ul><li>Đặt câu hỏi mở để khơi gợi trí tò mò.</li><li>Khen ngợi nỗ lực thay vì kết quả.</li><li>Để bé dẫn dắt trò chơi.</li></ul>',
    category: 'giao-duc-tre-em',
    tags: ['nuôi dạy', 'mẹo hay'],
    author: 'KidScape',
    featured: true,
    order: 2,
    publishedAt: new Date('2026-05-28'),
  },
  {
    slug: 'bao-ton-thien-nhien-bat-dau-tu-dieu-nho',
    title: 'Bảo tồn thiên nhiên bắt đầu từ những điều nhỏ',
    excerpt: 'Gieo cho bé tình yêu thiên nhiên qua các hoạt động đơn giản mỗi ngày.',
    content:
      '<p>Tình yêu thiên nhiên có thể được nuôi dưỡng từ rất sớm. KidScape tin rằng mỗi đứa trẻ đều có thể trở thành một người bạn của Trái Đất.</p>',
    category: 'bao-ton-thien-nhien',
    tags: ['bảo tồn', 'thiên nhiên'],
    author: 'KidScape',
    featured: false,
    order: 3,
    publishedAt: new Date('2026-06-02'),
  },
]

async function seedCategories() {
  const count = await Category.countDocuments()
  if (count === 0) {
    await Category.insertMany(CATEGORY_SEED)
    console.log(`✓ Đã tạo ${CATEGORY_SEED.length} danh mục mẫu.`)
  } else {
    console.log(`• Đã có ${count} danh mục — bỏ qua seed.`)
  }
}

async function seedBlogs() {
  const count = await Blog.countDocuments()
  if (count === 0) {
    await Blog.insertMany(BLOG_SEED)
    console.log(`✓ Đã tạo ${BLOG_SEED.length} bài viết mẫu.`)
  } else {
    console.log(`• Đã có ${count} bài viết — bỏ qua seed.`)
  }
}

async function run() {
  await connectDB()
  try {
    await seedAdmin()
    await seedChatbot()
    await seedProducts()
    await seedCategories()
    await seedBlogs()
    console.log('Seed hoàn tất.')
  } finally {
    await disconnectDB()
  }
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed lỗi:', err)
    process.exit(1)
  })
