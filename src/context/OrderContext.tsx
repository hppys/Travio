import { createContext, useContext, useState, type ReactNode } from "react";

export interface OrderItem {
  id: string;
  type: "FLIGHT" | "HOTEL" | "RENTAL";
  title: string;
  subtitle: string;
  pricePerUnit: number;
  totalPrice: number;
  // 👇 Pastikan kedua properti ini ada:
  dateRange: string;
  durationInfo?: string;
  status: "pending" | "success" | "cancelled";
  image: string;
}

// ... (Sisa kode UserProfile dan Context tidak berubah) ...
// Biar aman, ini full codenya untuk bagian Provider:

interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  memberLevel: "Classic" | "Silver" | "Gold" | "Platinum";
}

interface OrderContextType {
  orders: OrderItem[];
  user: UserProfile;
  addOrder: (item: Omit<OrderItem, "id" | "status">) => void;
  updateOrderStatus: (id: string, status: "success" | "cancelled") => void;
  updateUserProfile: (name: string, email: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [user, setUser] = useState<UserProfile>({
    name: "Rizky Traveler",
    email: "rizky@example.com",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Rizky",
    memberLevel: "Gold",
  });

  const addOrder = (item: Omit<OrderItem, "id" | "status">) => {
    const newOrder: OrderItem = {
      ...item,
      id: `TRV-${Date.now().toString().slice(-6)}`,
      status: "pending",
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrderStatus = (id: string, status: "success" | "cancelled") => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, status } : order))
    );
  };

  const updateUserProfile = (name: string, email: string) => {
    setUser((prev) => ({
      ...prev,
      name,
      email,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${name}`,
    }));
  };

  return (
    <OrderContext.Provider
      value={{ orders, user, addOrder, updateOrderStatus, updateUserProfile }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context)
    throw new Error("useOrder must be used within an OrderProvider");
  return context;
};
