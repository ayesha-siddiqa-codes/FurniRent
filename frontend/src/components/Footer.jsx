import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">

      <div className="footer-content">

        <h2>FurniRent</h2>

        <p>
          Beautiful furniture. Flexible living.
        </p>

        <nav className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/furniture">Furniture</Link>
          <a href="/#how-it-works">How It Works</a>
        </nav>

        <p className="footer-copyright">
          © 2026 FurniRent. All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;