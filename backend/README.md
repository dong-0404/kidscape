# KidScape Backend — Auth API

Node.js + Express + MongoDB. Hiện tại chỉ phục vụ **xác thực admin** (một cấp admin, JWT + bcrypt). Các phần quản lý nội dung (CMS) sẽ được bổ sung sau.

## Chạy

```bash
npm install
cp .env.example .env     # chỉnh biến môi trường (đặc biệt JWT_SECRET ở production)
npm run seed             # tạo admin đầu tiên (create-only, không ghi đè mật khẩu đã đổi)
npm run dev              # nodemon, mặc định http://localhost:5000
```

Yêu cầu MongoDB đang chạy tại `MONGODB_URI`.

## Cấu trúc

```text
src/
├── config/        # env, kết nối DB
├── models/        # Admin (model duy nhất hiện tại)
├── controllers/   # auth.controller
├── routes/        # auth + health check
├── middleware/    # authGuard, errorHandler, notFound, rateLimiter, validate
├── validators/    # auth.validator
├── utils/         # asyncHandler, ApiError/Response, jwt
├── app.js         # khởi tạo Express app
└── server.js      # entrypoint: load env → connect DB → listen
seed/              # script seed admin
```

## API

| Method | Path | Auth | Mô tả |
| --- | --- | --- | --- |
| GET | `/api/health` | public | Kiểm tra trạng thái server + DB |
| POST | `/api/auth/login` | public | Đăng nhập admin → trả JWT (rate-limited) |
| GET | `/api/auth/me` | admin | Thông tin admin hiện tại |
| PATCH | `/api/auth/password` | admin | Đổi mật khẩu |
