"use client";

import React, { useState, useEffect } from "react";
import { useApp, Reservation } from "@/context/AppContext";
import { Calendar, Armchair, Clock, FileText, CheckCircle2, AlertTriangle, HelpCircle, Utensils, CreditCard } from "lucide-react";
import { TABLES } from "./SeatMap";

interface UserReservationsProps {
  onOpenLogin: () => void;
}

export const UserReservations: React.FC<UserReservationsProps> = ({ onOpenLogin }) => {
  const { user, reservations } = useApp();
  const [selectedResId, setSelectedResId] = useState<string | null>(null);

  // Filter user's reservations
  const myReservations = reservations.filter((res) => res.userId === user?.id);

  // Set first reservation as selected by default when list loads
  useEffect(() => {
    if (myReservations.length > 0 && !selectedResId) {
      setSelectedResId(myReservations[0].id);
    }
  }, [myReservations, selectedResId]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center rounded-[22px] bg-white border border-[#f2f4f6] toss-shadow">
        <FileText className="h-12 w-12 text-[#8b95a1] mb-4" />
        <h4 className="text-lg font-bold text-[#191f28] mb-2">예약 내역 조회 불가</h4>
        <p className="text-sm text-[#4e5968] max-w-sm mb-6 leading-relaxed">
          본인이 신청한 레스토랑 예약 정보를 확인하시려면 로그인이 필요합니다.
        </p>
        <button
          onClick={onOpenLogin}
          className="rounded-xl bg-[#3182f6] hover:bg-[#1b64da] text-white px-6 py-3 text-xs font-bold transition-all duration-200 shadow-sm cursor-pointer"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  const selectedRes = myReservations.find((res) => res.id === selectedResId);
  const selectedTable = TABLES.find((t) => t.id === selectedRes?.tableId);

  const getStatusBadge = (status: "대기" | "승인" | "거절") => {
    switch (status) {
      case "승인":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 border border-emerald-100 text-emerald-600 whitespace-nowrap">
            <CheckCircle2 className="h-3.5 w-3.5" />
            예약 확정
          </span>
        );
      case "거절":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 border border-red-100 text-red-500 whitespace-nowrap">
            <AlertTriangle className="h-3.5 w-3.5" />
            예약 거절
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border border-amber-200 text-amber-600 whitespace-nowrap">
            <HelpCircle className="h-3.5 w-3.5 animate-pulse" />
            승인 대기
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-xl font-bold text-[#191f28]">나의 파인 다이닝 예약</h3>
          <p className="text-xs text-[#8b95a1] mt-1.5">
            위 목록에서 예약 건을 선택하시면 하단에 실시간 사전 주문 내역 및 상세 진행 상태가 표시됩니다.
          </p>
        </div>
        <div className="text-xs text-[#4e5968] whitespace-nowrap font-semibold bg-[#e8f3ff] px-3.5 py-1.5 rounded-full text-[#3182f6]">
          계정: {user.name}님
        </div>
      </div>

      {myReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-[22px] bg-white border border-[#f2f4f6] toss-shadow">
          <Calendar className="h-12 w-12 text-[#8b95a1] mb-4" />
          <p className="text-sm font-semibold text-[#4e5968]">예약한 내역이 아직 존재하지 않습니다.</p>
          <p className="text-xs text-[#8b95a1] mt-1.5">상단의 테이블 및 코스 예약을 이용해 주십시오.</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* 1. TOP BOX: Reservation Scrollable List Container */}
          <div className="border border-[#e5e8eb] rounded-[20px] bg-[#f9fafb] overflow-hidden">
            <div className="bg-[#f2f4f6] px-5 py-3 border-b border-[#e5e8eb] flex items-center justify-between">
              <span className="text-xs font-bold text-[#4e5968] uppercase tracking-wider">
                예약 목록 (스크롤)
              </span>
              <span className="text-xs font-bold text-[#3182f6]">
                총 {myReservations.length}건
              </span>
            </div>
            
            <div className="max-h-60 overflow-y-auto p-3 space-y-2">
              {myReservations.map((res) => {
                const tableInfo = TABLES.find((t) => t.id === res.tableId);
                const isSelected = res.id === selectedResId;

                return (
                  <button
                    key={res.id}
                    onClick={() => setSelectedResId(res.id)}
                    className={`w-full text-left p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[#e8f3ff] border-[#3182f6] text-[#3182f6] shadow-sm font-semibold"
                        : "bg-white border-[#e5e8eb] hover:bg-[#f2f4f6]/40 text-[#4e5968]"
                    }`}
                  >
                    {/* Res info row */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 flex-grow font-semibold text-xs text-[#4e5968]">
                      <div>
                        <span className="text-[9px] text-[#8b95a1] font-bold block">RESERVATION ID</span>
                        <span className="font-mono text-xs font-bold text-[#191f28]">{res.id}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-[#3182f6]" />
                        <span className="text-[#191f28]">{res.date}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[#3182f6]" />
                        <span className="text-[#191f28]">{res.time}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Armchair className="h-3.5 w-3.5 text-[#3182f6]" />
                        <span className="text-[#191f28] truncate max-w-[150px] break-keep">
                          {res.guests}명 ({tableInfo?.name || `테이블 ${res.tableId}`})
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-between items-center sm:justify-end gap-2.5">
                      <span className="text-xs font-mono font-bold text-[#191f28] whitespace-nowrap">
                        {res.totalPrice.toLocaleString()}원
                      </span>
                      {getStatusBadge(res.status)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. BOTTOM BOX: Selected Reservation Detailed View */}
          {selectedRes ? (
            <div className="border border-[#f2f4f6] rounded-[22px] bg-white p-6 toss-card-shadow relative overflow-hidden animate-fade-in">
              
              <div className="border-b border-[#e5e8eb] pb-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#e8f3ff] border border-transparent flex items-center justify-center text-[#3182f6]">
                    <Utensils className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#191f28]">예약 상세 정보</h4>
                    <p className="text-[11px] text-[#8b95a1] font-semibold mt-0.5">
                      신청 완료 시간: {new Date(selectedRes.createdAt).toLocaleString("ko-KR")}
                    </p>
                  </div>
                </div>
                <div>
                  {getStatusBadge(selectedRes.status)}
                </div>
              </div>

              {/* Grid detail metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 text-xs font-semibold">
                <div className="rounded-xl bg-[#f9fafb] border border-[#e5e8eb] p-3 text-center">
                  <span className="text-[10px] text-[#8b95a1] block uppercase font-bold tracking-wider">예약 번호</span>
                  <span className="font-mono text-[#191f28] font-bold mt-1 block">{selectedRes.id}</span>
                </div>
                <div className="rounded-xl bg-[#f9fafb] border border-[#e5e8eb] p-3 text-center">
                  <span className="text-[10px] text-[#8b95a1] block uppercase font-bold tracking-wider">날짜 및 시간</span>
                  <span className="text-[#191f28] mt-1 block">{selectedRes.date} ({selectedRes.time})</span>
                </div>
                <div className="rounded-xl bg-[#f9fafb] border border-[#e5e8eb] p-3 text-center">
                  <span className="text-[10px] text-[#8b95a1] block uppercase font-bold tracking-wider">테이블 & 인원</span>
                  <span className="text-[#191f28] mt-1 block truncate break-keep">
                    {selectedTable?.name || `테이블 ${selectedRes.tableId}`} ({selectedRes.guests}명)
                  </span>
                </div>
                <div className="rounded-xl bg-[#f9fafb] border border-[#e5e8eb] p-3 text-center">
                  <span className="text-[10px] text-[#8b95a1] block uppercase font-bold tracking-wider">가상 결제 총액</span>
                  <span className="text-[#3182f6] font-bold mt-1 block">
                    {selectedRes.totalPrice.toLocaleString()}원
                  </span>
                </div>
              </div>

              {/* Pre-ordered Course Menu List */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-[#4e5968] flex items-center gap-1.5">
                  <Utensils className="h-3.5 w-3.5 text-[#3182f6]" />
                  사전 선택 코스 메뉴
                </h5>

                {selectedRes.items.length === 0 ? (
                  <div className="rounded-xl border border-[#e5e8eb] p-4 text-center text-xs text-[#8b95a1] bg-[#f9fafb]">
                    사전 주문된 메뉴가 없습니다. 현장 방문 시 즉시 주문이 진행됩니다.
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#e5e8eb] overflow-hidden divide-y divide-[#e5e8eb] bg-[#f9fafb]/5">
                    {selectedRes.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3.5 text-xs sm:text-sm hover:bg-[#f2f4f6]/30 transition-colors font-semibold"
                      >
                        <span className="text-[#191f28] break-keep pr-4 leading-relaxed">
                          {item.name}
                        </span>
                        
                        <div className="flex items-center gap-6 font-mono text-xs text-[#4e5968] flex-shrink-0">
                          <span className="whitespace-nowrap">{item.quantity}개</span>
                          <span className="text-[#191f28] font-bold whitespace-nowrap">
                            {(item.price * item.quantity).toLocaleString()}원
                          </span>
                        </div>
                      </div>
                    ))}
                    
                    {/* Checkout Balance Summary */}
                    <div className="flex items-center justify-between p-4 bg-[#e8f3ff]/40 border-t border-[#e5e8eb]">
                      <span className="text-xs font-bold text-[#191f28] flex items-center gap-1.5">
                        <CreditCard className="h-4 w-4 text-[#3182f6]" />
                        가상 카드 승인 합계
                      </span>
                      <span className="text-base font-bold text-[#3182f6]">
                        {selectedRes.totalPrice.toLocaleString()}원
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Caution Footnote */}
              <p className="text-[11px] text-[#8b95a1] font-semibold text-right mt-4 leading-relaxed break-keep">
                ※ 예약 변경/취소 또는 코스 요리 메뉴 변경은 방문 1일 전까지 대표번호로 연락해 주시기 바랍니다.
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#e5e8eb] py-12 text-center text-xs text-[#8b95a1] bg-[#f9fafb]">
              위 예약 목록에서 예약을 선택하시면 세부 내역이 이곳에 표시됩니다.
            </div>
          )}

        </div>
      )}
    </div>
  );
};
