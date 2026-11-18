/**
 * Dữ liệu lời chúc 19/11 - Ngày Quốc Tế Nam Giới
 */

// Danh sách lời chúc riêng mặc định cho từng người (Đồng bộ với data/wishes.json)
const defaultCustomWishes = [
  {
    id: "1794990913934",
    name: "Gia Quyết",
    title: "Tài Năng Trẻ Triển Vọng & Tương Lai Bứt Phá",
    wish: "Chúc Quyết luôn mạnh khỏe, vui vẻ và gặp nhiều may mắn nhé! Chúc Quyết có khoảng thời gian thực tập thật nhiều trải nghiệm bổ ích, học hỏi được nhiều điều mới và ngày càng tiến bộ trong công việc. Mong Quyết sẽ tự tin, cởi mở hơn, có thêm nhiều cơ hội giao lưu và kết nối với mọi người trong công ty. Chúc Quyết sớm hoàn thành tốt kỳ thực tập nhé!",
    keywords: ["gia quyết", "gia quyet", "quyết", "quyet"]
  },
  {
    id: "1794990873877",
    name: "Ngô Thành Nam",
    title: "Chiến Binh Trẻ Bản Lĩnh & Kiên Định",
    wish: "Chúc Nam luôn vui vẻ, mạnh khỏe và có thật nhiều năng lượng nhé! Chúc Nam vừa hoàn thành tốt công việc thực tập, vừa hoàn thành đồ án thật suôn sẻ và đạt kết quả như mong muốn. Mong Nam ngày càng tự tin, bản lĩnh hơn, mạnh dạn thể hiện quan điểm và tích lũy thêm nhiều kinh nghiệm. Hy vọng Nam sẽ sớm hoàn thành tốt kỳ thực tập và tiếp tục phát triển thật tốt trong công việc nhé!",
    keywords: ["ngô thành nam", "ngo thanh nam", "nam", "thành nam", "thanh nam"]
  },
  {
    id: "1794990856878",
    name: "Lê Minh Hiếu",
    title: "Quý Ông Phong Độ & Tinh Thần Tích Cực",
    wish: "Chúc Hiếu luôn mạnh khỏe, vui vẻ và gặp nhiều may mắn trong công việc cũng như cuộc sống nhé! Chúc Hiếu tiếp tục giữ vững phong độ, làm việc hiệu quả, phát huy khả năng của mình và ngày càng có thêm nhiều thành công. Mong Hiếu luôn giữ được tinh thần tích cực, mọi chuyện đều vui vẻ, thuận lợi. Chúc tình yêu luôn ngọt ngào và có thật nhiều niềm vui trong chặng đường sắp tới nhé!",
    keywords: ["lê minh hiếu", "le minh hieu", "hiếu", "hieu", "minh hiếu", "minh hieu"]
  },
  {
    id: "1794990809694",
    name: "Trần Minh Hoàng",
    title: "Giám Đốc Tầm Nhìn & Thuyền Trưởng Bản Lĩnh",
    wish: "Chúc anh Hoàng luôn mạnh khỏe, vui vẻ và giữ được thật nhiều năng lượng tích cực trong công việc cũng như cuộc sống. Chúc anh luôn vững vàng trước những áp lực công việc, mọi kế hoạch và dự định đều thuận lợi, suôn sẻ. Mong anh có thêm nhiều thời gian nghỉ ngơi, cân bằng giữa công việc và cuộc sống, đồng thời chúc gia đình anh luôn hạnh phúc, ấm êm và nhiều niềm vui !",
    keywords: ["trần minh hoàng", "tran minh hoang", "hoàng", "hoang", "anh hoàng", "anh hoang", "sếp hoàng", "sep hoang", "giám đốc hoàng", "giam doc hoang", "giám đốc", "giam doc", "minh hoàng", "minh hoang"]
  },
  {
    id: "1794990772023",
    name: "Nguyễn Quang Tiệp",
    title: "Chiến Thần Chăm Chỉ & Chu Đáo Tận Tâm",
    wish: "Chúc Tiệp luôn mạnh khỏe, vui vẻ và gặp nhiều điều may mắn trong cuộc sống nhé! Mong Tiệp luôn giữ được sự chăm chỉ, chu đáo và nhiệt tình trong công việc, nhưng cũng đừng mải mê tăng ca quá mà quên dành thời gian cho bản thân. Chúc công việc ngày càng thuận lợi, mọi dự định đều suôn sẻ và chuyện tình cảm cũng sớm có tín hiệu tốt đẹp nhé!",
    keywords: ["nguyễn quang tiệp", "nguyen quang tiep", "tiệp", "tiep", "quang tiệp", "quang tiep"]
  },
  {
    id: "1794990756374",
    name: "Phạm Đức Huy",
    title: "Chuyên Gia QC & Người Gác Cổng Chất Lượng",
    wish: "Chúc Huy luôn vui vẻ, mạnh khỏe và gặp thật nhiều may mắn nhé! Chúc Huy công việc ngày càng thuận lợi, dù phải đảm nhận nhiều vai trò từ tester đến hỗ trợ vận hành nhưng vẫn luôn giữ được sự chăm chỉ và nhiệt tình như hiện tại. Đi làm xa cũng nhớ giữ gìn sức khỏe, đừng để bản thân quá vất vả nhé. Chúc chuyện tình cảm đang tìm hiểu sớm có kết quả tốt đẹp và mọi điều đều suôn sẻ!",
    keywords: ["phạm đức huy", "pham duc huy", "huy", "đức huy", "duc huy", "anh huy", "qc huy", "huy qc", "tester huy"]
  },
  {
    id: "1794982956115",
    name: "Nguyễn Lê Vinh",
    title: "Thủ Lĩnh Tận Tâm & Người Anh Cả Tuyệt Vời",
    wish: "Nhân ngày 19/11, chúc anh luôn mạnh khỏe, vui vẻ và gặp nhiều may mắn trong công việc cũng như cuộc sống. Cảm ơn anh vì luôn quan tâm đến từng nhân viên của phòng IT nói chung, lắng nghe và hỗ trợ mọi người giải quyết các vấn đề trong công việc, cuộc sống. Chúc anh công việc ngày càng thuận lợi, gia đình luôn hạnh phúc, bình an và có thật nhiều thời gian vui vẻ bên những người thân yêu.",
    keywords: ["nguyễn lê vinh", "nguyen le vinh", "vinh", "anh vinh", "sếp vinh", "sep vinh", "lê vinh", "le vinh"]
  },
  {
    id: "1",
    name: "Nguyễn Văn Thanh",
    title: "Chiến Thần Bản Lĩnh & Trách Nhiệm Hết Mình",
    wish: "Nhân ngày 19/11, chúc anh Thanh luôn mạnh khỏe, vui vẻ và gặp nhiều may mắn trong cuộc sống. Chúc anh công việc luôn thuận lợi, mọi kế hoạch đều suôn sẻ và giữ mãi tinh thần trách nhiệm, nhiệt huyết như hiện tại. Chúc anh và gia đình luôn có thật nhiều niềm vui, cuộc sống đủ đầy, mọi việc đều như ý. Mong anh lúc nào cũng tràn đầy năng lượng và có nhiều khoảnh khắc vui vẻ bên mọi người nhé!",
    keywords: ["nguyễn văn thanh", "nguyễn văn thành", "nguyen van thanh", "thanh", "thành", "anh thanh", "anh thành", "văn thanh", "van thanh"]
  },
  {
    id: "2",
    name: "Nguyễn Đình Đại",
    title: "Chàng Trai Tinh Tế & Cây Hài Đầy Nhiệt Huyết",
    wish: "Chúc Đại luôn vui vẻ, mạnh khỏe và gặp thật nhiều may mắn nhé! Mong Đại lúc nào cũng giữ được sự nhiệt tình, tinh tế và tốt bụng, luôn được mọi người yêu quý như cách Đại vẫn nhiệt tình giúp đỡ mọi người. Chúc công việc thuận lợi, code ít bug, deadline luôn nhẹ nhàng và đặc biệt là sớm tìm được một nửa phù hợp để không còn cô đơn nữa nhé!",
    keywords: ["nguyễn đình đại", "nguyen dinh dai", "đại", "dai", "đình đại", "dinh dai", "anh đại"]
  },
  {
    id: "3",
    name: "Phùng Văn Hưng",
    title: "Cây Hài Duyên Dáng & Cao Thủ Clean Code",
    wish: "Chúc Hưng luôn vui vẻ, mạnh khỏe, công việc thuận lợi, code đâu chuẩn đó, không bug không lỗi nhé! Mong Hưng lúc nào cũng giữ được sự vui tính, hòa đồng và năng lượng tích cực để mang lại nhiều tiếng cười cho mọi người. Chúc Hưng luôn có trà sữa để uống, tình yêu lúc nào cũng ngọt ngào và sớm đạt được ước mơ có thật nhiều vợ",
    keywords: ["phùng văn hưng", "phung van hung", "hưng", "hung", "văn hưng", "van hung", "anh hưng"]
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
