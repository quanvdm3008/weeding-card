import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Sparkles, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/authStore";
import { sendDiscordNotification } from "@/lib/discord";

interface Message {
  id: string;
  sender: "user" | "admin";
  text: string;
  timestamp: Date;
}

const QUICK_PROMPTS = [
  "Tư vấn mẫu thiệp phù hợp",
  "Hướng dẫn cấu hình VietQR",
  "Cách quản lý khách mời",
  "Nâng cấp gói tài khoản",
];

export const SupportChatWidget = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "admin",
      text: "Xin chào! Mireia Concierge luôn sẵn sàng đồng hành cùng bạn tạo nên thiệp cưới hoàn hảo nhất. Bạn cần hỗ trợ gì hôm nay?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessageText = async (textToSend: string) => {
    if (!textToSend.trim() || isSending) return;

    const userText = textToSend.trim();
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsSending(true);

    // Send direct notification to Discord Webhook
    await sendDiscordNotification({
      title: "💬 Tin nhắn Support từ Dashboard Workspace",
      name: user?.email || "Chủ tiệc Mireia",
      email: user?.email,
      message: userText,
      source: window.location.href,
      type: "support",
    });

    setIsSending(false);

    // Simulate admin response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "admin",
          text: "Cảm ơn bạn! Yêu cầu đã được gửi trực tiếp tới đội ngũ kỹ thuật Mireia qua Discord. Chúng mình sẽ phản hồi ngay qua email hoặc cửa sổ này!",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessageText(inputValue);
  };

  return (
    <div className="flex flex-col h-[420px] border border-border/80 bg-card rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent/15 via-accent/5 to-transparent p-4 border-b border-border/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm leading-tight text-foreground">Mireia Concierge</h3>
            <p className="text-[10px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Trực tuyến · Hỗ trợ 24/7
            </p>
          </div>
        </div>
        <HelpCircle className="h-4 w-4 text-muted-foreground/60" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/10 text-xs">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-accent text-accent-foreground rounded-br-none font-medium"
                  : "bg-card border border-border/80 text-foreground rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2 border-t border-border/50 bg-muted/20 flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => sendMessageText(prompt)}
            className="shrink-0 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:border-accent hover:text-accent transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-card border-t border-border/70 flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập câu hỏi hoặc yêu cầu..."
          className="flex-1 text-xs h-9 bg-muted/40 border-border/60 focus-visible:ring-accent"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isSending || !inputValue.trim()}
          className="shrink-0 rounded-xl w-9 h-9 bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40"
        >
          {isSending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        </Button>
      </form>
    </div>
  );
};

export default SupportChatWidget;
