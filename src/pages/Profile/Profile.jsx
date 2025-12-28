import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import './Profile.css';

const Profile = () => {
  const { isDark } = useTheme();
  const { user, updateProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: user.name, email: user.email });
  const [copied, setCopied] = useState(false);

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    updateProfile(editData);
    setIsEditing(false);
  };

  return (
    <div className={`profile ${isDark ? 'dark' : 'light'}`}>
      <div className="profile-header">
        <div className="avatar-section">
          <img src={user.avatar} alt="Аватар" className="avatar" />
          <button className="change-avatar">📷</button>
        </div>
        
        {isEditing ? (
          <div className="edit-form">
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({...editData, name: e.target.value})}
              placeholder="Имя"
            />
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({...editData, email: e.target.value})}
              placeholder="Email"
            />
            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>Сохранить</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Отмена</button>
            </div>
          </div>
        ) : (
          <div className="user-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️ Редактировать</button>
          </div>
        )}
      </div>

      <div className="balance-card">
        <div className="balance-info">
          <span className="balance-label">Текущий баланс</span>
          <span className="balance-value">{user.balance} 💎</span>
        </div>
        <div className="balance-icon">💰</div>
      </div>

      <div className="referral-section">
        <h2>🎁 Реферальная программа</h2>
        <div className="referral-card">
          <div className="referral-code-block">
            <span className="label">Ваш код</span>
            <div className="code-row">
              <span className="code">{user.referralCode}</span>
              <button className="copy-btn" onClick={copyReferralCode}>
                {copied ? '✓' : '📋'}
              </button>
            </div>
          </div>
          
          <div className="referral-stats">
            <div className="stat">
              <span className="stat-value">{user.referrals}</span>
              <span className="stat-label">Приглашено</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.totalEarned} 💎</span>
              <span className="stat-label">Заработано</span>
            </div>
          </div>
          
          <p className="referral-hint">
            Приглашайте друзей и получайте 50 💎 за каждого!
          </p>
        </div>
      </div>

      <div className="payment-section">
        <h2>💳 Платёжные данные</h2>
        <div className="payment-cards">
          <div className="payment-card added">
            <span className="card-icon">💳</span>
            <div className="card-info">
              <span className="card-number">•••• 4567</span>
              <span className="card-type">Visa</span>
            </div>
            <span className="card-status">✓</span>
          </div>
          
          <button className="add-card-btn">
            <span>+</span>
            <span>Добавить карту</span>
          </button>
        </div>
      </div>

      <div className="history-section">
        <h2>📊 История операций</h2>
        <div className="history-list">
          <div className="history-item">
            <div className="history-icon income">+</div>
            <div className="history-info">
              <span className="history-title">Пополнение баланса</span>
              <span className="history-date">Сегодня, 14:30</span>
            </div>
            <span className="history-amount income">+500 💎</span>
          </div>
          <div className="history-item">
            <div className="history-icon expense">-</div>
            <div className="history-info">
              <span className="history-title">VIP Примерка</span>
              <span className="history-date">Вчера, 18:45</span>
            </div>
            <span className="history-amount expense">-25 💎</span>
          </div>
          <div className="history-item">
            <div className="history-icon income">+</div>
            <div className="history-info">
              <span className="history-title">Реферальный бонус</span>
              <span className="history-date">20.12.2024</span>
            </div>
            <span className="history-amount income">+50 💎</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
