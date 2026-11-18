/**
 * Dữ liệu lời chúc 19/11 - Ngày Quốc Tế Nam Giới
 */

// Danh sách lời chúc riêng mặc định cho từng người (Đồng bộ với data/wishes.json)
const defaultCustomWishes = [
  {
    id: "1794982956115",
    name: "Nguyễn Lê Vinh",
    title: "Thủ Lĩnh Tận Tâm & Người Anh Cả Tuyệt Vời",
    wish: "Nhân ngày 19/11, chúc anh luôn mạnh khỏe, vui vẻ và gặp nhiều may mắn trong công việc cũng như cuộc sống. Cảm ơn anh vì luôn quan tâm đến từng nhân viên của phòng IT nói chung, lắng nghe và hỗ trợ mọi người giải quyết các vấn đề trong công việc, cuộc sống. Chúc anh công việc ngày càng thuận lợi, gia đình luôn hạnh phúc, bình an và có thật nhiều thời gian vui vẻ bên những người thân yêu.",
    keywords: ["nguyễn lê vinh", "vinh", "anh vinh", "sếp vinh", "sep vinh", "le vinh"]
  },
  {
    id: "1",
    name: "Nguyễn Văn Thanh",
    title: "Chiến Thần Bản Lĩnh & Nhiệt Huyết",
    wish: "Nhân ngày 19/11, chúc anh Thanh luôn mạnh khỏe, vui vẻ và gặp nhiều may mắn trong cuộc sống. Chúc anh công việc luôn thuận lợi, mọi kế hoạch đều suôn sẻ và giữ mãi tinh thần trách nhiệm, nhiệt huyết như hiện tại. Chúc anh và gia đình luôn có thật nhiều niềm vui, cuộc sống đủ đầy, mọi việc đều như ý. Mong anh lúc nào cũng tràn đầy năng lượng và có nhiều khoảnh khắc vui vẻ bên mọi người nhé!",
    keywords: ["nguyễn văn thanh", "nguyễn văn thành", "thanh", "thành", "anh thanh", "anh thành", "van thanh"]
  },
  {
    id: "2",
    name: "Trần Đức Huy",
    title: "Quý Ông Đa Tài & Nhiệt Huyết",
    wish: "Chúc Huy ngày 19/11 luôn tươi vui, thăng tiến vù vù trong sự nghiệp, sớm đạt được mọi mục tiêu lớn và luôn giữ nụ cười tỏa nắng nhé!",
    keywords: ["huy", "tran duc huy", "anh huy", "đức huy", "duc huy"]
  },
  {
    id: "3",
    name: "Lê Hoàng Long",
    title: "Thủ Lĩnh Tiên Phong & Trí Tuệ",
    wish: "Nhân ngày Quốc tế Đàn ông 19/11, chúc Long luôn tràn đầy năng lượng tích cực, trí lực phi phàm, gặt hái thêm nhiều thành tựu rực rỡ!",
    keywords: ["long", "le hoang long", "anh long", "hoàng long", "hoang long"]
  }
];

// Kho lời chúc phong phú tự động dành cho người chưa có lời chúc riêng
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
