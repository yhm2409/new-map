"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
  role: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;
  date: string;
  time: string;
  guests: number;
  tableId: string;
  items: CartItem[];
  totalPrice: number;
  status: "대기" | "승인" | "거절";
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  category: "appetizer" | "main" | "dessert" | "drink";
  image: string;
}

interface AppContextType {
  // Auth
  user: User | null;
  isAdmin: boolean;
  login: (id: string, pw: string) => Promise<{ success: boolean; message: string }>;
  signup: (id: string, name: string, pw: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  toggleAdminMode: () => void;

  // Reservation Form State
  bookingDate: string;
  setBookingDate: (date: string) => void;
  bookingTime: string;
  setBookingTime: (time: string) => void;
  bookingGuests: number;
  setBookingGuests: (guests: number) => void;
  selectedTableId: string | null;
  setSelectedTableId: (tableId: string | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;

  // Reservations & Realtime table block
  reservations: Reservation[];
  reservedTableIds: string[];
  fetchReservedTables: () => Promise<void>;
  addReservation: () => Promise<{ success: boolean; reservationId: string }>;
  updateReservationStatus: (reservationId: string, status: "승인" | "거절") => Promise<void>;
  deleteReservation: (reservationId: string) => Promise<void>;
  refreshReservations: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// MOCK_MOVIES (영화 예매 티켓 및 웰컴 푸드/음료 스펙)
export const MOCK_MENU: MenuItem[] = [
  {
    id: "mv1",
    name: "미식의 여정 관람 티켓",
    price: 25000,
    description: "[다큐멘터리 / 120분 / 전체관람가] 프랑스 미쉐린 3스타 셰프들의 요리 철학과 전설적인 레시피를 조명하는 감동 다큐멘터리",
    category: "main",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "mv2",
    name: "어두운 주방 관람 티켓 (Suite)",
    price: 45000,
    description: "[미스터리, 스릴러 / 105분 / 15세관람가] 깊은 밤 레스토랑의 비밀 주방에서 은밀히 벌어지는 사건을 추적하는 서스펜스 영화 (리클라이너 Suite관)",
    category: "main",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "mv3",
    name: "라라 라롬 관람 티켓",
    price: 25000,
    description: "[로맨스, 뮤지컬 / 115.분 / 전체관람가] 프랑스 남부 프로방스의 아름다운 라벤더 밭과 미식 축제를 배경으로 벌어지는 뮤지컬 영화",
    category: "main",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "m1",
    name: "트러플 크림 아란치니 (웰컴)",
    price: 18000,
    description: "블랙 트러플 향이 은은하게 퍼지는 바삭하고 고소한 프리미엄 수제 이탈리아 튀김 주먹밥",
    category: "appetizer",
    image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "m5",
    name: "바닐라 브륄레 & 카라멜라이즈",
    price: 12000,
    description: "프랑스 정통 마다가스카르 바닐라 빈 커스터드 위에 바삭하고 달콤한 카라멜 라이즈 층을 얹은 디저트",
    category: "dessert",
    image: "https://images.unsplash.com/photo-1516685018646-549198525c1b?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "m6",
    name: "카베르네 소비뇽 (웰컴 와인)",
    price: 15000,
    description: "묵직한 바디감과 매혹적인 붉은 베리 풍미가 조화로운 캘리포니아 나파 밸리산 프리미엄 레드 와인 (글라스)",
    category: "drink",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60"
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Reservation Form State
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string>("");
  const [bookingGuests, setBookingGuests] = useState<number>(2);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // Reservations from DB
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservedTableIds, setReservedTableIds] = useState<string[]>([]);

  // Session persistence on client
  useEffect(() => {
    const savedUser = localStorage.getItem("larome_user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      if (parsed.role === "admin") {
        setIsAdmin(true);
      }
    }
  }, []);

  // Fetch reserved tables for SeatMap check when bookingDate/bookingTime change
  const fetchReservedTables = async () => {
    if (!bookingDate || !bookingTime) {
      setReservedTableIds([]);
      return;
    }
    try {
      const res = await fetch(`/api/reservations?date=${bookingDate}&time=${bookingTime}`);
      const data = await res.json();
      if (data.success) {
        setReservedTableIds(data.reservedTableIds);
      }
    } catch (err) {
      console.error("Failed to fetch reserved tables:", err);
    }
  };

  useEffect(() => {
    fetchReservedTables();
  }, [bookingDate, bookingTime]);

  // Fetch reservation list based on user mode
  const refreshReservations = async () => {
    try {
      let url = "";
      if (isAdmin) {
        url = "/api/reservations/admin";
      } else if (user) {
        url = `/api/reservations/my?userId=${user.id}`;
      } else {
        setReservations([]);
        return;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setReservations(data.reservations);
      }
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
    }
  };

  useEffect(() => {
    refreshReservations();
  }, [user, isAdmin]);

  const login = async (id: string, pw: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: id, password: pw }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem("larome_user", JSON.stringify(data.user));
        if (data.user.role === "admin") {
          setIsAdmin(true);
        }
        return { success: true, message: data.message };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error("Login client error:", err);
      return { success: false, message: "로그인 진행 중 에러가 발생했습니다." };
    }
  };

  const signup = async (id: string, name: string, pw: string) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: id, name, password: pw }),
      });
      const data = await res.json();
      return { success: data.success, message: data.message };
    } catch (err) {
      console.error("Signup client error:", err);
      return { success: false, message: "회원가입 진행 중 에러가 발생했습니다." };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    localStorage.removeItem("larome_user");
  };

  const toggleAdminMode = () => {
    setIsAdmin((prev) => !prev);
  };

  const addToCart = (item: MenuItem) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prevCart, { id: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((i) => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prevCart) => prevCart.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const addReservation = async () => {
    if (!user || !bookingDate || !bookingTime || !selectedTableId) {
      return { success: false, reservationId: "" };
    }

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          date: bookingDate,
          time: bookingTime,
          guests: bookingGuests,
          tableId: selectedTableId,
          items: cart,
          totalPrice: getCartTotal(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedTableId(null);
        clearCart();
        await refreshReservations();
        await fetchReservedTables(); // refresh SeatMap immediately
        return { success: true, reservationId: data.reservationId };
      }
      return { success: false, reservationId: "" };
    } catch (err) {
      console.error("Add reservation client error:", err);
      return { success: false, reservationId: "" };
    }
  };

  const updateReservationStatus = async (reservationId: string, status: "승인" | "거절") => {
    try {
      const res = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshReservations();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Update status client error:", err);
    }
  };

  const deleteReservation = async (reservationId: string) => {
    try {
      const res = await fetch(`/api/reservations/${reservationId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        await refreshReservations();
        await fetchReservedTables(); // Free tables in SeatMap immediately
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Delete status client error:", err);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAdmin,
        login,
        signup,
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
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        reservations,
        reservedTableIds,
        fetchReservedTables,
        addReservation,
        updateReservationStatus,
        deleteReservation,
        refreshReservations
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
