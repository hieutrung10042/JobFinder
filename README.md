# 🚀 Job Portal System

> Hệ thống tuyển dụng trực tuyến hỗ trợ ứng viên tìm việc, nhà tuyển dụng đăng tin và quản trị viên quản lý toàn bộ nền tảng.

---

# 📌 Giới thiệu

Dự án xây dựng một nền tảng tuyển dụng trực tuyến với đầy đủ các chức năng cơ bản:

* 👨‍💼 Nhà tuyển dụng đăng tuyển và quản lý ứng viên
* 👨‍🎓 Ứng viên tạo CV và ứng tuyển công việc
* 🛡️ Hệ thống phân quyền bằng JWT
* 📊 Dashboard quản trị dành cho Admin
* 🌙 Giao diện hiện đại hỗ trợ Dark Mode

Mục tiêu của dự án là mô phỏng quy trình tuyển dụng thực tế với kiến trúc Fullstack hiện đại sử dụng ReactJS + NodeJS/Express.

---

# ✨ Tính năng chính

## 🔐 Authentication & Authorization

* Đăng ký / Đăng nhập
* JWT Authentication
* Role-based Authorization:

  * Candidate
  * Employer
  * Admin

---

## 👨‍🎓 Candidate Features

* Tạo và quản lý hồ sơ cá nhân (CV)
* Ứng tuyển công việc
* Theo dõi trạng thái ứng tuyển
* Nhận thông báo phản hồi từ nhà tuyển dụng

---

## 🏢 Employer Features

* Đăng tin tuyển dụng
* Quản lý danh sách ứng viên
* Duyệt / Từ chối hồ sơ ứng tuyển

---

## 🛠️ Admin Features

* Quản lý tài khoản người dùng
* Khóa / Mở tài khoản
* Kiểm duyệt tin tuyển dụng
* Dashboard thống kê hệ thống

---

## 🚀 Advanced Features

* Gợi ý việc làm theo hồ sơ ứng viên
* Xuất CV PDF tự động
* Notification System
* Dark Mode
* SEO Optimization

---

# 🧱 Kiến trúc hệ thống

```bash
project-root/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   └── app.js
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── services/
│   └── App.jsx
│
└── README.md
```

---

# ⚙️ Công nghệ sử dụng

| Công nghệ                     | Mô tả                       |
| ----------------------------- | --------------------------- |
| ReactJS                       | Xây dựng giao diện Frontend |
| NodeJS                        | Runtime Backend             |
| ExpressJS                     | REST API Framework          |
| MySQL / MongoDB               | Database                    |
| JWT                           | Authentication              |
| Axios                         | HTTP Client                 |
| Context API / Redux / Zustand | State Management            |
| Vercel / Netlify              | Deploy Frontend             |
| Render                        | Deploy Backend              |
| Git & GitHub                  | Quản lý source code         |

---

# 🧪 Chức năng hệ thống

| Module         | Mô tả                        |
| -------------- | ---------------------------- |
| Authentication | Đăng nhập, đăng ký, JWT      |
| Candidate      | CV, ứng tuyển                |
| Employer       | Đăng tuyển, quản lý ứng viên |
| Admin          | Dashboard, kiểm duyệt        |
| Search System  | Tìm kiếm & lọc việc làm      |
| Notification   | Thông báo realtime           |
| PDF Export     | Xuất CV PDF                  |

---

# 🛠️ Hướng dẫn cài đặt

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd project-name
```

---

## 2️⃣ Cài đặt Backend

```bash
cd backend
npm install
```

### Chạy Backend

```bash
npm run dev
```

---

## 3️⃣ Cài đặt Frontend

```bash
cd frontend
npm install
```

### Chạy Frontend

```bash
npm run dev
```

---

# 🌐 Deploy

| Thành phần | Nền tảng                     |
| ---------- | ---------------------------- |
| Frontend   | Vercel / Netlify             |
| Backend    | Render                       |
| Database   | MongoDB Atlas / MySQL Server |

---

# 🔄 Git Flow

## 📌 Quy trình làm việc nhóm

Mỗi thành viên làm việc trên một branch riêng theo MSSV.

Ví dụ:

```bash
git checkout -b N23DVCN025
```

---

## 📥 Cập nhật source mới nhất

```bash
git checkout main
git pull origin main
```

---

## ✅ Commit code

```bash
git add .
git commit -m "feat: hoàn thành giao diện đăng nhập"
```

---

## 🚀 Push code lên GitHub

```bash
git push origin N23DVCN025
```

---

## 🔍 Pull Request Workflow

1. Tạo Pull Request trên GitHub
2. Leader review code
3. Sửa lỗi nếu có comment
4. Leader merge vào `main`

> ⚠️ Thành viên KHÔNG được tự ý merge Pull Request.

---

# 👥 Phân chia công việc

| Thành viên | Vai trò                | Nhiệm vụ                     |
| ---------- | ---------------------- | ---------------------------- |
| Phạm Hoàng Quốc Huy          | Leader / Frontend Lead | Setup project, UI/UX, Deploy |
| Nguyễn Trung Hiếu            | Backend Lead           | Database, JWT, API           |
| Nguyễn Hữu Đức               | Candidate Logic        | CV, ứng tuyển, PDF           |
| Trương Đình Tấn Tài          | Admin & Employer       | Dashboard, Notification      |

---

# 📈 Roadmap

* [x] Authentication System
* [x] Job Management
* [x] Candidate Application
* [x] Admin Dashboard
* [ ] Realtime Notification
* [ ] AI Job Recommendation
* [ ] Resume Builder

---

# 📷 Demo Features

* 🏠 Homepage
* 🔍 Job Search
* 📄 Job Detail
* 👤 Candidate Dashboard
* 🏢 Employer Dashboard
* 🛡️ Admin Panel

---

# 🧠 Best Practices

> ✔️ Tách riêng Controllers và Routes
> ✔️ Không viết business logic trực tiếp trong `app.js`
> ✔️ Commit nhỏ và rõ ràng
> ✔️ Review code bằng Pull Request
> ✔️ Giữ cấu trúc project clean và scalable

---

# 📄 License

MIT License © 2026

---

# ❤️ Contributors

* 👨‍💻 Frontend Team
* ⚙️ Backend Team
* 🛡️ Admin Team
* 🚀 DevOps & Deployment Team
