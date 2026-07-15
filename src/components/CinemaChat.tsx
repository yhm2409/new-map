"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessageSquare, AlertCircle } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const CinemaChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "안녕하세요! **라롬 파인다이닝 AI 컨시어지**입니다. 레스토랑 메뉴 구성, 좌석 테이블 혜택, 영업 시간 및 무료 주차 서비스에 대해 무엇이든 편하게 물어보세요! 🍽️"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    { text: "🍽️ 레스토랑 코스 요리 구성 알려줘", query: "라롬 파인다이닝 레스토랑의 코스 요리 메뉴판과 대표 스테이크 정보를 자세히 알고 싶어요." },
    { text: "🍷 창가석, 룸 좌석 종류와 예약 팁", query: "2단계 좌석 맵에 있는 창가석, 프라이빗 룸, 홀 테이블 구조와 특징을 알려주세요." },
    { text: "📍 식당 위치와 발레파킹 무료 안내", query: "청담동 라롬 레스토랑의 상세 오시는 길과 무료 발레파킹 이용 규칙이 어떻게 되나요?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setError(null);
    const newMsg: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiMessages = [...messages, newMsg].map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        setError(data.message || "AI 응답을 받아오는데 실패했습니다.");
      }
    } catch (err) {
      console.error("Chat fetch error:", err);
      setError("네트워크 연결 에러가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-extrabold text-[#191f28]">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-[525px] bg-[#f2f4f6] overflow-hidden animate-fade-in text-left">
      
      {/* 1. CHAT HEADER */}
      <div className="bg-white border-b border-[#f2f4f6] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-[#3182f6]/10 flex items-center justify-center text-[#3182f6] shadow-inner">
            <Sparkles className="h-4.5 w-4.5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#191f28]">라롬 레스토랑 AI 챗봇</h4>
            <span className="text-[9px] text-[#3182f6] font-bold block mt-0.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 block animate-ping" />
              GROQ Llama-3.3 실시간 상담 중
            </span>
          </div>
        </div>
      </div>

      {/* 2. CHAT HISTORY AREA */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={index}
              className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[85%] rounded-[18px] p-3 text-xs leading-relaxed break-all whitespace-pre-line toss-shadow ${
                  isUser
                    ? "bg-[#3182f6] text-white rounded-tr-none font-bold"
                    : "bg-white text-[#4e5968] rounded-tl-none border border-[#f2f4f6] font-semibold"
                }`}
              >
                {isUser ? msg.content : renderMessageContent(msg.content)}
              </div>
            </div>
          );
        })}

        {/* LOADING Bubble */}
        {isLoading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white text-[#8b95a1] rounded-[18px] rounded-tl-none border border-[#f2f4f6] p-3 toss-shadow flex items-center gap-1">
              <span className="h-2 w-2 bg-[#8b95a1] rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="h-2 w-2 bg-[#8b95a1] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="h-2 w-2 bg-[#8b95a1] rounded-full animate-bounce" />
            </div>
          </div>
        )}

        {/* ERROR Bubble */}
        {error && (
          <div className="flex justify-center text-center p-2">
            <div className="bg-red-50 border border-red-100 text-red-500 rounded-xl p-2.5 text-[10px] font-bold flex items-center gap-1.5 toss-shadow">
              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 3. QUICK QUESTIONS GRID */}
      {messages.length === 1 && !isLoading && (
        <div className="bg-white/80 backdrop-blur-sm p-3.5 border-t border-[#f2f4f6] space-y-2">
          <span className="text-[9px] text-[#8b95a1] font-bold tracking-wider uppercase block pl-1">
            자주 묻는 질문
          </span>
          <div className="flex flex-col gap-1.5">
            {quickQuestions.map((qq, index) => (
              <button
                key={index}
                onClick={() => handleSend(qq.query)}
                className="w-full text-left bg-white border border-[#e5e8eb] hover:border-[#3182f6]/40 hover:bg-[#f2f4f6] p-2.5 rounded-xl text-[10px] font-extrabold text-[#4e5968] hover:text-[#191f28] transition-all cursor-pointer toss-shadow truncate"
              >
                {qq.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. INPUT BOX */}
      <div className="bg-white border-t border-[#f2f4f6] p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              handleSend(input);
            }
          }}
          disabled={isLoading}
          placeholder="레스토랑 예약 관련 질문을 입력하세요..."
          className="flex-grow rounded-xl bg-[#f2f4f6] border border-transparent px-4 py-3 text-xs text-[#191f28] focus:bg-white focus:border-[#3182f6] focus:outline-none transition-all disabled:opacity-70 font-semibold"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isLoading}
          className="h-10 w-10 rounded-xl bg-[#3182f6] hover:bg-[#1b64da] text-white flex items-center justify-center transition-all cursor-pointer shadow-md disabled:bg-[#e5e8eb] disabled:text-[#8b95a1] disabled:cursor-not-allowed"
          aria-label="전송"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

    </div>
  );
};
