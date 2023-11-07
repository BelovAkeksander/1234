
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import './App.css';


const ArticleList = ({ articles, onDelete, onFilterChange }) => {
  return (
    <>
      <select onChange={onFilterChange}>
        <option value="все">Все</option>
        <option value="технологии">Технологии</option>
        <option value="спорт">Спорт</option>
        <option value="путешествия">Путешествия</option>
      </select>

      <div>
        {articles.map((article) => (
          <div key={article.id}>
            <h2>{article.title}</h2>
            <p>{article.summary}</p>
            <p>Категория: {article.category}</p>
            <Link to={`/article/${article.id}`}>Читать далее</Link>
            <Link to={`/edit/${article.id}`}>Редактировать</Link>
            <button onClick={() => onDelete(article.id)}>Удалить</button>
          </div>
        ))}
      </div>
    </>
  );
};


const ArticleDetail = ({ articles, onAddComment }) => {
  let { id } = useParams();
  let article = articles.find((article) => article.id === id);
  let navigate = useNavigate();

  const handleSubmitComment = (commentText) => {
    onAddComment(article.id, commentText);
  };

  return (
    <div>
      {article ? (
        <>
          <h1>{article.title}</h1>
          <p>{article.content}</p>
          <CommentList comments={article.comments} />
          <AddComment onAddComment={handleSubmitComment} />
        </>
      ) : (
        <p>Статья не найдена.</p>
      )}
    </div>
  );
};


const CommentList = ({ comments }) => {
  return (
    <div>
      {comments.length > 0 ? (
        <>
          <h3>Комментарии:</h3>
          {comments.map((comment, index) => (
            <div key={index}>
              <p>{comment}</p>
            </div>
          ))}
        </>
      ) : (
        <p>Комментариев пока нет.</p>
      )}
    </div>
  );
};


const AddComment = ({ onAddComment }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddComment(comment);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Комментарий:
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} required />
      </label>
      <button type="submit">Добавить комментарий</button>
    </form>
  );
};


const EditArticle = ({ articles, onUpdateArticle }) => {
  let { id } = useParams();
  let article = articles.find((article) => article.id === id);
  let navigate = useNavigate();

  const [title, setTitle] = useState(article.title);
  const [content, setContent] = useState(article.content);
  const [category, setCategory] = useState(article.category);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateArticle(id, title, content, category);
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Заголовок:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Содержание статьи:
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
      </label>
      <label>
        Категория:
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="технологии">Технологии</option>
          <option value="спорт">Спорт</option>
          <option value="путешествия">Путешествия</option>
        </select>
      </label>
      <button type="submit">Сохранить изменения</button>
    </form>
  );
};


const AddArticle = ({ onAddArticle }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('технологии');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddArticle({
      id: Date.now().toString(),
      title,
      summary: content.substring(0, 100) + '...',
      content,
      category,
      comments: []
    });
    setTitle('');
    setContent('');
    setCategory('технологии');
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Заголовок:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Содержание статьи:
        <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
      </label>
      <label>
        Категория:
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="технологии">Технологии</option>
          <option value="спорт">Спорт</option>
          <option value="путешествия">Путешествия</option>
        </select>
      </label>
      <button type="submit">Добавить статью</button>
    </form>
  );
};


const App = () => {
  const [articles, setArticles] = useState([
    { id: '1', title: 'Статья 1', category: 'технологии', summary: 'Краткое описание статьи 1', content: 'Полное содержание статьи 1', comments: [] },
    { id: '2', title: 'Статья 2', category: 'спорт', summary: 'Краткое описание статьи 2', content: 'Полное содержание статьи 2', comments: [] },
  
  ]);
  const [filter, setFilter] = useState('все');

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const addNewArticle = (article) => {
    setArticles(prevArticles => [...prevArticles, article]);
  };

  const updateArticle = (id, title, content, category) => {
    setArticles(prevArticles =>
      prevArticles.map((article) =>
        article.id === id ? { ...article, title, content, category } : article
      )
    );
  };

  const addCommentToArticle = (articleId, commentText) => {
    setArticles(prevArticles =>
      prevArticles.map((article) =>
        article.id === articleId ? { ...article, comments: [...article.comments, commentText] } : article
      )
    );
  };

  const deleteArticle = (articleId) => {
    setArticles(prevArticles => prevArticles.filter(article => article.id !== articleId));
  };

  const filteredArticles = filter === 'все' ? articles : articles.filter(article => article.category === filter);

  return (
    <Router>
      <div className="App">
        <nav>
          <Link to="/">Главная</Link>
          <Link to="/add">Добавить статью</Link>
        </nav>
        <Routes>
          <Route path="/" element={<ArticleList articles={filteredArticles} onDelete={deleteArticle} onFilterChange={handleFilterChange} />} />
          <Route path="/article/:id" element={<ArticleDetail articles={articles} onAddComment={addCommentToArticle} />} />
          <Route path="/add" element={<AddArticle onAddArticle={addNewArticle} />} />
          <Route path="/edit/:id" element={<EditArticle articles={articles} onUpdateArticle={updateArticle} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
