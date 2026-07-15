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
    { id: "appetizer", label: "에피타이저" },
    { id: "main", label: "메인 디쉬" },
    { id: "dessert", label: "디저트" },
    { id: "drink", label: "와인 & 음료" }
  ];

  const filteredMenu = activeCategory === "all"
    ? MOCK_MENU
    : MOCK_MENU.filter((item) => item.category === activeCategory);

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR") + "원";
  };

  const isReservationReady = bookingDate !== "" && bookingTime !== "" && selectedTableId !== null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Left 2 Columns: Menu List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-xl font-bold text-[#191f28] flex items-center gap-2">
            <MenuIcon className="h-5 w-5 text-[#3182f6]" />
            파인 다이닝 메뉴 사전 선택
          </h3>
          <p className="text-xs text-[#8b95a1]">
            예약 일정에 맞추어 현장에서 조리될 코스 요리를 미리 선택해 보세요.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#e5e8eb] pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4.5 py-2 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-[#3182f6] text-white shadow-sm"
                  : "bg-white text-[#4e5968] hover:text-[#191f28] hover:bg-[#f2f4f6] border border-[#e5e8eb]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMenu.map((item) => {
            const cartItem = cart.find((i) => i.id === item.id);
            return (
              <div
                key={item.id}
                className="group relative overflow-hidden rounded-[20px] border border-[#e5e8eb] bg-white hover:bg-[#f9fafb] hover:border-[#3182f6]/20 transition-all duration-300 flex flex-col toss-shadow"
              >
                {/* Image */}
                <div className="relative h-44 w-full overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                  
                  {/* Category Tag */}
                  <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold px-2 py-0.5 rounded-lg text-white">
                    {categories.find((c) => c.id === item.category)?.label}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h4 className="text-base font-bold text-[#191f28] group-hover:text-[#3182f6] transition-colors duration-200">
                    {item.name}
                  </h4>
                  <p className="text-xs text-[#4e5968] mt-1.5 line-clamp-2 flex-grow leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#3182f6]">
                      {formatPrice(item.price)}
                    </span>

                    {cartItem ? (
                      <div className="flex items-center gap-2 bg-[#f2f4f6] rounded-xl border border-transparent px-1.5 py-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.id, cartItem.quantity - 1)}
                          className="p-1.5 text-[#4e5968] hover:text-[#191f28] transition-colors cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-bold text-[#191f28] px-1">
                          {cartItem.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="p-1.5 text-[#4e5968] hover:text-[#191f28] transition-colors cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(item)}
                        className="rounded-xl bg-[#e8f3ff] hover:bg-[#d0e6ff] text-[#3182f6] px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        담기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Order Summary (Cart) */}
      <div className="lg:col-span-1">
        <div className="sticky top-6 rounded-[22px] bg-white p-6 toss-shadow border border-[#f2f4f6] flex flex-col min-h-[580px] justify-between">
          <div className="space-y-5">
            <h3 className="text-base font-bold text-[#191f28] flex items-center gap-2 border-b border-[#e5e8eb] pb-3">
              <ShoppingBag className="h-5 w-5 text-[#3182f6]" />
              선택한 코스 메뉴
            </h3>

            {/* 1. TOP BOX: Scrollable Cart List */}
            <div className="border border-[#e5e8eb] rounded-xl bg-[#f9fafb] p-3">
              <div className="text-[10px] text-[#8b95a1] font-bold uppercase tracking-wider mb-2.5 px-1">
                주문 요리 목록 (스크롤)
              </div>
              
              {cart.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-8 w-8 text-[#8b95a1] mb-2" />
                  <p className="text-xs text-[#8b95a1] font-semibold">선택한 메뉴가 없습니다.</p>
                </div>
              ) : (
                <div className="max-h-48 overflow-y-auto pr-1 space-y-2">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#e5e8eb]"
                    >
                      <div className="flex-grow pr-2 min-w-0">
                        <h5 className="text-xs font-bold text-[#191f28] truncate break-keep">{item.name}</h5>
                        <span className="text-[10px] text-[#4e5968] font-semibold block mt-0.5">
                          {formatPrice(item.price)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1 bg-[#f2f4f6] px-1 py-0.5 rounded-lg">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="p-0.5 text-[#4e5968] hover:text-[#191f28] transition-colors cursor-pointer"
                          >
                            <Minus className="h-2 w-2" />
                          </button>
                          <span className="text-[10px] font-bold text-[#191f28]">
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

            {/* 2. BOTTOM BOX: Reservation Details Summary */}
            <div className="border border-[#e5e8eb] rounded-xl bg-[#f9fafb] p-3.5 space-y-3">
              <div className="text-[10px] text-[#8b95a1] font-bold uppercase tracking-wider border-b border-[#e5e8eb] pb-2">
                지정한 예약 일정 정보
              </div>

              {isReservationReady ? (
                <div className="space-y-2 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-[#4e5968]">예약 일정</span>
                    <span className="text-[#191f28] whitespace-nowrap">{bookingDate} | {bookingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4e5968]">방문 인원</span>
                    <span className="text-[#191f28] whitespace-nowrap">{bookingGuests}명</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4e5968]">지정 좌석</span>
                    <span className="text-[#3182f6] truncate max-w-[150px] break-keep text-right font-bold">
                      {TABLES.find(t => t.id === selectedTableId)?.name}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-amber-600 font-bold leading-relaxed break-keep">
                  ⚠️ 상단의 방문 날짜, 시간 및 좌석 지정을 모두 완료하셔야 결제가 가능합니다.
                </div>
              )}
            </div>
          </div>

          {/* 3. FINAL CHECKOUT BOTTOM FOOTER */}
          <div className="border-t border-[#e5e8eb] pt-4 mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#4e5968] font-bold">총 주문 금액</span>
              <span className="text-base font-bold text-[#3182f6]">
                {formatPrice(getCartTotal())}
              </span>
            </div>

            {isReservationReady && cart.length > 0 ? (
              <button
                onClick={onCheckout}
                className="w-full rounded-xl bg-[#3182f6] hover:bg-[#1b64da] text-white py-3.5 text-sm font-bold tracking-wide shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer"
              >
                예약 및 결제하기
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                disabled
                className="w-full rounded-xl bg-[#e5e8eb] text-[#8b95a1] py-3.5 text-xs font-bold cursor-not-allowed text-center"
              >
                {cart.length === 0 ? "메뉴 코스를 담아주세요" : "예약 조건을 지정해주세요"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
