export interface SentenceExample {
  id: string;
  chinese: string;
  pinyin: string;
  vietnamese: string;
  breakdown?: string;
  keyPhrases?: string[];
}

export interface VocabularyItem {
  id: number;
  word: string;
  pinyin: string;
  vietnamese: string;
  usageGuide: string;
  commonCollocations: string[];
  sentences: SentenceExample[];
  icon: string;
}

export interface ScenarioRole {
  roleId: string;
  roleName: string;
  roleDescription: string;
  avatar: string;
}

export interface RoleplayScenario {
  id: string;
  number: number;
  title: string;
  titleChinese: string;
  tagline: string;
  context: string;
  roles: {
    student: ScenarioRole;
    ai: ScenarioRole;
  };
  targetVocabulary: string[];
  speakingRequirements: string[];
  suggestedPhrases: {
    chinese: string;
    pinyin: string;
    vietnamese: string;
  }[];
  initialAiGreeting: {
    chinese: string;
    pinyin: string;
    vietnamese: string;
  };
}

export const VOCABULARY_LIST: VocabularyItem[] = [
  {
    id: 1,
    word: "机场",
    pinyin: "jīchǎng",
    vietnamese: "Sân bay",
    icon: "Plane",
    usageGuide: "Thường dùng với các động từ 去 (đi), 到 (đến), 离开 (rời khỏi).",
    commonCollocations: ["去机场 (đi sân bay)", "到机场 (đến sân bay)", "机场候机室 (phòng chờ sân bay)", "首都机场 (sân bay thủ đô)"],
    sentences: [
      {
        id: "1-1",
        chinese: "因为我家离机场比较远，所以我明天早上六点就得起床出发，不然就会赶不上飞机。",
        pinyin: "Yīnwèi wǒ jiā lí jīchǎng bǐjiào yuǎn, suǒyǐ wǒ míngtiān zǎoshang liù diǎn jiù děi qǐchuáng chūfā, bùrán jiù huì gǎnbushàng fēijī.",
        vietnamese: "Vì nhà tôi cách sân bay khá xa, nên sáng mai 6 giờ tôi phải dậy xuất phát, nếu không sẽ không kịp máy bay.",
        breakdown: "离...比较远 (cách... khá xa) | 就得 (buộc phải) | 不然 (nếu không) | 赶不上 (không kịp)"
      },
      {
        id: "1-2",
        chinese: "到了机场以后，我们要先找到正确的航空公司柜台，然后再去办理登机手续。",
        pinyin: "Dàole jīchǎng yǐhòu, wǒmen yào xiān zhǎodào zhèngquè de hángkōng gōngsī guìtái, ránhòu zài qù bànlǐ dēngjī shǒuxù.",
        vietnamese: "Sau khi đến sân bay, chúng ta phải tìm đúng quầy của hãng hàng không trước, sau đó mới đi làm thủ tục lên máy bay.",
        breakdown: "先...然后再... (trước tiên... sau đó mới...) | 正确 (chính xác) | 柜台 (quầy) | 办理手续 (làm thủ tục)"
      },
      {
        id: "1-3",
        chinese: "如果飞机晚点，我们只能一直在机场的候机室里等待广播通知。",
        pinyin: "Rúguǒ fēijī wǎndiǎn, wǒmen zhǐ néng yīzhí zài jīchǎng de hòujīshì lǐ děngdài guāngbō tōngzhī.",
        vietnamese: "Nếu máy bay bị muộn, chúng ta chỉ có thể chờ thông báo phát thanh trong phòng chờ của sân bay.",
        breakdown: "如果 (nếu) | 晚点 (muộn/delay) | 候机室 (phòng chờ lên máy bay) | 广播通知 (thông báo loa phát thanh)"
      }
    ]
  },
  {
    id: 2,
    word: "航班",
    pinyin: "hángbān",
    vietnamese: "Chuyến bay",
    icon: "Send",
    usageGuide: "Dùng để chỉ chuyến bay cụ thể. Thường đi với 取消 (hủy), 晚点 (muộn), 起飞 (cất cánh).",
    commonCollocations: ["航班取消 (chuyến bay bị hủy)", "航班晚点 (chuyến bay trễ)", "乘坐航班 (đi chuyến bay)", "直达航班 (chuyến bay thẳng)"],
    sentences: [
      {
        id: "2-1",
        chinese: "由于今天北京有大雪，所以飞往北京的航班不仅取消了，而且我们还得重新买票。",
        pinyin: "Yóuyú jīntiān Běijīng yǒu dàxuě, suǒyǐ fēi wǎng Běijīng de hángbān bùjǐn qǔxiāole, érqiě wǒmen hái děi chóngxīn mǎi piào.",
        vietnamese: "Do hôm nay Bắc Kinh có tuyết lớn, nên chuyến bay đi Bắc Kinh không chỉ bị hủy, mà chúng tôi còn phải mua lại vé.",
        breakdown: "由于...所以... (do... cho nên...) | 不仅...而且... (không những... mà còn...) | 重新 (làm lại/mua lại)"
      },
      {
        id: "2-2",
        chinese: "请各位乘客注意，您乘坐的航班马上就要起飞了，请带好您的随身物品准备登机。",
        pinyin: "Qǐng gèwèi chéngkè zhùyì, nín chéngzuò de hángbān mǎshàng jiù yào qǐfēile, qǐng dài hǎo nín de suíshēn wùpǐn zhǔnbèi dēngjī.",
        vietnamese: "Xin chú ý các hành khách, chuyến bay của quý vị sắp cất cánh, vui lòng mang theo đồ dùng cá nhân chuẩn bị lên máy bay.",
        breakdown: "各位乘客 (quý hành khách) | 马上就要 (sắp sửa) | 起飞 (cất cánh) | 随身物品 (vật dụng tùy thân)"
      },
      {
        id: "2-3",
        chinese: "我查了一下手机上的软件，发现我的航班要晚点两个小时，所以我打算先去吃碗面条。",
        pinyin: "Wǒ chále yīxià shǒujī shang de ruǎnjiàn, fāxiàn wǒ de hángbān yào wǎndiǎn liǎng gè xiǎoshí, suǒyǐ wǒ dǎsuàn xiān qù chī wǎn miàntiáo.",
        vietnamese: "Tôi tra phần mềm trên điện thoại, phát hiện chuyến bay của tôi bị muộn hai tiếng, nên tôi định đi ăn bát mì trước.",
        breakdown: "查了一下 (tra một chút) | 软件 (phần mềm/ứng dụng) | 晚点两个小时 (chậm 2 tiếng) | 打算 (dự định)"
      }
    ]
  },
  {
    id: 3,
    word: "机票",
    pinyin: "jīpiào",
    vietnamese: "Vé máy bay",
    icon: "Ticket",
    usageGuide: "Đi với 订 (đặt), 买 (mua), 退 (hủy/trả). Lưu ý: Vé máy bay giấy dùng lượng từ 张 (zhāng).",
    commonCollocations: ["订机票 (đặt vé máy bay)", "退机票 (trả/hủy vé máy bay)", "一张机票 (một tấm vé máy bay)", "特价机票 (vé máy bay giá rẻ)"],
    sentences: [
      {
        id: "3-1",
        chinese: "因为现在是旅游旺季，所以机票的价格比平时贵了很多，我好不容易才抢到一张。",
        pinyin: "Yīnwèi xiànzài shì lǚyóu wàngjì, suǒyǐ jīpiào de jiàgé bǐ píngshí guìle hěnduō, wǒ hǎobù róngyì cái qiǎng dào yī zhāng.",
        vietnamese: "Vì bây giờ là mùa du lịch cao điểm, nên giá vé máy bay đắt hơn bình thường rất nhiều, tôi vất vả lắm mới săn được một tấm.",
        breakdown: "旅游旺季 (mùa du lịch cao điểm) | 比平时贵 (đắt hơn bình thường) | 好不容易才 (khó khăn lắm mới) | 抢到 (săn được)"
      },
      {
        id: "3-2",
        chinese: "我们在网上订好机票以后，一定要记得把行程单打印出来或者保存在手机里。",
        pinyin: "Wǒmen zài wǎngshang dìng hǎo jīpiào yǐhòu, yīdìng yào jìde bǎ xíngchéngdān dǎyìn chūlái huòzhě bǎocún zài shǒujī lǐ.",
        vietnamese: "Sau khi đặt vé máy bay trên mạng xong, chúng ta nhất định phải nhớ in lịch trình ra hoặc lưu trong điện thoại.",
        breakdown: "订好 (đặt xong) | 行程单 (phiếu hành trình) | 打印 (in ra) | 保存 (lưu trữ)"
      },
      {
        id: "3-3",
        chinese: "如果临时改变计划，退机票的手续费非常高，所以我建议你确定好时间再买。",
        pinyin: "Rúguǒ línshí gǎibiàn jìhuà, tuì jīpiào de shǒuxùfèi fēicháng gāo, suǒyǐ wǒ jiànyì nǐ quèdìng hǎo shíjiān zài mǎi.",
        vietnamese: "Nếu tạm thời thay đổi kế hoạch, phí hủy vé máy bay rất cao, nên tôi khuyên bạn xác định rõ thời gian rồi hãy mua.",
        breakdown: "临时 (tạm thời) | 手续费 (phí thủ tục) | 建议 (khuyên/gợi ý) | 确定好 (xác định rõ)"
      }
    ]
  },
  {
    id: 4,
    word: "回程机票",
    pinyin: "huíchéng jīpiào",
    vietnamese: "Vé về (khứ hồi chiều về)",
    icon: "Repeat",
    usageGuide: "Thường được hải quan yêu cầu xuất trình khi làm thủ tục nhập cảnh.",
    commonCollocations: ["出示回程机票 (xuất trình vé về)", "买回程机票 (mua vé về)", "回程机票订单 (đơn đặt vé về)"],
    sentences: [
      {
        id: "4-1",
        chinese: "入境的时候，海关工作人员不仅看了我的签证，还要求我出示回程机票的订单。",
        pinyin: "Rùjìng de shíhou, hǎiguān gōngzuò rényuán bùjǐn kànle wǒ de qiānzhèng, hái yāoqiú wǒ chūshì huíchéng jīpiào de dìngdān.",
        vietnamese: "Khi nhập cảnh, nhân viên hải quan không chỉ xem visa của tôi, mà còn yêu cầu tôi xuất trình đơn đặt vé về.",
        breakdown: "海关工作人员 (nhân viên hải quan) | 要求 (yêu cầu) | 出示 (xuất trình) | 订单 (đơn hàng/đặt chỗ)"
      },
      {
        id: "4-2",
        chinese: "虽然我已经买好了回程机票，但是因为天气原因，我有点担心到时候飞机会延误。",
        pinyin: "Suīrán wǒ yǐjīng mǎi hǎole huíchéng jīpiào, dànshì yīnwèi tiānqì yuányīn, wǒ yǒudiǎn dānxīn dào shíhou fēijī huì yánwù.",
        vietnamese: "Tuy tôi đã mua xong vé về, nhưng vì lý do thời tiết, tôi hơi lo lắng lúc đó máy bay sẽ bị hoãn.",
        breakdown: "虽然...但是... (tuy... nhưng...) | 天气原因 (nguyên nhân thời tiết) | 延误 (hoãn/chậm trễ)"
      },
      {
        id: "4-3",
        chinese: "买回程机票的时候，最好选择下午的航班，这样上午我们还能在酒店附近逛一逛。",
        pinyin: "Mǎi huíchéng jīpiào de shíhou, zuì hǎo xuǎnzé xiàwǔ de hángbān, zhèyàng shàngwǔ wǒmen hái néng zài jiǔdiàn fùjìn guàng yī guàng.",
        vietnamese: "Khi mua vé về, tốt nhất nên chọn chuyến bay buổi chiều, như vậy buổi sáng chúng ta vẫn có thể dạo quanh khách sạn.",
        breakdown: "最好 (tốt nhất) | 选择 (lựa chọn) | 这样 (như vậy) | 逛一逛 (đi dạo loanh quanh)"
      }
    ]
  },
  {
    id: 5,
    word: "护照",
    pinyin: "hùzhào",
    vietnamese: "Hộ chiếu",
    icon: "BookOpen",
    usageGuide: "Vật bất ly thân khi ra nước ngoài. Thường dùng với 拿 (cầm), 带 (mang), 丢 (mất).",
    commonCollocations: ["带护照 (mang hộ chiếu)", "护照过期 (hộ chiếu hết hạn)", "补办护照 (làm lại hộ chiếu)", "保管护照 (bảo quản hộ chiếu)"],
    sentences: [
      {
        id: "5-1",
        chinese: "出门旅游的时候，你千万要把护照放在安全的地方，如果弄丢了会非常麻烦。",
        pinyin: "Chūmén lǚyóu de shíhou, nǐ qiānwàn yào bǎ hùzhào fàng zài ānquán de dìfang, rúguǒ nòng diūle huì fēicháng máfan.",
        vietnamese: "Khi ra ngoài du lịch, bạn ngàn vạn lần phải để hộ chiếu ở nơi an toàn, nếu làm mất sẽ vô cùng rắc rối.",
        breakdown: "千万 (nhất định/ngàn vạn lần) | 安全的地方 (nơi an toàn) | 弄丢 (làm mất) | 麻烦 (rắc rối)"
      },
      {
        id: "5-2",
        chinese: "办理托运的工作人员把我的护照和登机牌一起还给了我，并提醒我拿好。",
        pinyin: "Bànlǐ tuōyùn de gōngzuò rényuán bǎ wǒ de hùzhào hé dēngjīpái yīqǐ huán gěile wǒ, bìng tíxǐng wǒ ná hǎo.",
        vietnamese: "Nhân viên làm thủ tục ký gửi trả lại hộ chiếu và thẻ lên máy bay cho tôi, đồng thời nhắc tôi cầm cho chắc.",
        breakdown: "还给 (trả lại) | 并 (đồng thời) | 提醒 (nhắc nhở) | 拿好 (cầm chắc/giữ kỹ)"
      },
      {
        id: "5-3",
        chinese: "因为他的护照快过期了，所以他必须在出发前一个月去大使馆办理新的。",
        pinyin: "Yīnwèi tā de hùzhào kuài guòqīle, suǒyǐ tā bìxū zài chūfā qián yí gè yuè qù dàshǐguǎn bànlǐ xīn de.",
        vietnamese: "Vì hộ chiếu của anh ấy sắp hết hạn, nên anh ấy phải đến đại sứ quán làm cái mới một tháng trước khi khởi hành.",
        breakdown: "快过期了 (sắp hết hạn) | 必须 (bắt buộc) | 大使馆 (đại sứ quán)"
      }
    ]
  },
  {
    id: 6,
    word: "签证",
    pinyin: "qiānzhèng",
    vietnamese: "Visa / Thị thực",
    icon: "FileCheck",
    usageGuide: "Đi với 办 (làm), 申请 (xin), 过期 (hết hạn).",
    commonCollocations: ["办签证 (làm visa)", "申请签证 (xin visa)", "多次往返签证 (visa nhập cảnh nhiều lần)", "旅游签证 (visa du lịch)"],
    sentences: [
      {
        id: "6-1",
        chinese: "去中国旅游需要提前申请签证，如果没有签证，连飞机都上不去。",
        pinyin: "Qù Zhōngguó lǚyóu xūyào tíqián shēnqǐng qiānzhèng, rúguǒ méiyǒu qiānzhèng, lián fēijī dōu shàng bu qù.",
        vietnamese: "Đi du lịch Trung Quốc cần xin visa trước, nếu không có visa, đến máy bay cũng không lên được.",
        breakdown: "提前 (trước thời hạn) | 连...都... (đến cả... cũng...) | 上不去 (không lên nổi)"
      },
      {
        id: "6-2",
        chinese: "我的签证是多次往返的，所以明年我还可以再去中国拜访我的朋友。",
        pinyin: "Wǒ de qiānzhèng shì duōcì wǎngfǎn de, suǒyǐ míngnián wǒ hái kěyǐ zài qù Zhōngguó bàifǎng wǒ de péngyou.",
        vietnamese: "Visa của tôi là loại nhập cảnh nhiều lần, nên năm sau tôi vẫn có thể đến Trung Quốc thăm bạn tôi.",
        breakdown: "多次往返 (nhiều lần đi về) | 拜访 (thăm hỏi)"
      },
      {
        id: "6-3",
        chinese: "海关官员看了一眼我的签证，问了我来中国的目的，然后就盖章让我过去了。",
        pinyin: "Hǎiguān guānyuán kànle yīyǎn wǒ de qiānzhèng, wènle wǒ lái Zhōngguó de mùdì, ránhòu jiù gài zhāng ràng wǒ guòqùle.",
        vietnamese: "Nhân viên hải quan liếc nhìn visa của tôi, hỏi mục đích tôi đến Trung Quốc, sau đó đóng dấu cho tôi qua.",
        breakdown: "看了一眼 (nhìn lướt qua một cái) | 目的 (mục đích) | 盖章 (đóng dấu)"
      }
    ]
  },
  {
    id: 7,
    word: "行李",
    pinyin: "xínglǐ",
    vietnamese: "Hành lý",
    icon: "Luggage",
    usageGuide: "Đi với 收拾 (dọn dẹp/sắp xếp), 拿 (lấy), 超重 (quá cân).",
    commonCollocations: ["收拾行李 (thu xếp hành lý)", "随身行李 (hành lý xách tay)", "托运行李 (hành lý ký gửi)", "行李超重 (hành lý quá cân)"],
    sentences: [
      {
        id: "7-1",
        chinese: "因为我要在中国住半个月，所以我的行李特别多，装满了整整一个大箱子。",
        pinyin: "Yīnwèi wǒ yào zài Zhōngguó zhù bàn gè yuè, suǒyǐ wǒ de xínglǐ tèbié duō, zhuāng mǎnle zhěngzhěng yí gè dà xiāngzi.",
        vietnamese: "Vì tôi sẽ ở Trung Quốc nửa tháng, nên hành lý của tôi đặc biệt nhiều, đựng đầy cả một chiếc vali to.",
        breakdown: "半个月 (nửa tháng) | 装满 (nhét đầy) | 整整 (trọn vẹn) | 箱子 (vali/thùng)"
      },
      {
        id: "7-2",
        chinese: "下了飞机以后，我们要先去行李转盘那里等我们的箱子，然后再去打车。",
        pinyin: "Xiàle fēijī yǐhòu, wǒmen yào xiān qù xínglǐ zhuànpán nàlǐ děng wǒmen de xiāngzi, ránhòu zài qù dǎchē.",
        vietnamese: "Sau khi xuống máy bay, chúng ta phải đến băng chuyền hành lý đợi vali của mình trước, sau đó mới đi bắt taxi.",
        breakdown: "行李转盘 (băng chuyền hành lý xoay) | 打车 (bắt xe taxi)"
      },
      {
        id: "7-3",
        chinese: "如果您的行李超过了航空公司的规定重量，您就需要额外支付一笔费用。",
        pinyin: "Rúguǒ nín de xínglǐ chāoguòle hángkōng gōngsī de guīdìng zhòngliàng, nín jiù xūyào éwài zhīfù yībǐ fèiyòng.",
        vietnamese: "Nếu hành lý của bạn vượt quá trọng lượng quy định của hãng hàng không, bạn sẽ cần phải trả thêm một khoản phí.",
        breakdown: "规定重量 (trọng lượng quy định) | 额外 (ngoài mức/thêm) | 支付费用 (trả chi phí)"
      }
    ]
  },
  {
    id: 8,
    word: "托运",
    pinyin: "tuōyùn",
    vietnamese: "Ký gửi",
    icon: "PackageCheck",
    usageGuide: "Động từ chỉ việc gửi hành lý. Thường dùng 办理托运 (làm thủ tục ký gửi).",
    commonCollocations: ["办理托运 (làm thủ tục ký gửi)", "托运行李 (hành lý ký gửi)", "免费托运 (ký gửi miễn phí)"],
    sentences: [
      {
        id: "8-1",
        chinese: "因为我的箱子里有液体化妆品，所以不能带上飞机，必须办理托运。",
        pinyin: "Yīnwèi wǒ de xiāngzi lǐ yǒu yètǐ huàzhuāngpǐn, suǒyǐ bù néng dài shàng fēijī, bìxū bànlǐ tuōyùn.",
        vietnamese: "Vì trong vali tôi có mỹ phẩm dạng lỏng, nên không thể mang lên máy bay, bắt buộc phải làm thủ tục ký gửi.",
        breakdown: "液体化妆品 (mỹ phẩm dạng lỏng) | 带上飞机 (mang lên máy bay) | 办理托运 (làm thủ tục ký gửi)"
      },
      {
        id: "8-2",
        chinese: "我们先把大件托运了，然后只拿着随身的小包去安检，这样会轻松很多。",
        pinyin: "Wǒmen xiān bǎ dàjiàn tuōyùnle, ránhòu zhǐ názhe suíshēn de xiǎobāo qù ānjiǎn, zhèyàng huì qīngsōng hěnduō.",
        vietnamese: "Chúng ta ký gửi đồ cỡ lớn trước, sau đó chỉ cầm túi nhỏ xách tay đi qua kiểm tra an ninh, như vậy sẽ nhẹ nhàng hơn nhiều.",
        breakdown: "大件 (đồ kiện lớn) | 随身小包 (túi xách nhỏ tùy thân) | 安检 (kiểm tra an ninh) | 轻松 (nhẹ nhõm)"
      },
      {
        id: "8-3",
        chinese: "办理托运的时候，工作人员会在你的箱子上贴一个标签，你一定要确认目的地是对的。",
        pinyin: "Bànlǐ tuōyùn de shíhou, gōngzuò rényuán huì zài nǐ de xiāngzi shang tiē yí gè biāoqiān, nǐ yīdìng yào quèrèn mùdìdì shì duì de.",
        vietnamese: "Khi làm thủ tục ký gửi, nhân viên sẽ dán một nhãn lên vali của bạn, bạn nhất định phải xác nhận điểm đến là đúng.",
        breakdown: "贴标签 (dán nhãn tem) | 确认 (xác nhận) | 目的地 (điểm đến)"
      }
    ]
  },
  {
    id: 9,
    word: "值机",
    pinyin: "zhíjī",
    vietnamese: "Check-in (Làm thủ tục lên máy bay)",
    icon: "UserCheck",
    usageGuide: "Có thể làm online (网上值机) hoặc tại quầy (柜台值机), hoặc máy tự động (自助值机).",
    commonCollocations: ["网上值机 (check-in trực tuyến)", "柜台值机 (check-in tại quầy)", "自助值机 (tự làm check-in)"],
    sentences: [
      {
        id: "9-1",
        chinese: "为了避免在机场排长队，我提前一天在手机软件上完成了值机手续。",
        pinyin: "Wèile bìmiǎn zài jīchǎng pái chángduì, wǒ tíqián yī tiān zài shǒujī ruǎnjiàn shang wánchéngle zhíjī shǒuxù.",
        vietnamese: "Để tránh xếp hàng dài ở sân bay, tôi đã hoàn thành thủ tục check-in trên phần mềm điện thoại trước một ngày.",
        breakdown: "避免 (tránh) | 排长队 (xếp hàng dài) | 完成 (hoàn thành)"
      },
      {
        id: "9-2",
        chinese: "到了机场，我们先去柜台办理值机，顺便把大件行李托运了。",
        pinyin: "Dàole jīchǎng, wǒmen xiān qù guìtái bànlǐ zhíjī, shùnbiàn bǎ dàjiàn xínglǐ tuōyùnle.",
        vietnamese: "Đến sân bay, chúng ta đi đến quầy làm thủ tục check-in trước, tiện thể ký gửi hành lý cỡ lớn.",
        breakdown: "柜台 (quầy) | 办理值机 (làm thủ tục check-in) | 顺便 (nhân tiện/tiện thể)"
      },
      {
        id: "9-3",
        chinese: "如果您不会在机器上值机，可以拿着护照去人工柜台请工作人员帮忙。",
        pinyin: "Rúguǒ nín bù huì zài jīqì shang zhíjī, kěyǐ názhe hùzhào qù réngōng guìtái qǐng gōngzuò rényuán bāngmáng.",
        vietnamese: "Nếu bạn không biết check-in trên máy, có thể cầm hộ chiếu đến quầy thủ công nhờ nhân viên giúp đỡ.",
        breakdown: "机器 (máy móc tự động) | 人工柜台 (quầy có người phục vụ) | 帮忙 (giúp đỡ)"
      }
    ]
  },
  {
    id: 10,
    word: "登机牌",
    pinyin: "dēngjīpái",
    vietnamese: "Thẻ lên máy bay (Boarding pass)",
    icon: "CreditCard",
    usageGuide: "Lượng từ là 张 (zhāng). Đi với 打印 (in), 拿 (lấy), 出示 (xuất trình).",
    commonCollocations: ["打印登机牌 (in thẻ lên máy bay)", "电子登机牌 (thẻ lên máy bay điện tử)", "出示登机牌 (xuất trình thẻ lên máy bay)"],
    sentences: [
      {
        id: "10-1",
        chinese: "办完托运后，工作人员递给我一张登机牌，并告诉我登机口是23号。",
        pinyin: "Bàn wán tuōyùn hòu, gōngzuò rényuán dì gěi wǒ yī zhāng dēngjīpái, bìng gàosù wǒ dēngjīkǒu shì èrshísān hào.",
        vietnamese: "Sau khi làm xong ký gửi, nhân viên đưa cho tôi một tấm thẻ lên máy bay, và nói với tôi cửa lên máy bay là số 23.",
        breakdown: "递给 (đưa cho) | 一张登机牌 (một tấm thẻ lên máy bay) | 登机口 (cửa lên máy bay)"
      },
      {
        id: "10-2",
        chinese: "你必须把登机牌和护照一起拿在手里，因为过安检和登机的时候都要检查。",
        pinyin: "Nǐ bìxū bǎ dēngjīpái hé hùzhào yīqǐ ná zài shǒu lǐ, yīnwèi guò ānjiǎn hé dēngjī de shíhou dōu yào jiǎnchá.",
        vietnamese: "Bạn phải cầm thẻ lên máy bay và hộ chiếu cùng lúc trên tay, vì lúc qua an ninh và lên máy bay đều phải kiểm tra.",
        breakdown: "拿在手里 (cầm trên tay) | 过安检 (qua cửa an ninh) | 检查 (kiểm tra)"
      },
      {
        id: "10-3",
        chinese: "现在很多人使用电子登机牌，只要扫一下手机屏幕上的二维码就可以上飞机了。",
        pinyin: "Xiànzài hěnduō rén shǐyòng diànzǐ dēngjīpái, zhǐyào sǎo yíxià shǒujī píngmù shang de èrwéimǎ jiù kěyǐ shàng fēijī le.",
        vietnamese: "Bây giờ nhiều người dùng thẻ lên máy bay điện tử, chỉ cần quét mã QR trên màn hình điện thoại là có thể lên máy bay.",
        breakdown: "电子登机牌 (thẻ điện tử) | 扫 (quét scan) | 屏幕 (màn hình) | 二维码 (mã QR)"
      }
    ]
  },
  {
    id: 11,
    word: "登机口",
    pinyin: "dēngjīkǒu",
    vietnamese: "Cửa lên máy bay (Gate)",
    icon: "DoorOpen",
    usageGuide: "Thường đi với 找 (tìm), 改变/更改 (thay đổi).",
    commonCollocations: ["找登机口 (tìm cửa lên máy bay)", "登机口改变 (đổi cửa lên máy bay)", "在登机口排队 (xếp hàng tại cửa lên)"],
    sentences: [
      {
        id: "11-1",
        chinese: "机场太大了，我们找了半天才找到我们的登机口，差点就迟到了。",
        pinyin: "Jīchǎng tài dàle, wǒmen zhǎole bàntiān cái zhǎodào wǒmen de dēngjīkǒu, chàdiǎn jiù chídàole.",
        vietnamese: "Sân bay quá lớn, chúng tôi tìm mãi mới thấy cửa lên máy bay của mình, suýt chút nữa thì muộn.",
        breakdown: "找了半天 (tìm nửa ngày / tìm mãi) | 差点 (suýt nữa) | 迟到 (đến muộn)"
      },
      {
        id: "11-2",
        chinese: "广播里说我们的登机口从A区改到了B区，所以我们得赶紧跑过去。",
        pinyin: "Guāngbō lǐ shuō wǒmen de dēngjīkǒu cóng A qū gǎi dàole B qū, suǒyǐ wǒmen děi gǎnjǐn pǎo guòqù.",
        vietnamese: "Loa phát thanh nói cửa lên máy bay của chúng ta đổi từ khu A sang khu B, nên chúng ta phải nhanh chóng chạy qua đó.",
        breakdown: "广播 (phát thanh) | 从...改到... (đổi từ... sang...) | 赶紧 (nhanh chóng) | 跑过去 (chạy qua)"
      },
      {
        id: "11-3",
        chinese: "在登机口排队的时候，我顺便去旁边的商店买了一瓶水，准备在飞机上喝。",
        pinyin: "Zài dēngjīkǒu páiduì de shíhou, wǒ shùnbiàn qù pángbiān de shāngdiàn mǎile yī píng shuǐ, zhǔnbèi zài fēijī shang hē.",
        vietnamese: "Khi xếp hàng ở cửa lên máy bay, tôi tiện thể vào cửa hàng bên cạnh mua một chai nước, chuẩn bị uống trên máy bay.",
        breakdown: "排队 (xếp hàng) | 旁边的商店 (cửa hàng bên cạnh) | 准备 (chuẩn bị)"
      }
    ]
  },
  {
    id: 12,
    word: "入境",
    pinyin: "rùjìng",
    vietnamese: "Nhập cảnh",
    icon: "Compass",
    usageGuide: "Đi với 办理 (làm thủ tục), 海关 (hải quan).",
    commonCollocations: ["办理入境手续 (làm thủ tục nhập cảnh)", "入境大厅 (sảnh nhập cảnh)", "入境卡 (tờ khai nhập cảnh)", "入境目的 (mục đích nhập cảnh)"],
    sentences: [
      {
        id: "12-1",
        chinese: "下飞机后，我们要跟着指示牌先去办理入境手续，然后再去拿行李。",
        pinyin: "Xià fēijī hòu, wǒmen yào gēnzhe zhǐshìpái xiān qù bànlǐ rùjìng shǒuxù, ránhòu zài qù ná xínglǐ.",
        vietnamese: "Sau khi xuống máy bay, chúng ta phải đi theo biển chỉ dẫn làm thủ tục nhập cảnh trước, sau đó mới đi lấy hành lý.",
        breakdown: "跟着 (đi theo) | 指示牌 (biển chỉ dẫn) | 入境手续 (thủ tục nhập cảnh) | 拿行李 (lấy hành lý)"
      },
      {
        id: "12-2",
        chinese: "在入境大厅里人非常多，我们排了半个小时才轮到我们。",
        pinyin: "Zài rùjìng dàtīng lǐ rén fēicháng duō, wǒmen páile bàn gè xiǎoshí cái lún dào wǒmen.",
        vietnamese: "Trong sảnh nhập cảnh người rất đông, chúng tôi xếp hàng nửa tiếng mới đến lượt.",
        breakdown: "入境大厅 (sảnh nhập cảnh) | 排了半个小时 (xếp hàng nửa tiếng) | 轮到 (đến lượt)"
      },
      {
        id: "12-3",
        chinese: "如果海关问你入境的目的，你要如实回答是为了旅游，不要紧张。",
        pinyin: "Rúguǒ hǎiguān wèn nǐ rùjìng de mùdì, nǐ yào rúshí huídá shì wèile lǚyóu, bú yào jǐnzhāng.",
        vietnamese: "Nếu hải quan hỏi mục đích nhập cảnh của bạn, bạn phải trả lời thật là để du lịch, đừng căng thẳng.",
        breakdown: "入境目的 (mục đích nhập cảnh) | 如实回答 (trả lời thành thật) | 紧张 (lo lắng/căng thẳng)"
      }
    ]
  },
  {
    id: 13,
    word: "目的",
    pinyin: "mùdì",
    vietnamese: "Mục đích",
    icon: "Target",
    usageGuide: "Danh từ chỉ mục tiêu, mục đích (ví dụ mục đích nhập cảnh, mục đích chuyến đi). Thường đi với 来...的目的是... hoặc 目的明确.",
    commonCollocations: ["入境目的 (mục đích nhập cảnh)", "旅游目的 (mục đích du lịch)", "达到目的 (đạt được mục đích)", "主要目的 (mục đích chính)"],
    sentences: [
      {
        id: "13-1",
        chinese: "请问您这次来中国的目的是什么？是旅游还是出差？",
        pinyin: "Qǐngwèn nín zhè cì lái Zhōngguó de mùdì shì shénme? Shì lǚyóu háishì chūchāi?",
        vietnamese: "Xin hỏi mục đích lần này quý vị đến Trung Quốc là gì? Là đi du lịch hay công tác?",
        breakdown: "这次 (lần này) | 的目的是什么 (mục đích là gì) | 还是 (hay là)"
      },
      {
        id: "13-2",
        chinese: "我来上海的主要目的是拜访朋友，顺便在周边城市逛一逛。",
        pinyin: "Wǒ lái Shànghǎi de zhǔyào mùdì shì bàifǎng péngyou, shùnbiàn zài zhōubiān chéngshì guàng yī guàng.",
        vietnamese: "Mục đích chính tôi đến Thượng Hải là thăm bạn, tiện thể đi dạo các thành phố xung quanh.",
        breakdown: "主要目的 (mục đích chính) | 拜访朋友 (thăm bạn) | 顺便 (tiện thể)"
      },
      {
        id: "13-3",
        chinese: "填写入境卡的时候，要清楚地写明自己的入境目的和住宿地址。",
        pinyin: "Tiánxiě rùjìngkǎ de shíhou, yào qīngchu de xiěmíng zìjǐ de rùjìng mùdì hé zhùsù dìzhǐ.",
        vietnamese: "Khi điền tờ khai nhập cảnh, cần ghi rõ mục đích nhập cảnh và địa chỉ lưu trú của mình.",
        breakdown: "填写 (điền vào) | 写明 (viết rõ) | 住宿地址 (địa chỉ chỗ ở)"
      }
    ]
  },
  {
    id: 14,
    word: "旅游",
    pinyin: "lǚyóu",
    vietnamese: "Du lịch",
    icon: "Map",
    usageGuide: "Động từ / danh từ chỉ việc đi du lịch. Hay dùng 去...旅游 (đi đâu du lịch), 旅游签证 (visa du lịch).",
    commonCollocations: ["去中国旅游 (đi Trung Quốc du lịch)", "旅游签证 (visa du lịch)", "自助旅游 (du lịch tự túc)", "旅游旺季 (mùa cao điểm du lịch)"],
    sentences: [
      {
        id: "14-1",
        chinese: "我是来旅游的，打算在北京和上海玩一个星期左右。",
        pinyin: "Wǒ shì lái lǚyóu de, dǎsuàn zài Běijīng hé Shànghǎi wán yī gè xīngqī zuǒyòu.",
        vietnamese: "Tôi đến để du lịch, dự định chơi ở Bắc Kinh và Thượng Hải khoảng một tuần.",
        breakdown: "是...的 (nhấn mạnh mục đích) | 打算 (dự định) | 左右 (khoảng chừng)"
      },
      {
        id: "14-2",
        chinese: "现在正好是旅游旺季，所以机场里的人特别多，办手续要排队。",
        pinyin: "Xiànzài zhènghǎo shì lǚyóu wàngjì, suǒyǐ jīchǎng lǐ de rén tèbié duō, bàn shǒuxù yào páiduì.",
        vietnamese: "Hiện tại đúng vào mùa du lịch cao điểm, nên trong sân bay người đặc biệt đông, làm thủ tục phải xếp hàng.",
        breakdown: "正好 (đúng lúc) | 旅游旺季 (mùa cao điểm du lịch) | 排队 (xếp hàng)"
      },
      {
        id: "14-3",
        chinese: "出国旅游以前，别忘了提前订好回程机票和酒店。",
        pinyin: "Chūguó lǚyóu yǐqián, bié wàngle tíqián dìng hǎo huíchéng jīpiào hé jiǔdiàn.",
        vietnamese: "Trước khi đi du lịch nước ngoài, đừng quên đặt trước vé máy bay khứ hồi và khách sạn.",
        breakdown: "出国 (ra nước ngoài) | 别忘了 (đừng quên) | 提前 (trước)"
      }
    ]
  },
  {
    id: 15,
    word: "拜访朋友",
    pinyin: "bàifǎng péngyou",
    vietnamese: "Thăm bạn",
    icon: "Users",
    usageGuide: "Cụm động-tân trang trọng hơn 看朋友, hay dùng khi trả lời hải quan hoặc nói lịch sự về việc đến thăm bạn bè, đối tác.",
    commonCollocations: ["去拜访朋友 (đi thăm bạn)", "拜访老朋友 (thăm bạn cũ)", "来北京拜访朋友 (đến Bắc Kinh thăm bạn)"],
    sentences: [
      {
        id: "15-1",
        chinese: "我这次来中国主要是为了拜访朋友，顺便体验一下当地的美食。",
        pinyin: "Wǒ zhè cì lái Zhōngguó zhǔyào shì wèile bàifǎng péngyou, shùnbiàn tǐyàn yīxià dāngdì de měishí.",
        vietnamese: "Lần này tôi đến Trung Quốc chủ yếu là để thăm bạn, tiện thể trải nghiệm ẩm thực địa phương.",
        breakdown: "主要是为了 (chủ yếu là để) | 当地 (địa phương) | 美食 (món ngon)"
      },
      {
        id: "15-2",
        chinese: "明天上午我要去拜访朋友，所以得早点儿打出租车过去。",
        pinyin: "Míngtiān shàngwǔ wǒ yào qù bàifǎng péngyou, suǒyǐ děi zǎodiǎnr dǎ chūzūchē guòqù.",
        vietnamese: "Sáng mai tôi phải đi thăm bạn, nên phải bắt taxi qua đó sớm một chút.",
        breakdown: "早点儿 (sớm một chút) | 打出租车 (bắt xe taxi) | 过去 (sang đó)"
      },
      {
        id: "15-3",
        chinese: "在机场免税店买点儿礼物带给朋友吧，明天拜访朋友的时候正好送给他。",
        pinyin: "Zài jīchǎng miǎnshuìdiàn mǎi diǎnr lǐwù dài gěi péngyou ba, míngtiān bàifǎng péngyou de shíhou zhènghǎo sòng gěi tā.",
        vietnamese: "Mua chút quà ở cửa hàng miễn thuế sân bay mang cho bạn đi, mai lúc đến thăm bạn tặng luôn cho bạn ấy.",
        breakdown: "免税店 (cửa hàng miễn thuế) | 礼物 (quà tặng) | 送给 (tặng cho)"
      }
    ]
  },
  {
    id: 16,
    word: "看朋友",
    pinyin: "kàn péngyou",
    vietnamese: "Thăm bạn",
    icon: "HeartHandshake",
    usageGuide: "Cách nói khẩu ngữ tự nhiên, thân mật mang nghĩa thăm hỏi bạn bè (看 mang nghĩa 探望 thăm nom).",
    commonCollocations: ["去看朋友 (đi thăm bạn)", "顺便看朋友 (tiện thể thăm bạn)", "来上海看朋友 (đến Thượng Hải thăm bạn)"],
    sentences: [
      {
        id: "16-1",
        chinese: "我周末坐飞机去广州看朋友，我们在那边待几天就回来。",
        pinyin: "Wǒ zhōumò zuò fēijī qù Guǎngzhōu kàn péngyou, wǒmen zài nàbiān dāi jǐ tiān jiù huílái.",
        vietnamese: "Cuối tuần tôi đi máy bay đến Quảng Châu thăm bạn, chúng tôi ở bên đó mấy ngày rồi về.",
        breakdown: "坐飞机 (đi máy bay) | 待几天 (ở mấy ngày) | 就回来 (rồi quay về)"
      },
      {
        id: "16-2",
        chinese: "下了飞机以后，我先去酒店放行李，晚上再去学校看朋友。",
        pinyin: "Xiàle fēijī yǐhòu, wǒ xiān qù jiǔdiàn fàng xínglǐ, wǎnshang zài qù xuéxiào kàn péngyou.",
        vietnamese: "Sau khi xuống máy bay, tôi về khách sạn cất hành lý trước, buổi tối mới đến trường thăm bạn.",
        breakdown: "先...再... (trước... sau mới...) | 放行李 (cất hành lý)"
      },
      {
        id: "16-3",
        chinese: "你已经好久没看朋友了吧？趁着这次假期一起聚一聚。",
        pinyin: "Nǐ yǐjīng hǎojiǔ méi kàn péngyou le ba? Chènzhe zhè cì jiàqī yīqǐ jù yī jù.",
        vietnamese: "Bạn đã lâu lắm không thăm bạn rồi nhỉ? Nhân kỳ nghỉ lần này tụ họp với nhau một bữa đi.",
        breakdown: "好久没...了 (lâu rồi chưa...) | 趁着 (nhân dịp) | 聚一聚 (tụ họp)"
      }
    ]
  },
  {
    id: 17,
    word: "住",
    pinyin: "zhù",
    vietnamese: "Ở",
    icon: "Home",
    usageGuide: "Động từ chỉ nơi cư trú, lưu trú (thường dùng với bổ ngữ kết quả 在: 住在 + địa điểm/khách sạn).",
    commonCollocations: ["住在酒店 (ở khách sạn)", "住几天 (ở mấy ngày)", "住在哪里 (ở đâu)", "住朋友家 (ở nhà bạn)"],
    sentences: [
      {
        id: "17-1",
        chinese: "请问您在中国期间住在哪里？请提供一下酒店的名称和地址。",
        pinyin: "Qǐngwèn nín zài Zhōngguó qījiān zhù zài nǎlǐ? Qǐng tígōng yīxià jiǔdiàn de míngchēng hé dìzhǐ.",
        vietnamese: "Xin hỏi trong thời gian ở Trung Quốc quý vị ở đâu? Vui lòng cung cấp tên và địa chỉ khách sạn.",
        breakdown: "期间 (trong thời gian) | 住在 (ở tại) | 提供 (cung cấp)"
      },
      {
        id: "17-2",
        chinese: "因为机场离市中心比较远，所以我打算第一晚住在机场附近的酒店。",
        pinyin: "Yīnwèi jīchǎng lí shìzhōngxīn bǐjiào yuǎn, suǒyǐ wǒ dǎsuàn dì yī wǎn zhù zài jīchǎng fùjìn de jiǔdiàn.",
        vietnamese: "Vì sân bay cách trung tâm thành phố khá xa, nên đêm đầu tiên tôi định ở khách sạn gần sân bay.",
        breakdown: "市中心 (trung tâm thành phố) | 第一晚 (đêm đầu tiên) | 附近 (gần/lân cận)"
      },
      {
        id: "17-3",
        chinese: "我这次来杭州住五天，前三天住在酒店，后两天住在我朋友家。",
        pinyin: "Wǒ zhè cì lái Hángzhōu zhù wǔ tiān, qián sān tiān zhù zài jiǔdiàn, hòu liǎng tiān zhù zài wǒ péngyou jiā.",
        vietnamese: "Lần này tôi đến Hàng Châu ở 5 ngày, 3 ngày đầu ở khách sạn, 2 ngày sau ở nhà bạn tôi.",
        breakdown: "前三天 (ba ngày đầu) | 后两天 (hai ngày sau)"
      }
    ]
  },
  {
    id: 18,
    word: "酒店",
    pinyin: "jiǔdiàn",
    vietnamese: "Khách sạn",
    icon: "Building2",
    usageGuide: "Danh từ chỉ khách sạn (lượng từ 家 jiā). Hay đi với 订 (đặt), 住 (ở), 退房 (trả phòng).",
    commonCollocations: ["订酒店 (đặt khách sạn)", "住在酒店 (ở tại khách sạn)", "酒店地址 (địa chỉ khách sạn)", "机场酒店 (khách sạn sân bay)"],
    sentences: [
      {
        id: "18-1",
        chinese: "师傅，麻烦送我去这家酒店，地址在我的手机屏幕上。",
        pinyin: "Shīfu, máfan sòng wǒ qù zhè jiā jiǔdiàn, dìzhǐ zài wǒ de shǒujī píngmù shang.",
        vietnamese: "Bác tài ơi, phiền chở tôi đến khách sạn này, địa chỉ ở trên màn hình điện thoại của tôi.",
        breakdown: "师傅 (bác tài/thợ) | 麻烦 (làm phiền) | 这家酒店 (khách sạn này)"
      },
      {
        id: "18-2",
        chinese: "如果你的行李明天才能送到，我们可以帮你直接寄到你住的酒店。",
        pinyin: "Rúguǒ nín de xínglǐ míngtiān cái néng sòngdào, wǒmen kěyǐ bāng nín zhíjiē jì dào nín zhù de jiǔdiàn.",
        vietnamese: "Nếu hành lý của quý khách ngày mai mới đến nơi, chúng tôi có thể gửi thẳng tới khách sạn quý khách ở.",
        breakdown: "直接 (trực tiếp) | 寄到 (gửi tới)"
      },
      {
        id: "18-3",
        chinese: "我提前在网上订了一家离地铁站很近的酒店，去机场也很方便。",
        pinyin: "Wǒ tíqián zài wǎngshang dìngle yī jiā lí dìtiězhàn hěn jìn de jiǔdiàn, qù jīchǎng yě hěn fāngbiàn.",
        vietnamese: "Tôi đặt trước trên mạng một khách sạn rất gần ga tàu điện ngầm, đi sân bay cũng rất tiện.",
        breakdown: "地铁站 (ga tàu điện ngầm) | 很近 (rất gần) | 方便 (tiện lợi)"
      }
    ]
  },
  {
    id: 19,
    word: "几天",
    pinyin: "jǐ tiān",
    vietnamese: "Mấy ngày",
    icon: "CalendarDays",
    usageGuide: "Dùng để hỏi số ngày ngắn (thường dưới 10 ngày) hoặc nói ước lượng 'vài ngày'.",
    commonCollocations: ["住几天 (ở mấy ngày)", "待几天 (nán lại mấy ngày)", "玩几天 (chơi mấy ngày)", "过几天 (mấy ngày nữa)"],
    sentences: [
      {
        id: "19-1",
        chinese: "请问您打算在中国待几天？您的回程机票是哪一天的？",
        pinyin: "Qǐngwèn nín dǎsuàn zài Zhōngguó dāi jǐ tiān? Nín de huíchéng jīpiào shì nǎ yī tiān de?",
        vietnamese: "Xin hỏi quý vị dự định ở Trung Quốc mấy ngày? Vé máy bay khứ hồi của quý vị là ngày nào?",
        breakdown: "待几天 (ở lại mấy ngày) | 哪一天 (ngày nào)"
      },
      {
        id: "19-2",
        chinese: "我只在这里住几天，下周二早上还要赶早班飞机回国呢。",
        pinyin: "Wǒ zhǐ zài zhèlǐ zhù jǐ tiān, xià zhōu'èr zǎoshang hái yào gǎn zǎobān fēijī huíguó ne.",
        vietnamese: "Tôi chỉ ở đây mấy ngày thôi, sáng thứ Ba tuần sau còn phải kịp chuyến bay sớm về nước nữa.",
        breakdown: "赶早班飞机 (kịp chuyến bay sáng sớm) | 回国 (về nước)"
      },
      {
        id: "19-3",
        chinese: "过几天我朋友也要来北京旅游，到时候我们可以一起去爬长城。",
        pinyin: "Guò jǐ tiān wǒ péngyou yě yào lái Běijīng lǚyóu, dào shíhou wǒmen kěyǐ yīqǐ qù pá Chángchéng.",
        vietnamese: "Mấy ngày nữa bạn tôi cũng đến Bắc Kinh du lịch, đến lúc đó chúng tôi có thể cùng đi leo Vạn Lý Trường Thành.",
        breakdown: "过几天 (mấy ngày nữa) | 到时候 (đến lúc đó) | 爬长城 (leo Trường Thành)"
      }
    ]
  },
  {
    id: 20,
    word: "出租车",
    pinyin: "chūzūchē",
    vietnamese: "Taxi",
    icon: "Car",
    usageGuide: "Xe taxi (lượng từ 辆 liàng). Hay dùng 坐出租车 (đi taxi) hoặc 打出租车 / 打车 (bắt taxi).",
    commonCollocations: ["坐出租车 (đi xe taxi)", "打出租车 (bắt taxi)", "出租车乘车点 (điểm đón taxi)", "出租车司机 (tài xế taxi)"],
    sentences: [
      {
        id: "20-1",
        chinese: "出了到达大厅以后，沿着指示牌一直走就能看到出租车排队的地方。",
        pinyin: "Chūle dàodá dàtīng yǐhòu, yánzhe zhǐshìpái yīzhí zǒu jiù néng kàndào chūzūchē páiduì de dìfang.",
        vietnamese: "Sau khi ra khỏi sảnh đến, đi thẳng theo biển chỉ dẫn là có thể thấy chỗ xe taxi xếp hàng.",
        breakdown: "到达大厅 (sảnh đến) | 沿着 (dọc theo) | 一直走 (đi thẳng)"
      },
      {
        id: "20-2",
        chinese: "因为我的行李很多，坐地铁不太方便，所以我决定直接坐出租车去酒店。",
        pinyin: "Yīnwèi wǒ de xínglǐ hěn duō, zuò dìtiě bù tài fāngbiàn, suǒyǐ wǒ juédìng zhíjiē zuò chūzūchē qù jiǔdiàn.",
        vietnamese: "Vì hành lý của tôi rất nhiều, đi tàu điện ngầm không tiện lắm, nên tôi quyết định đi thẳng taxi về khách sạn.",
        breakdown: "坐地铁 (đi tàu điện ngầm) | 决定 (quyết định)"
      },
      {
        id: "20-3",
        chinese: "从首都机场坐出租车到市中心大概需要一个小时，还要看路上堵不堵车。",
        pinyin: "Cóng Shǒudū Jīchǎng zuò chūzūchē dào shìzhōngxīn dàgài xūyào yī gè xiǎoshí, hái yào kàn lùshang dǔ bu dǔchē.",
        vietnamese: "Đi taxi từ sân bay Thủ Đô vào trung tâm thành phố mất khoảng một tiếng, còn tùy trên đường có tắc xe không.",
        breakdown: "大概 (khoảng chừng) | 堵车 (tắc đường)"
      }
    ]
  },
  {
    id: 21,
    word: "地址",
    pinyin: "dìzhǐ",
    vietnamese: "Địa chỉ",
    icon: "MapPin",
    usageGuide: "Danh từ chỉ địa chỉ nhà, khách sạn, nơi nhận hành lý. Hay đi với 写 (viết), 留 (để lại), 看 (xem), 记 (nhớ).",
    commonCollocations: ["酒店地址 (địa chỉ khách sạn)", "留地址 (để lại địa chỉ)", "填写地址 (điền địa chỉ)", "具体地址 (địa chỉ cụ thể)"],
    sentences: [
      {
        id: "21-1",
        chinese: "请在这里留下您的酒店地址和联系电话，行李一找到我们就送过去。",
        pinyin: "Qǐng zài zhèlǐ liúxià nín de jiǔdiàn dìzhǐ hé liánxì diànhuà, xínglǐ yī zhǎodào wǒmen jiù sòng guòqù.",
        vietnamese: "Vui lòng để lại địa chỉ khách sạn và số điện thoại liên hệ tại đây, tìm thấy hành lý là chúng tôi gửi qua ngay.",
        breakdown: "留下 (để lại) | 联系电话 (số điện thoại liên hệ) | 一...就... (hễ... là...)"
      },
      {
        id: "21-2",
        chinese: "上出租车以前，最好把酒店的中文地址提前截屏保存在手机里。",
        pinyin: "Shàng chūzūchē yǐqián, zuì hǎo bǎ jiǔdiàn de Zhōngwén dìzhǐ tíqián jiépíng bǎocún zài shǒujī lǐ.",
        vietnamese: "Trước khi lên taxi, tốt nhất hãy chụp màn hình địa chỉ tiếng Trung của khách sạn lưu sẵn trong điện thoại.",
        breakdown: "中文地址 (địa chỉ tiếng Trung) | 截屏 (chụp màn hình) | 保存 (lưu lại)"
      },
      {
        id: "21-3",
        chinese: "不好意思，我看不太清楚这个地址，您可以把字放大一点儿吗？",
        pinyin: "Bù hǎoyìsi, wǒ kàn bù tài qīngchu zhège dìzhǐ, nín kěyǐ bǎ zì fàngdà yīdiǎnr ma?",
        vietnamese: "Xin lỗi, tôi nhìn không rõ địa chỉ này lắm, quý khách có thể phóng to chữ lên một chút được không?",
        breakdown: "看不清楚 (nhìn không rõ) | 放大 (phóng to)"
      }
    ]
  },
  {
    id: 22,
    word: "多少钱",
    pinyin: "duōshao qián",
    vietnamese: "Bao nhiêu tiền",
    icon: "Coins",
    usageGuide: "Cụm từ hỏi giá tiền phổ biến nhất. Thường dùng 一共多少钱 (tổng cộng bao nhiêu tiền), 大概要多少钱 (khoảng bao nhiêu tiền).",
    commonCollocations: ["一共多少钱 (tổng cộng bao nhiêu tiền)", "大概多少钱 (khoảng bao nhiêu tiền)", "超重一公斤多少钱 (quá cân 1kg bao nhiêu tiền)"],
    sentences: [
      {
        id: "22-1",
        chinese: "师傅，从机场到这家酒店坐出租车大概需要多少钱？",
        pinyin: "Shīfu, cóng jīchǎng dào zhè jiā jiǔdiàn zuò chūzūchē dàgài xūyào duōshao qián?",
        vietnamese: "Bác tài ơi, đi taxi từ sân bay đến khách sạn này mất khoảng bao nhiêu tiền?",
        breakdown: "从...到... (từ... đến...) | 大概需要 (khoảng cần)"
      },
      {
        id: "22-2",
        chinese: "请问行李超重一公斤要补多少钱？我可以用微信支付吗？",
        pinyin: "Qǐngwèn xínglǐ chāozhòng yī gōngjīn yào bǔ duōshao qián? Wǒ kěyǐ yòng Wēixìn zhīfù ma?",
        vietnamese: "Cho hỏi hành lý quá cân 1 kg phải bù bao nhiêu tiền? Tôi có thể thanh toán bằng WeChat Pay không?",
        breakdown: "补多少钱 (bù bao nhiêu tiền) | 微信支付 (thanh toán WeChat)"
      },
      {
        id: "22-3",
        chinese: "到了目的地以后，我问司机一共多少钱，顺便要了一张发票。",
        pinyin: "Dàole mùdìdì yǐhòu, wǒ wèn sījī yīgòng duōshao qián, shùnbiàn yàole yī zhāng fāpiào.",
        vietnamese: "Sau khi đến nơi, tôi hỏi tài xế tổng cộng bao nhiêu tiền, tiện thể xin một tờ hóa đơn.",
        breakdown: "一共 (tổng cộng) | 司机 (tài xế) | 发票 (hóa đơn)"
      }
    ]
  },
  {
    id: 23,
    word: "打表",
    pinyin: "dǎbiǎo",
    vietnamese: "Bật đồng hồ tính tiền",
    icon: "Gauge",
    usageGuide: "Động từ ly hợp dùng khi đi taxi ở Trung Quốc, nhắc tài xế chạy theo đồng hồ tính cước thay vì mặc cả giá trọn gói.",
    commonCollocations: ["按打表收费 (tính tiền theo đồng hồ)", "麻烦打表 (phiền bật đồng hồ)", "不打表 (không bật đồng hồ)"],
    sentences: [
      {
        id: "23-1",
        chinese: "师傅，麻烦您打表吧，我们按计价器上的金额付款。",
        pinyin: "Shīfu, máfan nín dǎbiǎo ba, wǒmen àn jìjiàqì shang de jīn'é fùkuǎn.",
        vietnamese: "Bác tài ơi, phiền bác bật đồng hồ tính tiền nhé, chúng tôi trả theo số tiền trên đồng hồ.",
        breakdown: "按...付款 (trả tiền theo...) | 计价器 (đồng hồ tính cước) | 金额 (số tiền)"
      },
      {
        id: "23-2",
        chinese: "在机场上正规出租车的时候，一定要先确认司机打表再出发。",
        pinyin: "Zài jīchǎng shàng zhèngguī chūzūchē de shíhou, yīdìng yào xiān quèrèn sījī dǎbiǎo zài chūfā.",
        vietnamese: "Khi lên taxi chính quy ở sân bay, nhất định phải xác nhận tài xế bật đồng hồ rồi mới xuất phát.",
        breakdown: "正规 (chính quy) | 确认 (xác nhận) | 再出发 (rồi mới xuất phát)"
      },
      {
        id: "23-3",
        chinese: "这个司机不肯打表，非要一口价两百块，我们还是换下一辆车吧。",
        pinyin: "Zhège sījī bù kěn dǎbiǎo, fēiyào yīkǒujià liǎngbǎi kuài, wǒmen háishì huàn xià yī liàng chē ba.",
        vietnamese: "Tài xế này không chịu bật đồng hồ, cứ đòi giá chốt 200 tệ, chúng ta đổi sang chiếc xe tiếp theo đi.",
        breakdown: "不肯 (không chịu) | 一口价 (giá chốt không mặc cả) | 换车 (đổi xe)"
      }
    ]
  },
  {
    id: 24,
    word: "停",
    pinyin: "tíng",
    vietnamese: "Dừng lại",
    icon: "OctagonPause",
    usageGuide: "Động từ chỉ việc dừng xe, đỗ lại. Hay dùng với bổ ngữ 在 / 一下: 停在门口 (dừng ở cổng), 停一下 (dừng một chút), 停车 (đỗ/dừng xe).",
    commonCollocations: ["停在这里 (dừng ở đây)", "停一下 (dừng lại một chút)", "在门口停 (dừng ở cửa)", "禁止停车 (cấm đỗ xe)"],
    sentences: [
      {
        id: "24-1",
        chinese: "师傅，前面就是酒店的大门了，麻烦您在路边停一下。",
        pinyin: "Shīfu, qiánmiàn jiùshì jiǔdiàn de dàmén le, máfan nín zài lùbiān tíng yīxià.",
        vietnamese: "Bác tài ơi, phía trước chính là cổng chính khách sạn rồi, phiền bác dừng lại ở bên đường một chút.",
        breakdown: "大门 (cổng chính) | 路边 (bên đường) | 停一下 (dừng lại một chút)"
      },
      {
        id: "24-2",
        chinese: "这辆机场大巴只在这里停五分钟，大家拿好行李赶紧上车吧。",
        pinyin: "Zhè liàng jīchǎng dàbā zhǐ zài zhèlǐ tíng wǔ fēnzhōng, dàjiā ná hǎo xínglǐ gǎnjǐn shàngchē ba.",
        vietnamese: "Xe buýt sân bay này chỉ dừng ở đây 5 phút, mọi người cầm chắc hành lý rồi mau lên xe đi.",
        breakdown: "机场大巴 (xe buýt sân bay) | 停五分钟 (dừng 5 phút) | 上车 (lên xe)"
      },
      {
        id: "24-3",
        chinese: "航站楼门口不能长时间停车，送完人以后司机必须马上开走。",
        pinyin: "Hángzhànlóu ménkǒu bù néng cháng shíjiān tíngchē, sòng wán rén yǐhòu sījī bìxū mǎshàng kāizǒu.",
        vietnamese: "Cửa nhà ga sân bay không được dừng đỗ xe lâu, sau khi thả người xong tài xế phải lái đi ngay.",
        breakdown: "航站楼 (nhà ga sân bay) | 长时间 (thời gian dài) | 开走 (lái xe đi)"
      }
    ]
  }
];

