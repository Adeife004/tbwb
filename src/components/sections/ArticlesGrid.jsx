import { Link } from 'react-router-dom'
import { articles } from '../../data/articles'

export default function ArticlesGrid() {
  const rest = articles.slice(1)

  return (
    <section className="grid-section">
      <div className="grid-section__inner">
        <div className="section-label">More Writing</div>
        <div className="articles-grid">
          {rest.map((article, i) => (
            <Link
              to={`/article/${article.slug}`}
              className="article-card"
              key={article.id}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="article-card__img-wrap">
                <img src={article.coverImage} alt={article.title} />
              </div>
              <div className="article-card__body">
                <span className="article-card__category">{article.category}</span>
                <h3 className="article-card__title">{article.title}</h3>
                <p className="article-card__excerpt">{article.excerpt}</p>
                <div className="article-card__meta">
                  <span>{article.date}</span>
                  <span className="article-card__arrow">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}