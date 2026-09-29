# I Am Ronaldo — Product & Implementation Handoff

**Tên file:** `HANDOFF_PLAN.md`  
**Vị trí dự kiến:** `D:\I am Ronaldo\app\docs\HANDOFF_PLAN.md`  
**Ngày cập nhật:** 28/09/2026  
**Trạng thái:** Nội dung handoff hoàn chỉnh; **chưa ghi thành file vì phiên hiện tại đang ở Plan Mode**.

Tài liệu này thay thế các quyết định cũ về countdown, thời lượng định trước và đăng nhập bằng ChatGPT. Agent ở chat mới cần đọc toàn bộ tài liệu, kiểm tra code thực tế rồi tiếp tục từ phần còn thiếu.

---

## 1. Mục tiêu và bối cảnh người dùng

### Người dùng

Quang là sinh viên quốc tế Việt Nam tại Purdue Fort Wayne, học song ngành Computer Science và Mathematics, nhận học bổng toàn phần. Người dùng có nền tảng toán Olympiad và competitive programming từ phổ thông, từng đạt giải cấp tỉnh và quốc gia.

Mục tiêu dài hạn là theo đuổi PhD được tài trợ tại Mỹ, ưu tiên AI/ML, có thể nghiên cứu robotics sau này. Trường top 10 là nguyện vọng, không phải kết quả mà app được phép hứa hẹn.

Các ưu tiên hiện tại:

- Xây nền tảng toán và khoa học máy tính vững chắc.
- Giữ chất lượng học tập trong học kỳ 18 tín chỉ.
- Tìm cơ hội undergraduate research, quan tâm nghiên cứu với Jon Rusert về ML, tấn công và an ninh AI.
- Tìm một hoặc hai internship; đang tham gia Ola để chuẩn bị phỏng vấn và sửa résumé.
- Đã học kiến thức AI/ML cơ bản, NumPy/PyTorch và một số mô hình; chưa có nhiều kinh nghiệm làm việc với dataset thực tế.
- Không muốn chạy theo FOMO, học quá nhiều thứ hoặc làm hàng loạt project cùng lúc.

### Vấn đề app cần giải quyết

Khó khăn chính là **bắt đầu làm việc**, quản lý thời gian và doomscrolling. Người dùng thích Cristiano Ronaldo và muốn lấy sự kiên trì của Ronaldo làm động lực, nhưng muốn mức kỷ luật linh hoạt, thực tế.

App cần giúp người dùng:

1. Biết task nào có thể bắt đầu.
2. Bắt đầu bằng một thao tác.
3. Theo dõi thời gian đã làm.
4. Cảm thấy hài lòng khi hoàn thành.
5. Nhìn lại mình đã dành thời gian cho những mục tiêu nào.

Không dùng giọng trách móc, tạo cảm giác tội lỗi hoặc bắt buộc hoàn hảo mỗi ngày.

### Ràng buộc đời sống

Thông tin này phục vụ định hướng sản phẩm và các bản cập nhật lập kế hoạch sau này; **không tự động tạo lịch trong v1**:

- Học kỳ hiện tại khoảng 18 tín chỉ với nhiều môn toán và CS.
- Real Analysis online: hai lecture một giờ mỗi tuần; thường cần thêm khoảng hai giờ đọc sách cho mỗi lecture.
- Homework và phần catch-up nằm ngoài khoảng sáu giờ lecture/reading nói trên.
- Hiện thường xem lecture cuối tuần, homework hạn cuối thứ Hai.
- Khoảng một giờ cho bữa trưa mỗi ngày.
- Khoảng hai giờ nấu và ăn tối mỗi ngày.
- Muốn giữ khoảng một đến hai giờ nghỉ/ngủ sau giờ học.
- Có hoạt động Chapman Scholars, sự kiện trường và thời gian với bạn bè.
- Không được coi thời gian chưa nhập vào lịch là thời gian rảnh để làm việc.

Ảnh lịch học đã cung cấp không đủ để suy ra toàn bộ lịch hiện tại; chưa tự mã hóa các giờ học từ ảnh vào app.

---

## 2. Các quyết định đã chốt

