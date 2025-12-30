import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import TopUpModal from '../../components/Modals/TopUpModal';
import './Profile.css';

const Profile = () => {
  const { isDark } = useTheme();
  const { user, updateProfile } = useUser();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: user.name, email: user.email });
  const [copied, setCopied] = useState(false);
  const [showTopUp, setShowTopUp] = useState(false);

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
              <button className="save-btn" onClick={handleSave}>{t('profile.save')}</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>{t('profile.cancel')}</button>
            </div>
          </div>
        ) : (
          <div className="user-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️ {t('profile.editProfile')}</button>
          </div>
        )}
      </div>

      <div className="balance-card">
        <div className="balance-info">
          <span className="balance-label">{t('profile.currentBalance')}</span>
          <span className="balance-value">{user.balance} 💎</span>
        </div>
        <div className="balance-icon">💰</div>
      </div>

      <div className="referral-section">
        <h2>🎁 {t('profile.referral')}</h2>
        <div className="referral-card">
          <div className="referral-code-block">
            <span className="label">{t('profile.yourCode')}</span>
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
              <span className="stat-label">{t('profile.invited')}</span>
            </div>
            <div className="stat">
              <span className="stat-value">{user.totalEarned} 💎</span>
              <span className="stat-label">{t('profile.earned')}</span>
            </div>
          </div>
          
          <p className="referral-hint">
            {t('profile.inviteHint')}
          </p>
        </div>
      </div>

      <div className="payment-section">
        <h2>💎 {t('profile.balance')}</h2>
        <button className="topup-btn" onClick={() => setShowTopUp(true)}>
          <span className="topup-icon">💎</span>
          <span>{t('profile.topUp')}</span>
          <span className="topup-plus">+</span>
        </button>
      </div>

      <div className="history-section">
        <h2>📊 {t('profile.history')}</h2>
        <div className="history-list">
          <div className="history-item">
            <div className="history-icon income">+</div>
            <div className="history-info">
              <span className="history-title">{t('profile.topUpHistory')}</span>
              <span className="history-date">{t('profile.today')}, 14:30</span>
            </div>
            <span className="history-amount income">+500 💎</span>
          </div>
          <div className="history-item">
            <div className="history-icon expense">-</div>
            <div className="history-info">
              <span className="history-title">{t('profile.vipTryOn')}</span>
              <span className="history-date">{t('profile.yesterday')}, 18:45</span>
            </div>
            <span className="history-amount expense">-25 💎</span>
          </div>
          <div className="history-item">
            <div className="history-icon income">+</div>
            <div className="history-info">
              <span className="history-title">{t('profile.referralBonus')}</span>
              <span className="history-date">20.12.2024</span>
            </div>
            <span className="history-amount income">+50 💎</span>
          </div>
        </div>
      </div>

      {showTopUp && <TopUpModal onClose={() => setShowTopUp(false)} />}
    </div>
  );
};

export default Profile;
