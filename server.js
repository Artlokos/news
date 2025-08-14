import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import https from 'https';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Получаем __dirname в ES модулях
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Настройка HTTPS
const key = fs.readFileSync(path.join(__dirname, 'ssl', 'private.key'));
const cert = fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.crt'));
const httpsOptions = { key, cert };

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Модели MongoDB
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String, enum: ['politics', 'sports', 'tech'], required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true, maxlength: 500 },
  newsId: { type: mongoose.Schema.Types.ObjectId, ref: 'News', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'pending' },
  reported: { type: Boolean, default: false },
});

const User = mongoose.model('User', userSchema);
const News = mongoose.model('News', newsSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}));

// Лимитер запросов
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100 // лимит запросов
});
app.use(limiter);

// JWT секрет
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('JWT_SECRET не установлен');
  process.exit(1);
}

// Валидация и обработка ошибок
const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    
    res.status(400).json({ errors: errors.array() });
  };
};

// Middleware проверки JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Недействительный токен' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Требуется авторизация' });
  }
};

// API Новостей
app.get('/api/news', async (req, res, next) => {
  try {
    const news = await News.find().populate('authorId', 'username');
    res.json(news);
  } catch (err) {
    next(err);
  }
});

app.post('/api/news', authenticateJWT, validate([
  body('title').notEmpty().trim().isLength({ max: 100 }),
  body('content').notEmpty().trim(),
  body('category').isIn(['politics', 'sports', 'tech'])
]), async (req, res, next) => {
  try {
    const newsItem = new News({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      authorId: req.user.id
    });
    
    await newsItem.save();
    res.status(201).json(newsItem);
  } catch (err) {
    next(err);
  }
});

// API Комментариев
app.get('/api/comments/pending', authenticateJWT, async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    const comments = await Comment.find({ status: 'pending' })
      .populate('userId', 'username')
      .populate('newsId', 'title');
      
    res.json(comments);
  } catch (err) {
    next(err);
  }
});

app.post('/api/comments', authenticateJWT, validate([
  body('text').notEmpty().trim().isLength({ max: 500 }),
  body('newsId').notEmpty().isMongoId()
]), async (req, res, next) => {
  try {
    const comment = new Comment({
      text: req.body.text,
      newsId: req.body.newsId,
      userId: req.user.id,
      status: req.user.role === 'admin' ? 'approved' : 'pending'
    });
    
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
});

app.patch('/api/comments/:id/moderate', authenticateJWT, validate([
  body('status').isIn(['approved', 'rejected'])
]), async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Доступ запрещен' });
    }
    
    const comment = await Comment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    
    if (!comment) {
      return res.status(404).json({ message: 'Комментарий не найден' });
    }
    
    res.json(comment);
  } catch (err) {
    next(err);
  }
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Внутренняя ошибка сервера' });
});

// 404 обработчик
app.use((req, res) => {
  res.status(404).json({ message: 'Не найдено' });
});

// Запуск сервера
https.createServer(httpsOptions, app).listen(process.env.PORT || 5000, () => {
  console.log(`HTTPS сервер запущен на порту ${process.env.PORT || 5000}`);
});