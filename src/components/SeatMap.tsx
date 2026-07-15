"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Armchair, Sparkles } from "lucide-react";

export interface TableInfo {
  id: string; // "A1", "A2", "S1" 등
  name: string; // "Premium A1" 등
  capacity: number; // 좌석당 인원 (일반 1, 커플석 2)
  type: "premium" | "suite";
  typeLabel: string;
}

export const TABLES: TableInfo[] = [
  // 1관 Premium Screen 일반 좌석 (A1~A6, B1~B6, C1~C6 총 18석)
  { id: "A1", name: "Premium A1", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "A2", name: "Premium A2", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "A3", name: "Premium A3", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "A4", name: "Premium A4", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "A5", name: "Premium A5", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "A6", name: "Premium A6", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  
  { id: "B1", name: "Premium B1", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "B2", name: "Premium B2", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "B3", name: "Premium B3", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "B4", name: "Premium B4", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "B5", name: "Premium B5", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "B6", name: "Premium B6", capacity: 1, type: "premium", typeLabel: "1관 Premium" },

  { id: "C1", name: "Premium C1", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "C2", name: "Premium C2", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "C3", name: "Premium C3", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "C4", name: "Premium C4", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "C5", name: "Premium C5", capacity: 1, type: "premium", typeLabel: "1관 Premium" },
  { id: "C6", name: "Premium C6", capacity: 1, type: "premium", typeLabel: "1관 Premium" },

  // 2관 Suite Lounge 프리미엄 커플석 (S1~S3 총 3쌍, 2인 기준)
  { id: "S1", name: "Suite 커플석 S1", capacity: 2, type: "suite", typeLabel: "2관 Suite" },
  { id: "S2", name: "Suite 커플석 S2", capacity: 2, type: "suite", typeLabel: "2관 Suite" },
  { id: "S3", name: "Suite 커플석 S3", capacity: 2, type: "suite", typeLabel: "2관 Suite" }
];

export const SeatMap: React.FC = () => {
  const {
    bookingDate,
    bookingTime,
    bookingGuests,
    selectedTableId,
    setSelectedTableId,
    reservedTableIds
  } = useApp();

  const isDateTimeSelected = bookingDate !== "" && bookingTime !== "";

  const handleTableSelect = (table: TableInfo) => {
    if (!isDateTimeSelected) return;
    if (reservedTableIds.includes(table.id)) return;
    
    // Warn if table capacity is smaller than booking guests
    if (table.capacity < bookingGuests && table.type !== "suite") {
      if (!confirm(`선택하신 좌석은 ${table.capacity}인석입니다. 예매 인원(${bookingGuests}명)보다 적은데 이 좌석으로 진행하시겠습니까?`)) {
        return;
      }
    }

    setSelectedTableId(selectedTableId === table.id ? null : table.id);
  };

  const getTableTypeColor = (type: string) => {
    switch (type) {
      case "suite":
        return "bg-purple-50 border-purple-100 text-purple-600";
      default:
        return "bg-sky-50 border-sky-100 text-sky-600";
    }
  };

  return (
    <div className="rounded-[22px] bg-white p-6 toss-shadow border border-[#f2f4f6] text-left">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#191f28] flex items-center gap-1.5">
            <Sparkles className="h-5 w-5 text-[#3182f6]" />
            상영관 좌석 선택
          </h3>
          <p className="text-xs text-[#8b95a1] mt-1.5">
            원하시는 상영관 및 좌석의 위치를 확인 후 선택해 주세요.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3.5 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-[#4e5968]">
            <span className="h-3 w-3 rounded-full border border-[#e5e8eb] bg-white" />
            예매 가능
          </span>
          <span className="flex items-center gap-1.5 text-[#3182f6]">
            <span className="h-3 w-3 rounded-full bg-[#3182f6]" />
            선택됨
          </span>
          <span className="flex items-center gap-1.5 text-[#8b95a1]">
            <span className="h-3 w-3 rounded-full bg-[#e5e8eb]" />
            예매 완료
          </span>
        </div>
      </div>

      {!isDateTimeSelected ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-[#e5e8eb] rounded-[18px] bg-[#f9fafb]">
          <Armchair className="h-10 w-10 text-[#8b95a1] mb-3 animate-pulse" />
          <p className="text-sm font-semibold text-[#4e5968]">
            영화 상영 날짜와 시간표를 먼저 선택해 주세요.
          </p>
          <p className="text-xs text-[#8b95a1] mt-1.5">
            선택하신 회차에 해당하는 실시간 상영관 좌석 배치도가 표시됩니다.
          </p>
        </div>
      ) : (
        <div>
          {/* Cinema Screen Visual Representation */}
          <div className="relative border border-[#e5e8eb] rounded-[18px] bg-[#f9fafb] p-8 mb-6 max-h-[380px] overflow-y-auto">
            {/* SCREEN Indicator */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#191f28] px-10 py-1.5 rounded-b-xl text-[10px] font-extrabold tracking-[0.25em] text-white uppercase text-center w-[60%] shadow-md">
              SCREEN (화면 전면)
            </div>

            {/* Grid of Seats */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 relative z-10 pt-4">
              {TABLES.map((table) => {
                const isBooked = reservedTableIds.includes(table.id);
                const isSelected = selectedTableId === table.id;
                const typeStyle = getTableTypeColor(table.type);

                return (
                  <button
                    key={table.id}
                    disabled={isBooked}
                    onClick={() => handleTableSelect(table)}
                    className={`relative flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200 ${
                      isBooked
                        ? "bg-[#e5e8eb] border-transparent text-[#8b95a1] cursor-not-allowed"
                        : isSelected
                        ? "bg-[#e8f3ff] border-[#3182f6] text-[#3182f6] shadow-sm scale-[1.01]"
                        : "bg-white border-[#e5e8eb] text-[#191f28] hover:border-[#3182f6]/40 hover:scale-[1.005] cursor-pointer"
                    }`}
                  >
                    {/* Badge */}
                    <span className={`absolute top-1.5 right-1.5 text-[7px] px-1.5 py-0.5 rounded-full border font-extrabold scale-90 ${
                      isBooked
                        ? "bg-stone-300 border-transparent text-stone-600"
                        : isSelected
                        ? "bg-[#3182f6] border-transparent text-white"
                        : typeStyle
                    }`}>
                      {table.typeLabel}
                    </span>

                    <Armchair className={`h-6 w-6 mb-1.5 mt-2 transition-colors ${
                      isBooked ? "text-stone-400" : isSelected ? "text-[#3182f6]" : "text-[#4e5968]"
                    }`} />

                    <div className="text-xs font-bold tracking-tight">
                      {table.name}
                    </div>

                    <div className="text-[9px] text-[#4e5968] mt-0.5 font-bold">
                      {table.capacity}인석
                    </div>

                    {isBooked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-xl">
                        <span className="text-[8px] font-extrabold text-[#8b95a1] uppercase tracking-widest border border-[#8b95a1]/40 bg-[#f2f4f6] px-1.5 py-0.5 rounded">
                          예매완료
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
                선택한 좌석: <strong className="text-sm ml-1 text-[#3182f6]">{TABLES.find((t) => t.id === selectedTableId)?.name}</strong>
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
