import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getArticles } from '../data/articles'
import './Articles.css'

function readingTime(text) {
  return Math.ceil(text.trim().split(/\s+/).length / 200)
}

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    getArticles().then(data => {
      setArticles(data)
      setLoading(false)
    })
  }, [])

  const categories = ['All', ...new Set(articles.map(a => a.category).filter(Boolean))]

  const filtered = articles.filter(a => {
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory
    const matchesSearch = !search || 
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.excerpt?.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <main className="articles-page">
      <div className="articles-page__header">
        <div className="articles-page__header-inner">
          <span className="articles-page__eyebrow animate-fadeUp delay-1">All Writing</span>
          <h1 className="articles-page__title animate-fadeUp delay-2">
            Every Word,<br /><em>Unfiltered</em>
          </h1>
          <p className="articles-page__desc animate-fadeUp delay-3">
            {loading ? '...' : `${articles.length} essays and counting.`}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="articles-page__controls">
        <div className="articles-page__controls-inner">
          <div className="articles-search">
            <span className="articles-search__icon">🔍</span>
            <input
              className="articles-search__input"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="articles-search__clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
          <div className="articles-filter">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? 'filter-btn--active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="articles-page__list">
        <div className="articles-page__list-inner">
          {loading ? (
            [1,2,3].map(i => <div key={i} className="articles-row-skeleton" />)
          ) : filtered.length === 0 ? (
            <div className="articles-empty">
              <p>No articles found.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All') }}>
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map((article, i) => (
              <Link
                to={`/article/${article.slug}`}
                className="articles-row"
                key={article.id}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="articles-row__img-wrap">
                  <img src={article.cover_image} alt={article.title} />
                </div>
                <div className="articles-row__body">
                  <div className="articles-row__top">
                    <span className="articles-row__category">{article.category}</span>
                    <span className="articles-row__meta">
                      {article.date} · {readingTime(article.body)} min read · {article.views ?? 0} views
                    </span>
                  </div>
                  <h2 className="articles-row__title">{article.title}</h2>
                  <p className="articles-row__excerpt">{article.excerpt}</p>
                </div>
                <div className="articles-row__arrow">→</div>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
  )
}