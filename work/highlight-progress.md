# Cải thiện phần highlight — 2026-10-27

## Phạm vi và tiêu chí
- Chỉ đọc tiêu đề và phần tô màu vẫn nắm được quy tắc chính: đối tượng, hành động, điều kiện, thời hạn, ngoại lệ.
- Giữ nguyên văn bản chính sách; chỉ đổi vị trí thẻ mark trong 6 noi-bat.md và đồng bộ dữ liệu nhúng của mockups/tim-kiem-noi-bat.html.
- Không cập nhật chính sách từ Internet, không sửa bản toàn văn/tóm tắt hoặc các mockup khác.

## Baseline
- Checkout có sẵn nhiều file deleted/untracked do tái tổ chức tài liệu. Không gom các thay đổi này vào commit.
- Không có remote Git. Các bản noi-bat.md và mockups đang untracked.
- Trang highlight nhúng SOURCES, không tự đọc lại Markdown.

## Trạng thái
- Đã xác định điểm yếu: đang tô từ rời như 24 giờ, trừ khi, số điểm mà bỏ điều kiện và hệ quả.
- Đang biên tập 6 bản theo cụm đủ nghĩa, bảo toàn văn bản.
- Chưa kiểm chứng: tính toàn vẹn văn bản, đồng bộ HTML, trình duyệt.

## Bước tiếp
- So sánh trước/sau sau khi bỏ mark, kiểm tra cấu trúc thẻ và đọc phần tô riêng.
- Đồng bộ SOURCES; kiểm tra HTML render và lưu commit chỉ đúng file thuộc task.

## Checkpoint kiểm chứng
- Đã thêm `work/verify-highlights.cjs`: chạy parser Markdown thật bằng Node, so văn bản khi bỏ mark với SOURCES cũ, so cấu trúc block và số thẻ render.
- Lần kiểm tra đầu phát hiện mark bọc ngoài ký hiệu Markdown làm danh sách thành đoạn văn; đã giao sửa đúng vị trí thẻ, chưa chấp nhận kết quả này.
- `python` là alias Microsoft Store trên host; bỏ nhu cầu Python, dùng Node sẵn có.
- CUA từ chối file:// theo URL policy; không thử lách sang surface khác. Kiểm chứng trực quan trình duyệt giữ not_run. Parser offline vẫn kiểm tra được.
- Lệnh sau biên tập: `node work/verify-highlights.cjs --write`, rồi `node work/verify-highlights.cjs`.

## Review độc lập
- Reviewer phát hiện checklist LOA cấp 2/3, trường hóa đơn và một số danh sách ngành hàng chưa tô dù câu dẫn đã tô; đã giao sửa đúng các vùng thiếu.
- Bảng hạn mức tuần ở bài tiếp thị liên kết có dữ liệu định lượng chỉ trong ảnh nguồn. Không tự chép hoặc đoán con số; tô hướng dẫn có sẵn về nơi kiểm tra hạn mức. Giới hạn này phải nêu khi bàn giao.
- Chạy parser trước/sau đồng bộ lần đầu đạt cả 6 bài: 465 blocks; nội dung bỏ mark giữ nguyên; các thẻ render đủ. Chờ các bổ sung review rồi chạy lại.

## Hoàn tất
- Review độc lập đã xác nhận các finding được sửa, không còn finding nội dung trong phạm vi đã rà.
- Lần cuối: `node work/verify-highlights.cjs --write` và `node work/verify-highlights.cjs` đều exit 0.
- Cả 6 bài: 465 blocks; 458 vùng tô render đủ; thẻ cân bằng không lồng; cấu trúc khối và câu chữ sau bỏ mark bằng baseline; HTML khớp Markdown.
- Đã đồng bộ `mockups/tim-kiem-noi-bat.html`. Không sửa JavaScript/CSS của trang; chỉ thay SOURCES nhúng.
- Kiểm chứng trực quan browser: not_run do CUA chặn file://. Nội dung trong ảnh nguồn: không chép thành chữ; bảng hạn mức affiliate vẫn cần xem ảnh nguồn.
- Lưu commit local chỉ 6 noi-bat.md, HTML, verifier và log này. Không có remote nên không push. Các deleted/untracked có sẵn khác được giữ nguyên.

## Bảo trì
- Sau khi đổi thẻ highlight, chạy `node work/verify-highlights.cjs --write` rồi `node work/verify-highlights.cjs`.
- Script chỉ cho đồng bộ thay đổi mark; sửa văn bản chính sách cần quy trình riêng và baseline mới.

## Git bàn giao
- `git diff --cached --check`: exit 0, stage đúng 9 file thuộc task.
- `git commit -m "Improve standalone readability of policy highlights"`: không tạo được commit vì Git chưa cấu hình user.name/user.email. Không tự đặt danh tính. 9 file vẫn staged; thay đổi khác vẫn ngoài stage.

# Chỉnh lại theo phản hồi — 2026-10-27

