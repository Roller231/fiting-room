import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import './Fitting.css';

const Fitting = () => {
  const { isDark } = useTheme();
  const { subtractBalance } = useUser();
  const [userPhoto, setUserPhoto] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const categories = [
    { id: 'all', name: 'Все', icon: '🎯' },
    { id: 'tops', name: 'Верх', icon: '👕' },
    { id: 'bottoms', name: 'Низ', icon: '👖' },
    { id: 'dresses', name: 'Платья', icon: '👗' },
    { id: 'outerwear', name: 'Верхняя', icon: '🧥' },
    { id: 'shoes', name: 'Обувь', icon: '👟' }
  ];

  const clothingItems = [
    { id: 1, name: 'Футболка белая', category: 'tops', price: 10, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200' },
    { id: 2, name: 'Джинсы синие', category: 'bottoms', price: 10, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200' },
    { id: 3, name: 'Платье чёрное', category: 'dresses', price: 15, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200' },
    { id: 4, name: 'Куртка кожаная', category: 'outerwear', price: 20, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200' },
    { id: 5, name: 'Кроссовки белые', category: 'shoes', price: 15, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200' },
    { id: 6, name: 'Худи серое', category: 'tops', price: 12, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200' },
    { id: 7, name: 'Брюки классика', category: 'bottoms', price: 12, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200' },
    { id: 8, name: 'Платье летнее', category: 'dresses', price: 15, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200' }
  ];

  const filteredItems = selectedCategory === 'all' 
    ? clothingItems 
    : clothingItems.filter(item => item.category === selectedCategory);

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
      setResult({
        image: userPhoto,
        item: selectedItem
      });
    }, 2000);
  };

  return (
    <div className={`fitting ${isDark ? 'dark' : 'light'}`}>
      <div className="fitting-header">
        <h1>👗 Примерочная</h1>
        <p>Загрузите фото и выберите одежду</p>
      </div>

      <div className="photo-upload-section">
        <div className="photo-area" onClick={() => document.getElementById('photo-input').click()}>
          {userPhoto ? (
            <img src={userPhoto} alt="Ваше фото" />
          ) : (
            <div className="upload-placeholder">
              <span className="upload-icon">📷</span>
              <span>Загрузить фото</span>
            </div>
          )}
        </div>
        <input
          type="file"
          id="photo-input"
          accept="image/*"
          onChange={handlePhotoUpload}
          hidden
        />
      </div>

      <div className="categories-scroll">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <div className="clothing-grid">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            className={`clothing-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
            onClick={() => setSelectedItem(item)}
          >
            <img src={item.image} alt={item.name} />
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <span className="item-price">{item.price} 💎</span>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="try-on-btn"
        disabled={!userPhoto || !selectedItem || isProcessing}
        onClick={handleTryOn}
      >
        {isProcessing ? (
          <span className="processing">⏳ Обработка...</span>
        ) : (
          <>
            <span>Примерить</span>
            {selectedItem && <span className="btn-price">{selectedItem.price} 💎</span>}
          </>
        )}
      </button>

      {result && (
        <div className="result-modal" onClick={() => setResult(null)}>
          <div className="result-content" onClick={e => e.stopPropagation()}>
            <h3>✨ Результат примерки</h3>
            <div className="result-image">
              <img src={result.image} alt="Результат" />
              <div className="result-overlay">
                <span>{result.item.name}</span>
              </div>
            </div>
            <button onClick={() => setResult(null)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fitting;
