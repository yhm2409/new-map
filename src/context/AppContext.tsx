"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  name: string;
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
  login: (id: string, pw: string) => { success: boolean; message: string };
  signup: (id: string, name: string, pw: string) => { success: boolean; message: string };
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

  // Reservations
  reservations: Reservation[];
  addReservation: () => { success: boolean; reservationId: string };
  updateReservationStatus: (reservationId: string, status: "승인" | "거절") => void;
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

// Initial reservations to display on load
const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: "RES-1001",
    userId: "user123",
    userName: "김민수",
    date: "2026-07-20",
    time: "18:00",
    guests: 2,
    tableId: "2",
    items: [
      { id: "m3", name: "드라이 에이징 티본 스테이크", price: 89000, quantity: 1 },
      { id: "m6", name: "나파 밸리 카베르네 소비뇽", price: 95000, quantity: 1 }
    ],
    totalPrice: 184000,
    status: "승인",
    createdAt: "2026-07-15T12:00:00.000Z"
  },
  {
    id: "RES-1002",
    userId: "guest456",
    userName: "이서연",
    date: "2026-07-22",
    time: "19:30",
    guests: 4,
    tableId: "5",
    items: [
      { id: "m1", name: "트러플 크림 아란치니", price: 18000, quantity: 2 },
      { id: "m4", name: "비스크 소스 랍스터 파스타", price: 36000, quantity: 2 }
    ],
    totalPrice: 108000,
    status: "대기",
    createdAt: "2026-07-15T14:30:00.000Z"
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [users, setUsers] = useState<{ id: string; name: string; pw: string }[]>([]);

  // Reservation state
  const [bookingDate, setBookingDate] = useState<string>("");
  const [bookingTime, setBookingTime] = useState<string>("");
  const [bookingGuests, setBookingGuests] = useState<number>(2);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Cart
  const [cart, setCart] = useState<CartItem[]>([]);

  // Reservations
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);

  // Load user and data from localStorage (optional persistence helper)
  useEffect(() => {
    const savedUsers = localStorage.getItem("luxury_users");
    if (savedUsers) setUsers(JSON.parse(savedUsers));

    const savedReservations = localStorage.getItem("luxury_reservations");
    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    } else {
      localStorage.setItem("luxury_reservations", JSON.stringify(INITIAL_RESERVATIONS));
    }
  }, []);

  const login = (id: string, pw: string) => {
    const foundUser = users.find((u) => u.id === id && u.pw === pw);
    if (foundUser) {
      setUser({ id: foundUser.id, name: foundUser.name });
      return { success: true, message: "성공적으로 로그인되었습니다." };
    }
    // Default mock user check
    if (id === "user" && pw === "password") {
      const defaultUser = { id: "user", name: "테스터" };
      setUser(defaultUser);
      return { success: true, message: "기본 테스트 계정으로 로그인되었습니다." };
    }
    return { success: false, message: "아이디 또는 비밀번호가 일치하지 않습니다." };
  };

  const signup = (id: string, name: string, pw: string) => {
    if (id === "user" || users.some((u) => u.id === id)) {
      return { success: false, message: "이미 사용 중인 아이디입니다." };
    }
    const newUserList = [...users, { id, name, pw }];
    setUsers(newUserList);
    localStorage.setItem("luxury_users", JSON.stringify(newUserList));
    return { success: true, message: "회원가입이 완료되었습니다. 로그인해 주세요." };
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
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

  const addReservation = () => {
    if (!user || !bookingDate || !bookingTime || !selectedTableId) {
      return { success: false, reservationId: "" };
    }

    const reservationId = `RES-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReservation: Reservation = {
      id: reservationId,
      userId: user.id,
      userName: user.name,
      date: bookingDate,
      time: bookingTime,
      guests: bookingGuests,
      tableId: selectedTableId,
      items: [...cart],
      totalPrice: getCartTotal(),
      status: "대기",
      createdAt: new Date().toISOString()
    };

    const newReservations = [newReservation, ...reservations];
    setReservations(newReservations);
    localStorage.setItem("luxury_reservations", JSON.stringify(newReservations));

    // Reset reservation selections
    setSelectedTableId(null);
    clearCart();

    return { success: true, reservationId };
  };

  const updateReservationStatus = (reservationId: string, status: "승인" | "거절") => {
    const updated = reservations.map((res) => (res.id === reservationId ? { ...res, status } : res));
    setReservations(updated);
    localStorage.setItem("luxury_reservations", JSON.stringify(updated));
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
        addReservation,
        updateReservationStatus
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
