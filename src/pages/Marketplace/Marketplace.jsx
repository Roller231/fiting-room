import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import './Marketplace.css';

const Marketplace = () => {
  const { isDark } = useTheme();
  const { subtractBalance } = useUser();
  const [userPhoto, setUserPhoto] = useState(null);
  const [productUrl, setProductUrl] = useState('');
  const [parsedProduct, setParsedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUserPhoto(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const parseUrl = () => {
    if (!productUrl.trim()) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const isWB = productUrl.includes('wildberries');
      const isOzon = productUrl.includes('ozon');
      
      setParsedProduct({
        platform: isWB ? 'Wildberries' : isOzon ? 'Ozon' : 'Маркетплейс',
        name: isWB ? 'Платье летнее с принтом' : 'Костюм спортивный',
        price: 30,
        images: [
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200',
          'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200',
          'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=200'
        ]
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleTryOn = (imageIndex) => {
    if (!userPhoto) {
      alert('Сначала загрузите ваше фото!');
      return;
    }
    
    if (!subtractBalance(30)) {
      alert('Недостаточно средств! Пополните баланс.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert('✨ Примерка товара с маркетплейса завершена!');
    }, 2500);
  };

  return (
    <div className={`marketplace ${isDark ? 'dark' : 'light'}`}>
      <div className="mp-header">
        <h1>🛒 WB / Ozon</h1>
        <p>Примерь товар по ссылке с маркетплейса</p>
      </div>

      <div className="photo-section">
        <div className="photo-area" onClick={() => document.getElementById('mp-photo').click()}>
          {userPhoto ? (
            <img src={userPhoto} alt="Фото" />
          ) : (
            <div className="upload-placeholder">
              <span>📷</span>
              <span>Ваше фото</span>
            </div>
          )}
        </div>
        <input type="file" id="mp-photo" accept="image/*" onChange={handlePhotoUpload} hidden />
      </div>

      <div className="url-section">
        <h2>Вставьте ссылку на товар</h2>
        <div className="url-input-group">
          <input
            type="url"
            placeholder="https://wildberries.ru/... или https://ozon.ru/..."
            value={productUrl}
            onChange={(e) => setProductUrl(e.target.value)}
          />
          <button onClick={parseUrl} disabled={!productUrl.trim() || isLoading}>
            {isLoading ? '⏳' : '🔍'}
          </button>
        </div>
        
        <div className="platforms-hint">
          <span className="platform-badge wb">Wildberries</span>
          <span className="platform-badge ozon">Ozon</span>
        </div>
      </div>

      {parsedProduct && (
        <div className="parsed-product">
          <div className="product-header">
            <span className={`platform-tag ${parsedProduct.platform.toLowerCase()}`}>
              {parsedProduct.platform}
            </span>
            <h3>{parsedProduct.name}</h3>
            <span className="product-price">{parsedProduct.price} 💎 за примерку</span>
          </div>
          
          <div className="product-images">
            {parsedProduct.images.map((img, idx) => (
              <div key={idx} className="product-image-card">
                <img src={img} alt={`Фото ${idx + 1}`} />
                <button 
                  className="try-image-btn"
                  onClick={() => handleTryOn(idx)}
                  disabled={isProcessing}
                >
                  {isProcessing ? '⏳' : '👗 Примерить'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="info-card">
        <span className="info-icon">ℹ️</span>
        <div className="info-text">
          <h4>Как это работает?</h4>
          <p>Скопируйте ссылку на товар с WB или Ozon, мы автоматически загрузим фото товара и примерим его на вас с помощью AI</p>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
