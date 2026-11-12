export interface Step1Question {
  id: string;
  noteKey: string;
  chinese: string;
  pinyin: string;
  vietnamese: string;
}

export interface Step2QAPair {
  id: string;
  question: {
    chinese: string;
    pinyin: string;
    vietnamese: string;
  };
  answer: {
    chinese: string;
    pinyin: string;
    vietnamese: string;
  };
}

export interface DialogueLine {
  id: string;
  speaker: 'A' | 'B' | 'staff' | 'broadcast';
  speakerName: string;
  chinese: string;
  pinyin: string;
  vietnamese: string;
}

export interface CurriculumScenario {
  id: number;
  title: string;
  subTitle: string;
  context: string;
  roles: {
    name: string;
    description: string;
  }[];
  tasks: string[];
  vocabTags: string[];
  step1Questions: Step1Question[];
  step2QAPairs: Step2QAPair[];
  fullDialogue: DialogueLine[];
}

export interface VocabMatrixItem {
  word: string;
  pinyin: string;
  meaning: string;
  scenarios: number[];
}

export interface TeachingTip {
  num: number;
  title: string;
  desc: string;
}

export const CURRICULUM_SCENARIOS: CurriculumScenario[] = [
  {
    id: 1,
    title: '“Ngày mai bay rồi!” – Chuẩn bị trước chuyến đi',
    subTitle: 'Hai bạn nói chuyện qua điện thoại tối hôm trước',
    context: 'Hai bạn học sinh chuẩn bị đi du lịch Trung Quốc. Một người đã có kinh nghiệm, một người lần đầu đi máy bay. Họ nói chuyện qua điện thoại tối hôm trước.',
    roles: [
      { name: 'A (có kinh nghiệm)', description: 'Hỏi thăm tình hình chuẩn bị của B.' },
      { name: 'B (lần đầu đi)', description: 'Lo lắng, chưa biết cần chuẩn bị gì.' }
    ],
    tasks: [
      'Hỏi đáp về 护照 (hộ chiếu), 签证 (visa), 机票 (vé máy bay), 回程机票 (vé về).',
      'Nhắc nhở 收拾行李 (dọn hành lý) và kiểm tra 护照 còn hạn.',
      'Gợi ý 订机票 (đặt vé) và lưu ý 退机票 (hủy vé) nếu đổi kế hoạch.'
    ],
    vocabTags: ['护照', '签证', '机票', '回程机票', '行李'],
    step1Questions: [
      {
        id: 's1-q1',
        noteKey: 's1-q1',
        chinese: '喂，你明天的飞机是几点的？',
        pinyin: 'wèi, nǐ míngtiān de fēijī shì jǐ diǎn de?',
        vietnamese: 'Alo, máy bay ngày mai của bạn mấy giờ?'
      },
      {
        id: 's1-q2',
        noteKey: 's1-q2',
        chinese: '你的护照和签证都办好了吗？',
        pinyin: 'nǐ de hùzhào hé qiānzhèng dōu bànhǎo le ma?',
        vietnamese: 'Hộ chiếu và visa bạn làm xong chưa?'
      },
      {
        id: 's1-q3',
        noteKey: 's1-q3',
        chinese: '回程机票买了吗？',
        pinyin: 'huíchéng jīpiào mǎi le ma?',
        vietnamese: 'Vé về mua chưa?'
      },
      {
        id: 's1-q4',
        noteKey: 's1-q4',
        chinese: '行李收拾好了吗？',
        pinyin: 'xínglǐ shōushi hǎo le ma?',
        vietnamese: 'Dọn hành lý chưa?'
      }
    ],
    step2QAPairs: [
      {
        id: 's1-qa1',
        question: {
          chinese: '喂，你明天的飞机是几点的？',
          pinyin: 'wèi, nǐ míngtiān de fēijī shì jǐ diǎn de?',
          vietnamese: 'Alo, máy bay ngày mai của bạn mấy giờ?'
        },
        answer: {
          chinese: '早上九点的。因为我家离机场比较远，所以我六点就得起床出发。',
          pinyin: 'zǎoshang jiǔ diǎn de. yīnwèi wǒ jiā lí jīchǎng bǐjiào yuǎn, suǒyǐ wǒ liù diǎn jiù děi qǐchuáng chūfā.',
          vietnamese: '9 giờ sáng. Vì nhà tôi cách sân bay khá xa, nên 6 giờ tôi phải dậy xuất phát.'
        }
      },
      {
        id: 's1-qa2',
        question: {
          chinese: '你的护照和签证都办好了吗？',
          pinyin: 'nǐ de hùzhào hé qiānzhèng dōu bànhǎo le ma?',
          vietnamese: 'Hộ chiếu và visa bạn làm xong chưa?'
        },
        answer: {
          chinese: '办好了。我的签证是多次往返的，明年还可以再去。',
          pinyin: 'bànhǎo le. wǒ de qiānzhèng shì duōcì wǎngfǎn de, míngnián hái kěyǐ zài qù.',
          vietnamese: 'Xong rồi. Visa tôi loại nhiều lần, năm sau còn đi được.'
        }
      },
      {
        id: 's1-qa3',
        question: {
          chinese: '回程机票买了吗？',
          pinyin: 'huíchéng jīpiào mǎi le ma?',
          vietnamese: 'Vé về mua chưa?'
        },
        answer: {
          chinese: '买好了，我已经保存在手机里了。',
          pinyin: 'mǎi hǎo le, wǒ yǐjīng bǎocún zài shǒujī lǐ le.',
          vietnamese: 'Mua rồi, tôi lưu trong điện thoại rồi.'
        }
      },
      {
        id: 's1-qa4',
        question: {
          chinese: '行李收拾好了吗？',
          pinyin: 'xínglǐ shōushi hǎo le ma?',
          vietnamese: 'Dọn hành lý chưa?'
        },
        answer: {
          chinese: '差不多了，装满了整整一个大箱子。',
          pinyin: 'chàbuduō le, zhuāngmǎn le zhěngzhěng yí ge dà xiāngzi.',
          vietnamese: 'Gần xong rồi, đầy cả một vali to.'
        }
      }
    ],
    fullDialogue: [
      {
        id: 'dlg1-1',
        speaker: 'A',
        speakerName: 'Bạn A',
        chinese: '喂，你明天的飞机是几点的？',
        pinyin: 'wèi, nǐ míngtiān de fēijī shì jǐ diǎn de?',
        vietnamese: 'Alo, máy bay ngày mai của bạn mấy giờ?'
      },
      {
        id: 'dlg1-2',
        speaker: 'B',
        speakerName: 'Bạn B',
        chinese: '早上九点的。因为我家离机场比较远，所以我六点就得起床出发。',
        pinyin: 'zǎoshang jiǔ diǎn de. yīnwèi wǒ jiā lí jīchǎng bǐjiào yuǎn, suǒyǐ wǒ liù diǎn jiù děi qǐchuáng chūfā.',
        vietnamese: '9 giờ sáng. Vì nhà tôi cách sân bay khá xa, nên 6 giờ tôi phải dậy xuất phát.'
      },
      {
        id: 'dlg1-3',
        speaker: 'A',
        speakerName: 'Bạn A',
        chinese: '你的护照和签证都办好了吗？',
        pinyin: 'nǐ de hùzhào hé qiānzhèng dōu bànhǎo le ma?',
        vietnamese: 'Hộ chiếu và visa bạn làm xong chưa?'
      },
      {
        id: 'dlg1-4',
        speaker: 'B',
        speakerName: 'Bạn B',
        chinese: '办好了。我的签证是多次往返的，明年还可以再去。',
        pinyin: 'bànhǎo le. wǒ de qiānzhèng shì duōcì wǎngfǎn de, míngnián hái kěyǐ zài qù.',
        vietnamese: 'Xong rồi. Visa tôi loại nhiều lần, năm sau còn đi được.'
      },
      {
        id: 'dlg1-5',
        speaker: 'A',
        speakerName: 'Bạn A',
        chinese: '回程机票买了吗？入境的时候海关可能会看。',
        pinyin: 'huíchéng jīpiào mǎi le ma? rùjìng de shíhou hǎiguān kěnéng huì kàn.',
        vietnamese: 'Vé về mua chưa? Lúc nhập cảnh hải quan có thể xem.'
      },
      {
        id: 'dlg1-6',
        speaker: 'B',
        speakerName: 'Bạn B',
        chinese: '买好了，我已经保存在手机里了。',
        pinyin: 'mǎi hǎo le, wǒ yǐjīng bǎocún zài shǒujī lǐ le.',
        vietnamese: 'Mua rồi, tôi lưu trong điện thoại rồi.'
      },
      {
        id: 'dlg1-7',
        speaker: 'A',
        speakerName: 'Bạn A',
        chinese: '行李收拾好了吗？别超重了。',
        pinyin: 'xínglǐ shōushi hǎo le ma? bié chāozhòng le.',
        vietnamese: 'Dọn hành lý chưa? Đừng quá cân.'
      },
      {
        id: 'dlg1-8',
        speaker: 'B',
        speakerName: 'Bạn B',
        chinese: '差不多了，我的行李特别多，装满了整整一个大箱子。',
        pinyin: 'chàbuduō le, wǒ de xínglǐ tèbié duō, zhuāngmǎn le zhěngzhěng yí ge dà xiāngzi.',
        vietnamese: 'Gần xong rồi, hành lý tôi nhiều lắm, đầy cả một vali to.'
      },
      {
        id: 'dlg1-9',
        speaker: 'A',
        speakerName: 'Bạn A',
        chinese: '如果有液体化妆品，记得办理托运。',
        pinyin: 'rúguǒ yǒu yètǐ huàzhuāngpǐn, jìde bànlǐ tuōyùn.',
        vietnamese: 'Nếu có mỹ phẩm lỏng, nhớ ký gửi.'
      },
      {
        id: 'dlg1-10',
        speaker: 'B',
        speakerName: 'Bạn B',
        chinese: '好的，谢谢你提醒！',
        pinyin: 'hǎo de, xièxie nǐ tíxǐng!',
        vietnamese: 'Được, cảm ơn bạn nhắc!'
      }
    ]
  },
  {
    id: 2,
    title: '“Tại quầy check-in” – Làm thủ tục tại sân bay',
    subTitle: 'Hành khách và nhân viên hàng không tại quầy 值机',
    context: 'Một hành khách đến quầy 值机 (check-in) của hãng hàng không. Nhân viên làm thủ tục cho khách.',
    roles: [
      { name: 'Nhân viên hàng không', description: 'Hỏi giấy tờ, cân hành lý, phát thẻ lên máy bay.' },
      { name: 'Hành khách', description: 'Xuất trình 护照, 机票, gửi 行李 托运.' }
    ],
    tasks: [
      'Yêu cầu xuất trình 护照 và 机票.',
      'Hỏi về 行李 có 托运 không, có 超重 không.',
      'Thông báo 登机口 và giờ 登机.',
      'Đưa 登机牌 cho khách.'
    ],
    vocabTags: ['值机', '护照', '机票', '行李', '托运', '登机牌', '登机口'],
    step1Questions: [
      {
        id: 's2-q1',
        noteKey: 's2-q1',
        chinese: '您好，请出示您的护照和机票。',
        pinyin: 'nín hǎo, qǐng chūshì nín de hùzhào hé jīpiào.',
        vietnamese: 'Xin chào, vui lòng xuất trình hộ chiếu và vé.'
      },
      {
        id: 's2-q2',
        noteKey: 's2-q2',
        chinese: '您的行李需要托运吗？',
        pinyin: 'nín de xínglǐ xūyào tuōyùn ma?',
        vietnamese: 'Hành lý của bạn cần ký gửi không?'
      },
      {
        id: 's2-q3',
        noteKey: 's2-q3',
        chinese: '您的行李超重了两公斤，需要额外付费。',
        pinyin: 'nín de xínglǐ chāozhòng le liǎng gōngjīn, xūyào èwài fùfèi.',
        vietnamese: 'Hành lý của bạn quá cân 2 kg, cần trả thêm phí.'
      },
      {
        id: 's2-q4',
        noteKey: 's2-q4',
        chinese: '登机口是23号，这是您的登机牌。',
        pinyin: 'dēngjīkǒu shì èrshísān hào, zhè shì nín de dēngjīpái.',
        vietnamese: 'Cửa lên máy bay số 23, đây là thẻ lên máy bay của bạn.'
      }
    ],
    step2QAPairs: [
      {
        id: 's2-qa1',
        question: {
          chinese: '您好，请出示您的护照和机票。',
          pinyin: 'nín hǎo, qǐng chūshì nín de hùzhào hé jīpiào.',
          vietnamese: 'Xin chào, vui lòng xuất trình hộ chiếu và vé.'
        },
        answer: {
          chinese: '好的，这是我的护照和机票。',
          pinyin: 'hǎo de, zhè shì wǒ de hùzhào hé jīpiào.',
          vietnamese: 'Vâng, đây là hộ chiếu và vé của tôi.'
        }
      },
      {
        id: 's2-qa2',
        question: {
          chinese: '您的行李需要托运吗？',
          pinyin: 'nín de xínglǐ xūyào tuōyùn ma?',
          vietnamese: 'Hành lý của bạn cần ký gửi không?'
        },
        answer: {
          chinese: '需要，这个箱子托运，这个包我随身带。',
          pinyin: 'xūyào, zhège xiāngzi tuōyùn, zhège bāo wǒ suíshēn dài.',
          vietnamese: 'Cần, vali này ký gửi, túi này tôi xách tay.'
        }
      },
      {
        id: 's2-qa3',
        question: {
          chinese: '您的行李超重了两公斤，需要额外付费。',
          pinyin: 'nín de xínglǐ chāozhòng le liǎng gōngjīn, xūyào èwài fùfèi.',
          vietnamese: 'Hành lý của bạn quá cân 2 kg, cần trả thêm phí.'
        },
        answer: {
          chinese: '好的，没问题。请问登机口是几号？',
          pinyin: 'hǎo de, méi wèntí. qǐngwèn dēngjīkǒu shì jǐ hào?',
          vietnamese: 'Được, không vấn đề. Cho hỏi cửa lên máy bay số mấy?'
        }
      },
      {
        id: 's2-qa4',
        question: {
          chinese: '登机口是23号，这是您的登机牌。',
          pinyin: 'dēngjīkǒu shì èrshísān hào, zhè shì nín de dēngjīpái.',
          vietnamese: 'Cửa lên máy bay số 23, đây là thẻ lên máy bay của bạn.'
        },
        answer: {
          chinese: '谢谢！请问安检在哪里？',
          pinyin: 'xièxie! qǐngwèn ānjiǎn zài nǎlǐ?',
          vietnamese: 'Cảm ơn! Cho hỏi kiểm tra an ninh ở đâu?'
        }
      }
    ],
    fullDialogue: [
      {
        id: 'dlg2-1',
        speaker: 'staff',
        speakerName: 'Nhân viên quầy',
        chinese: '您好，请出示您的护照和机票。',
        pinyin: 'nín hǎo, qǐng chūshì nín de hùzhào hé jīpiào.',
        vietnamese: 'Xin chào, vui lòng xuất trình hộ chiếu và vé.'
      },
      {
        id: 'dlg2-2',
        speaker: 'A',
        speakerName: 'Hành khách',
        chinese: '好的，这是我的护照和机票。',
        pinyin: 'hǎo de, zhè shì wǒ de hùzhào hé jīpiào.',
        vietnamese: 'Vâng, đây là hộ chiếu và vé của tôi.'
      },
      {
        id: 'dlg2-3',
        speaker: 'staff',
        speakerName: 'Nhân viên quầy',
        chinese: '您的行李需要托运吗？',
        pinyin: 'nín de xínglǐ xūyào tuōyùn ma?',
        vietnamese: 'Hành lý của bạn cần ký gửi không?'
      },
      {
        id: 'dlg2-4',
        speaker: 'A',
        speakerName: 'Hành khách',
        chinese: '需要，这个箱子托运，这个包我随身带。',
        pinyin: 'xūyào, zhège xiāngzi tuōyùn, zhège bāo wǒ suíshēn dài.',
        vietnamese: 'Cần, vali này ký gửi, túi này tôi xách tay.'
      },
      {
        id: 'dlg2-5',
        speaker: 'staff',
        speakerName: 'Nhân viên quầy',
        chinese: '请把箱子放上来称一下。……您的行李超重了两公斤，需要额外付费。',
        pinyin: 'qǐng bǎ xiāngzi fàng shànglái chēng yíxià. …… nín de xínglǐ chāozhòng le liǎng gōngjīn, xūyào èwài fùfèi.',
        vietnamese: 'Vui lòng đặt vali lên cân. … Hành lý của bạn quá cân 2 kg, cần trả thêm phí.'
      },
      {
        id: 'dlg2-6',
        speaker: 'A',
        speakerName: 'Hành khách',
        chinese: '好的，没问题。请问登机口是几号？',
        pinyin: 'hǎo de, méi wèntí. qǐngwèn dēngjīkǒu shì jǐ hào?',
        vietnamese: 'Được, không vấn đề. Cho hỏi cửa lên máy bay số mấy?'
      },
      {
        id: 'dlg2-7',
        speaker: 'staff',
        speakerName: 'Nhân viên quầy',
        chinese: '登机口是23号，这是您的登机牌，请拿好。',
        pinyin: 'dēngjīkǒu shì èrshísān hào, zhè shì nín de dēngjīpái, qǐng ná hǎo.',
        vietnamese: 'Cửa số 23, đây là thẻ lên máy bay, cầm cho chắc.'
      },
      {
        id: 'dlg2-8',
        speaker: 'A',
        speakerName: 'Hành khách',
        chinese: '谢谢！请问安检在哪里？',
        pinyin: 'xièxie! qǐngwèn ānjiǎn zài nǎlǐ?',
        vietnamese: 'Cảm ơn! Cho hỏi kiểm tra an ninh ở đâu?'
      },
      {
        id: 'dlg2-9',
        speaker: 'staff',
        speakerName: 'Nhân viên quầy',
        chinese: '一直往前走，左转就到了。',
        pinyin: 'yìzhí wǎng qián zǒu, zuǒ zhuǎn jiù dào le.',
        vietnamese: 'Đi thẳng, rẽ trái là tới.'
      }
    ]
  },
  {
    id: 3,
    title: '“Thông báo khẩn tại sân bay” – Xử lý tình huống phát sinh',
    subTitle: 'Loa phát thanh báo 航班 晚点 / 取消',
    context: 'Tại 机场, loa phát thanh thông báo 航班 bị 晚点 (muộn) hoặc 取消 (hủy). Hai hành khách bàn bạc xem nên làm gì.',
    roles: [
      { name: 'Hành khách A', description: 'Bình tĩnh, đề xuất giải pháp.' },
      { name: 'Hành khách B', description: 'Lo lắng, sợ lỡ việc.' },
      { name: 'Nhân viên sân bay', description: 'Giải đáp thắc mắc.' }
    ],
    tasks: [
      'Thông báo 航班 bị 晚点 / 取消.',
      'Hỏi nhau về 登机口 có thay đổi không.',
      'Bàn về việc 退机票 hoặc đổi 航班 khác.',
      'Tìm 登机口 mới, kiểm tra 登机牌.'
    ],
    vocabTags: ['机场', '航班', '晚点', '取消', '登机口', '登机牌', '机票'],
    step1Questions: [
      {
        id: 's3-q1',
        noteKey: 's3-q1',
        chinese: '我们的航班晚点两个小时了，怎么办？',
        pinyin: 'wǒmen de hángbān wǎndiǎn liǎng ge xiǎoshí le, zěnme bàn?',
        vietnamese: 'Chuyến bay của chúng ta muộn 2 tiếng rồi, làm sao?'
      },
      {
        id: 's3-q2',
        noteKey: 's3-q2',
        chinese: '如果航班取消了怎么办？',
        pinyin: 'rúguǒ hángbān qǔxiāo le zěnme bàn?',
        vietnamese: 'Nếu chuyến bay bị hủy thì sao?'
      },
      {
        id: 's3-q3',
        noteKey: 's3-q3',
        chinese: '请问CA1234航班还飞吗？',
        pinyin: 'qǐngwèn CA1234 hángbān hái fēi ma?',
        vietnamese: 'Cho hỏi chuyến CA1234 còn bay không?'
      }
    ],
    step2QAPairs: [
      {
        id: 's3-qa1',
        question: {
          chinese: '我们的航班晚点两个小时了，怎么办？',
          pinyin: 'wǒmen de hángbān wǎndiǎn liǎng ge xiǎoshí le, zěnme bàn?',
          vietnamese: 'Chuyến bay của chúng ta muộn 2 tiếng rồi, làm sao?'
        },
        answer: {
          chinese: '别着急，我们先去新的登机口看看。',
          pinyin: 'bié zháojí, wǒmen xiān qù xīn de dēngjīkǒu kànkan.',
          vietnamese: 'Đừng lo, chúng ta đến cửa mới xem sao.'
        }
      },
      {
        id: 's3-qa2',
        question: {
          chinese: '如果航班取消了怎么办？',
          pinyin: 'rúguǒ hángbān qǔxiāo le zěnme bàn?',
          vietnamese: 'Nếu chuyến bay bị hủy thì sao?'
        },
        answer: {
          chinese: '如果取消了，我们得去退机票或者改签。',
          pinyin: 'rúguǒ qǔxiāo le, wǒmen děi qù tuì jīpiào huòzhě gǎiqiān.',
          vietnamese: 'Nếu hủy, chúng ta phải hủy vé hoặc đổi chuyến.'
        }
      },
      {
        id: 's3-qa3',
        question: {
          chinese: '请问CA1234航班还飞吗？',
          pinyin: 'qǐngwèn CA1234 hángbān hái fēi ma?',
          vietnamese: 'Cho hỏi chuyến CA1234 còn bay không?'
        },
        answer: {
          chinese: '目前只是晚点，请留意广播通知。',
          pinyin: 'mùqián zhǐshì wǎndiǎn, qǐng liúyì guǎngbō tōngzhī.',
          vietnamese: 'Hiện chỉ muộn thôi, chú ý thông báo loa.'
        }
      }
    ],
    fullDialogue: [
      {
        id: 'dlg3-1',
        speaker: 'broadcast',
        speakerName: 'Loa phát thanh',
        chinese: '各位旅客请注意，飞往北京的CA1234航班由于天气原因晚点两个小时，登机口从A区改到B区。',
        pinyin: 'gèwèi lǚkè qǐng zhùyì, fēi wǎng Běijīng de CA1234 hángbān yóuyú tiānqì yuányīn wǎndiǎn liǎng ge xiǎoshí, dēngjīkǒu cóng A qū gǎi dào B qū.',
        vietnamese: 'Xin chú ý, chuyến bay CA1234 đi Bắc Kinh do thời tiết bị muộn 2 tiếng, cửa lên máy bay đổi từ khu A sang khu B.'
      },
      {
        id: 'dlg3-2',
        speaker: 'A',
        speakerName: 'Hành khách A',
        chinese: '你听到了吗？我们的航班晚点两个小时了！',
        pinyin: 'nǐ tīngdào le ma? wǒmen de hángbān wǎndiǎn liǎng ge xiǎoshí le!',
        vietnamese: 'Bạn nghe thấy không? Chuyến bay của chúng ta muộn 2 tiếng rồi!'
      },
      {
        id: 'dlg3-3',
        speaker: 'B',
        speakerName: 'Hành khách B',
        chinese: '啊？那怎么办？我们会不会赶不上转机？',
        pinyin: 'a? nà zěnme bàn? wǒmen huì bú huì gǎnbushàng zhuǎnjī?',
        vietnamese: 'Hả? Vậy làm sao? Chúng ta có bị lỡ chuyến nối không?'
      },
      {
        id: 'dlg3-4',
        speaker: 'A',
        speakerName: 'Hành khách A',
        chinese: '别着急，我们先去新的登机口看看。',
        pinyin: 'bié zháojí, wǒmen xiān qù xīn de dēngjīkǒu kànkan.',
        vietnamese: 'Đừng lo, chúng ta đến cửa mới xem sao.'
      },
      {
        id: 'dlg3-5',
        speaker: 'B',
        speakerName: 'Hành khách B',
        chinese: '如果航班取消了怎么办？',
        pinyin: 'rúguǒ hángbān qǔxiāo le zěnme bàn?',
        vietnamese: 'Nếu chuyến bay bị hủy thì sao?'
      },
      {
        id: 'dlg3-6',
        speaker: 'A',
        speakerName: 'Hành khách A',
        chinese: '如果取消了，我们得去退机票或者改签。',
        pinyin: 'rúguǒ qǔxiāo le, wǒmen děi qù tuì jīpiào huòzhě gǎiqiān.',
        vietnamese: 'Nếu hủy, chúng ta phải hủy vé hoặc đổi chuyến.'
      },
      {
        id: 'dlg3-7',
        speaker: 'B',
        speakerName: 'Hành khách B',
        chinese: '好吧，我先去问问工作人员。',
        pinyin: 'hǎo ba, wǒ xiān qù wènwen gōngzuò rényuán.',
        vietnamese: 'Được, tôi đi hỏi nhân viên trước.'
      },
      {
        id: 'dlg3-8',
        speaker: 'staff',
        speakerName: 'Nhân viên quầy',
        chinese: '您好，有什么可以帮您？',
        pinyin: 'nín hǎo, yǒu shénme kěyǐ bāng nín?',
        vietnamese: 'Xin chào, tôi có thể giúp gì?'
      },
      {
        id: 'dlg3-9',
        speaker: 'B',
        speakerName: 'Hành khách B',
        chinese: '请问CA1234航班还飞吗？',
        pinyin: 'qǐngwèn CA1234 hángbān hái fēi ma?',
        vietnamese: 'Cho hỏi chuyến CA1234 còn bay không?'
      },
      {
        id: 'dlg3-10',
        speaker: 'staff',
        speakerName: 'Nhân viên quầy',
        chinese: '目前只是晚点，请留意广播通知。',
        pinyin: 'mùqián zhǐshì wǎndiǎn, qǐng liúyì guǎngbō tōngzhī.',
        vietnamese: 'Hiện chỉ muộn thôi, chú ý thông báo loa.'
      }
    ]
  },
  {
    id: 4,
    title: '“Nhập cảnh tại Trung Quốc” – Qua cửa hải quan',
    subTitle: 'Du khách Việt Nam và nhân viên hải quan',
    context: 'Một du khách Việt Nam đến 入境 (nhập cảnh) Trung Quốc. Nhân viên 海关 (hải quan) kiểm tra giấy tờ.',
    roles: [
      { name: 'Nhân viên hải quan', description: 'Hỏi mục đích 入境, kiểm tra 签证, 护照, 回程机票.' },
      { name: 'Du khách', description: 'Trả lời trung thực, xuất trình giấy tờ.' }
    ],
    tasks: [
      'Yêu cầu xuất trình 护照 và 签证.',
      'Hỏi mục đích 入境 (du lịch, công tác...).',
      'Yêu cầu xuất trình 回程机票.',
      'Hỏi về 行李 có gì cần khai báo không.'
    ],
    vocabTags: ['入境', '海关', '护照', '签证', '回程机票', '行李'],
    step1Questions: [
      {
        id: 's4-q1',
        noteKey: 's4-q1',
        chinese: '请出示您的护照和签证。',
        pinyin: 'qǐng chūshì nín de hùzhào hé qiānzhèng.',
        vietnamese: 'Vui lòng xuất trình hộ chiếu và visa.'
      },
      {
        id: 's4-q2',
        noteKey: 's4-q2',
        chinese: '您来中国的目的是什么？',
        pinyin: 'nín lái Zhōngguó de mùdì shì shénme?',
        vietnamese: 'Mục đích bạn đến Trung Quốc là gì?'
      },
      {
        id: 's4-q3',
        noteKey: 's4-q3',
        chinese: '请出示您的回程机票。',
        pinyin: 'qǐng chūshì nín de huíchéng jīpiào.',
        vietnamese: 'Vui lòng xuất trình vé về.'
      },
      {
        id: 's4-q4',
        noteKey: 's4-q4',
        chinese: '您的行李里有没有需要申报的物品？',
        pinyin: 'nín de xínglǐ lǐ yǒu méiyǒu xūyào shēnbào de wùpǐn?',
        vietnamese: 'Trong hành lý có đồ cần khai báo không?'
      }
    ],
    step2QAPairs: [
      {
        id: 's4-qa1',
        question: {
          chinese: '请出示您的护照和签证。',
          pinyin: 'qǐng chūshì nín de hùzhào hé qiānzhèng.',
          vietnamese: 'Vui lòng xuất trình hộ chiếu và visa.'
        },
        answer: {
          chinese: '好的，给您。',
          pinyin: 'hǎo de, gěi nín.',
          vietnamese: 'Vâng, đây ạ.'
        }
      },
      {
        id: 's4-qa2',
        question: {
          chinese: '您来中国的目的是什么？',
          pinyin: 'nín lái Zhōngguó de mùdì shì shénme?',
          vietnamese: 'Mục đích bạn đến Trung Quốc là gì?'
        },
        answer: {
          chinese: '我是来旅游的，打算待半个月。',
          pinyin: 'wǒ shì lái lǚyóu de, dǎsuàn dāi bàn ge yuè.',
          vietnamese: 'Tôi đến du lịch, định ở nửa tháng.'
        }
      },
      {
        id: 's4-qa3',
        question: {
          chinese: '请出示您的回程机票。',
          pinyin: 'qǐng chūshì nín de huíchéng jīpiào.',
          vietnamese: 'Vui lòng xuất trình vé về.'
        },
        answer: {
          chinese: '好的，这是回程机票的订单。',
          pinyin: 'hǎo de, zhè shì huíchéng jīpiào de dìngdān.',
          vietnamese: 'Vâng, đây là đơn đặt vé về.'
        }
      },
      {
        id: 's4-qa4',
        question: {
          chinese: '您的行李里有没有需要申报的物品？',
          pinyin: 'nín de xínglǐ lǐ yǒu méiyǒu xūyào shēnbào de wùpǐn?',
          vietnamese: 'Trong hành lý có đồ cần khai báo không?'
        },
        answer: {
          chinese: '没有，都是个人用品。',
          pinyin: 'méiyǒu, dōu shì gèrén yòngpǐn.',
          vietnamese: 'Không, đều là đồ cá nhân.'
        }
      }
    ],
    fullDialogue: [
      {
        id: 'dlg4-1',
        speaker: 'staff',
        speakerName: 'Hải quan',
        chinese: '请出示您的护照和签证。',
        pinyin: 'qǐng chūshì nín de hùzhào hé qiānzhèng.',
        vietnamese: 'Vui lòng xuất trình hộ chiếu và visa.'
      },
      {
        id: 'dlg4-2',
        speaker: 'A',
        speakerName: 'Du khách',
        chinese: '好的，给您。',
        pinyin: 'hǎo de, gěi nín.',
        vietnamese: 'Vâng, đây ạ.'
      },
      {
        id: 'dlg4-3',
        speaker: 'staff',
        speakerName: 'Hải quan',
        chinese: '您来中国的目的是什么？',
        pinyin: 'nín lái Zhōngguó de mùdì shì shénme?',
        vietnamese: 'Mục đích bạn đến Trung Quốc là gì?'
      },
      {
        id: 'dlg4-4',
        speaker: 'A',
        speakerName: 'Du khách',
        chinese: '我是来旅游的，打算待半个月。',
        pinyin: 'wǒ shì lái lǚyóu de, dǎsuàn dāi bàn ge yuè.',
        vietnamese: 'Tôi đến du lịch, định ở nửa tháng.'
      },
      {
        id: 'dlg4-5',
        speaker: 'staff',
        speakerName: 'Hải quan',
        chinese: '请出示您的回程机票。',
        pinyin: 'qǐng chūshì nín de huíchéng jīpiào.',
        vietnamese: 'Vui lòng xuất trình vé về.'
      },
      {
        id: 'dlg4-6',
        speaker: 'A',
        speakerName: 'Du khách',
        chinese: '好的，这是回程机票的订单。',
        pinyin: 'hǎo de, zhè shì huíchéng jīpiào de dìngdān.',
        vietnamese: 'Vâng, đây là đơn đặt vé về.'
      },
      {
        id: 'dlg4-7',
        speaker: 'staff',
        speakerName: 'Hải quan',
        chinese: '您的行李里有没有需要申报的物品？',
        pinyin: 'nín de xínglǐ lǐ yǒu méiyǒu xūyào shēnbào de wùpǐn?',
        vietnamese: 'Trong hành lý có đồ cần khai báo không?'
      },
      {
        id: 'dlg4-8',
        speaker: 'A',
        speakerName: 'Du khách',
        chinese: '没有，都是个人用品。',
        pinyin: 'méiyǒu, dōu shì gèrén yòngpǐn.',
        vietnamese: 'Không, đều là đồ cá nhân.'
      },
      {
        id: 'dlg4-9',
        speaker: 'staff',
        speakerName: 'Hải quan',
        chinese: '好的，盖章了，祝您旅途愉快。',
        pinyin: 'hǎo de, gàizhāng le, zhù nín lǚtú yúkuài.',
        vietnamese: 'Được, đóng dấu rồi, chúc chuyến đi vui vẻ.'
      }
    ]
  },
  {
    id: 5,
    title: '“Lạc mất hành lý” – Sự cố tại băng chuyền hành lý',
    subTitle: 'Hành khách hỏi quầy thất lạc hành lý',
    context: 'Sau khi 入境 xong, một hành khách đứng đợi ở băng chuyền 行李 nhưng mãi không thấy vali của mình. Người đó đến quầy thất lạc hành lý để hỏi.',
    roles: [
      { name: 'Hành khách', description: 'Mô tả 行李 bị mất, xuất trình 登机牌 và 护照.' },
      { name: 'Nhân viên sân bay', description: 'Hỏi thông tin, kiểm tra hệ thống.' }
    ],
    tasks: [
      'Mô tả 行李 (màu sắc, kích thước, có 托运 không).',
      'Xuất trình 登机牌 và 护照 để xác minh.',
      'Hỏi về 航班 số mấy, 登机口 nào.',
      'Nhân viên hứa sẽ tìm và liên lạc.'
    ],
    vocabTags: ['行李', '托运', '登机牌', '护照', '航班', '入境', '机场'],
    step1Questions: [
      {
        id: 's5-q1',
        noteKey: 's5-q1',
        chinese: '请告诉我您的航班号。',
        pinyin: 'qǐng gàosu wǒ nín de hángbān hào.',
        vietnamese: 'Cho tôi biết số chuyến bay.'
      },
      {
        id: 's5-q2',
        noteKey: 's5-q2',
        chinese: '请出示您的登机牌和护照。',
        pinyin: 'qǐng chūshì nín de dēngjīpái hé hùzhào.',
        vietnamese: 'Vui lòng xuất trình thẻ lên máy bay và hộ chiếu.'
      },
      {
        id: 's5-q3',
        noteKey: 's5-q3',
        chinese: '您在哪个行李转盘等的？',
        pinyin: 'nín zài nǎge xínglǐ zhuànpán děng de?',
        vietnamese: 'Bạn đợi ở băng chuyền nào?'
      }
    ],
    step2QAPairs: [
      {
        id: 's5-qa1',
        question: {
          chinese: '请告诉我您的航班号。',
          pinyin: 'qǐng gàosu wǒ nín de hángbān hào.',
          vietnamese: 'Cho tôi biết số chuyến bay.'
        },
        answer: {
          chinese: '我的航班是CA1234，从河内飞来的。',
          pinyin: 'wǒ de hángbān shì CA1234, cóng Hénèi fēi lái de.',
          vietnamese: 'Chuyến tôi là CA1234, từ Hà Nội bay đến.'
        }
      },
      {
        id: 's5-qa2',
        question: {
          chinese: '请出示您的登机牌和护照。',
          pinyin: 'qǐng chūshì nín de dēngjīpái hé hùzhào.',
          vietnamese: 'Vui lòng xuất trình thẻ lên máy bay và hộ chiếu.'
        },
        answer: {
          chinese: '给您。我的箱子是黑色的，很大，已经办理了托运。',
          pinyin: 'gěi nín. wǒ de xiāngzi shì hēisè de, hěn dà, yǐjīng bànlǐ le tuōyùn.',
          vietnamese: 'Đây ạ. Vali tôi màu đen, to, đã ký gửi.'
        }
      },
      {
        id: 's5-qa3',
        question: {
          chinese: '您在哪个行李转盘等的？',
          pinyin: 'nín zài nǎge xínglǐ zhuànpán děng de?',
          vietnamese: 'Bạn đợi ở băng chuyền nào?'
        },
        answer: {
          chinese: '我在5号转盘等了好久，但是没看到。',
          pinyin: 'wǒ zài wǔ hào zhuànpán děng le hǎojiǔ, dànshì méi kàndào.',
          vietnamese: 'Tôi đợi ở băng chuyền số 5 lâu lắm mà không thấy.'
        }
      }
    ],
    fullDialogue: [
      {
        id: 'dlg5-1',
        speaker: 'A',
        speakerName: 'Khách',
        chinese: '你好，我的行李不见了！',
        pinyin: 'nǐ hǎo, wǒ de xínglǐ bújiàn le!',
        vietnamese: 'Chào, hành lý của tôi mất rồi!'
      },
      {
        id: 'dlg5-2',
        speaker: 'staff',
        speakerName: 'Nhân viên quầy',
        chinese: '别着急，请告诉我您的航班号。',
        pinyin: 'bié zháojí, qǐng gàosu wǒ nín de hángbān hào.',
        vietnamese: 'Đừng lo, cho tôi biết số chuyến bay.'
      },
      {
        id: 'dlg5-3',
        speaker: 'A',
        speakerName: 'Khách',
        chinese: '我的航班是CA1234，从河内飞来的。',
        pinyin: 'wǒ de hángbān shì CA1234, cóng Hénèi fēi lái de.',
        vietnamese: 'Chuyến tôi là CA1234, từ Hà Nội bay đến.'
      },
      {
        id: 'dlg5-4',
        speaker: 'staff',
        speakerName: 'Nhân viên quầy',
        chinese: '请出示您的登机牌和护照。',
        pinyin: 'qǐng chūshì nín de dēngjīpái hé hùzhào.',
        vietnamese: 'Vui lòng xuất trình thẻ lên máy bay và hộ chiếu.'
      },
      {
        id: 'dlg5-5',
        speaker: 'A',
        speakerName: 'Khách',
        chinese: '给您。我的箱子是黑色的，很大，已经办理了托运。',
        pinyin: 'gěi nín. wǒ de xiāngzi shì hēisè de, hěn dà, yǐjīng bànlǐ le tuōyùn.',
        vietnamese: 'Đây ạ. Vali tôi màu đen, to, đã ký gửi.'
      },
      {
        id: 'dlg5-6',
        speaker: 'staff',
        speakerName: 'Nhân viên quầy',
        chinese: '您在哪个行李转盘等的？',
        pinyin: 'nín zài nǎge xínglǐ zhuànpán děng de?',
        vietnamese: 'Bạn đợi ở băng chuyền nào?'
      },
      {
        id: 'dlg5-7',
        speaker: 'A',
        speakerName: 'Khách',
        chinese: '我在5号转盘等了好久，但是没看到。',
        pinyin: 'wǒ zài wǔ hào zhuànpán děng le hǎojiǔ, dànshì méi kàndào.',
        vietnamese: 'Tôi đợi ở băng chuyền số 5 lâu lắm mà không thấy.'
      },
      {
        id: 'dlg5-8',
        speaker: 'staff',
        speakerName: 'Nhân viên quầy',
        chinese: '我查一下系统。……找到了，您的行李还在河内，明天才能到。',
        pinyin: 'wǒ chá yíxià xìtǒng. …… zhǎodào le, nín de xínglǐ hái zài Hénèi, míngtiān cái néng dào.',
        vietnamese: 'Tôi tra hệ thống. … Tìm thấy rồi, hành lý của bạn còn ở Hà Nội, mai mới đến.'
      },
      {
        id: 'dlg5-9',
        speaker: 'A',
        speakerName: 'Khách',
        chinese: '那怎么办？我明天就要用的东西都在里面。',
        pinyin: 'nà zěnme bàn? wǒ míngtiān jiù yào yòng de dōngxi dōu zài lǐmiàn.',
        vietnamese: 'Vậy làm sao? Đồ tôi cần dùng mai đều ở trong đó.'
      },
      {
        id: 'dlg5-10',
        speaker: 'staff',
        speakerName: 'Nhân viên quầy',
        chinese: '我们可以把行李寄到您的酒店，请留一下地址和电话。',
        pinyin: 'wǒmen kěyǐ bǎ xínglǐ jì dào nín de jiǔdiàn, qǐng liú yíxià dìzhǐ hé diànhuà.',
        vietnamese: 'Chúng tôi có thể gửi hành lý đến khách sạn, vui lòng để lại địa chỉ và điện thoại.'
      }
    ]
  },
  {
    id: 6,
    title: '“Về nước rồi!” – Kết thúc chuyến đi',
    subTitle: 'Hai bạn nói chuyện khi đợi ở 登机口',
    context: 'Hai bạn kết thúc chuyến du lịch Trung Quốc, chuẩn bị bay về Việt Nam. Họ nói chuyện trong lúc đợi ở 登机口.',
    roles: [
      { name: 'Bạn A', description: 'Hỏi về 回程机票, 登机牌, 登机口.' },
      { name: 'Bạn B', description: 'Kiểm tra lại giấy tờ, 行李 xách tay.' }
    ],
    tasks: [
      'Kiểm tra 回程机票 và 登机牌.',
      'Hỏi 登机口 số mấy, giờ 登机 chưa.',
      'Nhắc nhau cầm 护照 và 登机牌 trên tay.',
      'Nói về kỷ niệm chuyến đi, hẹn lần sau.'
    ],
    vocabTags: ['回程机票', '登机牌', '登机口', '护照', '行李', '航班'],
    step1Questions: [
      {
        id: 's6-q1',
        noteKey: 's6-q1',
        chinese: '你的回程机票和登机牌拿好了吗？',
        pinyin: 'nǐ de huíchéng jīpiào hé dēngjīpái ná hǎo le ma?',
        vietnamese: 'Bạn cầm vé về và thẻ lên máy bay chưa?'
      },
      {
        id: 's6-q2',
        noteKey: 's6-q2',
        chinese: '我们的登机口是几号？',
        pinyin: 'wǒmen de dēngjīkǒu shì jǐ hào?',
        vietnamese: 'Cửa lên máy bay của chúng ta số mấy?'
      },
      {
        id: 's6-q3',
        noteKey: 's6-q3',
        chinese: '你的行李托运了吗？',
        pinyin: 'nǐ de xínglǐ tuōyùn le ma?',
        vietnamese: 'Hành lý bạn ký gửi chưa?'
      }
    ],
    step2QAPairs: [
      {
        id: 's6-qa1',
        question: {
          chinese: '你的回程机票和登机牌拿好了吗？',
          pinyin: 'nǐ de huíchéng jīpiào hé dēngjīpái ná hǎo le ma?',
          vietnamese: 'Bạn cầm vé về và thẻ lên máy bay chưa?'
        },
        answer: {
          chinese: '拿好了。',
          pinyin: 'ná hǎo le.',
          vietnamese: 'Cầm rồi.'
        }
      },
      {
        id: 's6-qa2',
        question: {
          chinese: '我们的登机口是几号？',
          pinyin: 'wǒmen de dēngjīkǒu shì jǐ hào?',
          vietnamese: 'Cửa lên máy bay số mấy?'
        },
        answer: {
          chinese: '是B12。',
          pinyin: 'shì B12.',
          vietnamese: 'Là B12.'
        }
      },
      {
        id: 's6-qa3',
        question: {
          chinese: '你的行李托运了吗？',
          pinyin: 'nǐ de xínglǐ tuōyùn le ma?',
          vietnamese: 'Hành lý bạn ký gửi chưa?'
        },
        answer: {
          chinese: '托运了，随身只带了一个小包。',
          pinyin: 'tuōyùn le, suíshēn zhǐ dài le yí ge xiǎo bāo.',
          vietnamese: 'Ký gửi rồi, xách tay chỉ một túi nhỏ.'
        }
      }
    ],
    fullDialogue: [
      {
        id: 'dlg6-1',
        speaker: 'A',
        speakerName: 'Bạn A',
        chinese: '你的回程机票和登机牌拿好了吗？',
        pinyin: 'nǐ de huíchéng jīpiào hé dēngjīpái ná hǎo le ma?',
        vietnamese: 'Bạn cầm vé về và thẻ lên máy bay chưa?'
      },
      {
        id: 'dlg6-2',
        speaker: 'B',
        speakerName: 'Bạn B',
        chinese: '拿好了。我们的登机口是几号？',
        pinyin: 'ná hǎo le. wǒmen de dēngjīkǒu shì jǐ hào?',
        vietnamese: 'Cầm rồi. Cửa lên máy bay số mấy?'
      },
      {
        id: 'dlg6-3',
        speaker: 'A',
        speakerName: 'Bạn A',
        chinese: '我看一下……是B12。广播说马上就要登机了。',
        pinyin: 'wǒ kàn yíxià …… shì B12. guǎngbō shuō mǎshàng jiù yào dēngjī le.',
        vietnamese: 'Để tôi xem… là B12. Loa nói sắp lên máy bay rồi.'
      },
      {
        id: 'dlg6-4',
        speaker: 'B',
        speakerName: 'Bạn B',
        chinese: '那我们快过去吧。护照和登机牌要拿在手里。',
        pinyin: 'nà wǒmen kuài guòqù ba. hùzhào hé dēngjīpái yào ná zài shǒu lǐ.',
        vietnamese: 'Vậy mau qua đó. Hộ chiếu và thẻ phải cầm tay.'
      },
      {
        id: 'dlg6-5',
        speaker: 'A',
        speakerName: 'Bạn A',
        chinese: '对了，你的行李托运了吗？',
        pinyin: 'duì le, nǐ de xínglǐ tuōyùn le ma?',
        vietnamese: 'À, hành lý bạn ký gửi chưa?'
      },
      {
        id: 'dlg6-6',
        speaker: 'B',
        speakerName: 'Bạn B',
        chinese: '托运了，随身只带了一个小包。',
        pinyin: 'tuōyùn le, suíshēn zhǐ dài le yí ge xiǎo bāo.',
        vietnamese: 'Ký gửi rồi, xách tay chỉ một túi nhỏ.'
      },
      {
        id: 'dlg6-7',
        speaker: 'A',
        speakerName: 'Bạn A',
        chinese: '这次旅行太开心了，下次我们再去中国玩！',
        pinyin: 'zhè cì lǚxíng tài kāixīn le, xià cì wǒmen zài qù Zhōngguó wán!',
        vietnamese: 'Chuyến đi vui quá, lần sau lại đi Trung Quốc!'
      },
      {
        id: 'dlg6-8',
        speaker: 'B',
        speakerName: 'Bạn B',
        chinese: '好啊！下次我想去上海。',
        pinyin: 'hǎo a! xià cì wǒ xiǎng qù Shànghǎi.',
        vietnamese: 'Được! Lần sau tôi muốn đi Thượng Hải.'
      }
    ]
  }
];

