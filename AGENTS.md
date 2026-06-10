# AI Coding Agent System

## Rules
1. Bắt buộc đọc file `AGENTS.md` trước khi thực hiện bất kỳ hành động nào.
2. Tuân thủ nghiêm ngặt định hướng thiết kế thương hiệu trong `_source/DESIGN.md` và `README.md`.
3. Chỉ sử dụng Vanilla CSS và Javascript thuần để tùy biến giao diện nhằm đảm bảo khả năng tích hợp mượt mà vào Elementor (sử dụng tiền tố `lh-`).
4. Giữ thiết kế tối giản, đậm chất điện ảnh (cinematic "black room"), hạn chế tối đa các chi tiết thừa thãi.
5. Không sử dụng các emoji, không dùng các biểu tượng unicode trang trí trừ dấu chấm trung tâm (`·`).

## Commands
* `npm run dev` / `live-server` hoặc tương đương để chạy preview.

## Recent Changes
- **2026-06-10**: Bổ sung video demo wireframe 3D chưa render `Huda-Football-Demo.mp4` từ URL WordPress vào thư viện dự án Huda Football.
- **2026-06-10**: Thay thế ảnh cover và thumbnail của dự án "BT Studio – CGI Huda Football" bằng video vòng lặp chiến dịch `assets/video/2023/CGI Huda Football.mp4` trên trang chủ, trang portfolio và trang chi tiết dự án.
- **2026-06-10**: Chuyển đổi bộ lọc dự án tại `portfolio.html` từ chọn nhiều (multi-select) sang chọn đơn (single-select) kèm tính năng tự động tắt/bật (toggle) khi click lại cùng một category.
- **2026-06-10**: Nâng cấp phần Capabilities / Services của trang `about.html` từ thiết kế cũ sang phong cách mới "Digital Artist / 3D / AI / VFX", sử dụng layout lưới hairline grid bất đối xứng `lh-capabilities-grid` với hover và hiệu ứng gạch chân neon acid lime.
- **2026-06-10**: Nâng cấp phần Hero / Intro của trang `about.html` thành phong cách monograph nghệ thuật cao cấp: thiết kế lưới 2 cột bất đối xứng, cách điệu tên nghệ sĩ xếp chồng khổng lồ, tinh chỉnh màu nhấn acid lime siêu tối giản, bổ sung lớp phủ dot grid và quầng sáng mờ cinematic.
- **2026-06-10**: Nâng cấp bố cục Project Metadata & Typography trên 13 card dự án tại file `portfolio.html`: chèn lưới thông tin chi tiết (Role, Client, Year) dùng font JetBrains Mono (9px/11px) ngăn cách bởi các hairline mờ phát sáng nhẹ khi hover.
- **2026-06-10**: Tinh chỉnh kích thước của Custom Cursor: Tăng độ lớn của vòng tròn dot xanh ở tâm lên 10px (+66%) để tăng khả năng nhận diện, đồng thời giảm 20% kích thước vòng ring ngoài (xuống 30px) để ôm sát thon gọn hơn.
- **2026-06-10**: Triển khai tính năng Custom Interactive Cinematic Cursor (chuột tùy chỉnh mượt với Lerp physics) trên các file `styles.css` và `main.js`, dọn dẹp các mã nguồn dư thừa và kiểm tra cú pháp JS thành công.
- **2026-06-10**: Khởi tạo file hệ thống `AGENTS.md` và tiến hành phân tích mã nguồn `portfolio.html` cùng các assets để lập đề xuất nâng cấp Premium Editorial VFX Portfolio.
