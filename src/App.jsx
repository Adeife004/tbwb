import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Cursor from './components/Cursor'
import Home from './pages/Home'
import Articles from './pages/Articles'
import ArticlePage from './pages/ArticlePage'
import About from './pages/About'
import './components/Navbar.css'

function App() {
  return (
    <BrowserRouter>
      <Cursor />
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/articles"      element={<Articles />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/about"         element={<About />} />
        <Route path="/write"         element={<div style={{paddingTop:'80px',textAlign:'center'}}>Editor coming soon...</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App