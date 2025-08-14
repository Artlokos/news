import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../app/store'; // Импортируем RootState
import { updatePreferences, toggleTheme } from './userSlice';
import { useState } from 'react';

// Предполагая, что у вас есть список категорий
const categories = ['Технологии', 'Наука', 'Спорт', 'Политика', 'Искусство'];

const UserSettings = () => {
  const dispatch = useDispatch();
  const preferences = useSelector((state: RootState) => state.userPreferences);
  const [formData, setFormData] = useState(preferences);

  const handleSubmit = () => {
    dispatch(updatePreferences(formData));
  };

  return (
    <div className={`user-settings ${preferences.theme}`}>
      <h3>Настройки пользователя</h3>
      
      <div className="form-group">
        <label>Предпочитаемые категории:</label>
        <select
          multiple
          value={formData.preferredCategories}
          onChange={(e) => setFormData({
            ...formData,
            preferredCategories: Array.from(e.target.selectedOptions, option => option.value)
          })}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Тема:</label>
        <button onClick={() => dispatch(toggleTheme())}>
          Переключить на {preferences.theme === 'light' ? 'тёмную' : 'светлую'}
        </button>
      </div>

      <button onClick={handleSubmit}>Сохранить настройки</button>
    </div>
  );
};

export default UserSettings;