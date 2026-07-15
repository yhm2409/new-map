"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Check, X, Users, CreditCard, Clock, Calendar, CheckSquare, ChevronDown, ChevronUp } from "lucide-react";
import { TABLES } from "./SeatMap";

export const AdminDashboard: React.FC = () => {
  const { reservations, updateReservationStatus } = useApp();
  const [filter, setFilter] = useState<"all" | "대기" | "승인" | "거절">("all");
  const [expandedResId, setExpandedResId] = useState<string | null>(null);

  // Statistics
  const totalReservations = reservations.length;
  const pendingCount = reservations.filter((r) => r.status === "대기").length;
  const approvedCount = reservations.filter((r) => r.status === "승인").length;
  const totalSales = reservations
    .filter((r) => r.status === "승인")
    .reduce((sum, r) => sum + r.totalPrice, 0);

  // Filtered list
  const filteredReservations = filter === "all"
    ? reservations
    : reservations.filter((res) => res.status === filter);

  const toggleExpand = (id: string) => {
    setExpandedResId(expandedResId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-[#191f28]">사장님 예약 통합 관리</h3>
        <p className="text-xs text-[#8b95a1] mt-1.5">
          실시간 가상 예약 현황을 모니터링하고 예약을 승인하거나 반려 처리합니다.
        </p>
      </div>

      {/* Top Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="rounded-2xl border border-[#f2f4f6] bg-white p-5 flex items-center justify-between toss-shadow">
          <div>
            <span className="text-[10px] text-[#8b95a1] font-bold uppercase tracking-wider block">총 접수 건수</span>
            <span className="font-mono text-xl font-bold text-[#191f28] mt-1.5 block">{totalReservations}건</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#f2f4f6] flex items-center justify-center text-[#4e5968]">
            <CheckSquare className="h-5 w-5" />
          </div>
        </div>

        {/* Stat 2 */}
        <div className="rounded-2xl border border-[#f2f4f6] bg-white p-5 flex items-center justify-between toss-shadow">
          <div>
            <span className="text-[10px] text-[#8b95a1] font-bold uppercase tracking-wider block">승인 대기 예약</span>
            <span className="font-mono text-xl font-bold text-amber-600 mt-1.5 block">{pendingCount}건</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-55/60 flex items-center justify-center text-amber-600">
            <Clock className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="rounded-2xl border border-[#f2f4f6] bg-white p-5 flex items-center justify-between toss-shadow">
          <div>
            <span className="text-[10px] text-[#8b95a1] font-bold uppercase tracking-wider block">방문 예정 예약</span>
            <span className="font-mono text-xl font-bold text-[#3182f6] mt-1.5 block">{approvedCount}건</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-[#e8f3ff] flex items-center justify-center text-[#3182f6]">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="rounded-2xl border border-[#f2f4f6] bg-white p-5 flex items-center justify-between toss-shadow">
          <div>
            <span className="text-[10px] text-[#8b95a1] font-bold uppercase tracking-wider block">승인 가상 매출액</span>
            <span className="font-mono text-xl font-bold text-emerald-600 mt-1.5 block">
              {totalSales.toLocaleString()}원
            </span>
          </div>
          <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CreditCard className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-[#e5e8eb] gap-2 pb-3">
        {(["all", "대기", "승인", "거절"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4.5 py-2.5 text-xs font-bold rounded-lg transition-all duration-200 cursor-pointer ${
              filter === tab
                ? "bg-[#3182f6] text-white shadow-sm"
                : "text-[#8b95a1] hover:text-[#191f28] hover:bg-[#f2f4f6]"
            }`}
          >
            {tab === "all" ? "전체 목록" : tab}
          </button>
        ))}
      </div>

      {/* Reservation List */}
      {filteredReservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[#e5e8eb] rounded-2xl bg-white">
          <Calendar className="h-10 w-10 text-[#8b95a1] mb-3" />
          <p className="text-sm font-semibold text-[#8b95a1]">조건에 부합하는 예약 정보가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((res) => {
            const table = TABLES.find((t) => t.id === res.tableId);
            const isExpanded = expandedResId === res.id;

            return (
              <div
                key={res.id}
                className="rounded-2xl border border-[#f2f4f6] bg-white overflow-hidden toss-shadow transition-all duration-200"
              >
                {/* Row Summary */}
                <div className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-3 cursor-pointer flex-grow font-semibold text-xs text-[#4e5968]" onClick={() => toggleExpand(res.id)}>
                    <div>
                      <span className="text-[9px] text-[#8b95a1] font-bold block">RESERVATION ID</span>
                      <span className="font-mono text-xs font-bold text-[#191f28]">{res.id}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-[#8b95a1] block">고객명</span>
                      <span className="text-[#191f28]">{res.userName}</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-[#8b95a1] block">예약 일시</span>
                      <span className="text-[#191f28]">{res.date} ({res.time})</span>
                    </div>

                    <div>
                      <span className="text-[9px] text-[#8b95a1] block">테이블</span>
                      <span className="text-[#191f28]">
                        {table?.name || `테이블 ${res.tableId}`} ({res.guests}명)
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] text-[#8b95a1] block">결제 금액</span>
                      <span className="font-mono text-[#3182f6] font-bold">
                        {res.totalPrice.toLocaleString()}원
                      </span>
                    </div>
                  </div>

                  {/* Actions / Status */}
                  <div className="flex items-center gap-3 justify-between lg:justify-end border-t border-[#f2f4f6] lg:border-none pt-3 lg:pt-0">
                    {res.status === "대기" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateReservationStatus(res.id, "승인")}
                          className="flex items-center gap-1 rounded-lg bg-[#eefcf2] hover:bg-emerald-600 text-emerald-600 hover:text-white border border-transparent px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm"
                        >
                          <Check className="h-3.5 w-3.5" />
                          승인
                        </button>
                        <button
                          onClick={() => updateReservationStatus(res.id, "거절")}
                          className="flex items-center gap-1 rounded-lg bg-red-50 hover:bg-red-500 text-red-500 hover:text-white border border-transparent px-3.5 py-2 text-xs font-bold transition-all cursor-pointer shadow-sm"
                        >
                          <X className="h-3.5 w-3.5" />
                          거절
                        </button>
                      </div>
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        res.status === "승인"
                          ? "bg-emerald-50 border border-emerald-100 text-emerald-600"
                          : "bg-red-50 border border-red-100 text-red-500"
                      }`}>
                        {res.status === "승인" ? "승인 완료" : "거절 완료"}
                      </span>
                    )}

                    <button
                      onClick={() => toggleExpand(res.id)}
                      className="text-[#8b95a1] hover:text-[#4e5968] cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="bg-[#f9fafb] border-t border-[#e5e8eb] p-5 space-y-4">
                    <div>
                      <h5 className="text-[10px] font-bold uppercase tracking-wider text-[#8b95a1] mb-2.5">
                        주문 코스 세부 정보
                      </h5>
                      {res.items.length === 0 ? (
                        <p className="text-xs text-[#8b95a1] font-semibold">사전 선택된 메뉴 없음 (현장 결제)</p>
                      ) : (
                        <div className="rounded-xl border border-[#e5e8eb] divide-y divide-[#e5e8eb] overflow-hidden bg-white">
                          {res.items.map((item) => (
                            <div key={item.id} className="flex justify-between p-3.5 text-xs font-semibold">
                              <span className="text-[#191f28]">{item.name}</span>
                              <span className="font-mono text-[#4e5968]">{item.quantity}개 ({(item.price * item.quantity).toLocaleString()}원)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
