import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import './Marketplace.css';

const Marketplace = () => {
  const { isDark } = useTheme();
  const { subtractBalance } = useUser();
  const { t } = useLanguage();
  const [userPhoto, setUserPhoto] = useState(null);
  const [productUrl, setProductUrl] = useState('');
  const [parsedProduct, setParsedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);

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
        originalUrl: productUrl,
        images: [
          { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200', productLink: productUrl },
          { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=200', productLink: productUrl },
          { url: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=200', productLink: productUrl }
        ]
      });
      setIsLoading(false);
    }, 1500);
  };

  const copyProductLink = (link, idx) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(idx);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleTryOn = (imageIndex) => {
    if (!userPhoto) {
      alert(t('common.uploadPhotoFirst'));
      return;
    }
    
    if (!subtractBalance(30)) {
      alert(t('common.insufficientFunds'));
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setResult({
        image: userPhoto,
        item: parsedProduct,
        selectedIndex: imageIndex
      });
    }, 2500);
  };

  return (
    <div className={`marketplace ${isDark ? 'dark' : 'light'}`}>
      <div className="mp-header">
        <h1>🛒 {t('marketplace.title')}</h1>
        <p>{t('marketplace.subtitle')}</p>
      </div>

      <div className="photo-section">
        <div className="photo-area" onClick={() => document.getElementById('mp-photo').click()}>
          {userPhoto ? (
            <img src={userPhoto} alt="Фото" />
          ) : (
            <div className="upload-placeholder">
              <span>📷</span>
              <span>{t('marketplace.yourPhoto')}</span>
            </div>
          )}
        </div>
        <input type="file" id="mp-photo" accept="image/*" onChange={handlePhotoUpload} hidden />
      </div>

      <div className="url-section">
        <h2>{t('marketplace.pasteLink')}</h2>
        <div className="url-input-group">
          <input
            type="url"
            placeholder={t('marketplace.placeholder')}
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
            <span className="product-price">{parsedProduct.price} 💎 {t('marketplace.perTryOn')}</span>
          </div>
          
          <div className="product-images">
            {parsedProduct.images.map((img, idx) => (
              <div key={idx} className="product-image-card">
                <div className="product-image-wrapper">
                  <img src={img.url} alt={`Фото ${idx + 1}`} />
                  <span className={`platform-badge-small ${parsedProduct.platform.toLowerCase()}`}>
                    {parsedProduct.platform === 'Wildberries' ? 'WB' : parsedProduct.platform === 'Ozon' ? 'OZON' : 'MP'}
                  </span>
                </div>
                <div className="product-actions">
                  <button 
                    className="try-image-btn"
                    onClick={() => handleTryOn(idx)}
                    disabled={isProcessing}
                  >
                    {isProcessing ? '⏳' : `👗 ${t('marketplace.tryOn')}`}
                  </button>
                  <button 
                    className="copy-link-btn"
                    onClick={() => copyProductLink(img.productLink, idx)}
                  >
                    {copiedLink === idx ? '✓' : '🔗'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="info-card">
        <span className="info-icon">ℹ️</span>
        <div className="info-text">
          <h4>{t('marketplace.howItWorks')}</h4>
          <p>{t('marketplace.howItWorksDesc')}</p>
        </div>
      </div>

      {result && (
        <div className="result-modal" onClick={() => setResult(null)}>
          <div className="result-content" onClick={e => e.stopPropagation()}>
            <h3>✨ {t('marketplace.result')}</h3>
            <div className="result-image">
              <img src={result.image} alt="Результат" />
              <div className="result-overlay">
                <span>{result.item.name}</span>
                <span className={`result-platform ${result.item.platform.toLowerCase()}`}>
                  {result.item.platform}
                </span>
              </div>
            </div>
            <div className="result-actions">
              <a 
                href={result.item.originalUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="open-store-btn"
              >
                🛒 {t('marketplace.openIn')} {result.item.platform}
              </a>
              <button 
                className="copy-result-link"
                onClick={() => {
                  navigator.clipboard.writeText(result.item.originalUrl);
                  alert(t('common.linkCopied'));
                }}
              >
                📋 {t('marketplace.copyLink')}
              </button>
            </div>
            <button className="close-result-btn" onClick={() => setResult(null)}>{t('marketplace.close')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
