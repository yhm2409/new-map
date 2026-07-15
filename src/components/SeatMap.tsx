"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Armchair, Sparkles } from "lucide-react";

export interface TableInfo {
  id: string;
  name: string;
  capacity: number;
  type: "window" | "hall" | "room" | "terrace";
  typeLabel: string;
}

export const TABLES: TableInfo[] = [
  { id: "1", name: "Table 1 (Window)", capacity: 2, type: "window", typeLabel: "창가 석" },
  { id: "2", name: "Table 2 (Hall)", capacity: 2, type: "hall", typeLabel: "중앙 홀" },
  { id: "3", name: "Table 3 (Hall)", capacity: 4, type: "hall", typeLabel: "중앙 홀" },
  { id: "4", name: "Table 4 (Window)", capacity: 4, type: "window", typeLabel: "창가 석" },
  { id: "5", name: "VIP Room 5", capacity: 6, type: "room", typeLabel: "프라이빗 룸" },
  { id: "6", name: "Table 6 (Terrace)", capacity: 4, type: "terrace", typeLabel: "테라스" }
];

export const SeatMap: React.FC = () => {
  const {
    bookingDate,
    bookingTime,
    bookingGuests,
    selectedTableId,
    setSelectedTableId,
    reservations
  } = useApp();

  const isDateTimeSelected = bookingDate !== "" && bookingTime !== "";

  // Check which tables are already reserved for the selected date and time
  const getReservedTableIds = () => {
    if (!isDateTimeSelected) return [];
    return reservations
      .filter((res) => res.date === bookingDate && res.time === bookingTime && res.status !== "거절")
      .map((res) => res.tableId);
  };

  const reservedTableIds = getReservedTableIds();

  const handleTableSelect = (table: TableInfo) => {
    if (!isDateTimeSelected) return;
    if (reservedTableIds.includes(table.id)) return;
    
    // Warn if table capacity is smaller than booking guests
    if (table.capacity < bookingGuests) {
      if (!confirm(`선택하신 테이블은 ${table.capacity}인석입니다. 예약 인원(${bookingGuests}명)보다 적은데 진행하시겠습니까?`)) {
        return;
      }
    }

    setSelectedTableId(selectedTableId === table.id ? null : table.id);
  };

  const getTableTypeColor = (type: string) => {
    switch (type) {
      case "window":
        return "bg-sky-50 border-sky-100 text-sky-600";
      case "room":
        return "bg-purple-50 border-purple-100 text-purple-600";
      case "terrace":
        return "bg-emerald-50 border-emerald-100 text-emerald-600";
      default:
        return "bg-stone-50 border-stone-200 text-[#4e5968]";
    }
  };

  return (
    <div className="rounded-[22px] bg-white p-6 toss-shadow border border-[#f2f4f6]">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#191f28] flex items-center gap-1.5">
            <Sparkles className="h-5 w-5 text-[#3182f6]" />
            좌석 테이블 지정
          </h3>
          <p className="text-xs text-[#8b95a1] mt-1.5">
            원하시는 테이블의 위치와 수용 인원을 확인 후 선택하세요.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3.5 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-[#4e5968]">
            <span className="h-3 w-3 rounded-full border border-[#e5e8eb] bg-white" />
            예약 가능
          </span>
          <span className="flex items-center gap-1.5 text-[#3182f6]">
            <span className="h-3 w-3 rounded-full bg-[#3182f6]" />
            선택됨
          </span>
          <span className="flex items-center gap-1.5 text-[#8b95a1]">
            <span className="h-3 w-3 rounded-full bg-[#e5e8eb]" />
            예약 불가능
          </span>
        </div>
      </div>

      {!isDateTimeSelected ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[#e5e8eb] rounded-[18px] bg-[#f9fafb]">
          <Armchair className="h-10 w-10 text-[#8b95a1] mb-3 animate-pulse" />
          <p className="text-sm font-semibold text-[#4e5968]">
            예약 날짜와 시간을 먼저 선택해 주세요.
          </p>
          <p className="text-xs text-[#8b95a1] mt-1.5">
            날짜와 시간에 따라 이용 가능한 실시간 좌석 정보가 표시됩니다.
          </p>
        </div>
      ) : (
        <div>
          {/* Restaurant Layout Visual Representation */}
          <div className="relative border border-[#e5e8eb] rounded-[18px] bg-[#f9fafb] p-8 mb-6 max-h-[360px] overflow-y-auto">
            {/* Entrance/Counter Indicator */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#191f28] px-4.5 py-1.5 rounded-full text-[10px] font-bold tracking-widest text-white uppercase">
              ENTRANCE / COUNTER
            </div>

            {/* Grid of Tables */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
              {TABLES.map((table) => {
                const isBooked = reservedTableIds.includes(table.id);
                const isSelected = selectedTableId === table.id;
                const typeStyle = getTableTypeColor(table.type);

                return (
                  <button
                    key={table.id}
                    disabled={isBooked}
                    onClick={() => handleTableSelect(table)}
                    className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border transition-all duration-200 ${
                      isBooked
                        ? "bg-[#e5e8eb] border-transparent text-[#8b95a1] cursor-not-allowed"
                        : isSelected
                        ? "bg-[#e8f3ff] border-[#3182f6] text-[#3182f6] shadow-sm scale-[1.01]"
                        : "bg-white border-[#e5e8eb] text-[#191f28] hover:border-[#3182f6]/40 hover:scale-[1.005] cursor-pointer"
                    }`}
                  >
                    {/* Badge */}
                    <span className={`absolute top-2.5 right-3 text-[9px] px-2 py-0.5 rounded-full border font-bold ${
                      isBooked
                        ? "bg-stone-300 border-transparent text-stone-600"
                        : isSelected
                        ? "bg-[#3182f6] border-transparent text-white"
                        : typeStyle
                    }`}>
                      {table.typeLabel}
                    </span>

                    <Armchair className={`h-8 w-8 mb-2.5 transition-colors ${
                      isBooked ? "text-stone-400" : isSelected ? "text-[#3182f6]" : "text-[#4e5968]"
                    }`} />

                    <div className="text-sm font-bold tracking-tight">
                      {table.name}
                    </div>

                    <div className="text-[11px] text-[#4e5968] mt-1 font-semibold">
                      수용 인원: {table.capacity}인석
                    </div>

                    {isBooked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-2xl">
                        <span className="text-xs font-bold text-[#8b95a1] uppercase tracking-widest border border-[#8b95a1] bg-[#f2f4f6] px-2.5 py-1 rounded-lg">
                          예약 완료
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom helper */}
          {selectedTableId && (
            <div className="flex items-center justify-between rounded-xl bg-[#e8f3ff] border border-[#3182f6]/10 px-4 py-3">
              <span className="text-xs text-[#3182f6] font-bold">
                선택한 테이블: <strong className="text-sm ml-1 text-[#3182f6]">{TABLES.find((t) => t.id === selectedTableId)?.name}</strong>
              </span>
              <button
                onClick={() => setSelectedTableId(null)}
                className="text-xs font-bold text-[#8b95a1] hover:text-[#4e5968] transition-colors cursor-pointer"
              >
                선택 취소
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
