import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, Sparkles } from "lucide-react";
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

export const SupportChatWidget = () => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "admin",
      text: "Xin chào! Bạn đang cần tư vấn tạo thiệp, nâng cấp gói hay hỗ trợ kỹ thuật trong Workspace?",
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isSending) return;

    const userText = inputValue.trim();
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
          text: "Tin nhắn của bạn đã được chuyển thẳng tới đội ngũ quản trị viên qua Discord. Chúng mình sẽ hỗ trợ bạn ngay!",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[400px] border border-border bg-card rounded-2xl overflow-hidden shadow-sm">
      <div className="bg-accent/10 p-3.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-accent text-accent-foreground flex items-center justify-center shrink-0 shadow-sm">
            <MessageCircle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Hỗ trợ kỹ thuật & Tư vấn</h3>
            <p className="text-[10px] text-muted-foreground">Đồng bộ trực tiếp Discord</p>
          </div>
        </div>
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20 text-xs">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2 leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-accent text-accent-foreground rounded-br-none font-medium"
                  : "bg-card border border-border text-foreground rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-3 bg-card border-t border-border flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nhập câu hỏi hoặc yêu cầu..."
          className="flex-1 text-xs h-9 bg-muted/50 border-transparent focus-visible:ring-accent"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isSending}
          className="shrink-0 rounded-xl w-9 h-9 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
};
