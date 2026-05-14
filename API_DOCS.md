# Authentication API Documentation

Tài liệu này mô tả chi tiết 2 endpoints cốt lõi để tích hợp chức năng Đăng ký (Register) và Đăng nhập (Login) cho Backend `TrendSearchor-be` đang chạy trên Railway.

**Base URL (Production):** `https://trendsearchor-be-production.up.railway.app`
**Swagger UI:** `https://trendsearchor-be-production.up.railway.app/swagger-ui/index.html`

---

## 1. Đăng ký tài khoản (Register)

> Mặc định khi gọi API Register thành công, tài khoản sẽ được tự động gán role là `USER`.

- **Endpoint:** `POST /api/auth/register`
- **Content-Type:** `application/json`
- **Yêu cầu xác thực (Auth):** Không (Public)

### Request Body

| Field | Type | Rules & Validation | Example |
| :--- | :--- | :--- | :--- |
| `username` | String | Không được để trống | `"nguyenvana"` |
| `password` | String | >= 9 ký tự, ít nhất 1 chữ hoa, 1 số, 1 ký tự đặc biệt | `"Password@123"` |
| `dob` | String | Định dạng `YYYY-MM-DD`. Phải là ngày trong quá khứ và năm sinh > 1920 | `"2000-01-01"` |
| `mail` | String | Định dạng email hợp lệ | `"vana@gmail.com"` |
| `phone` | String | Độ dài đúng 10 số. Phải bắt đầu bằng: `09`, `03`, `05`, `07`, hoặc `08` | `"0912345678"` |
| `gender` | Enum | Chỉ chấp nhận: `MALE`, `FEMALE`, `OTHERS` | `"MALE"` |
| `workplace` | String | Nơi công tác/Học tập (không được để trống) | `"FPT University"` |

**Ví dụ Request:**
```json
{
  "username": "nguyenvana",
  "password": "Password@123",
  "dob": "2000-01-01",
  "mail": "vana@gmail.com",
  "phone": "0912345678",
  "gender": "MALE",
  "workplace": "FPT University"
}
```

### Responses

**✅ Thành công (201 Created)**
Trả về chuỗi text thông báo thành công.
```text
User registered successfully
```

**❌ Lỗi Validation (400 Bad Request)**
Nếu người dùng nhập sai quy tắc (pass ngắn, sai format SĐT), Backend trả về Object map theo field lỗi:
```json
{
  "phone": "Phone must start with 09, 03, 05, 07, 08 and have exactly 10 digits",
  "password": "Password must be at least 9 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character"
}
```

---

## 2. Đăng nhập (Login)

- **Endpoint:** `POST /api/auth/login`
- **Content-Type:** `application/json`
- **Yêu cầu xác thực (Auth):** Không (Public)

### Request Body

**Ví dụ Request:**
```json
{
  "username": "admin",
  "password": "admin"
}
```

### Responses

**✅ Thành công (200 OK)**
Hệ thống trả về chuỗi Token (JWT). Frontend cần lưu trữ `accessToken` (thường lưu ở `localStorage`) và đính kèm vào Header `Authorization: Bearer <token>` cho mọi request Private sau này.
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImlhdCI6...",
  "tokenType": "Bearer"
}
```

**❌ Sai tài khoản / mật khẩu (401 Unauthorized)**
Trả về khi không tìm thấy username hoặc password không đúng.
```json
{
  "error": "Authentication failed",
  "message": "Bad credentials"
}
```