| Chủ đề | Quyết định |
|---|---|
| Tên | I Am Ronaldo |
| Người dùng | Một người |
| Thiết bị | iPhone và laptop |
| Sản phẩm | Web app hỗ trợ cài lên Home Screen |
| Luồng chính | Today → chọn task → Focus → hoàn thành → Today |
| Timer | **Count-up**, bắt đầu từ `00:00` |
| Thời lượng | Không nhập thời lượng dự kiến, không có giới hạn |
| Đăng nhập | Không tài khoản, không đăng ký, không đăng nhập ChatGPT |
| Quyền truy cập | Link bí mật, thiết bị ghi nhớ quyền truy cập |
| Đồng bộ | Dữ liệu server dùng chung giữa các thiết bị |
| Phân loại | Goal baskets |
| Thống kê | Biểu đồ thanh ngang theo tuần |
| Ngân sách | $0 chi phí định kỳ bổ sung |
| Coaching | Thông điệp ngắn, tự viết; không dùng paid AI API |
| Ngôn ngữ UI v1 | Tiếng Anh đơn giản; nội dung task hỗ trợ tiếng Việt |
| Múi giờ | `America/Indiana/Indianapolis` |
| Tuần thống kê | Thứ Hai đến Chủ nhật |

**Không đưa trở lại:** countdown, Duration field, Add time, timer expiry, tự động đánh dấu hoàn thành khi hết giờ, hoặc đăng nhập bằng tài khoản.

---

## 3. Phạm vi bản đầu

### Có trong v1

- Tạo, sửa, đổi ngày, sắp xếp và xóa task.
- Gán task vào một basket.
- Templates có thể chỉnh sửa.
- Count-up timer, pause/resume, hoàn thành hoặc kết thúc session.
- Một session hoạt động tại một thời điểm trên mọi thiết bị.
- Completed section và undo completion.
- Weekly review theo baskets và task.
- Lưu bền vững, đồng bộ đa thiết bị.
- Link riêng thay cho tài khoản.
- Hỗ trợ Home Screen, âm thanh và giữ màn hình sáng tùy chọn.
- Loading, empty, error, connection-loss states.

### Để sau

- Nhắc việc nền/web push.
- Tự động lập kế hoạch tuần.
- Long-term goals và mục tiêu 12 tuần.
- Các mức intensity.
- Brightspace imports.
- Conversational AI.
- Chỉnh sửa offline.
- Chỉnh thời gian session khi quên tắt timer.
- Leaderboard, streak penalties, điểm số hoặc nhiều dashboard.

Biểu đồ tuần của v1 là **xem lại thời gian**, không phải hệ thống tự lập kế hoạch.

---

## 4. Visual direction — Duolingo là tham chiếu chính

