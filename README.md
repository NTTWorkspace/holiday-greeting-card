# 🎩 Thiệp Chúc Mừng Ngày Quốc Tế Nam Giới 19/11 (International Men's Day)

Dự án web biểu diễn thiệp chúc mừng 19/11 với **đường dẫn riêng biệt** cho Người Nhận và Quản Trị Viên (Admin).

---

## 🔗 Hai Đường Dẫn Truy Cập Riêng Biệt

### 1. Đường dẫn chung gửi cho Người Nhận:
👉 **`http://localhost:3000`** *(hoặc tên miền của bạn)*

* **Hoàn toàn ẩn mọi dấu vết của Admin**: Trên giao diện người nhận không hề có bất kỳ nút, link hay modal nào liên quan đến Admin.
* Người nhận chỉ thấy màn hình vinh danh sang trọng, có ô nhập **Họ và Tên**.
* Điền tên $\rightarrow$ Bấm **"Mở Thiệp & Nhận Lời Chúc"** $\rightarrow$ Hệ thống tự động so khớp và hiển thị thiệp dát vàng lấp lánh kèm **lời chúc cá nhân hóa riêng** mà bạn đã chuẩn bị!
* Có nút **📸 Tải ảnh thiệp (PNG)** để khoe Facebook, Zalo, Story.

---

### 2. Đường dẫn bí mật dành riêng cho Quản Trị Viên (Admin):
👉 **`http://localhost:3000/itedit`** *(hoặc `https://holiday-greeting-card.vercel.app/itedit`)*

* **Tài khoản đăng nhập**:
  * **Tên đăng nhập**: `admin`
  * **Mật khẩu**: `admin123`
* Sau khi đăng nhập, Admin có thể:
  * ➕ **Thêm thành viên mới**: Nhập *Họ tên*, *Danh hiệu* và *Lời chúc riêng*.
  * ✏️ **Chỉnh sửa** lời chúc của bất kỳ thành viên nào.
  * 🗑️ **Xóa** thành viên.
  * 👁️ **Xem thử thiệp**: Bấm mở nhanh thiệp của từng người để duyệt trước.
  * 🔍 **Tìm kiếm nhanh** theo tên thành viên.
* Mọi dữ liệu được lưu vĩnh viễn trên Server (`data/wishes.json`).

---

## 🚀 Khởi Chạy Server

Chạy lệnh:
```bash
node server.js
```
