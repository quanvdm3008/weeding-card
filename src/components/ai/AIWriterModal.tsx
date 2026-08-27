import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bot,
  Copy,
  Check,
  RotateCcw,
  Wand2,
  Heart,
  MessageSquare,
  BookOpen,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

type AICategory = "invitation" | "story" | "vows" | "thankyou";
type AITone = "romantic" | "formal" | "witty" | "traditional" | "poetic";

const TONES: { id: AITone; label: string; icon: string }[] = [
  { id: "romantic", label: "Lãng Mạn", icon: "💖" },
  { id: "formal", label: "Trang Trọng", icon: "🎩" },
  { id: "witty", label: "Hài Hước", icon: "✨" },
  { id: "traditional", label: "Truyền Thống", icon: "🏮" },
  { id: "poetic", label: "Thơ Mộng", icon: "🌸" },
];

const PRESETS: Record<AICategory, Record<AITone, string[]>> = {
  invitation: {
    romantic: [
      "Từ hai thế giới riêng biệt, định mệnh đã dẫn lối để chúng mình tìm thấy nhau. Giờ đây, một chương mới trọn vẹn hơn đang mở ra. Sự hiện diện và lời chúc phúc của bạn chính là món quà quý giá nhất trong ngày chung đôi của chúng mình.",
      "Có những khoảnh khắc chỉ xảy ra một lần trong đời, và sẽ thật trọn vẹn khi có bạn bên cạnh sẻ chia. Trân trọng kính mời bạn đến chung vui và nâng ly chúc phúc cho tình yêu của chúng mình.",
    ],
    formal: [
      "Trân trọng kính mời Quý khách đến tham dự Lễ Thành Hôn và dùng bữa cơm thân mật chung vui cùng gia đình chúng tôi. Sự hiện diện của Quý khách là niềm vinh hạnh to lớn cho hai gia đình và đôi tân lang tân nương.",
      "Hai bên gia đình trân trọng kính báo Lễ Thành Hôn của hai con. Kính mời Quý khách dành thời gian quý báu đến chứng kiến và chúc phúc cho đôi bạn trẻ trăm năm tình viên mãn.",
    ],
    witty: [
      "Sau chuỗi ngày dài 'thả thính' và chạy trốn deadline tình cảm, chúng mình đã chính thức ký vào bản hợp đồng trọn đời! Hẹn gặp bạn tại bữa tiệc để kiểm chứng ngày hai đứa chính thức hết độc thân nhé!",
      "Game độc thân đã chính thức Over! Mời bạn đến ăn mừng chúng mình mở khóa màn chơi mới: 'Về Chung Một Nhà'. Nhớ mang theo nụ cười tươi nhất và một chiếc bụng đói nhé!",
    ],
    traditional: [
      "Trăm năm kết tóc se duyên, sắc cầm hảo hợp vẹn tròn phúc duyên. Hai họ trân trọng kính mời Quý khách thân bằng quyến thuộc đến dự tiệc mừng ngày thành hôn của hai cháu.",
      "Ơn cha mẹ sinh thành dưỡng dục, duyên trời định đôi lứa sánh đôi. Gia đình trân trọng kính mời Quý quan khách đến nâng ly rượu hồng chúc cho đôi trẻ răng long đầu bạc.",
    ],
    poetic: [
      "Gặp gỡ là duyên, ở bên nhau là hẹn ước. Mùa hoa nở rộ nhất đời người chính là ngày hai trái tim cùng chung một nhịp đập. Trân trọng mời bạn ghé thăm và gửi gắm những lời chúc dịu dàng nhất.",
      "Nắng sớm nghiêng nghiêng qua vạt áo, nụ cười người rạng rỡ giữa muôn hoa. Ngày chung đôi xin được đón tiếp bạn bằng trọn vẹn sự chân thành và yêu thương.",
    ],
  },
  story: {
    romantic: [
      "Năm 2020: Lần đầu tiên gặp nhau tại một quán cà phê quen thuộc vào một chiều mưa Hà Nội. Ánh mắt đầu tiên đã thay đổi cả cuộc đời.\nNăm 2022: Cùng nhau vượt qua những chuyến đi xa và nhận ra đối phương là mảnh ghép không thể thiếu.\nNăm 2026: Một lời cầu hôn chân thành dưới bầu trời đầy sao và một lời hẹn ước trăm năm.",
    ],
    formal: [
      "Giai đoạn quen biết: Những ngày tháng đồng hành và thấu hiểu nhau sâu sắc.\nGiai đoạn gắn kết: Cùng vun đắp ước mơ và nhận được sự chúc phúc từ hai bên gia đình.\nNgày thành hôn: Chính thức kết duyên vợ chồng, dựng xây tổ ấm.",
    ],
    witty: [
      "Năm 2019: Vô tình cướp mất ly trà sữa cuối cùng của nhau nhưng lại 'cướp' luôn cả trái tim.\nNăm 2023: Nhận ra không ai chịu nổi tính cách đối phương ngoài chính người kia.\nNăm 2026: Quyết định về chung nhà để đỡ mất tiền gọi điện mỗi tối!",
    ],
    traditional: [
      "Duyên thắm ngẫu duyên từ thuở ban đầu gặp gỡ.\nTrải qua bao thăng trầm, đồng cam cộng khổ vun vén yêu thương.\nNay duyên lành đơm hoa kết trái, tròn chữ tòng phu phu phụ hòa hợp.",
    ],
    poetic: [
      "Thuở ấy người mang mùa xuân đến sưởi ấm những ngày đông giá lạnh.\nNăm tháng êm đềm trôi như dòng sông nhỏ, tình ta ngày một sâu đậm.\nNay bước vào lễ đường rực rỡ, cùng viết tiếp thiên tình ca bất tận.",
    ],
  },
  vows: {
    romantic: [
      "Anh hứa sẽ luôn nắm chặt tay em qua mọi giông bão, sẽ là bến đỗ bình yên nhất mỗi khi em mỏi mệt, và yêu em nhiều hơn mỗi sớm mai thức dậy.",
      "Em hứa sẽ là người bạn đồng hành trung thành nhất, luôn lắng nghe và sẻ chia, cùng anh xây đắp một mái ấm tràn ngập tình yêu và tiếng cười.",
    ],
    formal: [
      "Trước sự chứng kiến của hai bên gia đình và quan khách, anh xin nguyện dành trọn sự tôn trọng, lòng trung thủy và trách nhiệm để chăm sóc em suốt cuộc đời.",
      "Em nguyện gắn bó cùng anh trong mọi thăng trầm của cuộc sống, cùng gìn giữ danh dự gia đình và nuôi dưỡng hạnh phúc trăm năm.",
    ],
    witty: [
      "Anh hứa sẽ chủ động rửa bát khi em nấu cơm, nhường em chiếc đùi gà rán ngon nhất và không bao giờ tranh remote TV khi đến giờ em xem phim!",
      "Em hứa sẽ không nổi giận khi anh đi xem bóng đá muộn, nhưng với điều kiện anh phải luôn khen đồ ăn em nấu ngon nhé!",
    ],
    traditional: [
      "Nguyện một lòng sắc son chung thủy, trên kính dưới nhường, phụng dưỡng mẹ cha, sớm hôm nâng khăn sửa túi, giữ trọn đạo vợ chồng.",
      "Nguyện làm tròn trách nhiệm người trụ cột gia đình, yêu thương kính trọng hiền thê, cùng xây dựng nếp nhà êm ấm muôn đời.",
    ],
    poetic: [
      "Dù mây đổi hướng gió xoay vần, tình anh trao em vẫn vẹn nguyên như ngày đầu. Xin hứa đi cùng em đến tận cùng năm tháng.",
      "Bàn tay này xin trao anh trọn vẹn, để những mùa sau dẫu bão giông hay nắng ấm, ta vẫn có nhau giữa cuộc đời rộng lớn.",
    ],
  },
  thankyou: {
    romantic: [
      "Cảm ơn bạn đã đến và làm cho ngày cưới của chúng mình trở nên lung linh và trọn vẹn hơn bao giờ hết. Tình cảm và những cái ôm của bạn sẽ luôn là kỷ niệm đẹp nhất trong tim chúng mình!",
    ],
    formal: [
      "Đôi tân lang tân nương cùng hai bên gia đình xin gửi lời cảm ơn chân thành và sâu sắc nhất đến Quý khách đã dành thời gian quý báu đến tham dự và chúc phúc cho ngày vui của chúng tôi.",
    ],
    witty: [
      "Cảm ơn bạn đã 'quẩy' hết mình cùng chúng mình hôm nay! Sự hiện diện của bạn làm bữa tiệc vui gấp bội (dù ngày mai chắc chắn hai đứa sẽ đau chân vì nhảy quá nhiều)!",
    ],
    traditional: [
      "Hai họ chúng tôi xin chân thành cảm tạ Quý quan khách thân bằng quyến thuộc gần xa đã bớt chút thời gian ngọc ngà đến chung vui và mừng hạnh phúc cho hai cháu.",
    ],
    poetic: [
      "Ngày vui đã khép lại trong trọn vẹn yêu thương. Cảm ơn người vì đã mang nụ cười và những lời chúc ngọt ngào nhất làm rạng rỡ cả một khung trời hạnh phúc của chúng mình.",
    ],
  },
};

