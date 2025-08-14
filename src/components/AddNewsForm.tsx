// features/news/AddNewsForm.tsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNews } from '../features/news/newsSlice';

const AddNewsForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addNews({
        title,
        content,
        date: new Date().toISOString(),
      })
    );
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="add-news-form">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Заголовок"
        required
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Содержание"
        required
      />
      <button type="submit">Добавить новость</button>
    </form>
  );
};

export default AddNewsForm;