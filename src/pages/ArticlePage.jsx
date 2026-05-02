import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useState, useEffect } from 'react'
import { getArticles, getArticleBySlug } from '../data/articles'
import Comments from '../components/Comments'
import { supabase } from '../lib/supabase'
import './ArticlePage.css'

function readingTime(text) {
  return Math.ceil(text.trim().split(/\s+/).length / 200)
}

function shareOnX(title, url) {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    '_blank'
  )
}

function copyLink(url, setCopied) {
  navigator.clipboard.writeText(url)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}

export default function ArticlePage() {
  const { slug } = useParams()
  const [article, setArticle]     = useState(null)
  const [allArticles, setAll]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [copied, setCopied]       = useState(false)
  const [scrollPct, setScrollPct] = useState(0)
  const [related, setRelated] = useState([])

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    Promise.all([
      getArticleBySlug(slug),
      getArticles()
    ]).then(([art, all]) => {
      setArticle(art)
      setAll(all)
      setLoading(false)
    })
  }, [slug])

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setScrollPct(total > 0 ? (el.scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!slug) return
    supabase.rpc('increment_views', { article_slug: slug })
  }, [slug])

  useEffect(() => {
  if (!article || !allArticles.length) return
  const rel = allArticles
    .filter(a => a.slug !== slug && a.category === article.category)
    .slice(0, 3)
  setRelated(rel)
}, [article, allArticles, slug])

  if (loading) return (
    <div className="article-loading">
      <div className="article-loading__bar" />
    </div>
  )

  if (!article) return (
    <div className="article-not-found">
      <h2>Article not found</h2>
      <Link to="/articles">← Back to Articles</Link>
    </div>
  )

  const currentIndex = allArticles.findIndex(a => a.slug === slug)
  const prev = allArticles[currentIndex + 1]
  const next = allArticles[currentIndex - 1]
  const pageUrl = window.location.href
  const mins = readingTime(article.body)

  return (
    <div className="article-page">
      <Helmet>
      <title>{article.title} — TBWB</title>
      <meta name="description" content={article.subtitle || article.excerpt} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={article.title} />
      <meta property="og:description" content={article.subtitle || article.excerpt} />
      <meta property="og:image" content={article.cover_image} />
      <meta property="og:url" content={pageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={article.title} />
      <meta name="twitter:description" content={article.subtitle || article.excerpt} />
      <meta name="twitter:image" content={article.cover_image} />
    </Helmet>

      <div className="progress-bar" style={{ width: `${scrollPct}%` }} />

      {/* Hero */}
      <div className="article-hero">
        <img src={article.cover_image} alt={article.title} className="article-hero__img" />
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
            <span className="article-meta__dot">·</span>
            <span>{article.views ?? 0} views</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="article-body-wrap">
        <div className="article-body">
          {article.body.split('\n\n').map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          {/* Author */}
{(article.author_name || article.author_avatar) && (
  <div className="article-author">
    {article.author_avatar && (
      <img src={article.author_avatar} alt={article.author_name} className="article-author__avatar" />
    )}
    <div className="article-author__info">
      <span className="article-author__label">Written by</span>
      <span className="article-author__name">{article.author_name || 'The Boy Without Blueprint'}</span>
    </div>
  </div>
)}
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

        {/* Related Articles */}
{related.length > 0 && (
  <div className="related">
    <div className="related__label">
      <span>More in {article.category}</span>
    </div>
    <div className="related__grid">
      {related.map(r => (
        <Link to={`/article/${r.slug}`} key={r.slug} className="related__card">
          <div className="related__img-wrap">
            <img src={r.cover_image} alt={r.title} />
          </div>
          <div className="related__body">
            <span className="related__category">{r.category}</span>
            <h3 className="related__title">{r.title}</h3>
            <p className="related__excerpt">{r.excerpt}</p>
            <span className="related__read">Read →</span>
          </div>
        </Link>
      ))}
    </div>
  </div>
)}

        <Comments articleSlug={slug} />
      </div>
    </div>
  )
}