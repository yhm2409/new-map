"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AuthModal } from "@/components/AuthModal";
import { SeatMap, TABLES } from "@/components/SeatMap";
import { MenuSelector } from "@/components/MenuSelector";
import { MockPaymentModal } from "@/components/MockPaymentModal";
import { UserReservations } from "@/components/UserReservations";
import { AdminDashboard } from "@/components/AdminDashboard";
import { Calendar, Clock, Users, User, ShieldAlert, LogOut, Sparkles, ChefHat, ChevronRight, ChevronLeft, MapPin, Phone, Check } from "lucide-react";

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
    setSelectedTableId,
    cart,
    getCartTotal,
  } = useApp();

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  // bookingStep - 0: Home landing page, 1: Date/Time, 2: Seat Map, 3: Menu Pre-order
  const [bookingStep, setBookingStep] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"book" | "my-reservations">("book");

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
    <div className="min-h-screen bg-[#f2f4f6] text-[#191f28] flex flex-col selection:bg-[#3182f6]/20 selection:text-[#3182f6]">
      
      {/* GLOBAL HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#f2f4f6] bg-white toss-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo - L'ARÔME FINE DINING */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setBookingStep(0);
              setActiveTab("book");
            }}
          >
            <div className="h-10 w-10 bg-[#3182f6] rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-[#3182f6]/10">
              ΨΩ
            </div>
            <div className="flex flex-col text-left">
              <span className="font-serif text-lg tracking-wider text-[#191f28] font-black">
                L'ARÔME
              </span>
              <span className="text-[9px] font-sans font-bold tracking-widest text-[#8b95a1] -mt-1">
                FINE DINING
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            {/* Admin Toggle */}
            <button
              onClick={toggleAdminMode}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isAdmin
                  ? "bg-[#3182f6] text-white border-transparent shadow-sm"
                  : "bg-white border border-[#e5e8eb] text-[#4e5968] hover:text-[#191f28] hover:bg-[#f2f4f6]"
              }`}
            >
              <ShieldAlert className="h-4 w-4" />
              어드민 대시보드
            </button>

            {/* Auth Button */}
            {user ? (
              <div className="flex items-center gap-2.5 bg-[#f9fafb] border border-[#e5e8eb] pl-3.5 pr-2 py-1.5 rounded-xl">
                <span className="text-xs text-[#4e5968] font-bold">
                  <span className="text-[#3182f6] font-extrabold">{user.name}</span>님
                </span>
                <button
                  onClick={logout}
                  className="p-1 rounded-lg text-[#8b95a1] hover:text-red-500 transition-colors cursor-pointer"
                  title="로그아웃"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 bg-[#3182f6] hover:bg-[#1b64da] text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
              >
                <User className="h-4 w-4" />
                로그인
              </button>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center">
        
        {isAdmin ? (
          /* 어드민 모드 */
          <div className="animate-fade-in">
            <AdminDashboard />
          </div>
        ) : bookingStep === 0 ? (
          /* 0단계: L'ARÔME 홈 화면 랜딩 페이지 (전달받은 레퍼런스 이미지와 100% 동일) */
          <div className="space-y-10 animate-fade-in flex-grow flex flex-col justify-center py-6">
            
            {/* Tab controls (사용자 예약 조회 이동 가능하게 탭은 연동 제공) */}
            <div className="flex border-b border-[#e5e8eb] gap-4">
              <button
                onClick={() => {
                  setActiveTab("book");
                  setBookingStep(0);
                }}
                className={`pb-4 text-sm font-bold tracking-tight border-b-[3px] transition-all duration-200 cursor-pointer ${
                  activeTab === "book"
                    ? "border-[#3182f6] text-[#3182f6]"
                    : "border-transparent text-[#8b95a1] hover:text-[#4e5968]"
                }`}
              >
                소개 및 예약 홈
              </button>
              <button
                onClick={() => setActiveTab("my-reservations")}
                className={`pb-4 text-sm font-bold tracking-tight border-b-[3px] transition-all duration-200 cursor-pointer ${
                  activeTab === "my-reservations"
                    ? "border-[#3182f6] text-[#3182f6]"
                    : "border-transparent text-[#8b95a1] hover:text-[#4e5968]"
                }`}
              >
                나의 예약 현황
              </button>
            </div>

            {activeTab === "book" ? (
              /* Home Landing Page Grid */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-4">
                
                {/* Left Column: Headline and Actions (7/12) */}
                <div className="lg:col-span-7 space-y-6 text-left pr-4">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e8f3ff] border border-[#3182f6]/10 text-xs font-bold text-[#3182f6]">
                    <Sparkles className="h-3.5 w-3.5" />
                    미쉐린 3스타 아르페쥬 출신 셰프의 정통 프렌치 파인다이닝
                  </div>

                  {/* Headline */}
                  <h1 className="text-4xl sm:text-5xl font-black text-[#191f28] leading-[1.3] tracking-tight">
                    미식의 향기가<br />
                    감동으로 남는 곳, <span className="text-[#3182f6]">라롬 (L'ARÔME)</span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base text-[#4e5968] font-medium leading-relaxed max-w-xl break-keep">
                    가상 좌석 도면을 직접 보고 원하는 위치를 예약해 보세요.<br />
                    셰프의 추천 시즌 테이스팅 코스와 디저트 사전 주문을 통해 완벽한 미식을 즐기실 수 있습니다.
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button
                      onClick={() => setBookingStep(1)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-[#3182f6] hover:bg-[#1b64da] text-white px-7 py-4 text-sm font-extrabold tracking-wide shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
                    >
                      실시간 예약하기
                      <ChevronRight className="h-4.5 w-4.5" />
                    </button>

                    <button
                      onClick={() => setActiveTab("my-reservations")}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-[#e5e8eb] hover:bg-[#f2f4f6] text-[#4e5968] px-7 py-4 text-sm font-extrabold tracking-wide transition-all duration-200 cursor-pointer toss-shadow"
                    >
                      <User className="h-4.5 w-4.5 text-[#3182f6]" />
                      내 예약 확인하기
                    </button>
                  </div>

                  {/* Bottom Info Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-[#e5e8eb]">
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-[#4e5968]">
                      <MapPin className="h-4 w-4 text-[#3182f6] flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#8b95a1] block font-bold">위치</span>
                        서울시 강남구 청담동 12-34
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-[#4e5968]">
                      <Clock className="h-4 w-4 text-[#3182f6] flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#8b95a1] block font-bold">영업</span>
                        매일 12:00 - 22:00
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 text-xs font-semibold text-[#4e5968]">
                      <Phone className="h-4 w-4 text-[#3182f6] flex-shrink-0" />
                      <div>
                        <span className="text-[10px] text-[#8b95a1] block font-bold">문의</span>
                        02-1234-5678
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Hero Image Card (5/12) */}
                <div className="lg:col-span-5 relative w-full flex justify-center">
                  <div className="relative w-full max-w-[420px] rounded-[32px] overflow-hidden toss-card-shadow aspect-[4/5] bg-stone-100 border border-[#f2f4f6]">
                    {/* Hero Food Image */}
                    <img
                      src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
                      alt="Chef Signature Table"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                    
                    {/* Bottom overlay text */}
                    <div className="absolute bottom-0 inset-x-0 p-6 space-y-2.5 text-left">
                      <span className="text-[10px] font-bold text-sky-400 tracking-wider uppercase block">
                        CHEF'S SIGNATURE TABLE
                      </span>
                      <h3 className="text-lg font-bold text-white leading-snug tracking-tight">
                        "정교한 프렌치 다이닝의 정수를 청담동에서 즐겨보세요."
                      </h3>
                      <p className="text-[11px] text-stone-300 font-semibold leading-relaxed">
                        매일 신선한 최상급 제철 식재료와 프렌치 테크닉의 하모니
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              /* 나의 예약 현황 탭 */
              <div className="animate-fade-in">
                <UserReservations onOpenLogin={() => setIsAuthOpen(true)} />
              </div>
            )}

          </div>
        ) : (
          /* 예약 단계별 순차 노출 화면 (Step 1 -> 2 -> 3) */
          <div className="space-y-8 animate-fade-in flex-grow flex flex-col justify-center max-w-4xl mx-auto w-full py-4">
            
            {/* STEP PROGRESS BAR */}
            <div className="rounded-[22px] bg-white p-5 toss-shadow border border-[#f2f4f6]">
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
                  { stepNum: 3, label: "메뉴 사전선택" }
                ].map((s) => {
                  const isCompleted = bookingStep > s.stepNum;
                  const isActive = bookingStep === s.stepNum;

                  return (
                    <div key={s.stepNum} className="flex flex-col items-center z-10 relative">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                          isCompleted
                            ? "bg-[#3182f6] text-white"
                            : isActive
                            ? "bg-[#e8f3ff] border border-[#3182f6] text-[#3182f6] scale-105"
                            : "bg-white border border-[#e5e8eb] text-[#8b95a1]"
                        }`}
                      >
                        {isCompleted ? <Check className="h-4 w-4" /> : s.stepNum}
                      </div>
                      <span
                        className={`text-[11px] font-bold mt-2 transition-colors ${
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
                <div className="rounded-[22px] bg-white p-6 border border-[#f2f4f6] toss-shadow space-y-6 animate-fade-in">
                  <div className="border-b border-[#e5e8eb] pb-3">
                    <h3 className="text-lg font-bold text-[#191f28]">
                      1. 방문 일정 및 인원 선택
                    </h3>
                    <p className="text-xs text-[#8b95a1] mt-1">방문하실 날짜와 원하시는 시간대, 인원을 선택해 주세요.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Date */}
                    <div>
                      <label className="block text-xs font-bold text-[#4e5968] mb-2 pl-1">
                        날짜 선택
                      </label>
                      <input
                        type="date"
                        value={bookingDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="w-full rounded-xl border border-transparent bg-[#f2f4f6] py-3.5 px-4 text-sm text-[#191f28] focus:bg-white focus:border-[#3182f6] focus:outline-none focus:ring-2 focus:ring-[#3182f6]/10 transition-all font-semibold"
                      />
                    </div>

                    {/* Time */}
                    <div>
                      <label className="block text-xs font-bold text-[#4e5968] mb-2 pl-1">
                        시간 선택
                      </label>
                      <div className="relative">
                        <select
                          value={bookingTime}
                          onChange={(e) => setBookingTime(e.target.value)}
                          className="w-full rounded-xl border border-transparent bg-[#f2f4f6] py-3.5 px-4 text-sm text-[#191f28] focus:bg-white focus:border-[#3182f6] focus:outline-none focus:ring-2 focus:ring-[#3182f6]/10 transition-all appearance-none cursor-pointer font-semibold"
                        >
                          <option value="">시간대를 골라주세요</option>
                          {times.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <Clock className="absolute right-4 top-4 h-4 w-4 text-[#8b95a1] pointer-events-none" />
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="block text-xs font-bold text-[#4e5968] mb-2 pl-1">
                        방문 인원
                      </label>
                      <div className="relative">
                        <select
                          value={bookingGuests}
                          onChange={(e) => setBookingGuests(Number(e.target.value))}
                          className="w-full rounded-xl border border-transparent bg-[#f2f4f6] py-3.5 px-4 text-sm text-[#191f28] focus:bg-white focus:border-[#3182f6] focus:outline-none focus:ring-2 focus:ring-[#3182f6]/10 transition-all appearance-none cursor-pointer font-semibold"
                        >
                          {[2, 3, 4, 5, 6].map((num) => (
                            <option key={num} value={num}>
                              {num}명
                            </option>
                          ))}
                        </select>
                        <Users className="absolute right-4 top-4 h-4 w-4 text-[#8b95a1] pointer-events-none" />
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
            <div className="flex justify-between items-center pt-4 border-t border-[#e5e8eb]">
              <button
                onClick={prevStep}
                className="flex items-center gap-1 rounded-xl bg-white border border-[#e5e8eb] hover:bg-[#f2f4f6] text-[#4e5968] px-5 py-3 text-xs font-bold transition-all cursor-pointer toss-shadow"
              >
                <ChevronLeft className="h-4 w-4" />
                이전으로
              </button>

              {bookingStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center gap-1 rounded-xl bg-[#3182f6] hover:bg-[#1b64da] text-white px-6 py-3.5 text-xs font-bold transition-all cursor-pointer shadow-md"
                >
                  다음 단계
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={handleCheckoutTrigger}
                  disabled={cart.length === 0}
                  className={`flex items-center gap-1 rounded-xl px-6 py-3.5 text-xs font-bold transition-all cursor-pointer shadow-md ${
                    cart.length > 0 
                      ? "bg-[#3182f6] hover:bg-[#1b64da] text-white" 
                      : "bg-[#e5e8eb] text-[#8b95a1] cursor-not-allowed"
                  }`}
                >
                  예약 완료 및 결제
                  <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>

          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-[#e5e8eb] bg-[#f9fafb] py-6 text-center text-xs text-[#8b95a1] font-semibold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <p>© 2026 L'ARÔME Fine Dining. Supported by toss pay.</p>
          <div className="flex justify-center gap-6">
            <span className="hover:text-[#4e5968] transition-colors cursor-pointer">이용 약관</span>
            <span className="hover:text-[#4e5968] transition-colors cursor-pointer">개인정보처리방침</span>
          </div>
        </div>
      </footer>

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
