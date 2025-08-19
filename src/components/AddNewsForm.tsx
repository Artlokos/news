// features/news/AddNewsForm.tsx
import React, { useState } from 'react';
import { useAppDispatch} from "../app/hooks";
import { addNews } from '../features/news/newsSlice';
import NewsItem from "../features/news/NewsItem";
interface NewsFormData {
    title: string;
    content: string;
    date: string;
    category?: string;
    tags?: string[];
}

const AddNewsForm = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const dispatch = useAppDispatch(); // Используем типизированный dispatch

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const newsData: Omit<NewsItem, 'id'> = {
            title,
            content,
            date: new Date().toISOString(),
            category: 'general', // Добавьте нужные значения по умолчанию
            tags: [],
            authorId: 'currentUserId', // Замените на реальный ID
            rating: 0,
            views: 0
        };

        dispatch(addNews(newsData));
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