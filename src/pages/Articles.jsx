import { Link } from 'react-router-dom'
import { articles } from '../data/articles'
import './Articles.css'

function readingTime(text) {
  return Math.ceil(text.trim().split(/\s+/).length / 200)
}

export default function Articles() {
  return (
    <main className="articles-page">

      {/* Header */}
      <div className="articles-page__header">
        <div className="articles-page__header-inner">
          <span className="articles-page__eyebrow animate-fadeUp delay-1">
            All Writing
          </span>
          <h1 className="articles-page__title animate-fadeUp delay-2">
            Every Word,<br /><em>Unfiltered</em>
          </h1>
          <p className="articles-page__desc animate-fadeUp delay-3">
            {articles.length} essays and counting.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="articles-page__list">
        <div className="articles-page__list-inner">
          {articles.map((article, i) => (
            <Link
              to={`/article/${article.slug}`}
              className="articles-row"
              key={article.id}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="articles-row__img-wrap">
                <img src={article.coverImage} alt={article.title} />
              </div>

              <div className="articles-row__body">
                <div className="articles-row__top">
                  <span className="articles-row__meta">
                    {article.date} · {readingTime(article.body)} min read
                  </span>
                </div>
                <h2 className="articles-row__title">{article.title}</h2>
                <p className="articles-row__excerpt">{article.excerpt}</p>
              </div>

              <div className="articles-row__arrow">→</div>
            </Link>
          ))}
        </div>
      </div>

    </main>
  )
}