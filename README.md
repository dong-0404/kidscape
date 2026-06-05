# KidScape 🧸

Demo UI trang chủ cho **KidScape** — thương hiệu đồ chơi giáo dục đa giác quan dành cho trẻ 3-6 tuổi, học hỏi và khám phá thế giới qua **nhìn — nghe — chạm — tương tác**.

Xây dựng bằng **React + Vite**.

## 🚀 Chạy dự án

```bash
# Cài dependencies
npm install

# Chạy dev server (http://localhost:5173)
npm run dev

# Build production
npm run build

# Xem thử bản build
npm run preview
```

## 🗂️ Cấu trúc

```
src/
├── App.jsx              # Ghép các section trang chủ
├── data.js             # Toàn bộ nội dung text (menu, giá trị, sản phẩm, footer)
├── index.css           # Styling & palette thương hiệu
└── components/
    ├── Header.jsx       # Logo + menu điều hướng (responsive)
    ├── Hero.jsx         # Hero banner + CTA
    ├── About.jsx        # Sứ mệnh & Tầm nhìn
    ├── CoreValues.jsx   # 5 giá trị cốt lõi
    ├── WhyKidScape.jsx  # Vì sao chọn KidScape
    ├── Products.jsx     # Sản phẩm nổi bật
    ├── FinalCTA.jsx     # CTA cuối trang
    └── Footer.jsx       # Thông tin doanh nghiệp
```

## ✏️ Tùy chỉnh nội dung

Hầu hết nội dung text được gom trong [`src/data.js`](src/data.js) để dễ chỉnh sửa mà không cần đụng vào component.

> **Lưu ý:** Hình ảnh sản phẩm/logo hiện đang dùng emoji + khối màu làm placeholder cho demo.