## Yêu cầu và quyết định hiện hành (thay tiêu chí tô gần hết ở lượt trước)
- Phản hồi trực tiếp: tô gần hết tài liệu là vô dụng. Highlight chỉ chọn thông tin then chốt, không thay bản đầy đủ.
- Tạo thêm mỗi thư mục một `viet-co-dong.md`: viết gọn theo từng ý, giữ thứ tự/heading nguồn và các quy tắc độc lập, không gom bullet gốc thành một câu tóm tắt chung.
- Giữ điều kiện, số liệu, mốc bắt đầu thời hạn, phải/nên/có thể, HOẶC/VÀ và ngoại lệ. Chỗ nguồn mơ hồ ghi chú rõ, không tự diễn giải.
- Thao tác theo phần nhỏ: đọc vùng nguồn → biên tập vùng đó → đối chiếu rồi mới chuyển phần. Không thay cả kho bằng phép mở rộng mark tự động.
- Không thay toan-van.md/tom-tat*.md. Chỉ đồng bộ SOURCES HTML, giữ các sửa đổi media/CSS/JS hiện có của người dùng.

## Kế hoạch theo chặng (writing-plans)
- [ ] Hiệu suất: mục1–3 → mục4–5 → mục6–8 → review.
- [ ] Đăng bán thương hiệu: định nghĩa/so sánh/ảnh/tiêu đề → danh mục/trường thương hiệu/mô tả → bao bì/hạn chế/vi phạm → review.
- [ ] Chứng nhận thương hiệu: định nghĩa/loại/chủ sở hữu/cấp1 → cấp2/cấp3/bằng chứng mua → gửi hồ sơ/bổ sung/FAQ → review.
- [ ] SOF: định nghĩa/điều kiện → trách nhiệm → hướng dẫn → review.
- [ ] Ngành hàng được mời: tổng quan đến trang sức → đa phương tiện đến mẹ/bé → pin/sức khỏe/voucher/vi phạm → review.
- [ ] Affiliate: chia theo heading, mỗi gói khoảng100 dòng nguồn hoặc ít hơn → review.
- [ ] Mục lục: thêm đường dẫn đến6 bản cô đọng; verifier highlight, so số liệu/heading và các ca dễ sai; đồng bộ HTML.

## Giới hạn đã biết
- Git thiếu danh tính, không tự cấu hình; chưa có remote. Lưu checkpoint/file local khi không thể commit.
- Không kiểm chứng tính cập nhật ngoài web: đây là biên tập snapshot nguồn đã có.
- CUA chặn file:// ở lượt trước; không tuyên bố đã kiểm tra trực quan.

## Chỉ dẫn mới nhất của người dùng — tách hai việc độc lập
- Người dùng xác nhận highlight và viết cô đọng là HAI VIỆC RIÊNG, KHÔNG LIÊN QUAN.
- Thay quyết định "hai lớp đọc" phía trên: không dùng bản cô đọng để quyết định mức độ đủ nghĩa của highlight hoặc ngược lại.
- Chặng A: tạo6 viet-co-dong.md trực tiếp từ toan-van.md, thao tác theo phần, giữ đủ thông tin.
- Chặng B: chỉ sau chặng A, giảm highlight độc lập trong nguyên văn; bảo toàn chữ và đồng bộ HTML.
- Đã chuyển worker sang chỉ biên tập bản cô đọng. Nếu mark mục1–3 đã thay trước chỉ dẫn này, ghi nhận riêng để review ở chặng B.
- Baseline tỷ lệ từ tô trước chặng B: chứng nhận67.1%, affiliate73.5%, ngành hàng66.5%, SOF56.3%, đăng bán78.7%, hiệu suất94.5%.

## Bổ sung được yêu cầu
- Tạo riêng `mockups/tim-kiem-co-dong.html`, dữ liệu chỉ từ6 `viet-co-dong.md`.
- Dùng lại giao diện/mục lục/tìm kiếm có sẵn, HTML tự chứa dữ liệu, không fetch Markdown, không deploy.
- Worker phụ trách `work/build-compact-reader.cjs` và kiểm chứng; chờ6 bản đầy đủ mới tạo trang cuối.
- Áp dụng Sites ở chế độ local-only và Ponytail (reuse giao diện, Node stdlib, không dependency mới).

## Chặng A / bài hiệu suất / phần1
- Đã tạo `8623594494494465-hieu-suat-nguoi-ban/viet-co-dong.md`, metadata và mục1–3.
- Controller đối chiếu trực tiếp với source: scope, nghĩa vụ cập nhật, AHR90 ngày/ngoại lệ, tài khoản liên kết đều có; các ý tách bullet đúng thứ tự. Được chuyển sang mục4–5.
- Mark mục1–3 đã chỉnh trước khi user yêu cầu tách việc; giữ làm pending của chặng B. Các phần khác chưa chỉnh thêm.

