import { Link } from "react-router";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer-custom text-center py-3 mt-4">
      <div className="footer-content">
        <span>© 2025 PARTICIPIUM. All rights reserved.</span>
        <div className="footer-links">
          <Link to="/privacy" className="footer-link">
            Privacy Policy
          </Link>
          <span className="footer-separator">|</span>
          <Link to="/terms" className="footer-link">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