export const SCENARIOS: RoleplayScenario[] = [
  {
    id: "scenario-1",
    number: 1,
    title: "Ngày mai bay rồi!",
    titleChinese: "明天就要起飞了！",
    tagline: "Chuẩn bị trước chuyến đi & dặn dò qua điện thoại",
    context: "Hai bạn học sinh chuẩn bị đi du lịch Trung Quốc. Một người đã có kinh nghiệm (A), một người lần đầu đi máy bay (B). Họ nói chuyện qua điện thoại tối hôm trước để chuẩn bị đồ đạc và giấy tờ.",
    roles: {
      student: {
        roleId: "student_b",
        roleName: "Bạn B (Lần đầu đi máy bay)",
        roleDescription: "Hơi lo lắng, chưa rõ thủ tục, cần hỏi về hộ chiếu, visa, vé máy bay, cách dọn hành lý.",
        avatar: "🎒"
      },
      ai: {
        roleId: "friend_a",
        roleName: "Bạn A (Người có kinh nghiệm)",
        roleDescription: "Điềm tĩnh, chu đáo, nhiệt tình hướng dẫn và nhắc nhở B kiểm tra giấy tờ.",
        avatar: "✈️"
      }
    },
    targetVocabulary: ["护照", "签证", "机票", "回程机票", "行李", "托运"],
    speakingRequirements: [
      "Hỏi đáp về 护照 (hộ chiếu), 签证 (visa), 机票 (vé máy bay), 回程机票 (vé về).",
      "Nhắc nhở về việc 收拾行李 (dọn hành lý) và kiểm tra hạn của 护照.",
      "Gợi ý 订机票 (đặt vé) và lưu ý về 退机票 (hủy vé) nếu thay đổi kế hoạch."
    ],
    suggestedPhrases: [
      {
        chinese: "我的护照和签证都办好了，机票也买好了。",
        pinyin: "Wǒ de hùzhào hé qiānzhèng dōu bàn hǎole, jīpiào yě mǎi hǎole.",
        vietnamese: "Hộ chiếu và visa của mình đều làm xong rồi, vé máy bay cũng mua rồi."
      },
      {
        chinese: "你订的是哪天的机票？回程机票也买了吗？",
        pinyin: "Nǐ dìng de shì nǎ tiān de jīpiào? Huíchéng jīpiào yě mǎile ma?",
        vietnamese: "Cậu đặt vé máy bay ngày nào? Vé về cũng đã mua chưa?"
      },
      {
        chinese: "我的行李收拾得差不多了，希望不要超重！",
        pinyin: "Wǒ de xínglǐ shōushí de chàbuduō le, xīwàng bú yào chāozhòng!",
        vietnamese: "Hành lý của mình dọn hòm hòm rồi, hi vọng không bị quá cân!"
      }
    ],
    initialAiGreeting: {
      chinese: "喂！明天我们就要去中国了，你的护照、签证还有机票都准备好了吗？",
      pinyin: "Wéi! Míngtiān wǒmen jiù yào qù Zhōngguó le, nǐ de hùzhào, qiānzhèng hái yǒu jīpiào dōu zhǔnbèi hǎole ma?",
      vietnamese: "Alo! Ngày mai tụi mình bay sang Trung Quốc rồi đấy, hộ chiếu, visa và cả vé máy bay của cậu đã chuẩn bị sẵn sàng chưa?"
    }
  },
  {
    id: "scenario-2",
    number: 2,
    title: "Tại quầy check-in",
    titleChinese: "在航空公司值机柜台",
    tagline: "Làm thủ tục lên máy bay, cân hành lý & nhận thẻ lên tàu",
    context: "Hành khách đến quầy 值机 (check-in) của hãng hàng không tại sân bay. Nhân viên thủ tục kiểm tra hộ chiếu, hỏi hành lý ký gửi, cân vali và in thẻ lên máy bay.",
    roles: {
      student: {
        roleId: "passenger",
        roleName: "Hành khách (Học sinh)",
        roleDescription: "Đến làm thủ tục, xuất trình hộ chiếu, vé máy bay và hỏi về hành lý ký gửi, cửa lên máy bay.",
        avatar: "🧳"
      },
      ai: {
        roleId: "ground_staff",
        roleName: "Nhân viên hàng không (AI)",
        roleDescription: "Lịch sự, chuyên nghiệp, kiểm tra giấy tờ, cân hành lý và giao thẻ lên máy bay.",
        avatar: "🧑‍✈️"
      }
    },
    targetVocabulary: ["值机", "护照", "机票", "行李", "托运", "登机牌", "登机口"],
    speakingRequirements: [
      "Xuất trình 护照 và 机票 cho nhân viên.",
      "Trả lời về 行李 có 托运 không, có 超重 không.",
      "Hỏi hoặc nghe thông báo về 登机口 và giờ 登机.",
      "Nhận 登机牌 (thẻ lên máy bay) và kiểm tra lại thông tin."
    ],
    suggestedPhrases: [
      {
        chinese: "您好，我想办理值机手续，这是我的护照和电子机票。",
        pinyin: "Nínhǎo, wǒ xiǎng bànlǐ zhíjī shǒuxù, zhè shì wǒ de hùzhào hé diànzǐ jīpiào.",
        vietnamese: "Xin chào, tôi muốn làm thủ tục check-in, đây là hộ chiếu và vé máy bay điện tử của tôi."
      },
      {
        chinese: "我有一个大箱子需要托运，随身还有一个小背包。",
        pinyin: "Wǒ yǒu yí gè dà xiāngzi xūyào tuōyùn, suíshēn hái yǒu yí gè xiǎo bèibāo.",
        vietnamese: "Tôi có một vali lớn cần ký gửi, trên người còn có một balo nhỏ."
      },
      {
        chinese: "请问我的登机口是几号？几点开始登机？",
        pinyin: "Qǐngwèn wǒ de dēngjīkǒu shì jǐ hào? Jǐ diǎn kāishǐ dēngjī?",
        vietnamese: "Xin hỏi cửa lên máy bay của tôi là số mấy? Mấy giờ bắt đầu lên máy bay?"
      }
    ],
    initialAiGreeting: {
      chinese: "您好！欢迎乘坐我们航空公司的航班。请出示您的护照和机票。",
      pinyin: "Nínhǎo! Huānyíng chéngzuò wǒmen hángkōng gōngsī de hángbān. Qǐng chūshì nín de hùzhào hé jīpiào.",
      vietnamese: "Xin chào! Chào mừng quý khách bay cùng hãng hàng không chúng tôi. Vui lòng xuất trình hộ chiếu và vé máy bay của quý khách."
    }
  },
  {
    id: "scenario-3",
    number: 3,
    title: "Thông báo khẩn tại sân bay",
    titleChinese: "机场紧急广播通知",
    tagline: "Xử lý chuyến bay bị hoãn, đổi cửa ra máy bay",
    context: "Tại sân bay, loa phát thanh đột ngột thông báo chuyến bay bị chậm (晚点) hoặc có thay đổi cửa lên máy bay (登机口). Hai hành khách cùng nhau tìm hướng giải quyết.",
    roles: {
      student: {
        roleId: "calm_passenger",
        roleName: "Hành khách (Bạn A)",
        roleDescription: "Bình tĩnh nghe ngóng thông tin, tìm hiểu xem hoãn mấy tiếng hoặc đổi sang cửa nào.",
        avatar: "📱"
      },
      ai: {
        roleId: "worried_friend",
        roleName: "Bạn đi cùng (Bạn B - AI)",
        roleDescription: "Khá lo lắng vì sợ trễ việc, liên tục hỏi han về tình hình hoãn chuyến và hủy vé.",
        avatar: "😰"
      }
    },
    targetVocabulary: ["航班", "晚点", "取消", "登机口", "登机牌", "退机票", "机场"],
    speakingRequirements: [
      "Thông báo hoặc hỏi về 航班 bị 晚点 hoặc 取消.",
      "Kiểm tra xem 登机口 có thay đổi từ khu nào sang khu nào.",
      "Bàn về phương án nếu hủy chuyến (退机票 hoặc đổi chuyến khác).",
      "Nhắc nhau kiểm tra lại thông tin trên 登机牌."
    ],
    suggestedPhrases: [
      {
        chinese: "你听到了吗？广播说我们的航班晚点两个小时！",
        pinyin: "Nǐ tīngdàole ma? Guāngbō shuō wǒmen de hángbān wǎndiǎn liǎng gè xiǎoshí!",
        vietnamese: "Cậu có nghe thấy không? Loa phát thanh nói chuyến bay của tụi mình bị muộn 2 tiếng rồi!"
      },
      {
        chinese: "登机口从A区改到B区了，我们快跑过去确认一下吧！",
        pinyin: "Dēngjīkǒu cóng A qū gǎi dàole B qū, wǒmen kuài pǎo guòqù quèrèn yīxià ba!",
        vietnamese: "Cửa lên máy bay đổi từ khu A sang khu B rồi, tụi mình mau chạy qua xác nhận xem!"
      },
      {
        chinese: "别担心，如果航班取消了，我们可以去柜台退机票或者改签。",
        pinyin: "Bié dānxīn, rúguǒ hángbān qǔxiāole, wǒmen kěyǐ qù guìtái tuì jīpiào huòzhě gǎiqiān.",
        vietnamese: "Đừng lo, nếu chuyến bay bị hủy, tụi mình có thể ra quầy trả vé hoặc đổi chuyến."
      }
    ],
    initialAiGreeting: {
      chinese: "哎呀！刚才广播好像在念我们的航班号，你听清楚了吗？好像说航班晚点了！",
      pinyin: "Āiyā! Gāngcái guāngbō hǎoxiàng zài niàn wǒmen de hángbān hào, nǐ tīng qīngchǔ le ma? Hǎoxiàng shuō hángbān wǎndiǎn le!",
      vietnamese: "Ái chà! Vừa rồi loa dường như đang đọc số hiệu chuyến bay của tụi mình, cậu có nghe rõ không? Hình như nói chuyến bay bị muộn rồi!"
    }
  },
  {
    id: "scenario-4",
    number: 4,
    title: "Nhập cảnh tại Trung Quốc",
    titleChinese: "在海关办理入境手续",
    tagline: "Đối thoại với nhân viên hải quan và kiểm soát thị thực",
    context: "Du khách Việt Nam vừa hạ cánh tại sân bay quốc tế Bắc Kinh/Thượng Hải, đến quầy Hải quan (海关) để làm thủ tục 入境 (nhập cảnh). Nhân viên hỏi mục đích, kiểm tra visa và vé máy bay khứ hồi.",
    roles: {
      student: {
        roleId: "tourist",
        roleName: "Du khách (Học sinh)",
        roleDescription: "Bình tĩnh trả lời các câu hỏi về mục đích du lịch, thời gian lưu trú và xuất trình giấy tờ.",
        avatar: "🛂"
      },
      ai: {
        roleId: "customs_officer",
        roleName: "Nhân viên hải quan (AI)",
        roleDescription: "Nghiêm túc, chuẩn mực, hỏi về visa, mục đích nhập cảnh, vé về và hành lý cần khai báo.",
        avatar: "👮‍♂️"
      }
    },
    targetVocabulary: ["入境", "海关", "护照", "签证", "回程机票", "行李"],
    speakingRequirements: [
      "Xuất trình 护照 và 签证 theo yêu cầu.",
      "Trả lời rõ ràng về mục đích 入境 (ví dụ: 来旅游 - đi du lịch).",
      "Xuất trình 回程机票 (vé khứ hồi về nước).",
      "Khẳng định 行李 không có vật phẩm cần khai báo."
    ],
    suggestedPhrases: [
      {
        chinese: "海关官员好，这是我的护照和签证。",
        pinyin: "Hǎiguān guānyuán hǎo, zhè shì wǒ de hùzhào hé qiānzhèng.",
        vietnamese: "Chào cán bộ hải quan, đây là hộ chiếu và visa của tôi."
      },
      {
        chinese: "我来中国的目的是旅游，打算停留十五天。",
        pinyin: "Wǒ lái Zhōngguó de mùdì shì lǚyóu, dǎsuàn tíngliú shíwǔ tiān.",
        vietnamese: "Mục đích tôi đến Trung Quốc là để du lịch, dự định lưu trú 15 ngày."
      },
      {
        chinese: "这是我的回程机票订单，我的行李里没有需要申报的物品。",
        pinyin: "Zhè shì wǒ de huíchéng jīpiào dìngdān, wǒ de xínglǐ lǐ méiyǒu xūyào shēnbào de wùpǐn.",
        vietnamese: "Đây là đơn đặt vé máy bay chiều về của tôi, trong hành lý không có đồ cần khai báo."
      }
    ],
    initialAiGreeting: {
      chinese: "您好，请出示您的护照和有效签证。请问您来中国的目的是什么？",
      pinyin: "Nínhǎo, qǐng chūshì nín de hùzhào hé yǒuxiào qiānzhèng. Qǐngwèn nín lái Zhōngguó de mùdì shì shénme?",
      vietnamese: "Xin chào, vui lòng xuất trình hộ chiếu và visa hợp lệ. Xin hỏi mục đích bạn đến Trung Quốc là gì?"
    }
  },
  {
    id: "scenario-5",
    number: 5,
    title: "Lạc mất hành lý",
    titleChinese: "行李延误与遗失查询",
    tagline: "Báo sự cố tại quầy thất lạc hành lý ở băng chuyền",
    context: "Sau khi làm thủ tục nhập cảnh xong, hành khách đứng đợi ở băng chuyền (行李转盘) rất lâu nhưng không thấy vali. Khách đến quầy Trợ giúp Hành lý (行李查询柜台) để trình báo.",
    roles: {
      student: {
        roleId: "worried_traveler",
        roleName: "Hành khách (Học sinh)",
        roleDescription: "Miêu tả hình dáng, kích thước, màu sắc vali, cung cấp số thẻ lên máy bay và cuống hành lý ký gửi.",
        avatar: "🧳"
      },
      ai: {
        roleId: "lost_luggage_agent",
        roleName: "Nhân viên quầy hành lý (AI)",
        roleDescription: "Tận tình, trấn an khách, xin thẻ hành lý, tra cứu hệ thống chuyến bay và ghi nhận thông tin liên lạc.",
        avatar: "📋"
      }
    },
    targetVocabulary: ["行李", "托运", "行李转盘", "登机牌", "护照", "航班"],
    speakingRequirements: [
      "Mô tả sự cố 行李 bị mất tại băng chuyền.",
      "Xuất trình 登机牌 và 护照 có gắn cuống vé 托运.",
      "Cung cấp thông tin số hiệu 航班 và mô tả chi tiết vali (màu sắc, kích thước).",
      "Lấy biên nhận và để lại số điện thoại/khách sạn để liên hệ."
    ],
    suggestedPhrases: [
      {
        chinese: "您好，我的行李不见了！我在行李转盘等了很久都没看到。",
        pinyin: "Nínhǎo, wǒ de xínglǐ bújiàn le! Wǒ zài xínglǐ zhuànpán děngle hěn jiǔ dōu méi kàndào.",
        vietnamese: "Xin chào, hành lý của tôi bị biến đâu mất rồi! Tôi đợi ở băng chuyền rất lâu mà không thấy."
      },
      {
        chinese: "这是我的登机牌和护照，上面有托运行李的标签。我的航班是CA1234。",
        pinyin: "Zhè shì wǒ de dēngjīpái hé hùzhào, shàngmian yǒu tuōyùn xínglǐ de biāoqiān. Wǒ de hángbān shì CA1234.",
        vietnamese: "Đây là thẻ lên máy bay và hộ chiếu của tôi, bên trên có nhãn hành lý ký gửi. Chuyến bay của tôi là CA1234."
      },
      {
        chinese: "我的箱子是黑色的，很大，四角有银色的防撞条。",
        pinyin: "Wǒ de xiāngzi shì hēisè de, hěn dà, sì jiǎo yǒu yínsè de fángzhuàng tiáo.",
        vietnamese: "Vali của tôi màu đen, rất to, bốn góc có viền chống va đập màu bạc."
      }
    ],
    initialAiGreeting: {
      chinese: "您好，请别着急。请问有什么可以帮您？您的托运行李没有在转盘上出来吗？",
      pinyin: "Nínhǎo, qǐng bié zhāojí. Qǐngwèn yǒu shénme kěyǐ bāng nín? Nín de tuōyùn xínglǐ méiyǒu zài zhuànpán shang chūlái ma?",
      vietnamese: "Xin chào, quý khách đừng sốt ruột. Tôi có thể giúp gì cho quý khách? Có phải hành lý ký gửi của quý khách chưa ra ở băng chuyền không?"
    }
  },
  {
    id: "scenario-6",
    number: 6,
    title: "Về nước rồi!",
    titleChinese: "结束旅程准备回国",
    tagline: "Kết thúc chuyến đi, đợi lên máy bay về Việt Nam",
    context: "Hai người bạn kết thúc chuyến du lịch đáng nhớ tại Trung Quốc, đang ngồi chờ ở cửa lên máy bay (登机口) để chuẩn bị bay về Việt Nam. Họ cùng kiểm tra lại vé về, hộ chiếu và ôn lại kỷ niệm.",
    roles: {
      student: {
        roleId: "friend_returning",
        roleName: "Bạn học sinh",
        roleDescription: "Hào hứng kể lại kỷ niệm, kiểm tra lại vé máy bay về, nhắc nhở bạn giữ hộ chiếu và thẻ lên tàu cẩn thận.",
        avatar: "🇻🇳"
      },
      ai: {
        roleId: "travel_buddy",
        roleName: "Bạn đồng hành (AI)",
        roleDescription: "Vui vẻ, hào hứng, bàn về các món ăn đã ăn và hẹn lần sau lại sang Trung Quốc du lịch tiếp.",
        avatar: "🏮"
      }
    },
    targetVocabulary: ["回程机票", "登机牌", "登机口", "护照", "机场", "航班"],
    speakingRequirements: [
      "Kiểm tra 回程机票 và 登机牌 đã chuẩn bị đầy đủ chưa.",
      "Hỏi xem 登机口 số mấy và đã đến giờ lên máy bay chưa.",
      "Nhắc nhau luôn cầm 护照 và 登机牌 trên tay khi qua cửa an ninh/cửa lên máy bay.",
      "Chia sẻ cảm nghĩ về chuyến du lịch và hẹn dịp tái ngộ."
    ],
    suggestedPhrases: [
      {
        chinese: "你的回程机票和登机牌拿好了吗？我们的登机口是几号？",
        pinyin: "Nǐ de huíchéng jīpiào hé dēngjīpái ná hǎole ma? Wǒmen de dēngjīkǒu shì jǐ hào?",
        vietnamese: "Vé chiều về và thẻ lên máy bay của cậu đã cầm chắc chưa? Cửa lên máy bay của tụi mình là số mấy?"
      },
      {
        chinese: "护照和登机牌一定要拿在手里，一会儿登机的时候还要检查呢。",
        pinyin: "Hùzhào hé dēngjīpái yīdìng yào ná zài shǒu lǐ, yīhuǐ'er dēngjī de shíhou hái yào jiǎnchá ne.",
        vietnamese: "Hộ chiếu và thẻ lên máy bay nhất định phải cầm trên tay, lát nữa lúc lên máy bay còn phải kiểm tra đấy."
      },
      {
        chinese: "这次中国之行太好玩了，下次放假我们再一起来玩吧！",
        pinyin: "Zhè cì Zhōngguó zhī xíng tài hǎowán le, xià cì fàngjià wǒmen zài yīqǐ lái wán ba!",
        vietnamese: "Chuyến đi Trung Quốc lần này vui quá chừng, kỳ nghỉ tới tụi mình lại cùng nhau sang chơi tiếp nhé!"
      }
    ],
    initialAiGreeting: {
      chinese: "时间过得真快，今天我们就要回国了！你的登机牌和护照都拿在手里了吗？",
      pinyin: "Shíjiān guò de zhēn kuài, jīntiān wǒmen jiù yào huíguó le! Nǐ de dēngjīpái hé hùzhào dōu ná zài shǒu lǐ le ma?",
      vietnamese: "Thời gian trôi nhanh thật, hôm nay tụi mình phải về nước rồi! Thẻ lên máy bay và hộ chiếu của cậu đã cầm sẵn trên tay chưa?"
    }
  }
];

