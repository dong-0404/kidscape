# 🚀 Triển khai KidScape (Docker + Coolify + GCP)

Mục tiêu: **push code → tự động deploy**, có **GUI quản lý server** (Coolify), chạy **HTTPS** với domain riêng.

## Kiến trúc

```text
                 Internet (HTTPS)
                       │
            ┌──────────▼───────────┐
            │  Coolify (Traefik)   │  ← GUI quản lý + reverse proxy + SSL tự động
            └──────────┬───────────┘
                       │  kidscape.your-domain.com
            ┌──────────▼───────────┐
            │  frontend (nginx)    │  serve SPA + proxy /api → backend
            └──────────┬───────────┘
                       │  /api
            ┌──────────▼───────────┐      ┌──────────────┐
            │  backend (Express)   │─────▶│  mongo:7     │ (volume mongo-data)
            └──────────────────────┘      └──────────────┘
```

Chỉ **frontend** lộ ra Internet; **backend** và **mongo** chỉ chạy nội bộ trong mạng Docker.

CI/CD: **GitHub Actions** chạy test mỗi lần push → nếu xanh → gọi **webhook deploy của Coolify** → Coolify build lại & chạy stack từ `docker-compose.yaml`.

Các file liên quan: [docker-compose.yaml](docker-compose.yaml), [backend/Dockerfile](backend/Dockerfile), [frontend/Dockerfile](frontend/Dockerfile), [frontend/nginx.conf](frontend/nginx.conf), [.github/workflows/ci.yml](.github/workflows/ci.yml), [deploy/env.production.example](deploy/env.production.example).

---

## Bước 1 — Mở firewall trên Google Cloud

Coolify dashboard chạy ở cổng **8000**, web ở **80/443**. Trên máy có `gcloud` đã đăng nhập:

```bash
# Cho phép HTTP/HTTPS công khai tới VM
gcloud compute firewall-rules create kidscape-web \
  --allow=tcp:80,tcp:443 --direction=INGRESS --network=default

# Dashboard Coolify (8000) — CHỈ mở cho IP của bạn (lấy IPv4)
MYIP=$(curl -s4 ifconfig.me)
gcloud compute firewall-rules create kidscape-coolify \
  --allow=tcp:8000 --source-ranges="${MYIP}/32" --network=default
```

> Không có gcloud CLI? Làm tương tự trong **Console → VPC network → Firewall → Create**.
> Nên giới hạn cả cổng **22 (SSH)** về IP của bạn cho an toàn.

---

## Bước 2 — Cài Coolify trên VM

SSH vào VM rồi chạy trình cài đặt chính thức (cần Ubuntu 22.04+, ≥ 2GB RAM):

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | sudo bash
```

Xong, mở `http://<IP-VM>:8000` → tạo tài khoản admin Coolify đầu tiên.

---

## Bước 3 — Trỏ DNS

Tại nhà cung cấp domain, tạo bản ghi **A**:

| Tên | Loại | Giá trị |
| --- | --- | --- |
| `kidscape` (hoặc `@`) | A | `<IP-VM>` |
| `coolify` *(tuỳ chọn, để vào dashboard qua domain)* | A | `<IP-VM>` |

Chờ DNS lan truyền (vài phút). HTTPS sẽ được Coolify cấp tự động qua Let's Encrypt khi domain đã trỏ đúng.

---

## Bước 4 — Đưa code lên GitHub

```bash
cd /Users/shin/kidscape
git add -A
git commit -m "Add Docker + Coolify deploy + CI"
git branch -M main
git remote add origin https://github.com/<bạn>/kidscape.git
git push -u origin main
```

> Quan trọng: phải commit **toàn bộ layout mới** (`frontend/`, `backend/`, `docker-compose.yaml`, `.github/`…). Kiểm tra: `git ls-files | grep docker-compose.yaml` phải có kết quả.

---

## Bước 5 — Tạo ứng dụng trong Coolify

