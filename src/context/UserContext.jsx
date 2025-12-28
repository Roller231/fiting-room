import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    balance: 1500,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user123',
    name: 'Пользователь',
    email: 'user@example.com',
    referralCode: 'FIT2024USER',
    referrals: 3,
    totalEarned: 450
  });

  const addBalance = (amount) => {
    setUser(prev => ({ ...prev, balance: prev.balance + amount }));
  };

  const subtractBalance = (amount) => {
    if (user.balance >= amount) {
      setUser(prev => ({ ...prev, balance: prev.balance - amount }));
      return true;
    }
    return false;
  };

  const applyPromoCode = (code) => {
    const promoCodes = {
      'WELCOME100': 100,
      'VIP500': 500,
      'BONUS250': 250,
      'FIRST50': 50
    };
    
    if (promoCodes[code.toUpperCase()]) {
      addBalance(promoCodes[code.toUpperCase()]);
      return { success: true, amount: promoCodes[code.toUpperCase()] };
    }
    return { success: false };
  };

  const updateProfile = (data) => {
    setUser(prev => ({ ...prev, ...data }));
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      addBalance, 
      subtractBalance, 
      applyPromoCode,
      updateProfile 
    }}>
      {children}
    </UserContext.Provider>
  );
};
