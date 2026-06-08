# KidScape 🧸 — Monorepo

Website thương hiệu đồ chơi giáo dục đa giác quan cho trẻ 3-6 tuổi, kèm hệ quản trị nội dung (CMS) cho trang admin.

```
kidscape/
├── frontend/   # Giao diện website — React + Vite
└── backend/    # API + CMS — Node.js + Express + MongoDB
```

## 🚀 Chạy dự án

Hai service độc lập, chạy ở 2 cửa sổ terminal riêng.

### Frontend (React + Vite) — http://localhost:5173

```bash
cd frontend
npm install
npm run dev
```

### Backend (Express + MongoDB) — http://localhost:5000

Yêu cầu: **MongoDB** đang chạy (local tại `mongodb://127.0.0.1:27017` hoặc MongoDB Atlas).

```bash
cd backend
npm install
cp .env.example .env      # rồi chỉnh các biến môi trường
npm run seed              # tạo tài khoản admin đầu tiên
npm run dev
```

## 🗂️ Tài liệu

- [DEPLOY.md](DEPLOY.md) — triển khai production (Docker + Coolify + CI/CD)
- [frontend/README.md](frontend/README.md) — chi tiết giao diện
- [backend/README.md](backend/README.md) — chi tiết API auth

## 🧱 Tech stack

| Lớp | Công nghệ |
|-----|-----------|
| Frontend | React 18, Vite |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth | JWT + bcrypt (một cấp admin) |
| Triển khai | Docker, Coolify, GitHub Actions (CI/CD) |

