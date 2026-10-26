# TikTok Shop — ghi chú chính sách

Mở `index.html` trực tiếp bằng trình duyệt. Không cần server, cài thư viện hoặc tài khoản để đọc bản tóm tắt. Trang không tự tải tài nguyên ngoài; bấm liên kết nguồn sẽ mở TikTok Shop Academy và cần mạng.

## Phạm vi bản đầu

- Sáu bài người dùng cung cấp; đọc tiếng Việt ngày 26/10/2026.
- Chia mục nhỏ và bảng hai cột: liên kết tới mục toàn văn / tóm tắt.
- **Không phải bản sao đầy đủ của sáu bài.** Toàn văn nằm tại trang nguồn, không được sao chép vào repo. Tóm tắt là bản tra cứu ngắn, không bao quát mọi ví dụ, hình ảnh, danh mục con hoặc yêu cầu hồ sơ. Cần mở nguồn trước khi áp dụng.
- Ngày hiển thị trên mỗi bài là ngày bài nguồn; ngày thu thập là ngày kiểm tra. Đây là snapshot tóm tắt, không tự cập nhật.
- Các điểm chưa thống nhất trong nguồn AHR và hạn mức Affiliate được đánh dấu trên trang.

## Sửa và tạo lại HTML

Sửa nội dung tại `data/summaries.json`. Mỗi `sections` tham chiếu vị trí heading trong `work/source-metadata.json` (bắt đầu từ 0); metadata này chỉ chứa tiêu đề bài/ngày/anchor đã quan sát trực tiếp, không có cookie, tài khoản hay toàn văn. Vị trí này là chỉ số nội bộ, không phải số mục in trên bài gốc.

```powershell
node scripts/build.mjs
node scripts/build.mjs --check
```

Lệnh đầu tạo lại `index.html`. Lệnh sau kiểm tra dữ liệu, nguồn/anchor, độ dài bản tóm tắt và việc HTML khớp source. Chỉ cần Node.js để tạo lại; người đọc chỉ cần file HTML.

Repo local chưa có remote. Không tự đăng lên GitHub hay dịch vụ hosting.