interface AIWriterModalProps {
  onApplyText?: (text: string) => void;
  triggerButton?: React.ReactNode;
}

export function AIWriterModal({ onApplyText, triggerButton }: AIWriterModalProps) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<AICategory>("invitation");
  const [tone, setTone] = useState<AITone>("romantic");
  const [groomName, setGroomName] = useState("");
  const [brideName, setBrideName] = useState("");
  const [keywords, setKeywords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setGeneratedResult("");

    const options = PRESETS[category][tone];
    const baseText = options[Math.floor(Math.random() * options.length)];

    let customized = baseText;
    if (groomName && brideName) {
      customized = customized.replace("chúng mình", `${groomName} & ${brideName}`);
    }

    setTimeout(() => {
      setGeneratedResult(customized);
      setIsGenerating(false);
      toast.success("AI đã tạo xong nội dung gợi ý!");
    }, 600);
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    toast.success("Đã sao chép vào clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApplyText && generatedResult) {
      onApplyText(generatedResult);
      toast.success("Đã chèn nội dung vào thiệp cưới!");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button variant="outline" size="sm" className="text-xs bg-accent/10 border-accent/30 text-accent hover:bg-accent/20">
            <Wand2 className="mr-1.5 h-3.5 w-3.5" /> Trợ lý AI Viết Lời Mời
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <Sparkles className="h-5 w-5 text-accent" /> Trợ Lý AI Sáng Tạo Nội Dung Cưới
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Category Tabs */}
          <Tabs value={category} onValueChange={(v) => setCategory(v as AICategory)}>
            <TabsList className="grid grid-cols-4 w-full text-xs">
              <TabsTrigger value="invitation" className="text-[11px] sm:text-xs">
                <MessageSquare className="mr-1 h-3.5 w-3.5 hidden sm:inline" /> Lời ngỏ
              </TabsTrigger>
              <TabsTrigger value="story" className="text-[11px] sm:text-xs">
                <BookOpen className="mr-1 h-3.5 w-3.5 hidden sm:inline" /> Câu chuyện
              </TabsTrigger>
              <TabsTrigger value="vows" className="text-[11px] sm:text-xs">
                <Heart className="mr-1 h-3.5 w-3.5 hidden sm:inline" /> Lời thề
              </TabsTrigger>
              <TabsTrigger value="thankyou" className="text-[11px] sm:text-xs">
                <Send className="mr-1 h-3.5 w-3.5 hidden sm:inline" /> Cảm ơn
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Tone Selector */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground font-semibold">Chọn phong cách diễn đạt (Tone):</Label>
            <div className="flex flex-wrap gap-2">
              {TONES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    tone === t.id
                      ? "bg-accent text-accent-foreground font-semibold shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{t.icon}</span>
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional context inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Tên chú rể</Label>
              <Input
                placeholder="Ví dụ: Hoàng Long"
                value={groomName}
                onChange={(e) => setGroomName(e.target.value)}
                className="text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Tên cô dâu</Label>
              <Input
                placeholder="Ví dụ: Minh Anh"
                value={brideName}
                onChange={(e) => setBrideName(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full bg-accent text-accent-foreground font-semibold text-xs h-10 shadow-sm"
          >
            <Bot className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
            {isGenerating ? "AI Đang Soạn Thảo..." : "Tạo Nội Dung Bằng AI"}
          </Button>

          {/* Result Box */}
          <AnimatePresence>
            {generatedResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-3 rounded-2xl border border-border bg-card/90 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] bg-accent/10 border-accent/30 text-accent">
                    ✨ Gợi ý từ AI
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 text-xs px-2">
                      {copied ? <Check className="mr-1 h-3 w-3 text-emerald-500" /> : <Copy className="mr-1 h-3 w-3" />}
                      {copied ? "Đã chép" : "Sao chép"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleGenerate} className="h-7 text-xs px-2">
                      <RotateCcw className="mr-1 h-3 w-3" /> Đổi mẫu khác
                    </Button>
                  </div>
                </div>

                <div className="whitespace-pre-line text-xs sm:text-sm text-foreground leading-relaxed bg-background/70 p-3 rounded-xl border border-border/80 italic font-body">
                  "{generatedResult}"
                </div>

                {onApplyText && (
                  <Button
                    size="sm"
                    onClick={handleApply}
                    className="w-full bg-foreground text-background text-xs font-semibold"
                  >
                    Chèn nội dung này vào thiệp cưới
                  </Button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AIWriterModal;