1. **Sources → GitHub** → cài **GitHub App** của Coolify, cấp quyền repo `kidscape`.
2. **Projects → + New** → tạo project (vd `kidscape`) → chọn server (localhost) → **+ New Resource**.
3. Chọn **Docker Compose** → nguồn = repo GitHub `kidscape`, branch `main`, đường dẫn compose = `/docker-compose.yaml`.
4. **Environment Variables** → dán nội dung từ [deploy/env.production.example](deploy/env.production.example) và điền giá trị thật:
   - `APP_URL=https://kidscape.your-domain.com`
   - `JWT_SECRET` = kết quả `openssl rand -hex 32`
   - `MONGO_PASSWORD`, `SEED_ADMIN_PASSWORD` = mật khẩu mạnh (đặt **trước** lần deploy đầu)
   - `SEED_ADMIN_EMAIL` = email admin của bạn
   - `TRUST_PROXY=2`
   - `GEMINI_API_KEY` = khóa Google Gemini cho chatbot (lấy ở <https://aistudio.google.com/apikey>). Bỏ trống nếu chưa dùng chatbot — site + auth vẫn chạy, `/api/chat/ask` trả 503, các chip gợi ý vẫn trả lời được.
5. **Domains** → dịch vụ `frontend` → đặt domain `https://kidscape.your-domain.com`. Coolify (Traefik) tự cấp SSL Let's Encrypt khi DNS đã trỏ đúng. (Đây là cách gán domain — không cần biến `SERVICE_FQDN`.)
6. Nhấn **Deploy**. Lần đầu sẽ build cả 3 image. Backend tự tạo admin (seed create-only) khi khởi động.

Truy cập: `https://kidscape.your-domain.com` (trang chủ) và `…/admin/login` (đăng nhập admin).

---

## Bước 6 — Bật "push là tự deploy" (có cổng CI)

Hai cách:

**A. Đơn giản (Coolify tự deploy khi push):** trong resource → bật **Automatic Deployment**. Mỗi push lên `main` Coolify build lại ngay (không qua CI).

**B. Khuyến nghị (push → CI test → nếu xanh → deploy):**
1. Trong Coolify, **tắt** Automatic Deployment.
2. Resource → **Webhooks → Deploy Webhook**: copy URL + tạo **API Token** (Coolify → Keys & Tokens).
3. GitHub repo → **Settings → Secrets and variables → Actions → New secret**:
   - `COOLIFY_WEBHOOK_URL` = URL deploy webhook
   - `COOLIFY_API_TOKEN` = API token
4. Xong. Job `deploy` trong [ci.yml](.github/workflows/ci.yml) chỉ chạy sau khi `frontend` + `backend` test xanh, rồi gọi webhook để Coolify deploy.

> Chưa đặt đủ 2 secret cũng không sao — job `deploy` sẽ tự bỏ qua, CI vẫn xanh.

---

## Bước 7 — Sau khi deploy: checklist bảo mật

- [ ] **Đặt `SEED_ADMIN_PASSWORD` mạnh TRƯỚC lần deploy đầu** — production sẽ từ chối tạo admin nếu mật khẩu trống/giá trị mẫu.
- [ ] Đăng nhập `/admin/login` bằng `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`, rồi **đổi mật khẩu** ngay trong Dashboard.
- [ ] `JWT_SECRET` đủ mạnh (≥ 24 ký tự) — backend từ chối khởi động ở production nếu là giá trị mẫu.
- [ ] `TRUST_PROXY=2` đã đặt (rate-limit đăng nhập theo đúng IP client sau 2 lớp proxy).
- [ ] Firewall: cổng **8000 (Coolify)** và **22 (SSH)** chỉ mở cho IP của bạn.
- [ ] MongoDB & backend **không** expose ra ngoài (chỉ nội bộ) ✓ đã cấu hình sẵn.
- [ ] Bật HTTPS/HSTS (Traefik cấp SSL; nginx đã set sẵn các security header cho SPA).

---

## Khắc phục sự cố

| Triệu chứng | Kiểm tra |
| --- | --- |
| Web không lên HTTPS | DNS đã trỏ đúng IP chưa; domain đã gán ở Coolify chưa; chờ Let's Encrypt |
| `/api` trả 502 | Backend chưa khởi động xong (chờ mongo healthy); xem log service `backend` |
| Backend crash khi boot | `JWT_SECRET` chưa đặt/quá yếu; `MONGO_PASSWORD` khớp giữa mongo & backend |
| Không tạo được admin | `SEED_ADMIN_PASSWORD` chưa đặt (prod từ chối mật khẩu mẫu); xem log backend |
| Đăng nhập sai dù đúng mật khẩu | Admin đã seed chưa (log backend `Seeding admin…`); đúng `SEED_ADMIN_EMAIL` |
| Push nhưng không deploy | Cách B: kiểm tra 2 secrets; cách A: bật Automatic Deployment |

## Chạy thử local bằng Docker (tuỳ chọn)

```bash
cp deploy/env.production.example .env   # điền giá trị; tạm đặt APP_URL=http://localhost:8080
# tạm thêm 'ports: ["8080:80"]' cho service frontend để mở ở máy local
docker compose up --build -d
```
