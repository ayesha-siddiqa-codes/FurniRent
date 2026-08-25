import { Link } from "react-router-dom";
import heroBg from "../images/hero-bg.jpg";
import Footer from "../components/Footer";
function Home() {
  return (
    <main className="home-page">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section
        className="hero"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        <div className="hero-content">

          <div className="home-label">
            ✦ YOUR SPACE. YOUR STYLE.
          </div>

          <h1>
            Beautiful furniture.
            <br />
            <em>Flexible living.</em>
          </h1>

          <p>
            Transform your space with stylish, comfortable furniture
            without the commitment of buying.
          </p>

          <p className="home-highlight">
            Rent what you love. Live the way you want.
          </p>

          <div className="home-buttons">

            <Link
              to="/furniture"
              className="btn btn-primary"
            >
              Explore Furniture →
            </Link>

            <a
              href="#how-it-works"
              className="btn btn-secondary"
            >
              How It Works
            </a>

          </div>

          <div className="home-stats">

            <div className="home-stat">
              <strong>5+</strong>
              <span>FURNITURE STYLES</span>
            </div>

            <div className="home-stat">
              <strong>24/7</strong>
              <span>EASY SUPPORT</span>
            </div>

            <div className="home-stat">
              <strong>100%</strong>
              <span>FLEXIBLE LIVING</span>
            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          WHY FURNIRENT
      ===================================================== */}

      <section className="why-furnirent">

        <div className="home-section-heading">

          <p className="home-section-label">
            WHY FURNIRENT
          </p>

          <h2>
            Furniture Without The Commitment
          </h2>

        </div>

        <div className="why-furnirent-grid">

          <article className="why-card">

            <span className="why-number">
              01
            </span>

            <h3>
              Flexible Rentals
            </h3>

            <p>
              Rent furniture for as long as you need it.
              No long-term commitment.
            </p>

          </article>


          <article className="why-card">

            <span className="why-number">
              02
            </span>

            <h3>
              Quality Furniture
            </h3>

            <p>
              Choose from stylish and comfortable furniture
              designed for modern homes.
            </p>

          </article>


          <article className="why-card">

            <span className="why-number">
              03
            </span>

            <h3>
              Simple & Convenient
            </h3>

            <p>
              Browse, choose and rent your furniture
              from the comfort of your home.
            </p>

          </article>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        id="how-it-works"
        className="how-it-works"
      >

        <div className="home-section-heading">

          <p className="home-section-label">
            HOW IT WORKS
          </p>

          <h2>
            Rent In Three Simple Steps
          </h2>

        </div>

        <div className="how-it-works-grid">

          <article className="how-card">

            <span className="how-number">
              01
            </span>

            <h3>
              Choose
            </h3>

            <p>
              Browse our collection and find furniture
              that fits your space.
            </p>

          </article>


          <article className="how-card">

            <span className="how-number">
              02
            </span>

            <h3>
              Rent
            </h3>

            <p>
              Select your rental dates and place
              your order.
            </p>

          </article>


          <article className="how-card">

            <span className="how-number">
              03
            </span>

            <h3>
              Enjoy
            </h3>

            <p>
              Enjoy your furniture and make your
              space feel like home.
            </p>

          </article>

        </div>

      </section>
        <Footer/>
    </main>
  );
}

export default Home;