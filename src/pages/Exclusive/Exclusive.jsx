import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import './Exclusive.css';

const Exclusive = () => {
  const { isDark } = useTheme();
  const { subtractBalance } = useUser();
  const [userPhoto, setUserPhoto] = useState(null);
  const [clothingPhoto, setClothingPhoto] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const promptSuggestions = [
    'Сделай образ более элегантным',
    'Добавь аксессуары',
    'Измени цвет одежды на синий',
    'Сделай casual стиль',
    'Добавь деловой стиль'
  ];

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (type === 'user') setUserPhoto(ev.target.result);
        else setClothingPhoto(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!userPhoto || !clothingPhoto) {
      alert('Загрузите оба фото!');
      return;
    }
    
    if (!subtractBalance(50)) {
      alert('Недостаточно средств! Пополните баланс.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setResult({
        image: userPhoto,
        clothing: clothingPhoto,
        prompt: prompt
      });
    }, 3000);
  };

  return (
    <div className={`exclusive ${isDark ? 'dark' : 'light'}`}>
      <div className="exc-header">
        <h1>⭐ Эксклюзив</h1>
        <p>Загрузите свою одежду и создайте уникальный образ</p>
        <span className="exc-price">50 💎</span>
      </div>

      <div className="photos-grid">
        <div className="photo-card">
          <div 
            className="photo-upload"
            onClick={() => document.getElementById('exc-user-photo').click()}
          >
            {userPhoto ? (
              <img src={userPhoto} alt="Ваше фото" />
            ) : (
              <div className="placeholder">
                <span>👤</span>
                <span>Ваше фото</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            id="exc-user-photo" 
            accept="image/*" 
            onChange={(e) => handlePhotoUpload(e, 'user')} 
            hidden 
          />
        </div>

        <div className="plus-icon">+</div>

        <div className="photo-card">
          <div 
            className="photo-upload"
            onClick={() => document.getElementById('exc-cloth-photo').click()}
          >
            {clothingPhoto ? (
              <img src={clothingPhoto} alt="Одежда" />
            ) : (
              <div className="placeholder">
                <span>👗</span>
                <span>Фото одежды</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            id="exc-cloth-photo" 
            accept="image/*" 
            onChange={(e) => handlePhotoUpload(e, 'clothing')} 
            hidden 
          />
        </div>
      </div>

      <div className="prompt-section">
        <h2>✨ AI Промт (опционально)</h2>
        <textarea
          placeholder="Опишите желаемый результат... Например: 'Сделай образ более элегантным и добавь аксессуары'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />
        
        <div className="prompt-suggestions">
          {promptSuggestions.map((sug, idx) => (
            <button 
              key={idx}
              className="suggestion-btn"
              onClick={() => setPrompt(sug)}
            >
              {sug}
            </button>
          ))}
        </div>
      </div>

      <button 
        className="generate-btn"
        disabled={!userPhoto || !clothingPhoto || isProcessing}
        onClick={handleGenerate}
      >
        {isProcessing ? (
          <span className="processing">
            <span className="spinner">🔄</span>
            AI обрабатывает...
          </span>
        ) : (
          <>
            <span>✨ Создать образ</span>
            <span className="btn-price">50 💎</span>
          </>
        )}
      </button>

      {result && (
        <div className="result-modal" onClick={() => setResult(null)}>
          <div className="result-content" onClick={e => e.stopPropagation()}>
            <h3>✨ Ваш эксклюзивный образ</h3>
            <div className="result-images">
              <div className="result-before">
                <img src={result.image} alt="До" />
                <span>Оригинал</span>
              </div>
              <div className="result-arrow">→</div>
              <div className="result-after">
                <img src={result.image} alt="После" />
                <span>Результат</span>
              </div>
            </div>
            {result.prompt && (
              <p className="result-prompt">Промт: "{result.prompt}"</p>
            )}
            <div className="result-actions">
              <button className="save-btn">💾 Сохранить</button>
              <button className="close-btn" onClick={() => setResult(null)}>Закрыть</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exclusive;
