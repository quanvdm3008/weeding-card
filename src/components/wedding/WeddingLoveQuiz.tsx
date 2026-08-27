import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, CheckCircle, HelpCircle, Heart, RotateCcw, PartyPopper } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    question: "Khoảnh khắc đầu tiên Chú Rể và Cô Dâu chạm mắt nhau ở đâu?",
    options: ["Quán cà phê góc phố mùa thu", "Thư viện trường đại học", "Buổi tiệc sinh nhật một người bạn thân", "Trạm xe bus dưới cơn mưa rào"],
    correctIndex: 0,
    explanation: "Đúng rồi! Đó là một buổi chiều thu tháng 10 dịu dàng tại quán cà phê quen thuộc.",
  },
  {
    question: "Ai là người chủ động nói lời tỏ tình trước?",
    options: ["Chú Rể (sau 3 tháng chuẩn bị)", "Cô Dâu (vì đợi lâu quá)", "Cả hai cùng nói một lúc", "Do bạn thân xúi giục"],
    correctIndex: 0,
    explanation: "Chính xác! Chú rể đã chuẩn bị một bó hoa cúc tana và bức thư viết tay ngọt ngào.",
  },
  {
    question: "Món ăn yêu thích nhất mà cả hai luôn đồng lòng chọn mỗi cuối tuần?",
    options: ["Phở bò gia truyền phố cổ", "Lẩu bò nhúng giấm", "Bún chả que tre nướng than hoa", "Pizza nướng củi hải sản"],
    correctIndex: 1,
    explanation: "Tuyệt vời! Lẩu bò nhúng giấm luôn là chân ái của cặp đôi trong mọi ngày se lạnh.",
  },
  {
    question: "Sau khi kết hôn, công việc 'rửa bát & dọn nhà' sẽ do ai phụ trách?",
    options: ["Chú Rể tự giác nhận 100%", "Cô Dâu đảm đang lo liệu", "Máy rửa bát làm việc, cả hai cùng nghỉ ngơi", "Chia đều theo lịch chẵn / lẻ"],
    correctIndex: 2,
    explanation: "Chuẩn không cần chỉnh! Cả hai đã đầu tư ngay một chiếc máy rửa bát hiện đại để giữ hòa khí gia đình!",
  },
];

interface Props {
  groomName?: string;
  brideName?: string;
  accentColor?: string;
}

export const WeddingLoveQuiz: React.FC<Props> = ({
  groomName = "Minh Anh",
  brideName = "Thanh Hà",
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const q = DEFAULT_QUESTIONS[currentIdx];

  const handleSelect = (optionIdx: number) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
    setIsAnswered(true);

    if (optionIdx === q.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < DEFAULT_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCompleted(false);
    setScore(0);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-12 px-4 select-none">
      <div className="bg-[#FDFBF7] rounded-3xl border border-[#C5A880]/60 p-6 sm:p-10 shadow-[0_20px_50px_rgba(154,123,86,0.12)] text-center relative overflow-hidden">
        {/* Top Emblem */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FAF7F2] border border-[#C5A880]/50 text-[#9A7B56] text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
          <span>MINIGAME TƯƠNG TÁC NGÀY CƯỚI</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-serif font-normal uppercase tracking-wider text-[#2C2523] mb-2">
          BẠN HIỂU {groomName.toUpperCase()} & {brideName.toUpperCase()} ĐẾN ĐÂU?
        </h3>
        <p className="text-xs sm:text-sm text-[#6B5D55] italic mb-8 max-w-md mx-auto">
          Cùng tham gia trắc nghiệm vui 4 câu hỏi về chuyện tình của cặp đôi để rinh về những phần quà may mắn!
        </p>

        {!isCompleted ? (
          <div>
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs text-[#8C7A70] font-mono mb-3 max-w-xl mx-auto">
              <span>CÂU HỎI {currentIdx + 1} / {DEFAULT_QUESTIONS.length}</span>
              <span>ĐIỂM: {score}</span>
            </div>
            <div className="w-full max-w-xl mx-auto h-1.5 bg-[#EFE8DE] rounded-full overflow-hidden mb-6">
              <motion.div
                className="h-full bg-[#9A7B56]"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIdx + 1) / DEFAULT_QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>

            {/* Question Box */}
            <div className="bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-[#C5A880]/40 max-w-xl mx-auto mb-6 text-left">
              <h4 className="text-base sm:text-lg font-serif font-bold text-[#2C2523] leading-snug flex items-start gap-2.5">
                <HelpCircle className="w-5 h-5 text-[#9A7B56] shrink-0 mt-0.5" />
                <span>{q.question}</span>
              </h4>
            </div>

            {/* Options List */}
            <div className="space-y-3 max-w-xl mx-auto text-left mb-6">
              {q.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === q.correctIndex;
                let btnStyle = "bg-[#FAF7F2] border-[#C5A880]/40 text-[#2C2523] hover:bg-[#F3EDE2]";

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-sm";
                  } else if (isSelected && !isCorrect) {
                    btnStyle = "bg-rose-50 border-rose-400 text-rose-800";
                  } else {
                    btnStyle = "opacity-40 bg-[#FAF7F2] border-transparent text-[#8C7A70]";
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border transition-all text-xs sm:text-sm flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full border border-current text-xs font-mono font-bold flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </span>
                    {isAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Next Button */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-xl mx-auto"
                >
                  <p className="text-xs sm:text-sm text-[#6B5D55] italic bg-[#F3EDE2]/80 p-3.5 rounded-xl border border-[#C5A880]/30 mb-5">
                    💡 {q.explanation}
                  </p>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-3 rounded-full bg-[#9A7B56] text-[#FAF7F2] text-xs font-serif font-bold uppercase tracking-widest hover:bg-[#7D6344] transition-all shadow-md cursor-pointer"
                  >
                    {currentIdx < DEFAULT_QUESTIONS.length - 1 ? "Câu Tiếp Theo →" : "Xem Kết Quả Chung Cuộc 🎉"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Final Results Card */
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-md mx-auto text-center space-y-4 py-4"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C5A880] to-[#9A7B56] text-white flex items-center justify-center mx-auto shadow-lg">
              <Trophy className="w-10 h-10" />
            </div>

            <h4 className="text-2xl font-serif font-bold uppercase text-[#2C2523]">
              {score >= 3 ? "BẠN LÀ BẠN TRI KỶ CỦA DÂU RỂ! 🌟" : "MỘT NGƯỜI BẠN TUYỆT VỜI! 💖"}
            </h4>

            <p className="text-sm text-[#6B5D55]">
              Bạn đã trả lời đúng <strong className="text-[#9A7B56] text-lg">{score}/{DEFAULT_QUESTIONS.length}</strong> câu hỏi. Hãy cùng chờ đón thời khắc nâng ly chúc phúc trên khán phòng tiệc cưới nhé!
            </p>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRestart}
                className="px-6 py-2.5 rounded-full bg-[#FAF7F2] border border-[#C5A880]/60 text-[#9A7B56] text-xs font-serif font-bold uppercase tracking-wider hover:bg-[#F3EDE2] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Chơi lại</span>
              </button>
              <a
                href="#rsvp"
                className="px-6 py-2.5 rounded-full bg-[#9A7B56] text-[#FAF7F2] text-xs font-serif font-bold uppercase tracking-wider hover:bg-[#7D6344] transition-all shadow-md flex items-center gap-1.5"
              >
                <PartyPopper className="w-3.5 h-3.5" />
                <span>Gửi lời chúc ngay</span>
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
export default WeddingLoveQuiz;
