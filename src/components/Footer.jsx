import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpeg'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer__inner">

        {/* Top */}
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <img src={logo} alt="TBWB" />
              <span>TBWB</span>
            </Link>
            <p className="footer__tagline">
              Honest writing from someone<br />still figuring it out.
            </p>
          </div>

          <div className="footer__links">
            <span className="footer__links-label">Navigate</span>
            <Link to="/">Home</Link>
            <Link to="/articles">Articles</Link>
            <Link to="/about">About</Link>
          </div>

          <div className="footer__contact">
            <span className="footer__links-label">Say something</span>
            <a href="mailto:hello@tbwb.com">hello@tbwb.com</a>
            
             <a href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
            >
              Twitter / X
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="footer__divider" />

        {/* Bottom */}
        <div className="footer__bottom">
          <p>© {year} The Boy Without Blueprint. All rights reserved.</p>
          <p className="footer__credit">
            No blueprint. No apologies.
          </p>
        </div>

      </div>

      {/* Big background text */}
      <div className="footer__bg-text">TBWB</div>
    </footer>
  )
}