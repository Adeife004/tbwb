import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <div className="notfound">
      <div className="notfound__inner animate-fadeUp delay-1">
        <span className="notfound__code">404</span>
        <h1 className="notfound__title">
          No blueprint<br /><em>for this page.</em>
        </h1>
        <p className="notfound__desc">
          The page you're looking for doesn't exist —
          or maybe it never did.
        </p>
        <Link to="/" className="notfound__btn">
          Go back home →
        </Link>
      </div>
      <div className="notfound__bg">404</div>
    </div>
  )
}