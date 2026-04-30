import { useParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { articles } from '../data/articles'
import Comments from '../components/Comments'
import './ArticlePage.css'

function readingTime(text) {
  const words = text.trim().split(/\s+/).length
  return Math.ceil(words / 200)
}

function shareOnX(title, url) {
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank')
}

function copyLink(url, setCopied) {
  navigator.clipboard.writeText(url)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}

export default function ArticlePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)

  const article = articles.find(a => a.slug === slug)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setScrollPct(total > 0 ? (scrolled / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!article) return (
    <div className="article-not-found">
      <h2>Article not found</h2>
      <Link to="/articles">← Back to Articles</Link>
    </div>
  )

  const currentIndex = articles.findIndex(a => a.slug === slug)
  const prev = articles[currentIndex - 1]
  const next = articles[currentIndex + 1]
  const pageUrl = window.location.href
  const mins = readingTime(article.body)

  return (
    <div className="article-page">

      {/* Reading progress bar */}
      <div className="progress-bar" style={{ width: `${scrollPct}%` }} />

      {/* Hero */}
      <div className="article-hero">
        <img src={article.coverImage} alt={article.title} className="article-hero__img" />
        <div className="article-hero__overlay" />
        <div className="article-hero__content animate-fadeUp delay-1">
          <Link to="/articles" className="article-back">← All Articles</Link>
          <span className="article-category">{article.category}</span>
          <h1 className="article-title">{article.title}</h1>
          <p className="article-subtitle">{article.subtitle}</p>
          <div className="article-meta">
            <span>{article.date}</span>
            <span className="article-meta__dot">·</span>
            <span>{mins} min read</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="article-body-wrap">
        <div className="article-body">
          {article.body.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        {/* Share */}
        <div className="article-share">
          <span className="article-share__label">Share this</span>
          <button
            className="article-share__btn article-share__btn--x"
            onClick={() => shareOnX(article.title, pageUrl)}
          >
            Post on X
          </button>
          <button
            className={`article-share__btn article-share__btn--copy ${copied ? 'copied' : ''}`}
            onClick={() => copyLink(pageUrl, setCopied)}
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* Prev / Next */}
        <div className="article-nav">
          {prev ? (
            <Link to={`/article/${prev.slug}`} className="article-nav__item article-nav__item--prev">
              <span className="article-nav__dir">← Previous</span>
              <span className="article-nav__title">{prev.title}</span>
            </Link>
          ) : <div />}
          {next && (
            <Link to={`/article/${next.slug}`} className="article-nav__item article-nav__item--next">
              <span className="article-nav__dir">Next →</span>
              <span className="article-nav__title">{next.title}</span>
            </Link>
          )}
        </div>

        {/* Comments */}
        <Comments articleSlug={slug} />

      </div>
    </div>
  )
}