export const QUICK_CHALLENGES = [
  {
    id: "qc-1",
    scenario: "Tại quầy Hải quan (海关)",
    questionChinese: "您好，请问您来中国的目的是什么？打算住几天？",
    questionPinyin: "Nínhǎo, qǐngwèn nín lái Zhōngguó de mùdì shì shénme? Dǎsuàn zhù jǐ tiān?",
    questionVietnamese: "Xin chào, xin hỏi mục đích bạn đến Trung Quốc là gì? Dự định ở mấy ngày?",
    hintChinese: "我来旅游，打算住十五天。(Wǒ lái lǚyóu, dǎsuàn zhù shíwǔ tiān.)",
    targetKeywords: ["旅游", "目的", "住"]
  },
  {
    id: "qc-2",
    scenario: "Tại quầy Check-in (值机)",
    questionChinese: "请问您有几件行李需要办理托运？里面有液体或电池吗？",
    questionPinyin: "Qǐngwèn nín yǒu jǐ jiàn xínglǐ xūyào bànlǐ tuōyùn? Lǐmiàn yǒu yètǐ huò diànchí ma?",
    questionVietnamese: "Xin hỏi bạn có mấy kiện hành lý cần làm thủ tục ký gửi? Bên trong có chất lỏng hoặc pin không?",
    hintChinese: "我有一件箱子要托运，里面没有违禁品。(Wǒ yǒu yí jiàn xiāngzi yào tuōyùn, lǐmiàn méiyǒu wéijìnpǐn.)",
    targetKeywords: ["托运", "行李", "箱子"]
  },
  {
    id: "qc-3",
    scenario: "Loa phát thanh & Cửa lên máy bay",
    questionChinese: "广播说我们的登机口从23号改到了45号，现在我们该怎么办？",
    questionPinyin: "Guāngbō shuō wǒmen de dēngjīkǒu cóng èrshísān hào gǎi dàole sìshíwǔ hào, xiànzài wǒmen gāi zěnme bàn?",
    questionVietnamese: "Loa nói cửa lên máy bay của chúng ta đổi từ số 23 sang số 45, bây giờ chúng ta nên làm thế nào?",
    hintChinese: "我们得赶紧带好随身行李跑去45号登机口！(Wǒmen děi gǎnjǐn dài hǎo suíshēn xínglǐ pǎo qù sìshíwǔ hào dēngjīkǒu!)",
    targetKeywords: ["登机口", "赶紧", "随身"]
  },
  {
    id: "qc-4",
    scenario: "Tại quầy Thất lạc Hành lý",
    questionChinese: "请出示您的登机牌和行李票，并描述一下您的箱子外观。",
    questionPinyin: "Qǐng chūshì nín de dēngjīpái hé xínglǐpiào, bìng miáoshù yīxià nín de xiāngzi wàiguān.",
    questionVietnamese: "Vui lòng xuất trình thẻ lên máy bay và vé hành lý, đồng thời miêu tả một chút ngoại quan chiếc vali của bạn.",
    hintChinese: "这是我的登机牌。我的箱子是黑色的，很大。(Zhè shì wǒ de dēngjīpái. Wǒ de xiāngzi shì hēisè de, hěn dà.)",
    targetKeywords: ["登机牌", "箱子", "黑色"]
  }
];

