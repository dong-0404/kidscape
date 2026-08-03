// Bộ icon SVG dùng chung cho trang chủ mới (nét dày, bo tròn — hợp tông "đồ chơi").
// Icon minh hoạ nhiều màu nằm ở /public/assets/home dưới dạng ảnh.

const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const CartIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}>
    <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
    <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
    <path d="M2 3h2.2l2.3 11.2a2 2 0 0 0 2 1.6h8.1a2 2 0 0 0 2-1.55L21 7H5.2" />
  </svg>
)

export const PlayIcon = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <circle cx="12" cy="12" r="9.2" />
    <path d="M10.2 8.6 15.4 12l-5.2 3.4z" fill="currentColor" stroke="none" />
  </svg>
)

export const SoundIcon = (p) => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...base} {...p}>
    <path d="M4 9.5h3.2L12 5.4v13.2L7.2 14.5H4z" fill="currentColor" stroke="none" />
    <path d="M15.4 9a4.3 4.3 0 0 1 0 6" />
    <path d="M18.2 6.4a8 8 0 0 1 0 11.2" />
  </svg>
)

export const CheckIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} strokeWidth={2.8} {...p}>
    <path d="m4.5 12.6 4.6 4.6L19.5 6.8" />
  </svg>
)

const CHEVRON = {
  right: 'm9 5 7 7-7 7',
  left: 'M15 5 8 12l7 7',
  down: 'm5 9 7 7 7-7',
  up: 'm5 15 7-7 7 7',
}

export const ChevronIcon = ({ dir = 'right', ...p }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} strokeWidth={2.6} {...p}>
    <path d={CHEVRON[dir] || CHEVRON.right} />
  </svg>
)

export const MinusIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} strokeWidth={2.6} {...p}>
    <path d="M5 12h14" />
  </svg>
)

export const PlusIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} strokeWidth={2.6} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const StarIcon = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}>
    <path d="m12 2.6 2.9 5.9 6.5.95-4.7 4.6 1.1 6.45L12 17.45 6.2 20.5l1.1-6.45-4.7-4.6 6.5-.95z" />
  </svg>
)

export const PawIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
    <ellipse cx="7" cy="8.4" rx="2.1" ry="2.7" />
    <ellipse cx="12" cy="6.8" rx="2.1" ry="2.9" />
    <ellipse cx="17" cy="8.4" rx="2.1" ry="2.7" />
    <ellipse cx="19.6" cy="13.2" rx="1.9" ry="2.2" />
    <path d="M12 11.4c3 0 5.4 2.2 5.4 4.7 0 2-1.6 3.3-3.6 3.3-1 0-1.4-.35-1.8-.35s-.8.35-1.8.35c-2 0-3.6-1.3-3.6-3.3 0-2.5 2.4-4.7 5.4-4.7Z" />
  </svg>
)

export const ChatIcon = (p) => (
  <svg viewBox="0 0 24 24" width="20" height="20" {...base} {...p}>
    <path d="M20.5 11.6c0 4-3.8 7.2-8.5 7.2-.9 0-1.8-.12-2.6-.34L4.5 20.2l1.3-3.4a6.8 6.8 0 0 1-2.3-5.2c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2Z" />
  </svg>
)

export const PhoneIcon = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}>
    <path d="M6.6 3h3.1l1.6 4-2.1 1.5a11.5 11.5 0 0 0 5.3 5.3l1.5-2.1 4 1.6v3.1A2.6 2.6 0 0 1 17.4 19 14.4 14.4 0 0 1 5 6.6 2.6 2.6 0 0 1 6.6 3Z" />
  </svg>
)

export const MailIcon = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}>
    <path d="M3 5.6h18c.6 0 1 .45 1 1v10.8c0 .55-.4 1-1 1H3c-.6 0-1-.45-1-1V6.6c0-.55.4-1 1-1Zm1.9 1.8L12 12.2l7.1-4.8z" />
  </svg>
)

export const PinIcon = (p) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}>
    <path d="M12 2.4c-3.7 0-6.7 3-6.7 6.7 0 4.9 6 12.2 6.3 12.5.2.25.6.25.8 0 .3-.3 6.3-7.6 6.3-12.5 0-3.7-3-6.7-6.7-6.7Zm0 9.3a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2Z" />
  </svg>
)

export const FacebookIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.63A22 22 0 0 0 14.3 3.5c-2.4 0-4 1.45-4 4.13V9.9H7.6V13h2.7v8z" />
  </svg>
)

export const InstagramIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...base} strokeWidth={1.9} {...p}>
    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.1" cy="6.9" r="1.15" fill="currentColor" stroke="none" />
  </svg>
)

export const TiktokIcon = (p) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...p}>
    <path d="M16.3 3h-2.75v11.7a2.35 2.35 0 1 1-1.9-2.3V9.6a5.25 5.25 0 1 0 4.65 5.2V8.9a6.1 6.1 0 0 0 3.5 1.1V7.25A3.5 3.5 0 0 1 16.3 3Z" />
  </svg>
)

export const socialIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  tiktok: TiktokIcon,
}
