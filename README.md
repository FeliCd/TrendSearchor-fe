# TrendSearchor Frontend (ScholarTrend)

TrendSearchor (còn được biết đến với tên gọi ScholarTrend) là một nền tảng web mạnh mẽ giúp theo dõi các xu hướng tạp chí khoa học, nghiên cứu học thuật, và các báo cáo đột phá trong giới nghiên cứu.

## 🚀 Công nghệ sử dụng

Dự án được phát triển dựa trên các công nghệ hiện đại nhất dành cho Frontend:

- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) - Trình đóng gói siêu tốc độ
- **Routing**: [React Router v6](https://reactrouter.com/) - Quản lý điều hướng client-side
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/) - Framework CSS tiện ích
- **HTTP Client**: [Axios](https://axios-http.com/) - Xử lý API requests
- **Charts/Visualization**: [Recharts](https://recharts.org/) - Vẽ biểu đồ dữ liệu học thuật
- **Icons**: [Lucide React](https://lucide.dev/) - Thư viện icon mã nguồn mở

## 📁 Cấu trúc thư mục

```text
src/
├── components/     # Các UI components tái sử dụng (Button, Input, Layout...)
├── hooks/          # Custom hooks (ví dụ: useLoginForm, useAuth...)
├── pages/          # Các trang chính của ứng dụng (Login, Register, Home...)
├── services/       # File cấu hình gọi API và Axios instance (authService, api...)
├── styles/         # Global CSS (globals.css)
├── utils/          # Các hàm tiện ích dùng chung
├── App.jsx         # Component gốc chứa Routes
└── main.jsx        # Điểm entry point của ứng dụng React
```

## ⚙️ Yêu cầu hệ thống

- Node.js (phiên bản 18.x hoặc mới hơn)
- npm hoặc yarn

## 🛠 Hướng dẫn Cài đặt & Chạy dự án

1. **Cài đặt thư viện**
   Mở terminal tại thư mục dự án và chạy lệnh sau để tải về các phụ thuộc:
   ```bash
   npm install
   ```

2. **Cấu hình môi trường**
   Sao chép file `.env.example` thành `.env` và cập nhật các biến môi trường nếu cần thiết (như đường dẫn API backend).
   ```bash
   cp .env.example .env
   ```

3. **Chạy server phát triển (Development)**
   ```bash
   npm run dev
   ```
   Sau khi khởi động, ứng dụng sẽ chạy tại `http://localhost:5173/` (mặc định của Vite).

4. **Đóng gói sản phẩm (Production Build)**
   Để build ứng dụng cho môi trường production, chạy:
   ```bash
   npm run build
   ```
   Kết quả build sẽ nằm trong thư mục `dist/`. Bạn có thể chạy thử bản build bằng lệnh:
   ```bash
   npm run preview
   ```

## 📝 Quy chuẩn Code

- Sử dụng **ESLint** để kiểm tra mã nguồn (`npm run lint`).
- Tuân thủ cấu trúc thư mục dạng tính năng hoặc component-based.
- Định nghĩa các hằng số hoặc đường dẫn API trong thư mục `services` và `.env`.

---
*Dự án Frontend được xây dựng cho hệ thống TrendSearchor (ScholarTrend).*
