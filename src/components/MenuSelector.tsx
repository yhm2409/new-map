"use client";

import React, { useState } from "react";
import { useApp, MOCK_MENU, MenuItem } from "@/context/AppContext";
import { ShoppingBag, Plus, Minus, Trash2, ChevronRight, Menu as MenuIcon } from "lucide-react";
import { TABLES } from "./SeatMap";

interface MenuSelectorProps {
  onCheckout: () => void;
}

export const MenuSelector: React.FC<MenuSelectorProps> = ({ onCheckout }) => {
  const {
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    bookingDate,
    bookingTime,
    bookingGuests,
    selectedTableId
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "전체" },
    { id: "main", label: "영화 티켓" },
    { id: "appetizer", label: "웰컴 스낵" },
    { id: "dessert", label: "디저트" },
    { id: "drink", label: "음료" }
  ];

  const filteredMenu = activeCategory === "all"
    ? MOCK_MENU
    : MOCK_MENU.filter((item) => item.category === activeCategory);

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR") + "원";
  };

  const isReservationReady = bookingDate !== "" && bookingTime !== "" && selectedTableId !== null;

  return (
    <div className="flex flex-col gap-6 text-left">
      
      {/* 1. UPPER SECTION: Movie & Snack Selector with Scroll */}
      <div className="rounded-2xl bg-white p-4.5 border border-[#f2f4f6] toss-shadow space-y-4">
        <div className="flex justify-between items-center border-b border-[#f2f4f6] pb-2.5">
          <h3 className="text-sm font-bold text-[#191f28] flex items-center gap-1.5">
            <MenuIcon className="h-4.5 w-4.5 text-[#3182f6]" />
            영화 관람권 및 웰컴 푸드 선택
          </h3>
          <span className="text-[10px] text-[#8b95a1] font-semibold">위아래로 스크롤하여 선택</span>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-[11px] font-bold rounded-full transition-all duration-200 cursor-pointer flex-shrink-0 ${
                activeCategory === cat.id
                  ? "bg-[#3182f6] text-white shadow-sm"
                  : "bg-[#f2f4f6] text-[#4e5968] hover:text-[#191f28] border border-transparent"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scrollable Items Container (HEIGHT LIMIT AT 270px) */}
        <div className="h-[270px] overflow-y-auto pr-1 space-y-3.5 scrollbar-thin">
          {filteredMenu.map((item) => {
            const cartItem = cart.find((i) => i.id === item.id);
            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-xl border border-[#e5e8eb] bg-white p-3 flex gap-3 toss-shadow transition-colors duration-200 hover:bg-[#f9fafb]"
              >
                {/* Image */}
                <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-stone-100 flex-shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute top-1 left-1 bg-black/60 text-[8px] font-bold px-1.5 py-0.5 rounded text-white">
                    {categories.find((c) => c.id === item.category)?.label}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-between flex-grow min-w-0">
                  <div>
                    <h4 className="text-xs font-bold text-[#191f28] truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-[#8b95a1] mt-0.5 line-clamp-2 leading-tight">
                      {item.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] font-extrabold text-[#3182f6]">
                      {formatPrice(item.price)}
                    </span>

                    {cartItem ? (
                      <div className="flex items-center gap-1.5 bg-[#f2f4f6] rounded-lg px-1 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, cartItem.quantity - 1)}
                          className="p-1 text-[#4e5968] hover:text-[#191f28] transition-colors cursor-pointer"
                        >
                          <Minus className="h-2.5 w-2.5" />
                        </button>
                        <span className="text-[10px] font-bold text-[#191f28]">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="p-1 text-[#4e5968] hover:text-[#191f28] transition-colors cursor-pointer"
                        >
                          <Plus className="h-2.5 w-2.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="rounded-lg bg-[#e8f3ff] hover:bg-[#d0e6ff] text-[#3182f6] px-3 py-1.5 text-[10px] font-bold transition-all duration-200 cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="h-2.5 w-2.5" />
                        선택
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. LOWER SECTION: Selected Tickets & Booking Info */}
      <div className="rounded-2xl bg-white p-4.5 border border-[#f2f4f6] toss-shadow space-y-4">
        
        {/* Selected Course List Box */}
        <div>
          <h4 className="text-xs font-bold text-[#191f28] flex items-center gap-1.5 border-b border-[#f2f4f6] pb-2">
            <ShoppingBag className="h-4 w-4 text-[#3182f6]" />
            선택한 예매 품목
          </h4>
          
          {cart.length === 0 ? (
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="h-6 w-6 text-[#8b95a1] mb-1.5" />
              <p className="text-[10px] text-[#8b95a1] font-semibold">아직 선택한 관람 티켓이나 푸드가 없습니다.</p>
            </div>
          ) : (
            /* Selected list box (Height limit at 105px to fit one screen) */
            <div className="max-h-[105px] overflow-y-auto pr-1 space-y-2 mt-2 scrollbar-thin">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-[#f9fafb] border border-[#e5e8eb]"
                >
                  <div className="flex-grow pr-2 min-w-0">
                    <h5 className="text-[11px] font-bold text-[#191f28] truncate">{item.name}</h5>
                    <span className="text-[9px] text-[#8b95a1] font-semibold block mt-0.5">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1 bg-white px-1 py-0.5 rounded border border-[#e5e8eb]">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-0.5 text-[#4e5968] hover:text-[#191f28] transition-colors cursor-pointer"
                      >
                        <Minus className="h-2 w-2" />
                      </button>
                      <span className="text-[9px] font-bold text-[#191f28]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-0.5 text-[#4e5968] hover:text-[#191f28] transition-colors cursor-pointer"
                      >
                        <Plus className="h-2 w-2" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-0.5 text-[#8b95a1] hover:text-red-500 transition-colors cursor-pointer"
                      aria-label="삭제"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Booking Info Box */}
        <div className="bg-[#f9fafb] border border-[#e5e8eb] rounded-xl p-3 space-y-2.5 text-[11px] font-semibold">
          <div className="text-[9px] text-[#8b95a1] font-bold uppercase tracking-wider border-b border-[#e5e8eb] pb-1.5">
            관람 일정 요약
          </div>
          
          {isReservationReady ? (
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#8b95a1]">상영 일정</span>
                <span className="text-[#191f28] font-bold">{bookingDate} | {bookingTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b95a1]">관람 인원</span>
                <span className="text-[#191f28] font-bold">{bookingGuests}명</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8b95a1]">지정 좌석</span>
                <span className="text-[#3182f6] font-bold">
                  {TABLES.find(t => t.id === selectedTableId)?.name}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-[9.5px] text-amber-600 font-bold leading-normal break-keep">
              ⚠️ 상단 일정 및 상영관 좌석 선택을 완료하셔야 예매 접수가 활성화됩니다.
            </div>
          )}
        </div>

        {/* Total Price & Action Box */}
        <div className="border-t border-[#e5e8eb] pt-3.5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#8b95a1] font-bold block">총 예매 금액</span>
            <span className="text-sm font-extrabold text-[#3182f6] block">
              {formatPrice(getCartTotal())}
            </span>
          </div>

          {isReservationReady && cart.length > 0 ? (
            <button
              onClick={onCheckout}
              className="rounded-xl bg-[#3182f6] hover:bg-[#1b64da] text-white px-5 py-3 text-xs font-bold tracking-wide shadow-md active:scale-[0.98] transition-all flex items-center gap-1 cursor-pointer"
            >
              티켓 예매 및 결제하기
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              disabled
              className="rounded-xl bg-[#e5e8eb] text-[#8b95a1] px-4 py-3 text-[10px] font-bold cursor-not-allowed text-center"
            >
              {cart.length === 0 ? "관람권을 선택해 주세요" : "좌석을 확정해 주세요"}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
