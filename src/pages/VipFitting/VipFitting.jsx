import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useLanguage } from '../../context/LanguageContext';
import './VipFitting.css';


const VipFitting = () => {
  const { isDark } = useTheme();
  const { subtractBalance } = useUser();
    const { t } = useLanguage();
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userPhotoFile, setUserPhotoFile] = useState(null);
  const [userPhotoPreview, setUserPhotoPreview] = useState(null);
  const [result, setResult] = useState(null);
  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, { mode: 'cors' });
      const blob = await response.blob();
  
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
  
      a.href = url;
      a.download = 'vip-try-on.png';
      document.body.appendChild(a);
      a.click();
  
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Не удалось скачать изображение');
    }
  };
  
  // const stores = [
  //   { id: 'zara', name: 'ZARA', logo: '🏷️' },
  //   { id: 'hm', name: 'H&M', logo: '👔' },
  //   { id: 'mango', name: 'MANGO', logo: '🥭' },
  //   { id: 'massimo', name: 'Massimo Dutti', logo: '👞' },
  //   { id: 'bershka', name: 'Bershka', logo: '🎸' },
  //   { id: 'pull', name: 'Pull&Bear', logo: '🐻' }
  // ];

  // const storeItems = {
  //   zara: [
  //     { id: 1, name: 'Блейзер оверсайз', price: 25, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200' },
  //     { id: 2, name: 'Платье миди', price: 25, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=200' },
  //     { id: 3, name: 'Джинсы wide leg', price: 25, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200' }
  //   ],
  //   hm: [
  //     { id: 4, name: 'Свитер вязаный', price: 25, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200' },
  //     { id: 5, name: 'Рубашка лен', price: 25, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200' },
  //     { id: 6, name: 'Шорты деним', price: 25, image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=200' }
  //   ],
  //   mango: [
  //     { id: 7, name: 'Костюм брючный', price: 30, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200' },
  //     { id: 8, name: 'Топ шёлковый', price: 25, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=200' }
  //   ],
  //   massimo: [
  //     { id: 9, name: 'Пальто шерсть', price: 35, image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200' },
  //     { id: 10, name: 'Брюки классика', price: 30, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=200' }
  //   ],
  //   bershka: [
  //     { id: 11, name: 'Худи принт', price: 20, image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200' },
  //     { id: 12, name: 'Юбка мини', price: 20, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj1a?w=200' }
  //   ],
  //   pull: [
  //     { id: 13, name: 'Футболка графика', price: 20, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=200' },
  //     { id: 14, name: 'Джоггеры', price: 20, image: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=200' }
  //   ]
  // };

  const [stores, setStores] = useState([]);
const [products, setProducts] = useState([]);
const handlePhotoUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUserPhotoFile(file);

  const reader = new FileReader();
  reader.onload = e => setUserPhotoPreview(e.target.result);
  reader.readAsDataURL(file);
};

useEffect(() => {
  const loadData = async () => {
    try {
      const shopsRes = await fetch(`${import.meta.env.VITE_API_URL}/shops`);
      const shopsData = await shopsRes.json();

      const productsRes = await fetch(`${import.meta.env.VITE_API_URL}/products`);
      const productsData = await productsRes.json();

      setStores(shopsData);
      setProducts(productsData);
    } catch (e) {
      console.error(e);
    }
  };

  loadData();
}, []);
const filteredProducts = selectedStore
  ? products.filter(p => p.shop_id === selectedStore)
  : [];




  

  const handleTryOn = async () => {
    if (!userPhotoFile || !selectedItem) return;
  
    // 1️⃣ списываем баланс
    const success = await subtractBalance(selectedItem.price);
  
    if (!success) {
      alert(t('common.insufficientFunds'));
      return;
    }
  
    // 2️⃣ формируем FormData
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
  
      // 3️⃣ показываем результат
      setResult({
        image: `${import.meta.env.VITE_API_URL}${data.url}`,
        item: selectedItem,
      });
    } catch (e) {
      console.error(e);
      alert('Ошибка примерки');
  
      // ⚠️ по желанию: вернуть баланс
      // await refundBalance(selectedItem.price)
    } finally {
      setIsProcessing(false);
    }
  };
  
  

  return (
    <div className={`vip-fitting ${isDark ? 'dark' : 'light'}`}>
      <div className="vip-header">
        <h1>👑 {t('vip.title')}</h1>
        <p>{t('vip.subtitle')}</p>
      </div>

      <div className="photo-section">
        <div className="photo-area" onClick={() => document.getElementById('vip-photo').click()}>
        {userPhotoPreview ? (
  <img src={userPhotoPreview} alt="Фото" />
) : (

            <div className="upload-placeholder">
              <span>📷</span>
              <span>{t('fitting.uploadPhoto')}</span>
            </div>
          )}
        </div>
        <input type="file" id="vip-photo" accept="image/*" onChange={handlePhotoUpload} hidden />
      </div>

      <div className="stores-section">
        <h2>{t('vip.selectStore')}</h2>
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
      {store.imageUrl && (
        <img src={store.imageUrl} alt={store.description} />
      )}
      <span className="store-name">{store.description}</span>
    </button>
  ))}
</div>

      </div>

      {selectedStore && (
  <div className="items-section">
    <h2>{t('vip.collection')}</h2>

    <div className="items-grid">
      {filteredProducts.map(item => (
        <div
          key={item.id}
          className={`item-card ${selectedItem?.id === item.id ? 'selected' : ''}`}
          onClick={() => setSelectedItem(item)}
        >
          <img
            src={`${import.meta.env.VITE_API_URL}/media/${item.photo}`}
            alt={item.name}
          />

          <div className="item-details">
            <span className="name">{item.name}</span>
            <span className="price">{item.price} 💎</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)}
{result && (
  <div className="result-modal" onClick={() => setResult(null)}>
    <div className="result-content" onClick={e => e.stopPropagation()}>
      <h3>✨ Результат</h3>

      <img src={result.image} alt="Результат" />

      <p>{result.item.name}</p>

      <div className="result-actions">
        <button
          className="download-btn"
          onClick={() => handleDownload(result.image)}
        >
          ⬇️ Скачать
        </button>

        <button onClick={() => setResult(null)}>
          Закрыть
        </button>
      </div>
    </div>
  </div>
)}


      <button 
        className="vip-try-btn"
        disabled={!userPhotoFile || !selectedItem || isProcessing}
        onClick={handleTryOn}
      >
        {isProcessing ? `⏳ ${t('vip.processing')}` : `${t('vip.tryOn')} ${selectedItem ? `(${selectedItem.price} 💎)` : ''}`}
      </button>
    </div>



  );
};

export default VipFitting;
