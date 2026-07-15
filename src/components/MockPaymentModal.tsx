"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { X, CreditCard, Landmark, CheckCircle, ShieldCheck, Loader2 } from "lucide-react";
import { TABLES } from "./SeatMap";

interface MockPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reservationId: string) => void;
}

type PaymentMethod = "card" | "toss" | "kakao";
type PaymentStep = "choose" | "processing" | "success";

export const MockPaymentModal: React.FC<MockPaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const {
    user,
    bookingDate,
    bookingTime,
    bookingGuests,
    selectedTableId,
    cart,
    getCartTotal,
    addReservation
  } = useApp();

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [step, setStep] = useState<PaymentStep>("choose");
  const [loadingText, setLoadingText] = useState("안전한 가상 결제창에 연결 중입니다...");
  const [createdResId, setCreatedResId] = useState("");

  if (!isOpen) return null;

  const totalAmount = getCartTotal();
  const selectedTable = TABLES.find((t) => t.id === selectedTableId);

  const handlePay = () => {
    // 1차 결제 전 사전 정보 유효성 검증
    if (!user) {
      alert("로그인 정보가 없습니다. 다시 로그인해 주세요.");
      onClose();
      return;
    }
    if (!bookingDate || !bookingTime || !selectedTableId) {
      alert("예약 날짜, 시간 및 지정 좌석 테이블을 모두 확인해 주세요.");
      onClose();
      return;
    }

    setStep("processing");
    
    // Simulate payment sequence
    setTimeout(() => {
      setLoadingText("토스 결제망을 통해 거래 승인 요청 중...");
    }, 1000);

    setTimeout(() => {
      setLoadingText("가상 거래 전자 영수증 발급 중...");
    }, 2000);

    setTimeout(() => {
      const res = addReservation();
      if (res.success) {
        setCreatedResId(res.reservationId);
        setStep("success");
      } else {
        alert("예약 등록에 실패했습니다. 입력 정보(날짜, 시간, 좌석)를 다시 확인해 주세요.");
        setStep("choose");
      }
    }, 3000);
  };

  const handleSuccessConfirm = () => {
    onSuccess(createdResId);
    onClose();
    // reset step for next time
    setTimeout(() => {
      setStep("choose");
      setCreatedResId("");
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[26px] bg-white border border-[#f2f4f6] toss-card-shadow transition-all duration-300">
        
        {/* Decorative elements */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-[#3182f6]" />
        
        {/* Close Button - hide during processing */}
        {step !== "processing" && (
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-[#8b95a1] hover:text-[#4e5968] transition-colors duration-200 cursor-pointer"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Step: CHOOSE PAYMENT METHOD */}
        {step === "choose" && (
          <div className="p-8">
            <h3 className="text-xl font-bold text-[#191f28] mb-6 flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-[#3182f6]" />
              가상 안전 결제
            </h3>

            {/* Booking Details Summary */}
            <div className="mb-6 rounded-2xl bg-[#f9fafb] border border-[#e5e8eb] p-5 space-y-3.5">
              <div className="flex items-center justify-between text-xs font-semibold pb-3 border-b border-[#e5e8eb]">
                <span className="text-[#4e5968]">예약 일시</span>
                <span className="text-[#191f28]">{bookingDate} | {bookingTime}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold pb-3 border-b border-[#e5e8eb]">
                <span className="text-[#4e5968]">인원 & 테이블</span>
                <span className="text-[#191f28]">
                  {bookingGuests}명 | {selectedTable?.name} ({selectedTable?.typeLabel})
                </span>
              </div>
              <div className="space-y-1.5 max-h-24 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs font-semibold">
                    <span className="text-[#4e5968] truncate max-w-[200px]">{item.name} x {item.quantity}</span>
                    <span className="text-[#191f28] font-mono">{(item.price * item.quantity).toLocaleString()}원</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#e5e8eb] text-sm font-bold">
                <span className="text-[#191f28]">최종 결제 금액</span>
                <span className="text-base text-[#3182f6]">{totalAmount.toLocaleString()}원</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <label className="block text-xs font-bold text-[#4e5968] mb-3 pl-1">
              결제 수단 선택
            </label>
            <div className="grid grid-cols-3 gap-3 mb-8">
              <button
                onClick={() => setMethod("card")}
                className={`flex flex-col items-center justify-center p-4.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  method === "card"
                    ? "bg-[#e8f3ff] border-[#3182f6] text-[#3182f6] font-bold shadow-sm"
                    : "bg-[#f2f4f6] border-transparent text-[#4e5968] hover:bg-[#e5e8eb] hover:text-[#191f28]"
                }`}
              >
                <CreditCard className="h-5.5 w-5.5 mb-1.5" />
                <span className="text-xs font-semibold">신용카드</span>
              </button>
              
              <button
                onClick={() => setMethod("toss")}
                className={`flex flex-col items-center justify-center p-4.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  method === "toss"
                    ? "bg-[#e8f3ff] border-[#3182f6] text-[#3182f6] font-bold shadow-sm"
                    : "bg-[#f2f4f6] border-transparent text-[#4e5968] hover:bg-[#e5e8eb] hover:text-[#191f28]"
                }`}
              >
                <Landmark className="h-5.5 w-5.5 mb-1.5" />
                <span className="text-xs font-semibold">토스페이</span>
              </button>

              <button
                onClick={() => setMethod("kakao")}
                className={`flex flex-col items-center justify-center p-4.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  method === "kakao"
                    ? "bg-[#e8f3ff] border-[#3182f6] text-[#3182f6] font-bold shadow-sm"
                    : "bg-[#f2f4f6] border-transparent text-[#4e5968] hover:bg-[#e5e8eb] hover:text-[#191f28]"
                }`}
              >
                <CreditCard className="h-5.5 w-5.5 mb-1.5 text-amber-500" />
                <span className="text-xs font-semibold">카카오페이</span>
              </button>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              className="w-full rounded-xl bg-[#3182f6] py-4 text-sm font-bold text-white shadow-md hover:bg-[#1b64da] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
            >
              {(totalAmount).toLocaleString()}원 결제하기 (시뮬레이션)
            </button>
            <p className="text-center text-[10px] text-[#8b95a1] font-semibold mt-4">
              ※ 본 결제는 가상 결제창이며, 실제 요금이 청구되지 않습니다.
            </p>
          </div>
        )}

        {/* Step: PROCESSING */}
        {step === "processing" && (
          <div className="p-12 flex flex-col items-center justify-center min-h-[350px] text-center bg-[#f9fafb]">
            <Loader2 className="h-12 w-12 text-[#3182f6] animate-spin mb-6" />
            <h4 className="text-lg font-bold text-[#191f28] mb-2">가상 거래를 승인하고 있습니다</h4>
            <p className="text-sm text-[#3182f6] font-bold animate-pulse">{loadingText}</p>
            <div className="w-48 h-1 bg-[#e5e8eb] rounded-full overflow-hidden mt-6">
              <div className="h-full bg-[#3182f6] rounded-full w-2/3 animate-pulse" />
            </div>
          </div>
        )}

        {/* Step: SUCCESS */}
        {step === "success" && (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-[#e8f3ff] border border-[#3182f6]/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-9 w-9 text-[#3182f6]" />
            </div>

            <h3 className="text-2xl font-bold text-[#191f28] mb-2">예약 신청 완료</h3>
            <p className="text-sm text-[#4e5968]">식당에 예약금 및 메뉴 주문이 전달되었습니다.</p>
            
            <div className="w-full mt-6 mb-8 rounded-2xl bg-[#f9fafb] border border-[#e5e8eb] p-5 text-left space-y-3 font-semibold text-xs">
              <div className="flex justify-between">
                <span className="text-[#4e5968]">가상 예약 번호</span>
                <span className="font-mono font-bold text-[#191f28] tracking-wider">{createdResId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4e5968]">지정 테이블</span>
                <span className="text-[#191f28]">{selectedTable?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#4e5968]">예약 진행 상태</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-600">
                  승인 대기 중
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#8b95a1] mb-6 max-w-sm font-semibold">
              ※ 사장님이 예약을 확인하고 '승인' 처리를 완료하면 최종 예약이 확정됩니다. 내역은 상단의 '사장님 모드' 전환을 통해 직접 조절해볼 수 있습니다.
            </p>

            <button
              onClick={handleSuccessConfirm}
              className="w-full rounded-xl bg-[#f2f4f6] hover:bg-[#e5e8eb] py-3.5 text-sm font-bold text-[#4e5968] transition-colors cursor-pointer"
            >
              내 예약 현황 확인하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