**Tham chiếu bắt buộc:** [Duolingo design reference trên DesignMD](https://www.designmd.co/d/duolingo).

Agent triển khai cần mở trang này trước khi chốt visual. Lần kiểm tra gần nhất trang bị timeout; các thông số dưới đây là **quyết định thiết kế dành cho app**, không phải khẳng định đã trích xuất chính xác từ DesignMD.

### Cảm giác tổng thể

Giao diện thân thiện, vui, dễ tiếp cận, tương tự ngôn ngữ thiết kế Duolingo:

- Nền trắng.
- Chữ đậm, tròn, dễ đọc.
- Hình khối mềm và bo góc lớn.
- Nút có cảm giác nổi, nhấn xuống nhẹ.
- Màu xanh lá vui tươi.
- Mascot có biểu cảm rõ ràng.
- Nhiều khoảng trắng.
- Nội dung ngắn, mỗi màn hình có một hành động chính rõ ràng.

Không chuyển thành dashboard bóng đá, giao diện đen neon hoặc landing page nhiều hiệu ứng. Không thêm bản đồ bài học, leaderboard hay XP chỉ vì Duolingo có các tính năng đó.

### Bảng màu triển khai

| Thành phần | Màu mặc định |
|---|---|
| Background | `#FFFFFF` |
| Primary green | `#58CC02` |
| Đáy nút xanh | `#43A600` |
| Chữ trên nút xanh | `#173700` |
| Chữ chính | `#343B3F` |
| Chữ phụ | `#66705F` |
| Border | `#E6E9E3` |
| Surface phụ | `#F5F7F4` |
| Focus ring | `#2498CE` |

Baskets dùng xanh dương, tím, cam và xanh lá. Luôn có tên/nhãn đi kèm, không truyền đạt thông tin chỉ bằng màu.

### Typography và spacing

- Dùng Nunito đã có trong project nếu font hoạt động đúng; fallback rounded system font.
- Body khoảng 16px.
- Tiêu đề màn hình khoảng 28–36px, weight 800–900.
- Timer khoảng 80px trên điện thoại và 112px trên laptop; tự co khi hiển thị nhiều chữ số.
- Timer dùng `tabular-nums` để chữ số không làm layout nhảy.
- Spacing theo nhịp 8px; khoảng cách nhóm nội dung 24–32px.
- Nội dung chính rộng tối đa khoảng 640px.
- Focus tập trung hơn, tối đa khoảng 560px.
- Mobile padding ngang 20px và tôn trọng safe-area.

### Components

- Nút chính cao tối thiểu 52px, bo khoảng 16px.
- Border rõ, đáy nổi khoảng 4px.
- Khi nhấn, dịch xuống nhẹ; không làm các phần khác nhảy layout.
- Task row bo khoảng 18px, viền 2px, vùng bấm rộng.
- Sheet/dialog bo lớn, có label và keyboard focus đúng.
- Icon dùng bộ Lucide hiện có.
- Không tạo các khung trang trí không mang thông tin.

### Mascot Ronaldo

Một nhân vật cartoon Ronaldo nguyên bản, nhất quán qua ba trạng thái:

1. **Ready:** thân thiện, khích lệ bắt đầu.
2. **Training:** tập trung, đứng phía trên timer.
3. **Celebration:** tư thế ăn mừng sau khi hoàn thành.

Định hướng: tóc và nét mặt gợi Ronaldo, áo số 7, hình khối đơn giản, biểu cảm rõ ở kích thước nhỏ. Dùng nền trong suốt, không video.

Trên Focus:

- Mascot khoảng 160–200px tùy màn hình.
- Timer vẫn là yếu tố thị giác mạnh nhất.
- Chuyển động nhẹ, không chạy nhảy liên tục.
- Tắt animation không thiết yếu khi bật reduced motion.

Coaching dùng câu tự viết, ví dụ “One task at a time.” hoặc “A little progress is still progress.” Không gán các câu tự viết thành lời nói thật của Ronaldo.

### Tiêu chí visual

Ở màn hình iPhone thông thường, người dùng phải nhận ra ngay:

- Mình đang làm task nào.
- Timer đã chạy bao lâu.
- Nút pause và finish ở đâu.

Không cần cuộn qua trang trí để tìm các nút chính.

---

## 5. Luồng màn hình và hành vi

### Today

Mở thẳng Today trên thiết bị đã có quyền truy cập.

Hiển thị:

- Ngày đang chọn và điều hướng ngày.
- Tiến độ như `2 of 4 tasks done`.
- Tasks chưa hoàn thành theo thứ tự người dùng chọn.
- Bộ lọc `All` và các baskets.
- Nút Add task.
- Completed section thu gọn, nhóm theo basket.
- Resume session banner khi có session running hoặc paused.
- Điều hướng nhỏ giữa Today và This week.
- Settings qua icon.

Task row gồm tên, basket và thời gian đã ghi nhận nếu có. Bấm phần chính của row để bắt đầu; menu riêng dùng cho sửa, đổi ngày, sắp xếp và xóa.

Đổi ngày không tự chuyển các task quá hạn sang hôm nay.

### Add/Edit task

Các trường:

- Title: tùy chọn; để trống thành `Focus session`.
- Basket: bắt buộc; mặc định Homework.
- Day: mặc định ngày đang xem.
- First action: tùy chọn.

Không có trường Duration.

Giữ nguyên nội dung đang nhập khi lưu lỗi. Task đang có active session không được đổi basket trước khi kết thúc session đó.

Xóa task là ẩn khỏi danh sách, không xóa lịch sử thời gian.

### Focus

Thứ tự nội dung:

1. Mascot.
2. Tên task và basket.
3. Count-up timer.
4. First action nếu có.
5. Pause/Resume và Finish task.
6. End session và Back to today ở mức phụ.

| Hành động | Kết quả |
|---|---|
| Chọn task chưa hoàn thành | Tạo running session và mở Focus |
| Pause | Đóng đoạn chạy hiện tại, giữ elapsed time |
| Resume | Tiếp tục session bằng một đoạn chạy mới |
| Finish task | Kết thúc session, hoàn thành task, mở celebration |
| End session | Lưu thời gian, task vẫn chưa hoàn thành |
| Back to today | Timer tiếp tục, xuất hiện resume banner |
| Mở lại app | Khôi phục session từ server |
| Làm tiếp lâu hơn | Timer tiếp tục tăng, không có expiry |

Một task có thể cần nhiều sessions. Mỗi session mới bắt đầu từ zero. Hiển thị `Task total` nhỏ khi đã có thời gian từ session trước.

Nếu đang có session khác, cho hai lựa chọn:

- Resume current session.
- End current session and start this task.

Thay session phải là một thao tác atomic.

### Celebration và Completed

Sau khi finish:

- Mascot ăn mừng.
- Thông điệp ngắn.
- Thời gian session và basket đã đóng góp.
- Back to today.

Không tự bắt đầu task tiếp theo.

Undo completion chỉ mở lại task; không chạy lại session cũ và không trừ thời gian đã làm.

### Templates

Nằm trong Add task sheet, không có màn hình chính riêng.

Cho phép tạo, sửa, xóa và thêm template vào ngày đã chọn. Task được tạo là bản sao độc lập.

Starter templates:

| Template | Basket |
|---|---|
| Real Analysis: lecture segment | Mathematics |
| Real Analysis: textbook reading | Mathematics |
| Real Analysis: homework | Homework |
| Research: agreed next step | PhD Research |
| Ola: interview preparation | Software Engineering |

Không gắn thời lượng, không tự thêm hằng ngày.

---

## 6. Baskets và weekly review

### Baskets ban đầu

| Basket | Ví dụ |
|---|---|
| Homework | Assignment Data Structures, homework Real Analysis |
| Software Engineering | Backend lesson, LeetCode, Ola preparation |
| Mathematics | Ôn định nghĩa Real Analysis, đọc sách, luyện Putnam |
| PhD Research | Đọc paper, tái hiện thí nghiệm, chuẩn bị liên hệ giáo sư |

Người dùng chọn basket theo mục đích công việc. App không tự phân loại.

Task thuộc basket ngay khi tạo; hoàn thành chỉ đổi trạng thái. Cảm giác “đưa công việc vào basket” được thể hiện bằng celebration và danh sách completed, không phải chuyển dữ liệu sang một nơi khác.

Cho phép thêm và đổi tên basket trong Settings. V1 chưa cần xóa basket.

Đổi tên áp dụng cho mọi nơi. Đổi basket của task chỉ ảnh hưởng session tương lai; session cũ giữ basket snapshot.

### This week

Hiển thị:

- Khoảng ngày của tuần.
- Tổng thời gian đã ghi nhận.
- Biểu đồ thanh ngang, một hàng cho mỗi basket.
- Tên, thời gian và phần trăm tổng thời gian.
- Điều hướng tuần trước/sau và về tuần hiện tại.
- Chi tiết công việc khi chọn basket.

Mỗi thanh thể hiện tỷ trọng trên tổng thời gian của tuần, dùng chung một thang đo. Khi tổng bằng zero, hiển thị empty state, không tính phần trăm giả.

Trong basket, nhóm các sessions theo task và hiển thị:

- Tên task.
- Tổng thời gian của task trong tuần đó.
- Trạng thái hoàn thành hiện tại.
- Có thể mở chi tiết từng session.

### Quy tắc tính thời gian

- Tính cả completed, stopped và active sessions.
- Tính công việc chưa hoàn thành.
- Không tính pause.
- Không đếm lại thời gian khi finish hoặc undo.
- Dựa vào thời điểm thực sự chạy timer, không dựa vào planned date.
- Session qua ranh giới tuần được chia đúng phần thời gian của mỗi tuần.
- Task đổi ngày không kéo lịch sử sang ngày khác.
- Task bị ẩn vẫn đóng góp vào thống kê lịch sử.
- Phần trăm chỉ mô tả phân bổ, không chấm điểm hiệu suất.

---

## 7. Truy cập bằng link bí mật

Người dùng đã chọn phương án này thay cho tài khoản.

### Trải nghiệm

- Một link riêng dùng trên iPhone và laptop.
- Thiết bị mở link lần đầu sẽ nhớ quyền truy cập.
- Các lần sau mở thẳng Today.
- Ai có link có thể xem và sửa dữ liệu.
- Không có username, password hay hồ sơ tài khoản.

Nếu thiết bị chưa có quyền, chỉ hiển thị hướng dẫn mở link riêng. Có thể cho dán link riêng một lần để xử lý trường hợp Home Screen app không chia sẻ cookie với Safari; đây là bước cấp quyền cho thiết bị, không thêm hệ thống tài khoản.

### Cơ chế

- Sinh khóa ngẫu nhiên 256-bit.
- Link có dạng `https://<host>/#key=<secret>`.
- Fragment được đọc ở client và trao đổi qua `POST /api/access`.
- Server kiểm tra hash của khóa từ runtime secret.
- Đặt cookie `HttpOnly`, `Secure`, `SameSite=Lax`, thời hạn một năm, `Path=/`.
- Xóa fragment khỏi thanh địa chỉ sau khi nhận khóa; giữ trong bộ nhớ tạm nếu cần retry.
- Mỗi API kiểm tra cookie với khóa hiện hành.
- Không đưa khóa vào source, log, analytics hoặc tài liệu handoff.
- Đổi khóa qua cấu hình triển khai sẽ vô hiệu hóa quyền truy cập cũ.
- Môi trường local chỉ dùng khóa thử riêng; không có bypass trong production.

Mọi API đọc/ghi dữ liệu vẫn được bảo vệ. Trang shell có thể mở không cần tài khoản nền tảng, nhưng không chứa dữ liệu riêng trước khi kiểm tra quyền.

Hosting phải hỗ trợ mô hình này. Nếu vẫn bắt đăng nhập ChatGPT ở lớp hosting thì chưa đáp ứng yêu cầu, dù đã xóa nút Sign in trong React.

---

## 8. Kiến trúc và dữ liệu

### Stack

Tiếp tục starter đã có:

- React, TypeScript, Vinext.
- Cloudflare Workers.
- D1.
- Drizzle cho schema/migrations.
- UI primitives hiện có.
- Recharts có sẵn nếu dùng cho biểu đồ.

Không thay framework hoặc cài lại project từ đầu chỉ để triển khai thay đổi này.

### Workspace cá nhân

Dùng một workspace cố định phía server. Client không được tự chọn `owner_id`.

Schema hiện có dùng owner-scoped workspace document và một active-session slot. Có thể giữ cấu trúc này cho v1, chuyển ý nghĩa owner thành workspace cá nhân.

Nếu có dữ liệu cũ, chuyển có kiểm tra trong transaction; không xóa hoặc tự gộp nhiều workspace. Nếu phát hiện nhiều workspace thực có dữ liệu và không xác định được workspace chính, dừng riêng bước migration để làm rõ.

### Records logic

| Record | Nội dung |
|---|---|
| Preferences | Time zone, sound, keep-awake |
| Basket | ID, tên, màu |
| Task | ID, title, day, basket, first action, order, completed state, archived |
| Template | Title, first action, basket |
| Session | Task ID, title/basket snapshot, state, segments, outcome |
| Mutation receipt | Request ID, fingerprint, revision |

Session gồm các đoạn chạy `{start, end}`; đoạn đang chạy có `end = null`.

Không lưu `remainingDuration` hoặc preset duration.

Timestamps lưu UTC; task day là local calendar date. Tuần được xác định theo time zone, không mặc định một tuần luôn có đúng 168 giờ.

### API tối thiểu

- `POST /api/access`: đổi link secret lấy cookie.
- `GET /api/state`: trả state, revision và server time.
- `POST /api/command`: nhận `requestId`, `revision`, `command`.

Các command cần có:

- Task create/edit/archive/undo/reorder.
- Template create/edit/delete/add.
- Basket create/rename.
- Session start/pause/resume/finish/end.
- Preferences update.

Đổi ngày nằm trong task edit. Weekly summary có thể tính từ canonical session segments, không cần lưu bản tổng hợp riêng.

Mỗi mutation trả state canonical. Kiểm tra input phía server; không tin dữ liệu client. API responses dùng `Cache-Control: no-store`.

---

## 9. Timer, concurrency và mất kết nối

### Timer

Elapsed time bằng tổng các đoạn đã đóng cộng phần thời gian từ lúc mở đoạn đang chạy.

Interval chỉ dùng để vẽ lại màn hình; không cộng một giây mỗi tick làm nguồn dữ liệu chính.

- Dùng server time để hiệu chỉnh chênh lệch đồng hồ thiết bị.
- Dùng monotonic clock cho việc hiển thị giữa các lần đồng bộ.
- Re-fetch khi mở app, trở lại foreground hoặc reconnect.
- Poll mỗi 5 giây trên Focus và 15 giây trên Today/This week.
- Tạm dừng polling khi trang ẩn, đồng bộ ngay khi hiện lại.
- Session khác thiết bị đã pause/finish phải cập nhật lại UI.

Timer tiếp tục khi khóa điện thoại hoặc đóng tab. Không tự cap thời gian vì đã chuyển sang count-up.

Thời gian ghi nhận là thời gian timer chạy, không phải bằng chứng người dùng tập trung liên tục.

### Concurrency và retries

- Một active-session slot được bảo vệ bằng database transaction và revision compare-and-swap.
- Request ID giữ nguyên khi retry cùng thao tác.
- Cùng ID nhưng payload khác phải bị từ chối.
- Revision cũ trả conflict, tải state mới; không tự ghi đè.
- Double tap không tạo hai task hoặc hai session.

### Mất mạng

- Không cho thao tác thay đổi session được hiển thị là thành công trước khi server xác nhận.
- Có thể tiếp tục hiển thị elapsed theo session cuối cùng đã xác nhận, kèm trạng thái mất kết nối.
- Giữ draft task khi lưu lỗi.
- Nếu chưa biết write đã thành công hay chưa, retry đúng request ID.
- Reconcile trước khi nhận thao tác mới phụ thuộc vào state đó.

---

## 10. iPhone, accessibility và chất lượng

- Manifest với tên app, icon và standalone display.
- Icons 192px, 512px và Apple touch icon.
- Hướng dẫn Add to Home Screen.
- Manifest/start URL không chứa link secret.
- Service worker chỉ cache static assets; không cache API hoặc HTML có dữ liệu riêng.
- Keep screen awake mặc định tắt; nếu bật thì chỉ giữ khi session đang chạy và trang hiện.
- Release wake lock khi pause/end; xử lý từ chối một cách nhẹ nhàng.
- Completion sound mặc định tắt, chỉ phát khi app đang mở sau tương tác.
- Không hứa alarm khi đóng app hoặc khóa máy.
- Touch targets tối thiểu 44px.
- Form labels, keyboard navigation, focus states và dialog focus management đầy đủ.
- Không để screen reader đọc từng giây của timer.
- Biểu đồ có nhãn chữ và thời gian, không chỉ màu.
- Respect reduced motion và text zoom.

---

## 11. Trạng thái code thực tế tại thời điểm handoff

**App chưa hoàn thành. Không suy diễn có schema/API nghĩa là đã chạy hoặc kiểm thử thành công.**

| Hạng mục | Quan sát được |
|---|---|
| Starter | Đã có project và dependencies |
| Today UI | Có giao diện ban đầu; các nút chưa nối đầy đủ |
| Theme | Có CSS trắng/xanh, Nunito, rounded buttons |
| Domain logic | Có tasks, templates, baskets, sessions, elapsed và weekly aggregation |
| Repository | Có D1 reads/writes, revision và mutation receipts |
| API | Có state và command routes |
| Đăng nhập | Vẫn dùng ChatGPT user và còn màn hình Sign in cũ |
| Secret-link access | Chưa triển khai |
| Schema | Có định nghĩa Drizzle |
| Migrations | Chưa thấy SQL migrations; chỉ có metadata journal |
| Mascot | Chưa thấy assets trong `public` |
| PWA | Có manifest/SW nhưng chưa đầy đủ PNG icons được tham chiếu |
| Tests/build | Chưa có kết quả xác nhận hoàn chỉnh |
| Git | `git status` báo chưa phải Git repository |
| Deployment | Chưa xác minh deployment hoạt động |

Có dấu hiệu lỗi encoding trong một số chuỗi UI như dấu nháy; cần kiểm tra và lưu UTF-8 đúng.

### Các vị trí quan trọng

Đây là ngoại lệ có nhiều đường dẫn để agent tiếp nhận tìm đúng phần đang làm:

- Project: `D:\I am Ronaldo\app`
- Plan cũ: `D:\I am Ronaldo\app\docs\BUILD_PLAN.md` — còn nội dung sign-in cũ.
- UI: `app/page.tsx`, `app/training-app.tsx`, `app/globals.css`.
- Logic: `lib/domain.ts`, `lib/repository.ts`.
- API: `app/api/state/route.ts`, `app/api/command/route.ts`.
- Schema: `db/schema.ts`.
- Hosting: `.openai/hosting.json`.

### Hosting hiện có

Manifest hiện ghi:

```json
{
  "project_id": "appgprj_6ab9ed696654819198bee3b917e65905",
  "d1": "DB",
  "r2": null
}
```

Giữ nguyên project ID; không tạo thêm Site để thay thế mà chưa kiểm tra dự án hiện tại.

Sites skills/helpers không còn ở đường dẫn cache cũ trong lần kiểm tra gần đây; connector đọc Site cũng gặp lỗi kết nối. Không coi hosting, billing hoặc khả năng bỏ login gate là đã được xác minh.

Không đưa credentials hoặc link secret thật vào handoff.

---

## 12. Kế hoạch thực hiện

### Bước 1 — Xác minh nền tảng

- Đọc code hiện tại và instructions trong workspace.
- Kiểm tra dependencies, scripts, database state và asset paths.
- Kiểm tra khả năng hosting không bắt đăng nhập nền tảng, phù hợp ngân sách.
- Giữ nguyên starter và project ID.
- Lưu handoff này, cập nhật plan cũ để tránh yêu cầu mâu thuẫn.

### Bước 2 — Hoàn thiện trải nghiệm nhìn thấy được

- Áp dụng visual direction DesignMD/Duolingo.
- Hoàn thiện Today, Add/Edit sheet, Focus và celebration.
- Tạo/đưa vào ba mascot states.
- Dùng count-up ngay từ đầu.
- Kiểm tra layout iPhone và laptop bằng browser thực.

### Bước 3 — Quyền truy cập và dữ liệu bền vững

- Thay ChatGPT sign-in bằng link riêng.
- Thiết lập workspace cá nhân.
- Tạo và áp dụng migrations đúng môi trường.
- Kết nối task/template/basket operations.
- Giữ dữ liệu cũ nếu có.
- Bắt đầu dữ liệu sử dụng thật với task list rỗng và starter templates.

### Bước 4 — Session đáng tin cậy

- Timestamp-based timer.
- Pause/resume/end/finish.
- One active session.
- Atomic task switching.
- Revision checks, idempotency và retry.
- Cross-device refresh, resume banner và connection states.

### Bước 5 — Weekly review

- Tính thời gian theo segments và local week.
- Biểu đồ thanh ngang.
- Task breakdown theo basket.
- Bao gồm unfinished work.
- Kiểm tra đổi tuần, DST và lịch sử basket.

### Bước 6 — Sẵn sàng sử dụng

- Hoàn thiện PWA icons, Home Screen flow, sound và wake lock.
- Kiểm tra accessibility và reduced motion.
- Chạy tests phù hợp, typecheck, lint và production build.
- Deploy chỉ sau khi quyền truy cập bằng secret đã hoạt động.
- Nếu hosting không đạt yêu cầu hoặc cần trả thêm tiền, giữ local build và báo rõ điểm chặn.
- Không thay bằng API công khai không bảo vệ.

### Bước 7 — Thử dùng hai tuần

Đánh giá mức dễ bắt đầu, sự hữu ích của baskets, khả năng quay lại sau gián đoạn, quên tắt timer và độ gây phân tâm của mascot.

Một ngày chỉ làm coursework vẫn hợp lệ. Không thêm nghĩa vụ chỉ để biểu đồ trông cân bằng.

---

## 13. Acceptance tests

### Luồng sử dụng

- Thêm task với basket, bấm một lần để vào Focus.
- Title trống được xử lý; không hỏi duration.
- Timer tăng từ zero và chuyển sang định dạng giờ khi cần.
- Finish mở celebration và hoàn thành task.
- End session giữ task chưa hoàn thành.
- Session mới không làm mất thời gian cũ.
- Undo không khởi động timer hoặc trừ lịch sử.
- Template và task tạo từ template độc lập.

### Baskets và thống kê

- Mỗi session chỉ thuộc một basket.
- Unfinished work được tính.
- Pause bị loại trừ.
- Chart total bằng tổng task/session contributions.
- Session qua ranh giới tuần được phân bổ đúng.
- Đổi planned date không đổi thời gian lịch sử.
- Đổi tên basket không mất dữ liệu.
- Đổi basket của task không viết lại session cũ.
- Empty week không có tỷ lệ vô nghĩa.

### Timer và đồng bộ

- Pause → reload → resume giữ đúng elapsed.
- Khóa máy/đóng tab rồi mở lại không reset.
- Hai thiết bị bắt đầu đồng thời chỉ có một active session.
- Finish trên một thiết bị được phản ánh ở thiết bị còn lại.
- Request retry không ghi trùng.
- Stale revision không ghi đè state mới.
- Mất mạng không tạo trạng thái lưu thành công giả.
- Midnight và DST không làm mất hoặc cộng trùng thời gian.

### Quyền truy cập

- Link riêng dùng được trên hai thiết bị mà không có tài khoản.
- Thiếu/sai khóa không đọc hoặc sửa được dữ liệu.
- Khóa bị thay thế không còn hiệu lực.
- Không lộ secret trong URL sau exchange, log hoặc source.
- Không cho client chọn workspace khác.
- API từ chối cross-origin mutations.
- Home Screen app có luồng cấp quyền khả thi nếu cookie không được chia sẻ.

### Visual và chất lượng

- Kiểm tra ở chiều rộng 375px, 390px và desktop.
- Không overflow ngang.
- Timer, Pause và Finish dễ thấy.
- Mascot không lấn át timer.
- Touch, keyboard, text zoom và reduced motion hoạt động.
- Không còn asset 404, lỗi encoding hoặc nút không có hành vi.
- Phân biệt kiểm thử mô phỏng mobile với kiểm thử iPhone thật trong báo cáo bàn giao.

---

## 14. Chỉ dẫn cho chat tiếp nhận

> Đọc tài liệu này như yêu cầu sản phẩm hiện hành. Kiểm tra project thực tế trước khi sửa và tiếp tục từ phần chưa hoàn thành. Không khởi tạo lại app, không đưa countdown hay sign-in trở lại. Ưu tiên Today → count-up Focus → completion, visual theo Duolingo/DesignMD, baskets và weekly review. Người dùng đã chọn truy cập bằng link bí mật và ngân sách $0 chi phí định kỳ bổ sung. Không cần hỏi lại các quyết định đã chốt. Báo rõ phần đã kiểm thử, phần chưa kiểm thử và blocker triển khai nếu có.

**Định nghĩa thành công:** mở app dễ dàng, bắt đầu một task bằng một lần bấm, timer giữ đúng trạng thái giữa các thiết bị, hoàn thành tạo cảm giác tích cực và người dùng nhìn được thời gian trong tuần đã đi vào những mục tiêu nào.
