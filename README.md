# E-Commerce Web Application

Đây là một ứng dụng thương mại điện tử hoàn chỉnh được xây dựng bằng Node.js, Express, MongoDB và Handlebars. Ứng dụng bao gồm cả frontend và backend với đầy đủ các chức năng cần thiết cho một website bán hàng trực tuyến.

## Tính Năng

### Người dùng
- ✅ Đăng ký và đăng nhập tài khoản
- ✅ Xem danh sách sản phẩm và chi tiết sản phẩm
- ✅ Thêm sản phẩm vào giỏ hàng
- ✅ Quản lý giỏ hàng (thay đổi số lượng, xóa sản phẩm)
- ✅ Đặt hàng và xem lịch sử đơn hàng
- ✅ Viết đánh giá sản phẩm
- ✅ Cập nhật thông tin cá nhân và đổi mật khẩu

### Quản trị viên
- ✅ Dashboard với thống kê tổng quan
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục sản phẩm
- ✅ Quản lý đơn hàng và cập nhật trạng thái
- ✅ Quản lý người dùng
- ✅ Duyệt đánh giá sản phẩm

## Công nghệ sử dụng

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM cho MongoDB
- **JWT** - Xác thực và phân quyền
- **bcryptjs** - Mã hóa mật khẩu
- **express-validator** - Validation dữ liệu
- **cookie-parser** - Xử lý cookies

### Frontend
- **Handlebars** - Template engine
- **Bootstrap 5** - CSS framework
- **Font Awesome** - Icons
- **Vanilla JavaScript** - Client-side logic

## Cài đặt và Chạy dự án

### Yêu cầu hệ thống
- Node.js (phiên bản 14.x trở lên)
- npm hoặc yarn
- MongoDB (local hoặc MongoDB Atlas)

### Các bước cài đặt

1. **Clone repository**
```bash
git clone <your-repository-url>
cd Web_app
```

2. **Cài đặt dependencies**
```bash
npm install
```

3. **Tạo file cấu hình**
Tạo file `.env` trong thư mục gốc với nội dung:
```env
# Cổng chạy server
PORT=3000

# Chuỗi kết nối tới MongoDB
DB_URI=mongodb://localhost:27017/ecommerce_db

# Chuỗi bí mật cho JWT
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Môi trường
NODE_ENV=development
```

4. **Khởi động MongoDB**
```bash
# Nếu dùng MongoDB local
mongod

# Hoặc sử dụng MongoDB Atlas - cập nhật DB_URI trong .env
```

5. **Chạy ứng dụng**
```bash
# Chế độ development (với nodemon)
npm run dev

# Hoặc chế độ production
npm start
```

6. **Truy cập ứng dụng**
Mở trình duyệt và truy cập: `http://localhost:3000`

## Cấu trúc dự án

```
Web_app/
├── config/                 # Cấu hình database
├── controllers/           # Logic xử lý business
├── middlewares/          # Middleware functions
├── models/               # MongoDB schemas
├── public/               # Static files (CSS, JS, images)
├── routes/               # API routes
├── utils/                # Utility functions
├── views/                # Handlebars templates
│   ├── admin/           # Admin pages
│   ├── auth/            # Authentication pages
│   ├── cart/            # Cart pages
│   ├── layouts/         # Layout templates
│   ├── orders/          # Order pages
│   ├── products/        # Product pages
│   └── user/            # User profile pages
├── server.js            # Entry point
└── package.json         # Dependencies
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Đăng ký
- `POST /api/v1/auth/login` - Đăng nhập
- `POST /api/v1/auth/logout` - Đăng xuất

### Products
- `GET /api/v1/products` - Lấy danh sách sản phẩm
- `GET /api/v1/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/v1/products` - Tạo sản phẩm (Admin)
- `PUT /api/v1/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/v1/products/:id` - Xóa sản phẩm (Admin)

### Cart
- `GET /api/v1/cart/user` - Lấy giỏ hàng
- `POST /api/v1/cart` - Thêm sản phẩm vào giỏ
- `PUT /api/v1/cart/:id` - Cập nhật số lượng
- `DELETE /api/v1/cart/:id/products/:productId` - Xóa sản phẩm

### Orders
- `POST /api/v1/orders` - Tạo đơn hàng
- `GET /api/v1/orders/my-orders` - Lấy đơn hàng của user
- `GET /api/v1/orders/:id` - Chi tiết đơn hàng

### Admin
- `GET /api/v1/admin/dashboard` - Thống kê dashboard
- `GET /api/v1/admin/products` - Quản lý sản phẩm
- `GET /api/v1/admin/orders` - Quản lý đơn hàng
- `PATCH /api/v1/admin/orders/:id/status` - Cập nhật trạng thái đơn hàng

## Tính năng đã được fix

✅ **View Routes**: Đã thêm đầy đủ routes để render các trang HTML
✅ **Authentication**: Hỗ trợ cả JWT token và cookies
✅ **Home Page**: Trang chủ với sản phẩm nổi bật và danh mục
✅ **Product Pages**: Hiển thị danh sách và chi tiết sản phẩm
✅ **Cart Management**: Quản lý giỏ hàng hoàn chỉnh
✅ **Order Flow**: Từ giỏ hàng đến đặt hàng thành công
✅ **User Profile**: Cập nhật thông tin và đổi mật khẩu
✅ **Admin Dashboard**: Thống kê và quản lý hệ thống
✅ **Responsive Design**: Giao diện responsive với Bootstrap 5

## Hướng dẫn sử dụng

1. **Đăng ký tài khoản** tại `/register`
2. **Đăng nhập** tại `/login`
3. **Xem sản phẩm** tại `/products`
4. **Thêm vào giỏ hàng** từ trang sản phẩm
5. **Quản lý giỏ hàng** tại `/cart`
6. **Đặt hàng** từ giỏ hàng
7. **Xem đơn hàng** tại `/orders`

### Tài khoản Admin
Để tạo tài khoản admin, cần cập nhật trực tiếp trong database:
```javascript
// Trong MongoDB
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

## Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## License

Dự án này được phân phối dưới giấy phép MIT. Xem file `LICENSE` để biết thêm chi tiết.