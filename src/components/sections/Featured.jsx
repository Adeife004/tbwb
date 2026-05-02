import { Link } from 'react-router-dom'

export default function Featured({ articles, loading }) {
  if (loading) return (
    <section className="featured">
      <div className="featured__inner">
        <div className="section-label">Featured</div>
        <div className="featured__skeleton" />
      </div>
    </section>
  )

  if (!articles.length) return null
  const featured = articles[0]

  return (
    <section className="featured">
      <div className="featured__inner">
        <div className="section-label">Featured</div>
        <Link to={`/article/${featured.slug}`} className="featured__card">
          <div className="featured__img-wrap">
            <img src={featured.cover_image} alt={featured.title} />
            <div className="featured__overlay" />
          </div>
          <div className="featured__body">
            <span className="featured__category">{featured.category}</span>
            <h2 className="featured__title">{featured.title}</h2>
            <p className="featured__subtitle">{featured.subtitle}</p>
            <div className="featured__meta">
              <span>{featured.date}</span>
              <span className="featured__read-more">Read Essay →</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  )
}