export const AIRPORT_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Thông báo hoãn chuyến bay (航班晚点)",
    chinese: "各位旅客请注意，由北京飞往河内的CA1234次航班，由于天气原因延误，预计起飞时间推迟至下午两点三十分，请各位旅客在候机室耐心等待广播。",
    pinyin: "Gèwèi lǚkè qǐng zhùyì, yóu Běijīng fēi wǎng Hénèi de CA1234 cì hángbān, yóu yú tiānqì yuányīn yánwù, yùjì qǐfēi shíjiān tuīchí zhì xiàwǔ liǎng diǎn sānshí fēn, qǐng gèwèi lǚkè zài hòujīshì nàixīn děngdài guāngbō.",
    vietnamese: "Kính thưa quý hành khách, chuyến bay CA1234 khởi hành từ Bắc Kinh đi Hà Nội, do nguyên nhân thời tiết nên bị hoãn, giờ cất cánh dự kiến lùi lại đến 14h30 chiều. Kính mời quý khách kiên nhẫn đợi thông báo trong phòng chờ.",
    quiz: {
      question: "Chuyến bay CA1234 bị hoãn vì lý do gì và lùi đến mấy giờ?",
      options: [
        "Do thời tiết xấu, lùi đến 14h30 chiều",
        "Do máy bay hỏng, lùi đến 12h00 trưa",
        "Do hành khách đến muộn, lùi sang ngày mai"
      ],
      correctIndex: 0
    }
  },
  {
    id: "ann-2",
    title: "Thông báo thay đổi cửa lên máy bay (更改登机口)",
    chinese: "前往广州的VN512次航班乘客请注意，本次航班的登机口已由原来的A12号更改为B08号。请大家带好随身物品，前往B08号登机口准备登机。",
    pinyin: "Qiánwǎng Guǎngzhōu de VN512 cì hángbān chéngkè qǐng zhùyì, běn cì hángbān de dēngjīkǒu yǐ yóu yuánlái de A12 hào gēnggǎi wéi B08 hào. Qǐng dàjiā dài hǎo suíshēn wùpǐn, qiánwǎng B08 hào dēngjīkǒu zhǔnbèi dēngjī.",
    vietnamese: "Hành khách đi chuyến bay VN512 tới Quảng Châu xin chú ý, cửa lên máy bay của chuyến bay này đã đổi từ A12 sang B08. Vui lòng mang theo đồ đạc cá nhân di chuyển đến cửa B08 chuẩn bị lên máy bay.",
    quiz: {
      question: "Cửa lên máy bay đã được chuyển sang vị trí nào?",
      options: [
        "Chuyển từ B08 sang A12",
        "Chuyển từ A12 sang B08",
        "Vẫn giữ nguyên tại phòng chờ VIP"
      ],
      correctIndex: 1
    }
  }
];
