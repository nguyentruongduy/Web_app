# Quick Start Guide

## Cài đặt nhanh

1. **Cài đặt dependencies**
```bash
npm install
```

2. **Tạo file .env**
```bash
# Tạo file .env trong thư mục gốc
PORT=3000
DB_URI=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
```

3. **Khởi động MongoDB**
```bash
# Nếu dùng MongoDB local
mongod
```

4. **Chạy seed data (tùy chọn)**
```bash
npm run seed
```

5. **Khởi động server**
```bash
npm run dev
```

6. **Truy cập ứng dụng**
Mở trình duyệt: `http://localhost:3000`

## Tài khoản mẫu (sau khi chạy seed)

### Admin
- Email: `admin@example.com`
- Password: `admin123`

### User thường
- Email: `user@example.com`
- Password: `user123`

## Các trang chính

- **Trang chủ**: `/`
- **Sản phẩm**: `/products`
- **Đăng nhập**: `/login`
- **Đăng ký**: `/register`
- **Giỏ hàng**: `/cart`
- **Đơn hàng**: `/orders`
- **Profile**: `/profile`
- **Admin**: `/admin`

## Tính năng đã hoàn thiện

✅ **Frontend**: Giao diện đầy đủ với Bootstrap 5
✅ **Authentication**: Đăng ký, đăng nhập, đăng xuất
✅ **Products**: Hiển thị danh sách và chi tiết sản phẩm
✅ **Cart**: Thêm, sửa, xóa sản phẩm trong giỏ hàng
✅ **Orders**: Đặt hàng và xem lịch sử
✅ **Reviews**: Viết và xem đánh giá sản phẩm
✅ **Admin**: Dashboard và quản lý hệ thống
✅ **Responsive**: Giao diện responsive trên mọi thiết bị

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra MongoDB đã chạy chưa
- Kiểm tra DB_URI trong file .env

### Lỗi JWT
- Kiểm tra JWT_SECRET trong file .env
- Đảm bảo secret key đủ mạnh

### Lỗi port
- Thay đổi PORT trong file .env nếu port 3000 đã được sử dụng 