import { config } from '../src/config/env.js'
import { connectDB, disconnectDB } from '../src/config/db.js'
import Admin from '../src/models/Admin.js'
import KnowledgeBase from '../src/models/KnowledgeBase.js'
import ChatbotSuggestion from '../src/models/ChatbotSuggestion.js'

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

async function run() {
  await connectDB()
  try {
    await seedAdmin()
    await seedChatbot()
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
