import { Link } from 'react-router-dom'
import logo from '../../assets/logo.jpeg'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg-text">TBWB</div>

      <div className="hero__content">
        <div className="hero__left animate-fadeUp delay-1">
          <span className="hero__eyebrow">Est. 2026 · Ogun, Nigeria</span>
          <h1 className="hero__title">
            The Boy<br />
            <em>Without</em><br />
            Blueprint
          </h1>
          <p className="hero__desc">
            Honest writing from someone still figuring it out.
            No map. No manual. Just the truth as it comes.
          </p>
          <div className="hero__actions">
            <Link to="/articles" className="btn btn--red">
              <span>Read Articles</span>
            </Link>
            <Link to="/about" className="btn btn--ghost">
              <span>About the Writer</span>
            </Link>
          </div>
        </div>

        <div className="hero__right animate-scaleIn delay-3">
          <div className="hero__img-wrap">
            <img src={logo} alt="The Boy Without Blueprint" />
            <div className="hero__img-accent" />
          </div>
        </div>
      </div>

      <div className="hero__scroll-hint animate-fadeIn delay-5">
        <span>Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}