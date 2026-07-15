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

// Mock Menu Items
export const MOCK_MENU: MenuItem[] = [
  {
    id: "m1",
    name: "트러플 크림 아란치니",
    price: 18000,
    description: "블랙 트러플 향이 은은하게 퍼지는 이탈리아식 튀김 주먹밥",
    category: "appetizer",
    image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "m2",
    name: "시저 샐러드 & 훈제 연어",
    price: 22000,
    description: "로메인 레터스 위에 프리미엄 훈제 연어와 파르메산 치즈 칩을 얹은 샐러드",
    category: "appetizer",
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "m3",
    name: "드라이 에이징 티본 스테이크",
    price: 89000,
    description: "참나무 장작으로 구워낸 최고급 프라임 등급의 드라이 에이징 티본 스테이크 (500g)",
    category: "main",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "m4",
    name: "비스크 소스 랍스터 파스타",
    price: 36000,
    description: "랍스터 껍질을 우려낸 깊은 풍미의 비스크 소스와 랍스터 테일 한 마리가 올라간 링귀니 파스타",
    category: "main",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "m5",
    name: "바닐라 브륄레 & 카라멜라이즈",
    price: 12000,
    description: "프랑스 정통 바닐라 커스터드 크림 위에 바삭한 카라멜 층을 얹은 디저트",
    category: "dessert",
    image: "https://images.unsplash.com/photo-1516685018646-549198525c1b?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "m6",
    name: "나파 밸리 카베르네 소비뇽",
    price: 95000,
    description: "깊고 풍부한 베리 향과 묵직한 바디감이 돋보이는 캘리포니아산 프리미엄 레드 와인 (750ml)",
    category: "drink",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&auto=format&fit=crop&q=60"
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
