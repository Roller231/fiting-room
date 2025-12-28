import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import './VipFitting.css';

const VipFitting = () => {
  const { isDark } = useTheme();
  const { subtractBalance } = useUser();
  const [userPhoto, setUserPhoto] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const stores = [
    { id: 'zara', name: 'ZARA', logo: '🏷️' },
    { id: 'hm', name: 'H&M', logo: '👔' },
    { id: 'mango', name: 'MANGO', logo: '🥭' },
    { id: 'massimo', name: 'Massimo Dutti', logo: '👞' },
    { id: 'bershka', name: 'Bershka', logo: '🎸' },
    { id: 'pull', name: 'Pull&Bear', logo: '🐻' }
  ];

  const storeItems = {
    zara: [
      { id: 1, name: 'Блейзер оверсайз', price: 25, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200' },
      { id: 2, name: 'Платье миди', price: 25, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200' },
      { id: 3, name: 'Джинсы wide leg', price: 25, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200' }
    ],
    hm: [
      { id: 4, name: 'Свитер вязаный', price: 25, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200' },
      { id: 5, name: 'Рубашка лен', price: 25, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200' },
      { id: 6, name: 'Шорты деним', price: 25, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200' }
    ],
    mango: [
      { id: 7, name: 'Костюм брючный', price: 30, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200' },
      { id: 8, name: 'Топ шёлковый', price: 25, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=200' }
    ],
    massimo: [
      { id: 9, name: 'Пальто шерсть', price: 35, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200' },
      { id: 10, name: 'Брюки классика', price: 30, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200' }
    ],
    bershka: [
      { id: 11, name: 'Худи принт', price: 20, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200' },
      { id: 12, name: 'Юбка мини', price: 20, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj1a?w=200' }
    ],
    pull: [
      { id: 13, name: 'Футболка графика', price: 20, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200' },
      { id: 14, name: 'Джоггеры', price: 20, image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=200' }
    ]
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUserPhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = () => {
    if (!userPhoto || !selectedItem) return;
    
    if (!subtractBalance(selectedItem.price)) {
      alert('Недостаточно средств! Пополните баланс.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('✨ Примерка завершена! Результат готов.');
    }, 2500);
  };

  return (
    <div className={`vip-fitting ${isDark ? 'dark' : 'light'}`}>
      <div className="vip-header">
        <h1>👑 VIP Примерочная</h1>
        <p>Одежда из топовых магазинов</p>
      </div>

      <div className="photo-section">
        <div className="photo-area" onClick={() => document.getElementById('vip-photo').click()}>
          {userPhoto ? (
            <img src={userPhoto} alt="Фото" />
          ) : (
            <div className="upload-placeholder">
              <span>📷</span>
              <span>Загрузить фото</span>
            </div>
          )}
        </div>
        <input type="file" id="vip-photo" accept="image/*" onChange={handlePhotoUpload} hidden />
      </div>

      <div className="stores-section">
        <h2>Выберите магазин</h2>
        <div className="stores-grid">
          {stores.map(store => (
            <button
              key={store.id}
              className={`store-btn ${selectedStore === store.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedStore(store.id);
                setSelectedItem(null);
              }}
            >
              <span className="store-logo">{store.logo}</span>
              <span className="store-name">{store.name}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedStore && (
        <div className="items-section">
          <h2>Коллекция {stores.find(s => s.id === selectedStore)?.name}</h2>
          <div className="items-grid">
            {storeItems[selectedStore]?.map(item => (
              <div
                key={item.id}
                className={`item-card ${selectedItem?.id === item.id ? 'selected' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <span className="name">{item.name}</span>
                  <span className="price">{item.price} 💎</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button 
        className="vip-try-btn"
        disabled={!userPhoto || !selectedItem || isProcessing}
        onClick={handleTryOn}
      >
        {isProcessing ? '⏳ Обработка VIP...' : `Примерить ${selectedItem ? `(${selectedItem.price} 💎)` : ''}`}
      </button>
    </div>
  );
};

export default VipFitting;
