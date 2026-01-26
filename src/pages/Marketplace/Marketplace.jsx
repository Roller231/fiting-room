import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import './Marketplace.css';
import { fetchCategories, fetchProducts } from '../../api/catalogApi';

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

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [userPhotoFile, setUserPhotoFile] = useState(null);

  /* ===========================
     ЗАГРУЗКА ФОТО ПОЛЬЗОВАТЕЛЯ
  =========================== */
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUserPhotoFile(file);
    const reader = new FileReader();
    reader.onload = e => setUserPhoto(e.target.result);
    reader.readAsDataURL(file);
  };

  /* ===========================
     ЗАГРУЗКА КАТЕГОРИЙ И ТОВАРОВ
  =========================== */
  useEffect(() => {
    const load = async () => {
      try {
        const cats = await fetchCategories();
        const prods = await fetchProducts();
        setCategories(cats);
        setProducts(prods);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* ===========================
     ФИЛЬТР ТОЛЬКО MARKETPLACE
  =========================== */
  const marketplaceProducts = products.filter(
    p => p.marketplace_url
  );
  const canTryOn =
  userPhoto &&
  selectedItem &&
    !isProcessing;

  const filteredProducts =
    selectedCategory === 'all'
      ? marketplaceProducts
      : marketplaceProducts.filter(p => p.category_id === selectedCategory);

  /* ===========================
     ПАРСИНГ URL (НЕ УДАЛЯЛ)
  =========================== */
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

  /* ===========================
     TRY-ON (ОСТАВЛЕН КАК ЕСТЬ)
  =========================== */
  const handleTryOn = async () => {
    if (!userPhotoFile || !selectedItem) {
      alert('Выберите товар и загрузите фото');
      return;
    }
  
    // 🔥 СПИСЫВАЕМ ЦЕНУ ТОВАРА
    const success = await subtractBalance(selectedItem.price);
  
    if (!success) {
      alert(t('common.insufficientFunds'));
      return;
    }
  
    const formData = new FormData();
    formData.append('product_id', selectedItem.id);
    formData.append('user_photo', userPhotoFile);
  
    setIsProcessing(true);
  
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/try-on`,
        {
          method: 'POST',
          body: formData,
        }
      );
  
      if (!res.ok) {
        throw new Error('Try-on failed');
      }
  
      const data = await res.json();
  
      setResult({
        image: `${import.meta.env.VITE_API_URL}${data.url}`,
        item: selectedItem,
      });
    } catch (e) {
      console.error(e);
      alert('Ошибка примерки');
      // ⚠️ при желании — вернуть баланс
    } finally {
      setIsProcessing(false);
    }
  };
  

  /* ===========================
     СКАЧИВАНИЕ РЕЗУЛЬТАТА
  =========================== */
  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'marketplace-try-on.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Ошибка скачивания');
    }
  };

  return (
<div className={`marketplace fitting ${isDark ? 'dark' : 'light'}`}>
        <div className="mp-header">
        <h1>🛒 {t('marketplace.title')}</h1>
        <p>{t('marketplace.subtitle')}</p>
      </div>

      {/* 📸 Фото */}
      <div className="photo-section">
        <div className="photo-area" onClick={() => document.getElementById('mp-photo').click()}>
          {userPhoto ? <img src={userPhoto} alt="Фото" /> : (
            <div className="upload-placeholder">
              <span>📷</span>
              <span>{t('marketplace.yourPhoto')}</span>
            </div>
          )}
        </div>
        <input type="file" id="mp-photo" accept="image/*" hidden onChange={handlePhotoUpload} />
      </div>
      <button
  className="try-on-btn"
  disabled={!canTryOn}
  onClick={handleTryOn}
>
  {isProcessing
    ? '⏳ Обработка...'
    : selectedItem
      ? `Примерить (${selectedItem.price} 💎)`
      : 'Выберите одежду'
  }
</button>


      {/* 🧩 КАТЕГОРИИ */}
{/* 🧩 КАТЕГОРИИ (С подгрузкой картинок из API) */}
<div className="categories-section">
        <div className="categories-scroll">
          <div 
            className={`category-tile ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            <div className="tile-media">
              <span className="tile-emoji">🎯</span>
            </div>
            <span className="tile-label">{t('fitting.categories.all')}</span>
          </div>

          {categories.map(cat => (
            <div 
              key={cat.id} 
              className={`category-tile ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <div className="tile-media">
                {/* Проверяем: если у категории есть фото, берем его с сервера, 
                   как в карточках товаров. Иначе ставим дефолтную иконку 
                */}
                {cat.imageUrl || cat.icon ? (
                  <img 
                    src={cat.imageUrl || cat.icon}
                    alt={cat.name} 
                    className="tile-img"
                  />
                ) : (
                  <span className="tile-emoji">👕</span>
                )}
              </div>
              <span className="tile-label">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 👕 ТОВАРЫ */}
      <div className="clothing-grid">
        {filteredProducts.map(item => (
          <div key={item.id}  className={`clothing-item preview ${selectedItem?.id === item.id ? 'selected' : ''}`}
           onClick={() => setSelectedItem(item)}>
            <img
              src={`${import.meta.env.VITE_API_URL}/media/${item.gif || item.photo}`}
              alt={item.name}
            />
            <div className="item-info">
              <span className="item-name">{item.name}</span>
              <span className="item-price">{item.price} 💎</span>
            </div>
          </div>
        ))}
      </div>

      {/* ✨ РЕЗУЛЬТАТ */}
      {result && (
        <div className="result-modal" onClick={() => setResult(null)}>
          <div className="result-content" onClick={e => e.stopPropagation()}>
            <h3>✨ Результат</h3>

            <img src={result.image} alt="Результат" />

            <p>{result.item?.name}</p>

            <div className="result-actions">
              <button className="download-btn" onClick={() => handleDownload(result.image)}>
                ⬇️ Скачать
              </button>

              {result.item?.marketplace_url && (
                <a
                  href={result.item.marketplace_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="open-store-btn"
                >
                  🛒 Открыть на маркетплейсе
                </a>
              )}
            </div>

            <button onClick={() => setResult(null)}>Закрыть</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
