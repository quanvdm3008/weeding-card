import { MessageSquare, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useWeddingConfig } from "@/store/weddingConfigStore";
import { AIWriterModal } from "@/components/ai/AIWriterModal";
import { PanelHeader } from "./_shared";

const samplesByMood: Record<string, string[]> = {
  romantic: [
    "Từ hai câu chuyện riêng, chúng mình đã cùng nhau viết nên một hẹn ước chung. Thật hạnh phúc nếu có sự hiện diện của bạn trong chương rực rỡ nhất này.",
    "Ngày hai đứa về chung một nhà sẽ trọn vẹn và ấm áp hơn biết bao khi có bạn cùng chứng kiến và sẻ chia từng khoảnh khắc ngọt ngào.",
    "Trân trọng kính mời bạn đến nâng ly chúc phúc cho tình yêu, cho những lời hẹn ước và hành trình trăm năm mà chúng mình chuẩn bị bắt đầu.",
  ],
  garden: [
    "Tình yêu của chúng mình đã đến ngày đơm hoa kết trái. Trân trọng mời bạn ghé thăm khu vườn hạnh phúc và cùng lưu giữ những kỷ niệm tuyệt đẹp.",
    "Giữa hương sắc cỏ hoa và những lời chúc phúc ngọt ngào, chúng mình mong được đón tiếp bạn trong ngày hai gia đình chung trọn niềm vui.",
    "Một ngày dịu dàng đang chờ đón phía trước. Sự hiện diện của bạn chính là đóa hoa rạng rỡ nhất trong ngày vui của chúng mình.",
  ],
  modern: [
    "Save our special date! Một lễ cưới ấm cúng, tinh tế và ngập tràn niềm vui cùng những người thân thương nhất đang chờ đón bạn.",
    "Chúng mình chọn nhau cho những ngày tháng phía trước, và chọn bạn là người chứng kiến khoảnh khắc khởi đầu thiêng liêng này.",
    "Hẹn gặp bạn tại ngày hạnh phúc nhất của chúng mình, nơi một lời đồng ý mở ra trọn vẹn một hành trình yêu thương.",
  ],
  traditional: [
    "Hai bên gia đình chúng tôi trân trọng kính báo Lễ Thành Hôn của hai con và thân mời Quý khách đến chung vui cùng gia đình.",
    "Kính mời Quý khách tới dự bữa tiệc thân mật, cùng hai họ chứng kiến và chúc phúc cho đôi bạn trẻ trăm năm gắn kết, sắc cầm hảo hợp.",
    "Sự hiện diện của Quý khách là niềm vinh hạnh to lớn, góp phần làm cho ngày hạnh phúc của hai gia đình thêm phần trang trọng và trọn vẹn.",
  ],
};

function getSamples(templateId: string) {
  if (["garden", "sakura", "tropical", "boho"].includes(templateId)) return samplesByMood.garden;
  if (["modern", "minimalist", "magazine", "flat2d", "pixel", "cosmic"].includes(templateId)) return samplesByMood.modern;
  if (["traditional", "royal", "luxury", "vintage"].includes(templateId)) return samplesByMood.traditional;
  return samplesByMood.romantic;
}

const MessagePanel = () => {
  const { message, templateId, setField } = useWeddingConfig();
  const samples = getSamples(templateId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <PanelHeader icon={<MessageSquare className="w-4 h-4" />} title="Lời ngỏ & Lời mời" sub="Lời nhắn gửi chân thành từ cô dâu & chú rể gửi đến khách quý" />
      </div>
      <div className="flex justify-end">
        <AIWriterModal onApplyText={(text) => setField("message", text)} />
      </div>
      <Textarea
        value={message}
        onChange={(e) => setField("message", e.target.value)}
        placeholder="Nhập lời ngỏ mời cưới tại đây..."
        className="min-h-[160px] text-sm leading-relaxed resize-none bg-card"
      />
      <div>
        <p className="font-body text-xs font-semibold text-foreground/80 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-accent" /> Gợi ý mẫu lời mời phù hợp phong cách:
        </p>
        <div className="space-y-2">
          {samples.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setField("message", s)}
              className="w-full text-left text-xs font-body p-3 rounded-xl border border-border bg-card/60 hover:border-accent/60 hover:bg-accent/5 transition-all text-muted-foreground hover:text-foreground leading-relaxed shadow-sm"
            >
              "{s}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagePanel;
