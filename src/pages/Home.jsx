import Hero from '../components/sections/Hero'
import Featured from '../components/sections/Featured'
import ArticlesGrid from '../components/sections/ArticlesGrid'
import QuoteStrip from '../components/sections/QuoteStrip'
import './Home.css'

export default function Home() {
  return (
    <main className="home">
      <Hero />
      <Featured />
      <ArticlesGrid />
      <QuoteStrip />
    </main>
  )
}