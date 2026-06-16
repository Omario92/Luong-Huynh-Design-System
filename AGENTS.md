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
- **2026-06-16**: Thiết lập video loop thumbnail cho hai dự án "Huda CSR" và "TVC HERO 15s" trên `portfolio.html`; đồng thời xóa bỏ hoàn toàn dự án "BTS Soda" (gồm file `bts-soda.html`, thư mục media và project card), cập nhật lại tổng số dự án (13 -> 12) và định hình lại chuỗi loop navigation.
- **2026-06-16**: Bổ sung 2 dự án AI mới của năm 2025 là "Juice Monster AI" và "Clear Men AI" vào `portfolio.html` và tạo các trang chi tiết case study tương ứng `juice-monster-ai.html` và `clear-men-ai.html` với đầy đủ cover video (scroll-zoom) và gallery ảnh concept (đối với Clear Men); đồng thời cập nhật tổng dự án (11 -> 13) và thiết lập chuỗi loop navigation giữa các dự án.
- **2026-06-16**: Bổ sung phần gallery "3D Playblasts" chứa 11 video wireframe playblast (từ `assets/video/2024/CGI Beverage Demo/`) vào trang chi tiết dự án "BT Studio – CGI Beverage Demo" (file `bt-studio-cgi-beverage-demo.html`).
- **2026-06-15**: Bổ sung dự án mới "BTS Soda" (năm 2023, BT Studio) vào `portfolio.html` và tạo trang chi tiết `bts-soda.html`: dùng `BTS SODA.mp4` làm cover video (scroll-zoom) và 11 video còn lại (A_01–A_09, gồm A_06_1/2/3) làm gallery "3D Playblasts" dạng lưới 2 cột; cập nhật bộ đếm dự án (10 → 11, "Index 01 — 11") và chèn dự án vào chuỗi loop navigation giữa "BT Studio – CGI Beverage Demo" và "Twister Milk Bottle". Toàn bộ media tham chiếu cục bộ từ `assets/img/2023/BTS Soda/`.
- **2026-06-11**: Tiến hành dọn dẹp các dự án demo/placeholder không có media thực tế (Stride Beyond, Cheers to Victory, Huda Beach Carnival 2023, Circuit, Spectral, Nexora, Astralis); cập nhật danh sách các dự án thực tế trên trang chủ và portfolio (còn lại đúng 10 dự án CGI/VFX chất lượng cao); đồng bộ hóa chuỗi loop navigation qua lại giữa 10 dự án này; đồng thời thay thế ảnh chân dung nghệ sĩ bằng file halftone chính thức trên trang giới thiệu.
- **2026-06-11**: Cập nhật dự án "Halida Tet 2022 Key Visual" để sử dụng các hình ảnh chính thức (Halida_Final.png làm cover/thumbnail, Draft_Halida.webp và dd8e3e139474069.62397152c79d1.png trong gallery Development Pipeline), thay thế hoàn toàn các hình ảnh placeholder cũ.
- **2026-06-11**: Cập nhật dự án "TVC Ovaltine 2015 Adaptation" để tích hợp video quảng cáo chính thức từ YouTube (gBbWQVWmN6Y) vào iframe cover và sử dụng ảnh thiết kế chất lượng cao (Ovaltine2015-1.jpg) làm cover/thumbnail, đồng thời cập nhật bộ sưu tập gallery gồm 5 hình ảnh kết xuất chi tiết.
- **2026-06-11**: Cập nhật dự án "BT Studio – CGI Beverage Demo" để sử dụng video chiến dịch chính thức (BTS-SODA.mp4) làm cover video (sử dụng hiệu ứng scroll-zoom video) và snapshot làm thumbnail trên trang portfolio.
- **2026-06-11**: Cập nhật dự án "Twister Pack Visual" để sử dụng các hình ảnh chính thức (2ca5b487123729.5daeb55aa3894.jpg, Twister_01.jpg, Twister_02.jpg, Twister_03-scaled.jpg, Twister_04-scaled.jpg, Twister_thumb.jpg) thay thế cho các ảnh placeholder SVG cũ.
- **2026-06-11**: Bổ sung hai dự án mới từ năm 2021 là "Huda CSR" (CGI, Video Production) và "Pro VNA 3D KV" (Vietnam Airlines Key Visuals) vào portfolio.html; tạo các trang chi tiết case study tương ứng huda-csr.html và pro-vna-3d-kv.html, đồng thời nâng cấp hệ thống scroll-zoom video sang dạng đa đối tượng (multisections) để hỗ trợ hiệu ứng 3D translate/parallax đồng bộ cho cả Campaign Video B trên trang Huda CSR.
- **2026-06-11**: Thêm dự án mới "TVC HERO 15s" (năm 2020) vào trang portfolio.html và tạo trang chi tiết case study với layout scroll-zoom video cover, 2 video wireframe playblast (Xe_dap.mp4 và bottle.mp4) đặt song song, và hình render final 3D Pack.webp đặt căn giữa ở bên dưới.
- **2026-06-11**: Cập nhật dự án "AFC Key Visual" sang năm 2020, thay thế hình ảnh cover chính bằng `AFC_horizontal.webp` trên trang chi tiết, chuyển đổi thumbnail thành `AFC_thumb.webp` trên trang chủ và portfolio, đồng thời cập nhật năm lưu trữ thành 2020 và cấu hình bộ sưu tập wireframe 2 ảnh ở phần gallery.
- **2026-06-10**: Bổ sung dự án mới "Twister Milk Bottle" (năm 2020) vào trang portfolio.html và tạo trang chi tiết case study với layout 2 ảnh render FINAL song song (sửa lỗi cắt ảnh và thêm hiệu ứng cinematic reveal xuất hiện so le) và ảnh 3D Wireframe ở bên dưới.
- **2026-06-10**: Căn giữa video demo duy nhất của dự án Huda Football và bổ sung tiêu đề phụ "3D Wireframe Playblast" phía trên.
- **2026-06-10**: Dọn dẹp bộ sưu tập gallery tại trang chi tiết dự án Huda Football bằng cách loại bỏ các hình ảnh placeholder SVG tạm thời.
- **2026-06-10**: Triển khai hiệu ứng zoom video tràn màn hình (Scroll Zoom Video 3D Translate) trên trang chi tiết dự án Huda Football khi cuộn trang, sử dụng phương pháp mở rộng chiều rộng layout (width-based) kết hợp hiệu ứng parallax thu nhỏ video nội bộ để tránh hiện tượng cắt hình (cropping) trên dưới và đè chữ.
- **2026-06-10**: Triển khai hiệu ứng chuyển động mượt mà (smooth transition) cho video card khi hover bằng cách đồng bộ CSS cross-fade và trì hoãn lệnh pause/reset của JS thêm 500ms.
- **2026-06-10**: Cấu hình ảnh cover mặc định cho dự án CGI Huda Football tại portfolio.html và chỉ phát video loop khi hover chuột vào card.
- **2026-06-10**: Bổ sung video demo wireframe 3D chưa render `Huda-Football-Demo.mp4` từ URL WordPress vào thư viện dự án Huda Football.
- **2026-06-10**: Thay thế ảnh cover và thumbnail của dự án "BT Studio – CGI Huda Football" bằng video vòng lặp chiến dịch `assets/video/2023/CGI Huda Football.mp4` trên trang chủ, trang portfolio và trang chi tiết dự án.
- **2026-06-10**: Chuyển đổi bộ lọc dự án tại `portfolio.html` từ chọn nhiều (multi-select) sang chọn đơn (single-select) kèm tính năng tự động tắt/bật (toggle) khi click lại cùng một category.
- **2026-06-10**: Nâng cấp phần Capabilities / Services của trang `about.html` từ thiết kế cũ sang phong cách mới "Digital Artist / 3D / AI / VFX", sử dụng layout lưới hairline grid bất đối xứng `lh-capabilities-grid` với hover và hiệu ứng gạch chân neon acid lime.
- **2026-06-10**: Nâng cấp phần Hero / Intro của trang `about.html` thành phong cách monograph nghệ thuật cao cấp: thiết kế lưới 2 cột bất đối xứng, cách điệu tên nghệ sĩ xếp chồng khổng lồ, tinh chỉnh màu nhấn acid lime siêu tối giản, bổ sung lớp phủ dot grid và quầng sáng mờ cinematic.
- **2026-06-10**: Nâng cấp bố cục Project Metadata & Typography trên 13 card dự án tại file `portfolio.html`: chèn lưới thông tin chi tiết (Role, Client, Year) dùng font JetBrains Mono (9px/11px) ngăn cách bởi các hairline mờ phát sáng nhẹ khi hover.
- **2026-06-10**: Tinh chỉnh kích thước của Custom Cursor: Tăng độ lớn của vòng tròn dot xanh ở tâm lên 10px (+66%) để tăng khả năng nhận diện, đồng thời giảm 20% kích thước vòng ring ngoài (xuống 30px) để ôm sát thon gọn hơn.
- **2026-06-10**: Triển khai tính năng Custom Interactive Cinematic Cursor (chuột tùy chỉnh mượt với Lerp physics) trên các file `styles.css` và `main.js`, dọn dẹp các mã nguồn dư thừa và kiểm tra cú pháp JS thành công.
- **2026-06-10**: Khởi tạo file hệ thống `AGENTS.md` và tiến hành phân tích mã nguồn `portfolio.html` cùng các assets để lập đề xuất nâng cấp Premium Editorial VFX Portfolio.


## vexp <!-- vexp v2.0.12 -->

**MANDATORY: use `run_pipeline` — do NOT grep or glob the codebase.**
vexp returns pre-indexed, graph-ranked context in a single call.

### Workflow
1. `run_pipeline` with your task description — ALWAYS FIRST (replaces all other tools)
2. Make targeted changes based on the context returned
3. `run_pipeline` again only if you need more context

### Available MCP tools
- `run_pipeline` — **PRIMARY TOOL**. Runs capsule + impact + memory in 1 call.
  Auto-detects intent. Includes file content. Example: `run_pipeline({ "task": "fix auth bug" })`
- `get_skeleton` — compact file structure
- `index_status` — indexing status
- `expand_vexp_ref` — expand V-REF placeholders in v2 output

### Agentic search
- Do NOT use built-in file search, grep, or codebase indexing — always call `run_pipeline` first
- If you spawn sub-agents or background tasks, pass them the context from `run_pipeline`
  rather than letting them search the codebase independently

### Smart Features
Intent auto-detection, hybrid ranking, session memory, auto-expanding budget.

### Multi-Repo
`run_pipeline` auto-queries all indexed repos. Use `repos: ["alias"]` to scope. Run `index_status` to see aliases.
<!-- /vexp -->