export const VOCAB_MATRIX: VocabMatrixItem[] = [
  { word: '机场', pinyin: 'jīchǎng', meaning: 'Sân bay', scenarios: [1, 3, 5] },
  { word: '航班', pinyin: 'hángbān', meaning: 'Chuyến bay', scenarios: [3, 5, 6] },
  { word: '机票', pinyin: 'jīpiào', meaning: 'Vé máy bay', scenarios: [1, 2, 3] },
  { word: '回程机票', pinyin: 'huíchéng jīpiào', meaning: 'Vé về', scenarios: [1, 4, 6] },
  { word: '护照', pinyin: 'hùzhào', meaning: 'Hộ chiếu', scenarios: [1, 2, 4, 5, 6] },
  { word: '签证', pinyin: 'qiānzhèng', meaning: 'Visa', scenarios: [1, 4] },
  { word: '行李', pinyin: 'xínglǐ', meaning: 'Hành lý', scenarios: [1, 2, 4, 5, 6] },
  { word: '托运', pinyin: 'tuōyùn', meaning: 'Ký gửi', scenarios: [2, 5] },
  { word: '值机', pinyin: 'zhíjī', meaning: 'Check-in', scenarios: [2] },
  { word: '登机牌', pinyin: 'dēngjīpái', meaning: 'Thẻ lên máy bay', scenarios: [2, 3, 5, 6] },
  { word: '登机口', pinyin: 'dēngjīkǒu', meaning: 'Cửa lên máy bay', scenarios: [2, 3, 6] },
  { word: '入境', pinyin: 'rùjìng', meaning: 'Nhập cảnh', scenarios: [4, 5] }
];

export const TEACHING_TIPS: TeachingTip[] = [
  {
    num: 1,
    title: 'Quy trình 2 bước',
    desc: 'Bắt buộc học sinh làm Bước 1 trước (tự trả lời, nói to hoặc ghi chú vào ô, dùng nút AI chấm điểm), sau đó mới mở Bước 2 để đối chiếu.'
  },
  {
    num: 2,
    title: 'Đóng vai theo cặp',
    desc: 'Mỗi cặp chọn 1 tình huống: một bạn đọc câu hỏi, một bạn trả lời (Bước 1). Sau đó đổi vai và so với Bước 2.'
  },
  {
    num: 3,
    title: 'Ghi chú trên web',
    desc: 'Học sinh có thể gõ nhanh câu trả lời vào ô ghi chú — nội dung được lưu tự động trên trình duyệt (localStorage), dùng lại được ở buổi sau.'
  },
  {
    num: 4,
    title: 'Mở rộng tình huống',
    desc: 'Sau khi so đáp án, yêu cầu học sinh thêm 1–2 câu hỏi phát sinh ngoài kịch bản để tăng tính tự nhiên.'
  }
];
