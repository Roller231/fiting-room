import { useEffect, useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { fetchCategories, fetchProducts } from '../../api/catalogApi';
import './Fitting.css';
import { useUser } from '../../context/UserContext';

const Fitting = () => {
  const { isDark } = useTheme();
  const { t } = useLanguage();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const [userPhoto, setUserPhoto] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [userPhotoFile, setUserPhotoFile] = useState(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState(null);
  const TRY_ON_PRICE = 50;

  const [loading, setLoading] = useState(true);
  const { subtractBalance, user } = useUser();
  // 🔥 загрузка категорий + всех продуктов
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

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      const blob = await response.blob();
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
  
      a.href = url;
      a.download = 'try-on-result.png'; // имя файла
      document.body.appendChild(a);
      a.click();
  
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Не удалось скачать изображение');
    }
  };
  

  // 🔥 продукты по категории
  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter(p => p.category_id === selectedCategory);

      const canTryOn =
      userPhotoFile &&
      filteredProducts.length > 0 &&
      !isProcessing;
    

      const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
      
        setUserPhotoFile(file);
      
        const reader = new FileReader();
        reader.onload = e => setUserPhotoPreview(e.target.result);
        reader.readAsDataURL(file);
      };
      

      const handleTryOn = async () => {
        if (!userPhotoFile || filteredProducts.length === 0) return;
      
  // 🔥 списываем ФИКСИРОВАННУЮ цену
  const success = await subtractBalance(TRY_ON_PRICE);

  if (!success) {
    alert(t('common.insufficientFunds'));
    return;
  }

        const randomProduct =
          filteredProducts[Math.floor(Math.random() * filteredProducts.length)];
      
        const formData = new FormData();
        formData.append('product_id', randomProduct.id);
        formData.append('user_photo', userPhotoFile);
          formData.append('tg_id', user.tg_id || user.id);
        
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
            item: randomProduct,
          });
        } catch (e) {
          console.error(e);
          alert('Ошибка примерки');
        } finally {
          setIsProcessing(false);
        }
      };
      
  

  if (loading) {
    return <div className="fitting">Загрузка...</div>;
  }

  return (
    <div className={`fitting ${isDark ? 'dark' : 'light'}`}>
      <div className="fitting-header">
        <h1>👗 {t('fitting.title')}</h1>
        <p>{t('fitting.subtitle')}</p>
      </div>

      {/* 📸 Фото */}
      <div className="photo-upload-section">
        <div
          className="photo-area"
          onClick={() => document.getElementById('photo-input').click()}
        >
{userPhotoPreview ? (
  <img src={userPhotoPreview} alt="Ваше фото" />
)
 : (
            <div className="upload-placeholder">
              <span className="upload-icon">📷</span>
              <span>{t('fitting.uploadPhoto')}</span>
            </div>
          )}
        </div>

        <input
          type="file"
          id="photo-input"
          accept="image/*"
          hidden
          onChange={handlePhotoUpload}
        />
      </div>
      {/* ▶️ Кнопка */}
      <button
  className="try-on-btn"
  disabled={!canTryOn}
  onClick={handleTryOn}
>

{isProcessing
  ? '⏳ Обработка...'
  : `Примерить (${TRY_ON_PRICE} 💎)`
}
      </button>
      {/* 🧩 Категории */}

<div className="categories-section">
  <div className="categories-scroll">
    {/* Категория: Все */}
    <div 
      className={`category-tile ${selectedCategory === 'all' ? 'active' : ''}`}
      onClick={() => setSelectedCategory('all')}
    >
      <div className="tile-media">
        <span className="tile-emoji">🎯</span>
      </div>
      <span className="tile-label">{t('fitting.categories.all')}</span>
    </div>

    {/* Динамические категории */}
    {categories.map(cat => (
      <div 
        key={cat.id} 
        className={`category-tile ${selectedCategory === cat.id ? 'active' : ''}`}
        onClick={() => setSelectedCategory(cat.id)}
      >
        <div className="tile-media">
          {cat.imageUrl ? (
            <img 
              src={cat.imageUrl}
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

      {/* 👕 Товары */}
      <div className="clothing-grid">
  {filteredProducts.map(item => (
    <div key={item.id} className="clothing-item preview">
<img
  src={`${import.meta.env.VITE_API_URL}/media/${item.gif || item.photo}`}
  alt={item.name}
/>

      <div className="item-info">
        <span className="item-name">{item.name}</span>
      </div>
    </div>
  ))}
</div>




      {/* ✨ Результат */}
      {result && (
  <div className="result-modal" onClick={() => setResult(null)}>
    <div className="result-content" onClick={e => e.stopPropagation()}>
      <h3>✨ Результат</h3>
      <img src={result.image} alt="Результат" />
      <p>{result.item.name}</p>
      <button onClick={() => setResult(null)}>Закрыть</button>
      <div className="result-actions">
  <button
    className="download-btn"
    onClick={() => handleDownload(result.image)}
  >
    ⬇️ Скачать
  </button>


</div>

    </div>
  </div>
)}

    </div>
  );
};

export default Fitting;
