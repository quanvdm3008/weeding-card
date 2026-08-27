import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendDiscordNotification } from "@/lib/discord";

interface Message {
  id: string;
  sender: "user" | "admin";
  text: string;
  timestamp: Date;
}

export const FloatingSupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "admin",
      text: "Xin chào! Mình là chuyên viên tư vấn của Mireia Studio. Bạn cần hỗ trợ chọn mẫu thiệp, thiết kế theo yêu cầu hay tư vấn tính năng màn hình LED tiệc cưới không?",
      timestamp: new Date(),
    },
  ]);
  const [senderName, setSenderName] = useState("");
  const [senderContact, setSenderContact] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

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

    // Send direct alert to Discord Webhook for developers/admins
    await sendDiscordNotification({
      title: "💬 Tin nhắn Live Support từ Landing Page",
      name: senderName.trim() || "Khách quan tâm dịch vụ",
      phone: senderContact.trim(),
      message: userText,
      source: window.location.href,
      type: "support",
    });

    setIsSending(false);

    // Friendly automated feedback
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "admin",
          text: "Cảm ơn bạn! Tin nhắn đã được chuyển đến ban tư vấn & kỹ thuật viên qua Discord. Chúng mình sẽ liên hệ lại ngay nhé!",
          timestamp: new Date(),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-[360px] h-[500px] bg-card border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-stone-900 to-zinc-900 p-4 border-b border-border text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold shrink-0 shadow-md">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-white">Tư vấn Mireia Studio</h3>
                <p className="text-[11px] text-amber-300 flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block animate-ping" />
                  Đồng bộ tức thì tới Discord Dev
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="rounded-full h-8 w-8 text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20 text-xs">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed shadow-sm ${
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

          {/* User Info & Input Box */}
          <form onSubmit={handleSend} className="p-3 bg-card border-t border-border space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="Tên của bạn..."
                className="h-8 text-xs bg-muted/40"
              />
              <Input
                value={senderContact}
                onChange={(e) => setSenderContact(e.target.value)}
                placeholder="SĐT hoặc Zalo..."
                className="h-8 text-xs bg-muted/40"
              />
            </div>
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập nội dung cần hỗ trợ..."
                className="flex-1 text-xs h-9 bg-muted/50 focus-visible:ring-accent"
              />
              <Button
                type="submit"
                size="icon"
                disabled={isSending}
                className="shrink-0 rounded-xl w-9 h-9 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 px-5 rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-2xl flex items-center gap-2.5 transition hover:scale-105 border border-border/40"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500" />
          </span>
          <MessageCircle className="h-5 w-5 text-accent" />
          <span className="text-xs font-bold tracking-wide">Hỗ trợ tư vấn</span>
        </Button>
      )}
    </div>
  );
};
