import { useEffect, useState } from 'react'
import Hero from '../components/sections/Hero'
import Featured from '../components/sections/Featured'
import ArticlesGrid from '../components/sections/ArticlesGrid'
import QuoteStrip from '../components/sections/QuoteStrip'
import { getArticles } from '../data/articles'
import './Home.css'

export default function Home() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getArticles().then(data => {
      setArticles(data)
      setLoading(false)
    })
  }, [])

  return (
    <main className="home">
      <Hero />
      <Featured articles={articles} loading={loading} />
      <ArticlesGrid articles={articles} loading={loading} />
      <QuoteStrip />
    </main>
  )
}