import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Cursor from './components/Cursor'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import Articles from './pages/Articles'
import ArticlePage from './pages/ArticlePage'
import About from './pages/About'
import Write from './pages/Write'
import NotFound from './pages/NotFound'
import './components/Navbar.css'
import './components/Footer.css'
import './components/ScrollToTop.css'

function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <ScrollToTop />
      <Navbar />
      <div className="page-wrapper">
  <Routes>
    <Route path="/"              element={<Home />} />
    <Route path="/articles"      element={<Articles />} />
    <Route path="/article/:slug" element={<ArticlePage />} />
    <Route path="/about"         element={<About />} />
    <Route path="/write"         element={<Write />} />
    <Route path="*"              element={<NotFound />} />
  </Routes>
</div>
    </BrowserRouter>
  )
}

export default App