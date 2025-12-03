import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface OrderItem {
  id: string;
  type: "FLIGHT" | "HOTEL" | "RENTAL";
  title: string;
  subtitle: string;
  pricePerUnit: number;
  totalPrice: number;
  dateRange: string;
  durationInfo?: string;
  status: "pending" | "success" | "cancelled";
  image: string;
}

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
  // --- 1. LOAD DATA DARI LOCAL STORAGE ---

  const [orders, setOrders] = useState<OrderItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedOrders = localStorage.getItem("travio_orders");
      return savedOrders ? JSON.parse(savedOrders) : [];
    }
    return [];
  });

  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("travio_user_carlos");
      return savedUser
        ? JSON.parse(savedUser)
        : {
            name: "Carlos Sirait",
            email: "carlos@students.undip.ac.id",
            avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Carlos",
            memberLevel: "Gold",
          };
    }
    return {
      name: "Carlos Sirait",
      email: "carlos@students.undip.ac.id",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Carlos",
      memberLevel: "Gold",
    };
  });

  // --- 2. SIMPAN PERUBAHAN ---

  useEffect(() => {
    localStorage.setItem("travio_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("travio_user_carlos", JSON.stringify(user));
  }, [user]);

  // --- 3. LOGIKA BISNIS ---

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
      // Update avatar otomatis sesuai nama baru
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
