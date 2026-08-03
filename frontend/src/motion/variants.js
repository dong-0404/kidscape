// ============================================================
// KidScape — Motion design tokens (NGUỒN SỰ THẬT DUY NHẤT)
// Một bộ từ vựng: fadeUp (head/section), popIn (card/media), stagger (grid).
// Tất cả reveal theo trục Y. Soft-overshoot CHỈ cho chip/badge/icon nhỏ.
// ============================================================

export const EASE = [0.22, 0.61, 0.36, 1]      // expo-out mềm — mặc định mọi reveal & chữ
export const EASE_SOFT = [0.34, 1.3, 0.64, 1]   // overshoot nhẹ — CHỈ chip/badge/icon/nút "đồ-chơi"
export const SPRING = { type: 'spring', stiffness: 260, damping: 26, mass: 0.9 }
export const SPRING_SNAPPY = { type: 'spring', stiffness: 300, damping: 22 }
export const DUR = { fast: 0.22, base: 0.5, slow: 0.7 } // 0.22 khớp .chat-pop/.btn hiện có

export const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.base, ease: EASE } },
}

// card/media — chỉ một hơi scale, KHÔNG overshoot
export const popIn = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: DUR.base, ease: EASE } },
}

// chip/badge/icon "đồ-chơi" — pop nảy nhẹ
export const popToy = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: DUR.fast, ease: EASE_SOFT } },
}

export const stagger = (gap = 0.08, delay = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren: gap, delayChildren: delay } },
})

// page transition — CHỈ fade, KHÔNG y-drift (tránh phá sticky header + fixed chat widget)
export const pageVariants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: DUR.base, ease: EASE } },
  exit: { opacity: 0, transition: { duration: DUR.fast, ease: EASE } },
}

export const viewportOnce = { once: true, amount: 0.2, margin: '0px 0px -10% 0px' }
