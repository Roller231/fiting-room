import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import './Modal.css';

const TopUpModal = ({ onClose }) => {
  const { isDark } = useTheme();
  const { addBalance, applyPromoCode, user } = useUser();
  const [amount, setAmount] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [message, setMessage] = useState(null);

  const topUpOptions = [100, 250, 500, 1000, 2500, 5000];

  const handleTopUp = (value) => {
    addBalance(value);
    setMessage({ type: 'success', text: `Баланс пополнен на ${value} 💎` });
    setTimeout(() => {
      setMessage(null);
      onClose();
    }, 1500);
  };

  const handlePromo = () => {
    if (!promoCode.trim()) return;
    const result = applyPromoCode(promoCode);
    if (result.success) {
      setMessage({ type: 'success', text: `Промокод активирован! +${result.amount} 💎` });
      setPromoCode('');
    } else {
      setMessage({ type: 'error', text: 'Промокод недействителен' });
    }
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal ${isDark ? 'dark' : 'light'}`} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        
        <div className="modal-header">
          <h2>💎 Пополнение баланса</h2>
          <p className="current-balance">Текущий баланс: <strong>{user.balance}</strong></p>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="topup-options">
          {topUpOptions.map(value => (
            <button 
              key={value} 
              className="topup-option"
              onClick={() => handleTopUp(value)}
            >
              <span className="topup-value">{value}</span>
              <span className="topup-icon">💎</span>
            </button>
          ))}
        </div>

        <div className="custom-amount">
          <input
            type="number"
            placeholder="Своя сумма"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
          <button 
            onClick={() => amount > 0 && handleTopUp(Number(amount))}
            disabled={!amount || amount <= 0}
          >
            Пополнить
          </button>
        </div>

        <div className="promo-section">
          <h3>🎁 Промокод</h3>
          <div className="promo-input">
            <input
              type="text"
              placeholder="Введите промокод"
              value={promoCode}
              onChange={e => setPromoCode(e.target.value.toUpperCase())}
            />
            <button onClick={handlePromo}>Применить</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUpModal;
