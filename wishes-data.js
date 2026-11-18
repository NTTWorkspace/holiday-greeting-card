/**
 * Dữ liệu lời chúc 19/11 - Ngày Quốc Tế Nam Giới
 */

// Danh sách lời chúc riêng mặc định cho từng người (có thể mở rộng qua giao diện Quản trị)
const defaultCustomWishes = [
  {
    name: "Nguyễn Văn Thành",
    keywords: ["thanh", "nguyen van thanh", "anh thanh", "thành"],
    title: "Chiến Thần Bản Lĩnh & Người Anh Đáng Tin Cậy",
    wish: "Chúc anh Thành ngày 19/11 ngập tràn niềm vui, công việc hanh thông, luôn giữ vững phong độ đỉnh cao và là chỗ dựa vững chắc cho mọi người!"
  },
  {
    name: "Trần Đức Huy",
    keywords: ["huy", "tran duc huy", "anh huy"],
    title: "Quý Ông Đa Tài & Nhiệt Huyết",
    wish: "Chúc Huy ngày 19/11 luôn tươi vui, thăng tiến vù vù trong sự nghiệp, sớm đạt được mọi mục tiêu lớn và luôn giữ nụ cười tỏa nắng nhé!"
  },
  {
    name: "Lê Hoàng Long",
    keywords: ["long", "le hoang long", "anh long"],
    title: "Thủ Lĩnh Tiên Phong & Trí Tuệ",
    wish: "Nhân ngày Quốc tế Đàn ông 19/11, chúc Long luôn tràn đầy năng lượng tích cực, trí lực phi phàm, gặt hái thêm nhiều thành tựu rực rỡ!"
  }
];

// Kho lời chúc phong phú tự động dành cho người chưa có lời chúc riêng (hoặc đổi lời chúc)
const defaultWishPool = [
  {
    category: "Tôn vinh & Trân trọng",
    title: "Quý Ông Đích Thực",
    wish: "Nhân ngày 19/11 - Quốc tế Đàn ông, chúc bạn luôn giữ vững bản lĩnh, sự tự tin và sự kiên cường. Cảm ơn bạn vì luôn là điểm tựa vững chãi và mang lại những giá trị tuyệt vời cho những người xung quanh!"
  },
  {
    category: "Sự nghiệp & Tài lộc",
    title: "Chiến Binh Bất Bại",
    wish: "Chúc bạn ngày 19/11 sự nghiệp thăng hoa như diều gặp gió, tài lộc dồi dào, đánh đâu thắng đó, mọi quyết định đều chuẩn xác và đại thành công!"
  },
  {
    category: "Hài hước & Độc lạ",
    title: "Nam Thần Hoàn Hảo",
    wish: "19/11 chúc đồng chí: Đẹp trai không góc chết, ví dày không đáy, deadline tự né, bug tự tan và hôm nay có đặc quyền được yêu thương, chiều chuộng 100%!"
  },
  {
    category: "Ấm áp & Chân thành",
    title: "Người Đàn Ông Tuyệt Vời",
    wish: "Đàn ông cũng có những lúc mỏi mệt, nhưng hôm nay hãy tạm gác lại âu lo để tận hưởng ngày của riêng mình. Chúc bạn luôn bình an trong tâm hồn, dồi dào sức khỏe và luôn được hạnh phúc bao bọc!"
  },
  {
    category: "Năng lượng & Đam mê",
    title: "Cảm Hứng Bất Tận",
    wish: "Chúc bạn tuổi mới ngày mới luôn rực cháy đam mê, không ngừng chinh phục những đỉnh cao mới và luôn là phiên bản tự hào nhất của chính mình!"
  }
];