## Chặng A / checkpoint nội dung
- Hiệu suất: hoàn tất các gói1–3,4–5,6–8. Review độc lập đã phát hiện và controller sửa 'Ngoại trừ'→'Bất kể', khôi phục 'mọi thay đổi' và tác nhân nền tảng đóng shop. Hai quy tắc90ngày vẫn tách riêng; chưa sửa highlight thêm.
- Đăng bán thương hiệu: hoàn tất3gói (đầu→Tiêu đề;Danh mục→Mô tả;Bao bì→cuối). Đã giữ ghi chú nguồn mơ hồ và3ví dụ tuyên bố cần tránh. Đang review độc lập.
- Chứng nhận: hoàn tất3gói (đầu→cấp1;cấp2→bằng chứng mua;gửi hồ sơ→FAQ). Controller đối chiếu các checklist,7ngày,2–30ký tự,1–35Nice và các điều kiện hồ sơ; chờ review độc lập.
- SOF: controller đã kiểm tra định nghĩa/điều kiện và12trách nhiệm; đang xử lý các bước hướng dẫn.
- Ngành hàng: đang biên tập gói đầu→trang sức. Affiliate chưa viết.
- HTML mới: generator đã qua syntax và test thiếu dữ liệu phải báo lỗi; chưa sinh trang khi nội dung thiếu. Không đụng các thay đổi media hiện có.

## Chặng A / checkpoint review
- Review độc lập: bài hiệu suất, đăng bán thương hiệu, chứng nhận, SOF và ngành hàng đã đối chiếu từng mục. Đã sửa lỗi đảo nghĩa ở AHR và thời điểm thông báo lúc đăng bán; ngành hàng giữ hậu quả tái phạm là 'sẽ'.
- Affiliate: controller đã đối chiếu các phần mở đầu/thư mời, bảng quota trong2ảnh và phần thiết lập cộng tác mở; reviewer độc lập xác nhận phần đầu/quota. Đang xử lý lọc mẫu/tự thêm; cần đọc tiếp vùng339–cuối để kiểm tra hiệu suất/xóa/FAQ, không cần đọc lại phần đầu.
- Hai bảng quota được chép thành bullet với nhãn ảnh riêng, không hợp nhất; các dashboard chỉ là ví dụ số dư.
- Generator đã review độc lập: không ghi reader gốc, dữ liệu tự chứa, escape an toàn; --check chỉ kiểm tra bản dựng trong bộ nhớ. Sau build phải đối chiếu file lưu riêng.
- Phát hiện3compact file có UTF8BOM khiến parser không thấyH1; sẽ chuẩn hóa UTF8noBOM khi writer hoàn tất. Không thêm fallback che lỗi nguồn.
- Mục lục đã thêm6liên kết compact; controller sửa nhãn link search từ 'phần nổi bật' về 'bản cô đọng'.

## Chặng A hoàn tất
-6viet-co-dong.md hoàn chỉnh, các gói được đọc/viết/đối chiếu tuần tự theo section; review độc lập cả6bài đã xong, finding đã sửa.
- Controller chuẩn hóa UTF-8 không BOM; 99 heading trong 6 bản cô đọng khớp thứ tự nguồn; không còn bảng Markdown trong các bản này.
- Đã sửa3nhãn bao bì của bản đăng bán từH3 về nhãnđậm như nguồn; generator bỏ mark trang trí khi soheading nguồn.
- `node work/build-compact-reader.cjs --check`: exit0, replacement/script-escape + parser + real search-index/body/ancestor/no-hit checks đạt.
- `node work/build-compact-reader.cjs`: đã tạo `mockups/tim-kiem-co-dong.html`.
- Kiểm tra độc lập file lưu:6SOURCES khớp nguyên văn6MD; toànscript compileVM được; khôngscript/CSSngoài/fetch.
- Không có browserUIQA vì rào cảnfile:// đã biết. Chưa khẳng định focus/scroll/responsive runtime.

## Chặng B bắt đầu độc lập
- Chỉ sửa thẻmark trong6noi-bat.md, không dùngviet-co-dong làm nguồn chọnhighlight.
- Mỗi gói đọcsection→chọn vài quy tắcđầynghĩa→đổi thẻ→sochữ/cấu trúc trước khi chuyển.
- Không tô cả bảng/list/địnhnghĩa/intro để đạt độphủ. Không tô câu dẫn danh sách mà bỏ toàn bộ ý bắtbuộc theo sau. Chi tiết vẫn nằm nguyên văn, highlight dùng đểchọn ý nổi bật.

## Chặng B hoàn tất
- Chỉ gỡ thẻ `<mark>`, không sửa câu chữ. Bỏ tô ở định nghĩa, danh mục dài, bước bấm giao diện, ví dụ và checklist LOA lặp lại. Giữ ngưỡng, thời hạn, ngoại lệ, hồ sơ bắt buộc và điểm khác biệt giữa các cấp.
- SOF giữ nguyên (đã chọn lọc). Tỷ lệ ký tự còn tô: chứng nhận 36.9%, affiliate 11.1%, ngành hàng 44.6%, SOF 13.6%, đăng bán 23.6%, hiệu suất 33.4%.
- `node work/verify-highlights.cjs --write` rồi `node work/verify-highlights.cjs`: exit 0. Sáu bài khớp `mockups/tim-kiem-noi-bat.html`; cấu trúc khối và chữ sau khi bỏ mark không đổi.
