"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AuthModal } from "@/components/AuthModal";
import { SeatMap } from "@/components/SeatMap";
import { MenuSelector } from "@/components/MenuSelector";
import { MockPaymentModal } from "@/components/MockPaymentModal";
import { UserReservations } from "@/components/UserReservations";
import { AdminDashboard } from "@/components/AdminDashboard";
import { CinemaChat } from "@/components/CinemaChat";
import { Calendar, Clock, Users, User, ShieldAlert, LogOut, Sparkles, ChevronRight, ChevronLeft, MapPin, Phone, Check, MessageSquare, Ticket } from "lucide-react";

export default function Home() {
  const {
    user,
    isAdmin,
    logout,
    toggleAdminMode,
    bookingDate,
    setBookingDate,
    bookingTime,
    setBookingTime,
    bookingGuests,
    setBookingGuests,
    selectedTableId,
    cart,
  } = useApp();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  // bookingStep - 0: Home landing page, 1: Date/Time, 2: Seat Map, 3: Menu Pre-order
  const [bookingStep, setBookingStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"book" | "my-reservations" | "cinema-chat">("book");

  const times = ["17:00", "18:00", "19:00", "20:00", "21:00"];

  const handleCheckoutTrigger = () => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    setBookingStep(0);
    setActiveTab("my-reservations");
  };

  const nextStep = () => {
    if (bookingStep === 1) {
      if (!bookingDate || !bookingTime) {
        alert("방문 날짜와 시간을 선택해 주세요.");
        return;
      }
    }
    if (bookingStep === 2) {
      if (!selectedTableId) {
        alert("원하시는 좌석 테이블을 지정해 주세요.");
        return;
      }
    }
    setBookingStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setBookingStep((prev) => prev - 1);
  };

  return (
    <div 
      className={`min-h-screen bg-[#f2f4f6] text-[#191f28] flex selection:bg-[#3182f6]/20 selection:text-[#3182f6] ${
        isAdmin 
          ? "flex-col" 
          : "justify-center items-start sm:py-6"
      }`}
    >
      
      {/* CONTAINER WRAPPER - Switched between Wide Desktop Frame & Compact Mobile App Frame */}
      <div 
        className={
          isAdmin
            ? "w-full flex flex-col relative"
            : "w-full max-w-[480px] min-h-screen sm:min-h-[840px] sm:rounded-[36px] bg-[#f2f4f6] flex flex-col relative overflow-hidden shadow-2xl border border-[#e5e8eb] bg-white"
        }
      >
        
        {/* GLOBAL HEADER */}
        <header className="sticky top-0 z-40 border-b border-[#f2f4f6] bg-white toss-shadow w-full">
          <div 
            className={
              isAdmin
                ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between"
                : "px-4 h-16 flex items-center justify-between"
            }
          >
            {/* Logo - L'ARÔME FINE DINING */}
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                setBookingStep(0);
                setActiveTab("book");
              }}
            >
              <div 
                className={`bg-[#3182f6] rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-[#3182f6]/10 ${
                  isAdmin ? "h-10 w-10 text-base" : "h-8 w-8 text-sm rounded-lg"
                }`}
              >
                ΨΩ
              </div>
              <div className="flex flex-col text-left">
                <span 
                  className={`font-serif tracking-wider text-[#191f28] font-black leading-none ${
                    isAdmin ? "text-lg" : "text-sm"
                  }`}
                >
                  L'ARÔME
                </span>
                <span 
                  className={`font-sans font-bold tracking-widest text-[#8b95a1] ${
                    isAdmin ? "text-[9px] mt-0.5" : "text-[7px] mt-0.5"
                  }`}
                >
                  FINE DINING
                </span>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-3">
              {/* Admin Toggle */}
              <button
                onClick={toggleAdminMode}
                className={`flex items-center gap-1.5 rounded-xl font-bold transition-all duration-200 cursor-pointer ${
                  isAdmin
                    ? "bg-[#3182f6] text-white border-transparent shadow-sm px-4 py-2.5 text-xs"
                    : "bg-[#f2f4f6] text-[#4e5968] hover:text-[#191f28] px-2.5 py-1.5 text-[10px] rounded-lg"
                }`}
              >
                <ShieldAlert className={isAdmin ? "h-4 w-4" : "h-3.5 w-3.5"} />
                {isAdmin ? "일반 모드 전환" : "어드민"}
              </button>

              {/* Auth Button */}
              {user ? (
                <div 
                  className={`flex items-center bg-[#f9fafb] border border-[#e5e8eb] rounded-xl ${
                    isAdmin ? "pl-3.5 pr-2 py-1.5 gap-2.5" : "pl-2.5 pr-1.5 py-1 gap-1.5 rounded-lg"
                  }`}
                >
                  <span 
                    className={`font-bold text-[#4e5968] ${
                      isAdmin ? "text-xs" : "text-[10px]"
                    }`}
                  >
                    <span className="text-[#3182f6] font-extrabold">{user.name}</span>님
                  </span>
                  <button
                    onClick={logout}
                    className="p-0.5 text-[#8b95a1] hover:text-red-500 transition-colors cursor-pointer"
                    title="로그아웃"
                  >
                    <LogOut className={isAdmin ? "h-4 w-4" : "h-3 w-3"} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className={`flex items-center gap-1.5 bg-[#3182f6] hover:bg-[#1b64da] text-white font-bold transition-colors cursor-pointer shadow-sm ${
                    isAdmin ? "px-4 py-2.5 rounded-xl text-xs" : "px-2.5 py-1.5 rounded-lg text-[10px]"
                  }`}
                >
                  <User className={isAdmin ? "h-4 w-4" : "h-3 w-3"} />
                  로그인
                </button>
              )}
            </div>
          </div>
        </header>

        {/* MAIN CONTAINER */}
        <main 
          className={
            isAdmin
              ? "max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-start min-h-[600px] flex-grow bg-white rounded-2xl toss-shadow mt-6"
              : `flex-grow w-full px-4 py-5 flex flex-col justify-start overflow-y-auto ${
                  activeTab === "cinema-chat" ? "bg-[#f2f4f6]" : "bg-white"
                }`
          }
        >
          
          {isAdmin ? (
            /* 어드민 대시보드 */
            <div className="animate-fade-in">
              <AdminDashboard />
            </div>
          ) : bookingStep === 0 ? (
            /* 0단계: 홈 화면 랜딩 페이지 및 탭 스위칭 (모바일 앱) */
            <div className="animate-fade-in flex-grow flex flex-col justify-start">
              
              {activeTab === "book" && (
                /* 탭 1: 예약 홈 */
                <div className="space-y-6 pt-2 text-left">
                  
                  {/* Headline & Badges */}
                  <div className="space-y-4">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8f3ff] border border-[#3182f6]/5 text-[10px] font-bold text-[#3182f6]">
                      <Sparkles className="h-3 w-3" />
                      미쉐린 3스타 아르페쥬 출신 셰프의 프렌치
                    </div>

                    {/* Headline */}
                    <h1 className="text-2xl sm:text-3xl font-black text-[#191f28] leading-[1.35] tracking-tight break-keep">
                      미식의 향기가<br />
                      감동으로 남는 곳,<br />
                      <span className="text-[#3182f6]">라롬 (L'ARÔME)</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xs text-[#4e5968] font-medium leading-relaxed break-keep">
                      가상 좌석 도면을 직접 보고 원하는 위치를 예약해 보세요. 셰프의 추천 시즌 테이스팅 코스와 디저트 사전 주문을 통해 완벽한 미식을 즐기실 수 있습니다.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => {
                        if (!user) {
                          alert("로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.");
                          setIsAuthOpen(true);
                          return;
                        }
                        setBookingStep(1);
                      }}
                      className="inline-flex items-center justify-center gap-1 rounded-xl bg-[#3182f6] hover:bg-[#1b64da] text-white py-3 text-xs font-extrabold shadow-sm active:scale-[0.98] transition-all cursor-pointer"
                    >
                      실시간 예약하기
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => setActiveTab("my-reservations")}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white border border-[#e5e8eb] hover:bg-[#f2f4f6] text-[#4e5968] py-3 text-xs font-extrabold transition-all cursor-pointer toss-shadow"
                    >
                      <Ticket className="h-3.5 w-3.5 text-[#3182f6]" />
                      예약 확인하기
                    </button>
                  </div>

                  {/* Hero Image Card */}
                  <div className="relative w-full rounded-2xl overflow-hidden toss-card-shadow aspect-[4/3] bg-stone-100 border border-[#f2f4f6]">
                    <img
                      src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80"
                      alt="Chef Signature Table"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    
                    {/* Overlay texts */}
                    <div className="absolute bottom-0 inset-x-0 p-4 space-y-1 text-left">
                      <span className="text-[8px] font-bold text-sky-400 tracking-wider uppercase block">
                        CHEF'S SIGNATURE TABLE
                      </span>
                      <h3 className="text-sm font-bold text-white leading-snug">
                        "정교한 프렌치 다이닝의 정수를 청담동에서 즐겨보세요."
                      </h3>
                      <p className="text-[9px] text-stone-300 font-semibold leading-relaxed">
                        매일 신선한 최상급 제철 식재료와 프렌치 테크닉의 하모니
                      </p>
                    </div>
                  </div>

                  {/* Info Row Card */}
                  <div className="grid grid-cols-3 gap-1 py-3 px-1 border-t border-[#e5e8eb] text-center">
                    <div className="space-y-1">
                      <span className="text-[9px] text-[#8b95a1] font-bold block">위치</span>
                      <span className="text-[10px] font-bold text-[#4e5968] block truncate">서울 청담동 12</span>
                    </div>
                    <div className="space-y-1 border-x border-[#e5e8eb]">
                      <span className="text-[9px] text-[#8b95a1] font-bold block">영업 시간</span>
                      <span className="text-[10px] font-bold text-[#4e5968] block">12:00 - 22:00</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-[#8b95a1] font-bold block">예약 문의</span>
                      <span className="text-[10px] font-bold text-[#4e5968] block">02-1234-5678</span>
                    </div>
                  </div>

                </div>
              )}

              {activeTab === "my-reservations" && (
                /* 탭 2: 나의 예약 현황 */
                <div className="animate-fade-in">
                  <UserReservations onOpenLogin={() => setIsAuthOpen(true)} />
                </div>
              )}

              {activeTab === "cinema-chat" && (
                /* 탭 3: AI 시네마 챗봇 */
                <div className="animate-fade-in flex-grow flex flex-col justify-start">
                  <CinemaChat />
                </div>
              )}

            </div>
          ) : (
            /* 예약 단계별 순차 노출 화면 (Step 1 -> 2 -> 3) */
            <div className="space-y-5 animate-fade-in flex-grow flex flex-col justify-start w-full py-1">
              
              {/* STEP PROGRESS BAR */}
              <div className="rounded-xl bg-white p-3.5 toss-shadow border border-[#f2f4f6]">
                <div className="flex justify-between items-center relative">
                  
                  {/* Connecting Line */}
                  <div className="absolute left-[8%] right-[8%] top-1/2 -translate-y-1/2 h-0.5 bg-[#f2f4f6] z-0" />
                  <div 
                    className="absolute left-[8%] top-1/2 -translate-y-1/2 h-0.5 bg-[#3182f6] z-0 transition-all duration-300"
                    style={{
                      width: `${((bookingStep - 1) / 2) * 84}%`
                    }}
                  />

                  {/* Steps */}
                  {[
                    { stepNum: 1, label: "일정 및 인원" },
                    { stepNum: 2, label: "좌석 지정" },
                    { stepNum: 3, label: "관람권 선택" }
                  ].map((s) => {
                    const isCompleted = bookingStep > s.stepNum;
                    const isActive = bookingStep === s.stepNum;

                    return (
                      <div key={s.stepNum} className="flex flex-col items-center z-10 relative">
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                            isCompleted
                              ? "bg-[#3182f6] text-white"
                              : isActive
                              ? "bg-[#e8f3ff] border border-[#3182f6] text-[#3182f6] scale-105"
                              : "bg-white border border-[#e5e8eb] text-[#8b95a1]"
                          }`}
                        >
                          {isCompleted ? <Check className="h-3.5 w-3.5" /> : s.stepNum}
                        </div>
                        <span
                          className={`text-[9px] font-bold mt-1.5 transition-colors ${
                            isActive ? "text-[#3182f6]" : isCompleted ? "text-[#191f28]" : "text-[#8b95a1]"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}

                </div>
              </div>

              {/* STEP CONTENTS */}
              <div className="flex-grow">
                
                {/* STEP 1: Date & Time Picker */}
                {bookingStep === 1 && (
                  <div className="rounded-xl bg-white p-4 border border-[#f2f4f6] toss-shadow space-y-4 animate-fade-in text-left">
                    <div>
                      <h3 className="text-sm font-bold text-[#191f28]">
                        1. 상영 일정 및 관람 인원 선택
                      </h3>
                      <p className="text-[10px] text-[#8b95a1] mt-0.5">영화 상영 일시와 관람하실 인원수를 선택해 주세요.</p>
                    </div>
                    
                    <div className="space-y-4 pt-1">
                      {/* Date */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#4e5968] mb-1.5 pl-0.5">
                          날짜 선택
                        </label>
                        <input
                          type="date"
                          value={bookingDate}
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => setBookingDate(e.target.value)}
                          className="w-full rounded-xl border border-transparent bg-[#f2f4f6] py-3 px-3.5 text-xs text-[#191f28] focus:bg-white focus:border-[#3182f6] focus:outline-none transition-all font-semibold"
                        />
                      </div>

                      {/* Time */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#4e5968] mb-1.5 pl-0.5">
                          시간 선택
                        </label>
                        <div className="relative">
                          <select
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full rounded-xl border border-transparent bg-[#f2f4f6] py-3 px-3.5 text-xs text-[#191f28] focus:bg-white focus:border-[#3182f6] focus:outline-none transition-all appearance-none cursor-pointer font-semibold"
                          >
                            <option value="">상영 시간을 골라주세요</option>
                            {times.map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                          <Clock className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-[#8b95a1] pointer-events-none" />
                        </div>
                      </div>

                      {/* Guests */}
                      <div>
                        <label className="block text-[10px] font-bold text-[#4e5968] mb-1.5 pl-0.5">
                          관람 인원
                        </label>
                        <div className="relative">
                          <select
                            value={bookingGuests}
                            onChange={(e) => setBookingGuests(Number(e.target.value))}
                            className="w-full rounded-xl border border-transparent bg-[#f2f4f6] py-3 px-3.5 text-xs text-[#191f28] focus:bg-white focus:border-[#3182f6] focus:outline-none transition-all appearance-none cursor-pointer font-semibold"
                          >
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <option key={num} value={num}>
                                {num}명
                              </option>
                            ))}
                          </select>
                          <Users className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-[#8b95a1] pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Seat Map Layout */}
                {bookingStep === 2 && (
                  <div className="animate-fade-in">
                    <SeatMap />
                  </div>
                )}

                {/* STEP 3: Menu Pre-order & Basket */}
                {bookingStep === 3 && (
                  <div className="animate-fade-in">
                    <MenuSelector onCheckout={handleCheckoutTrigger} />
                  </div>
                )}

              </div>

              {/* FLOW NAVIGATION FOOTER BUTTONS */}
              <div className="flex justify-between items-center pt-3 border-t border-[#e5e8eb]">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-1 rounded-xl bg-white border border-[#e5e8eb] hover:bg-[#f2f4f6] text-[#4e5968] px-3.5 py-2.5 text-[10px] font-bold transition-all cursor-pointer toss-shadow"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  이전
                </button>

                {bookingStep < 3 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-1 rounded-xl bg-[#3182f6] hover:bg-[#1b64da] text-white px-4.5 py-3 text-[10px] font-bold transition-all cursor-pointer shadow-sm"
                  >
                    다음 단계
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleCheckoutTrigger}
                    disabled={cart.length === 0}
                    className={`flex items-center gap-1 rounded-xl px-4.5 py-3 text-[10px] font-bold transition-all cursor-pointer shadow-sm ${
                      cart.length > 0 
                        ? "bg-[#3182f6] hover:bg-[#1b64da] text-white" 
                        : "bg-[#e5e8eb] text-[#8b95a1] cursor-not-allowed"
                    }`}
                  >
                    결제하기
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

            </div>
          )}
        </main>

        {/* 📱 BOTTOM FIXED TAB NAVIGATION BAR (Visible only in non-admin mobile view & bookingStep == 0) */}
        {!isAdmin && bookingStep === 0 && (
          <nav className="sticky bottom-0 bg-white border-t border-[#f2f4f6] py-2 flex justify-around items-center z-30 toss-shadow">
            {/* Tab 1: 예약 홈 */}
            <button
              onClick={() => {
                setActiveTab("book");
                setBookingStep(0);
              }}
              className={`flex flex-col items-center gap-1 py-1 cursor-pointer transition-colors ${
                activeTab === "book" ? "text-[#3182f6]" : "text-[#8b95a1] hover:text-[#4e5968]"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-[9px] font-extrabold">예약 홈</span>
            </button>

            {/* Tab 2: 내 예약 확인 */}
            <button
              onClick={() => {
                setActiveTab("my-reservations");
                setBookingStep(0);
              }}
              className={`flex flex-col items-center gap-1 py-1 cursor-pointer transition-colors ${
                activeTab === "my-reservations" ? "text-[#3182f6]" : "text-[#8b95a1] hover:text-[#4e5968]"
              }`}
            >
              <Ticket className="h-5 w-5" />
              <span className="text-[9px] font-extrabold">내 예약</span>
            </button>

            {/* Tab 3: 시네마 AI 챗봇 */}
            <button
              onClick={() => {
                setActiveTab("cinema-chat");
                setBookingStep(0);
              }}
              className={`flex flex-col items-center gap-1 py-1 cursor-pointer transition-colors ${
                activeTab === "cinema-chat" ? "text-[#3182f6]" : "text-[#8b95a1] hover:text-[#4e5968]"
              }`}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-[9px] font-extrabold">AI 챗봇</span>
            </button>
          </nav>
        )}

        {/* FOOTER */}
        <footer 
          className={`border-t border-[#e5e8eb] bg-[#f9fafb] text-[#8b95a1] font-bold w-full ${
            isAdmin
              ? "py-6 text-xs mt-auto"
              : "py-4 text-center text-[9px] mt-auto"
          }`}
        >
          <div 
            className={
              isAdmin
                ? "max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4"
                : "px-4 flex flex-col items-center gap-1"
            }
          >
            <p>© 2026 L'ARÔME Fine Dining. Powered by toss pay.</p>
            <div 
              className={`flex justify-center text-[#8b95a1] ${
                isAdmin ? "gap-6 font-semibold" : "gap-4 text-[8px] font-semibold"
              }`}
            >
              <span className="hover:text-[#4e5968] cursor-pointer">이용약관</span>
              <span className="hover:text-[#4e5968] cursor-pointer">개인정보처리방침</span>
            </div>
          </div>
        </footer>

      </div>

      {/* MODALS */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      
      <MockPaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
      />
      
    </div>
  );
}
