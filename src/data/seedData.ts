export interface StoryMilestone {
  date: string;
  title: string;
  text: string;
  img: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface BankInfo {
  bankName: string;
  accountNumber: string;
  accountHolder?: string;
  qrCodeUrl?: string;
}

export interface ChatMessage {
  /** 'groom' | 'bride' */
  sender: "groom" | "bride";
  text: string;
  time: string;
  /** Optional emoji reaction shown below the bubble */
  reaction?: string;
}

export interface ParentInfo {
  fatherName: string;
  motherName: string;
  familyLabel?: string;
  fatherTitle?: string;
  motherTitle?: string;
  address?: string;
  phone?: string;
  note?: string;
}

export interface ScheduleEvent {
  time: string;
  title: string;
  description?: string;
  icon?: string;
}

export interface WeddingSeedData {
  groomName: string;
  brideName: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  message: string;
  coverImageUrl: string;
  galleryImageUrls: string[];
  stories: StoryMilestone[];
  faqs: FaqItem[];
  groomBank: BankInfo;
  brideBank: BankInfo;
  dressCodeColors: string[];
  chatMessages: ChatMessage[];
  groomParents?: ParentInfo;
  brideParents?: ParentInfo;
  schedule?: ScheduleEvent[];
}

export const WEDDING_SEED_DATA: WeddingSeedData = {
  groomName: "Minh Anh",
  brideName: "Thanh Ha",
  groomParents: { fatherName: "Tran Van Loc", motherName: "Le Thi Hoa", address: "Ba Dinh, Hanoi" },
  brideParents: { fatherName: "Nguyen Minh Tuan", motherName: "Pham Thi Lan", address: "Cau Giay, Hanoi" },
  date: "2027-02-14",
  time: "17:30",
  venue: "White Palace Convention Center",
  address: "123 Nguyen Hue Street, District 1, Ho Chi Minh City",
  message: "Our happiest journey is to go through all the storms of life together. Your presence is a great honor for our family.",
  schedule: [
    { time: "17:00", title: "Welcoming guests", description: "Take souvenir photos with the bride and groom at the check-in area.", icon: "welcome" },
    { time: "18:00", title: "Celebrate the wedding", description: "The ceremony of exchanging rings and cutting the sacred wedding cake.", icon: "ceremony" },
    { time: "18:30", title: "Party opening", description: "Have an intimate party and raise a glass to celebrate happiness.", icon: "party" },
  ],
  coverImageUrl: hero,
  galleryImageUrls: [
    couple1,
    couple2,
    couple3,
    ceremony,
    proposal,
    travel,
    rings,
    venue,
    hero,
  ],
  stories: [
    {
      date: "September - 2023",
      title: "Accidental Encounter",
      text: "Two souls suddenly met in rhythm at a small old cafe filled with gentle sunlight on the corner of a crowded street.",
      img: couple1,
    },
    {
      date: "December - 2023",
      title: "Warm Love Season",
      text: "Walking through quiet streets, talking for hours together, finding sincere harmony.",
      img: couple2,
    },
    {
      date: "October - 2025",
      title: "Lifetime Engagement Promise",
      text: "The sacred promise of marriage was exchanged in a romantic sunset beach atmosphere.",
      img: proposal,
    }
  ],
  faqs: [
    {
      q: "Is there parking for cars/motorbikes?",
      a: "The venue has spacious free parking for motorbikes and cars at the event's basement."
    },
    {
      q: "Time to welcome guests?",
      a: "The official reception begins at 5:30 p.m. Opening celebration party at 6:30 p.m."
    },
    {
      q: "Deadline for RSVP to send confirmation of attendance?",
      a: "Please select the status and number of screenings in the RSVP section below 10 days before the wedding."
    }
  ],
  groomBank: {
    bankName: "Vietcombank",
    accountNumber: "0123456789",
    accountHolder: "Nguyen Minh Anh"
  },
  brideBank: {
    bankName: "Techcombank",
    accountNumber: "9876543210",
    accountHolder: "Tran Thanh Ha"
  },
  dressCodeColors: ["#000000", "#FFFFFF", "#F5E6D3"],
  chatMessages: [
    { sender: "groom", text: "This day has finally come, wife! 😍", time: "09:00" },
    { sender: "bride", text: "I'm so nervous! I wonder if everyone will come in large numbers?", time: "09:05" },
    { sender: "groom", text: "It's definitely crowded. I have finished preparing everything.", time: "09:10" },
    { sender: "bride", text: "Thank you. I love you! ❤", time: "09:15", reaction: "❤️" }
  ]
};

export const getThemeMessage = (category: string): string => {
  const messages: Record<string, string[]> = {
    "romantic": [
      "Hành trình hạnh phúc nhất của chúng mình là được cùng nhau đi qua mọi giông bão cuộc đời. Sự hiện diện của bạn là lời chúc phúc ngọt ngào nhất.",
      "Tình yêu không phải là tìm thấy một người hoàn hảo, mà là học cách nhìn một người không hoàn hảo một cách hoàn hảo. Rất mong bạn sẽ đến chung vui."
    ],
    "Modern": [
      "Một chương mới sắp bắt đầu. Bọn mình rất vui được chia sẻ khoảnh khắc tuyệt vời này cùng những người thân yêu nhất.",
      "Lễ cưới sẽ không thể trọn vẹn nếu thiếu đi sự hiện diện của bạn. Cùng đến và tạo nên những kỷ niệm đáng nhớ nhé."
    ],
    "classic": [
      "Thời gian có thể trôi qua, nhưng tình yêu thì mãi mãi. Xin trân trọng kính mời bạn đến dự lễ thành hôn của chúng tôi.",
      "Một tình yêu giản dị, một đám cưới ấm áp. Sự hiện diện của bạn là niềm vinh hạnh lớn lao cho gia đình chúng tôi."
    ],
    "tropical": [
      "Cùng hòa mình vào biển xanh, nắng vàng và tình yêu rực rỡ của chúng mình. Hẹn gặp bạn ở buổi tiệc nhé!",
      "Hãy cùng nâng ly chúc mừng cho tình yêu dưới bóng dừa xanh ngát. Mong bạn sẽ là một phần của ngày vui này."
    ],
    "Art": [
      "Hai mảnh ghép đã tìm thấy nhau. Mời bạn đến chung vui trong ngày chúng mình chính thức trở thành một bức tranh hoàn chỉnh.",
      "Tình yêu là một kiệt tác nghệ thuật mà chúng mình đang cùng nhau vẽ nên. Cảm ơn bạn đã luôn đồng hành và ủng hộ."
    ],
    "Luxurious": [
      "Trân trọng kính mời quý khách đến dự buổi dạ tiệc vinh danh tình yêu của chúng tôi. Sự hiện diện của quý vị là vinh dự vô cùng to lớn.",
      "Một đêm tiệc rực rỡ ánh đèn và đong đầy hạnh phúc đang chờ đón. Rất mong sự hiện diện của quý vị."
    ],
    "Royal": [
      "Trân trọng kính mời quý khách đến chung vui trong ngày trọng đại nhất của cuộc đời chúng tôi. Sự hiện diện của quý vị là niềm vinh hạnh cho gia tộc.",
      "Trong không khí trang trọng và ấm áp, gia đình chúng tôi vô cùng vinh dự được đón tiếp quý khách đến dự lễ thành hôn."
    ],
    "traditional": [
      "Ngày lành tháng tốt, hai họ hoan hỉ. Trân trọng kính mời quý khách đến chung vui cùng gia đình chúng tôi trong ngày hỷ sự.",
      "Trăm năm tình viên mãn, bạc đầu nghĩa phu thê. Sự hiện diện của quý vị là lời chúc phúc quý giá nhất cho hai cháu."
    ],
    "Fairy tales": [
      "Hãy cùng bước vào câu chuyện cổ tích của chúng mình. Một chương mới sắp mở ra, và bạn là một phần không thể thiếu.",
      "Phép màu đã mang chúng mình đến với nhau, và ngày cưới sẽ là khoảnh khắc kỳ diệu nhất. Mời bạn đến chung vui!"
    ],
    "minimalist": [
      "Đơn giản và chân thành. Chúng mình rất mong sự hiện diện của bạn trong ngày cưới để chia sẻ niềm vui nhỏ bé này.",
      "Một ngày vui tinh tế và ấm áp. Cảm ơn bạn vì đã luôn ở đó, và mong bạn sẽ đến chung vui cùng chúng mình."
    ],
    "Boho": [
      "Gió mây tự do và tình yêu chân thành. Hãy đến chung vui trong ngày chúng mình dắt tay nhau bước sang một hành trình mới.",
      "Khung trời lãng mạn và tự do đang đón chờ. Sự hiện diện của bạn sẽ làm cho ngày vui thêm phần rực rỡ."
    ],
    "Japan": [
      "Dưới tán hoa anh đào, chúng tôi nguyện trao nhau lời thề ước trăm năm. Xin trân trọng kính mời bạn đến chung vui.",
      "Sự hiện diện của bạn tựa như cánh hoa mùa xuân, tô điểm thêm hạnh phúc cho ngày trọng đại của chúng tôi."
    ]
  };

  const categoryMessages = messages[category] || messages["romantic"];
  // For simplicity, just return the first one, or randomize if desired.
  return categoryMessages[0];
};
import couple1 from "@/assets/couple-1.jpg";
import couple2 from "@/assets/couple-2.jpg";
import couple3 from "@/assets/couple-3.jpg";
import ceremony from "@/assets/couple-ceremony.jpg";
import proposal from "@/assets/couple-proposal.jpg";
import travel from "@/assets/couple-travel.jpg";
import hero from "@/assets/hero-wedding.jpg";
import rings from "@/assets/rings.jpg";
import venue from "@/assets/venue.jpg";
