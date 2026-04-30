import './About.css'
import logo from '../assets/logo.jpeg'

export default function About() {
  return (
    <main className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero__inner">
          <div className="about-hero__left animate-fadeUp delay-1">
            <span className="about-eyebrow">The Writer</span>
            <h1 className="about-title">
              A boy.<br />
              <em>No map.</em><br />
              Just words.
            </h1>
          </div>
          <div className="about-hero__right animate-scaleIn delay-3">
            <div className="about-img-wrap">
              <img src={logo} alt="The Boy Without Blueprint" />
              <div className="about-img-accent" />
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="about-story">
        <div className="about-story__inner">

          <div className="about-block animate-fadeUp delay-1">
            <span className="about-block__number">01</span>
            <div className="about-block__content">
              <h2 className="about-block__title">Who is TBWB?</h2>
              <p>
                The Boy Without Blueprint is a writer, a thinker, and someone
                who refused to pretend he had everything figured out. Born and
                raised in Nigeria, shaped by everything this country throws at
                you — the chaos, the beauty, the frustration, the resilience.
              </p>
              <p>
                This is not a polished personal brand. This is a person writing
                honestly about what he sees, what he feels, and what he thinks —
                even when it's uncomfortable.
              </p>
            </div>
          </div>

          <div className="about-divider" />

          <div className="about-block animate-fadeUp delay-2">
            <span className="about-block__number">02</span>
            <div className="about-block__content">
              <h2 className="about-block__title">Why this site?</h2>
              <p>
                Because Substack has a paywall. Because Twitter is noise.
                Because some thoughts deserve more than a thread.
              </p>
              <p>
                This site exists as a permanent home for long-form thinking —
                a place where essays breathe, where ideas get the space they
                need, and where readers can engage without an algorithm
                deciding who sees what.
              </p>
            </div>
          </div>

          <div className="about-divider" />

          <div className="about-block animate-fadeUp delay-3">
            <span className="about-block__number">03</span>
            <div className="about-block__content">
              <h2 className="about-block__title">What to expect</h2>
              <p>
                Essays on Nigeria, society, identity, youth, and the quiet
                wars people fight inside themselves. No fluff. No hot takes
                for engagement. Just honest, considered writing from someone
                paying close attention.
              </p>
              <p>
                If something he writes makes you think differently about
                something — even for a moment — that's enough.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Quote */}
      <section className="about-quote">
        <div className="about-quote__inner">
          <p className="about-quote__text">
            "I write because I don't have the answers.<br />
            <em>Not in spite of that — because of it.</em>"
          </p>
          <span className="about-quote__attr">— The Boy Without Blueprint</span>
        </div>
      </section>

      {/* Contact */}
      <section className="about-contact">
        <div className="about-contact__inner">
          <h3 className="about-contact__title">Say something.</h3>
          <p className="about-contact__desc">
            A thought, a pushback, a question. He reads everything.
          </p>
          
          <a  href="mailto:hello@tbwb.com"
            className="about-contact__btn"
          >
            hello@tbwb.com
          </a>
        </div>
      </section>

    </main>
  )
}