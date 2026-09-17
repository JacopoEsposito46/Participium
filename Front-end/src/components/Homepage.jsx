import "./styles/Homepage.css";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useNavigate, Link } from "react-router";
import { MapPin, FileText, CheckCircle, Users, ArrowDown } from "lucide-react";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";

function Homepage() {
  const navigate = useNavigate();
  const { citizenLoggedIn } = useContext(UserContext);
  // State to track if button should be shown based on scroll position
  const [showScrollButton, setShowScrollButton] = useState(true);
  // State to control actual DOM rendering (delayed for animation)
  const [isVisible, setIsVisible] = useState(true);

  // Effect to handle scroll events and determine button visibility
  useEffect(() => {
    const handleScroll = () => {
      // Get current scroll position
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      // Get total scrollable height
      const scrollHeight = document.documentElement.scrollHeight;
      // Get viewport height
      const clientHeight = document.documentElement.clientHeight;

      // Hide button if user is within 100px of page bottom
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        setShowScrollButton(false);
      } else {
        setShowScrollButton(true);
      }
    };

    // Attach scroll listener
    window.addEventListener("scroll", handleScroll);
    // Check initial state on component mount
    handleScroll();

    // Cleanup: remove listener on unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Effect to handle fade-out animation before removing button from DOM
  useEffect(() => {
    if (showScrollButton) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showScrollButton]);

  // Smooth scroll to bottom of page when button is clicked
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const features = [
    {
      icon: <MapPin size={48} />,
      title: "Report Issues",
      description:
        "Identify and report urban problems directly on Turin's interactive map",
    },
    {
      icon: <FileText size={48} />,
      title: "Add Details",
      description:
        "Provide detailed descriptions and attach photos to document the issue",
    },
    {
      icon: <Users size={48} />,
      title: "Municipal Management",
      description: "Municipal staff manage and resolve reports efficiently",
    },
    {
      icon: <CheckCircle size={48} />,
      title: "Track Status",
      description: "Follow the progress of your reports until resolution",
    },
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="hero-content">
              <h1 className="hero-title">Participate in improving your city</h1>
              <p className="hero-subtitle">
                PARTICIPIUM is the platform that connects Turin citizens with
                the municipal administration to report and solve urban issues.
              </p>
            </Col>
            <Col lg={6} className="hero-image">
              <button
                className="image-placeholder clickable-map"
                onClick={() => navigate("/map")}
              >
                <img src="/image.png" alt="Turin Map" className="map-preview" />
                <div className="map-overlay">
                  <MapPin size={48} />
                  <span>Explore the Map</span>
                </div>
              </button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container>
          <h2 className="section-title">Key Features</h2>
          <Row className="g-4">
            {features.map((feature) => (
              <Col key={feature.title} md={6} lg={3} className="d-flex">
                <Card className="feature-card">
                  <Card.Body className="text-center">
                    <div className="feature-icon">{feature.icon}</div>
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className="feature-description">{feature.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Info Section */}
      <section className="info-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h2 className="info-title">Georeferenced Reports</h2>
              <p className="info-text">
                Every report is precisely positioned on Turin&apos;s map.
                Citizens can report issues such as potholes, defective lighting,
                abandoned waste, and much more.
              </p>
              <p className="info-text">
                Reports include detailed descriptions, photos, and are
                categorized by type, allowing municipal staff to manage them
                efficiently and prioritize them.
              </p>
            </Col>
            <Col lg={6}>
              <div className="info-highlights">
                <div className="highlight-item">
                  <CheckCircle className="highlight-icon" />
                  <span>Precise geolocation</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle className="highlight-icon" />
                  <span>Photo attachments</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle className="highlight-icon" />
                  <span>Report categorization</span>
                </div>
                <div className="highlight-item">
                  <CheckCircle className="highlight-icon" />
                  <span>Status tracking</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container className="text-center">
          <h2 className="cta-title">Ready to make a difference?</h2>
          <p className="cta-text">
            Join the community of active citizens contributing to Turin&apos;s
            improvement
          </p>
          <Button
            className="cta-button-large"
            onClick={() => navigate(citizenLoggedIn ? "/map" : "/register")}
          >
            {citizenLoggedIn ? "Go to the Map" : "Sign Up for Free"}
          </Button>

          {/* Legal Links */}
          <div className="homepage-legal-links">
            <Link to="/privacy" className="legal-link">
              Privacy Policy
            </Link>
            <span className="legal-separator">•</span>
            <Link to="/terms" className="legal-link">
              Terms of Service
            </Link>
          </div>
        </Container>
      </section>

      {/* Floating Scroll Button */}
      {isVisible && (
        <button
          className={`floating-scroll-btn ${showScrollButton ? "" : "hide"}`}
          onClick={scrollToBottom}
        >
          <ArrowDown size={24} />
        </button>
      )}
    </div>
  );
}

export default Homepage;
