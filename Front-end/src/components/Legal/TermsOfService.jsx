import { Container } from "react-bootstrap";
import { Link } from "react-router";
import "../styles/LegalPage.css";

function TermsOfService() {
  return (
    <div className="legal-page-wrapper">
      <Container className="legal-page-container">
        <div className="legal-page-header">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: December 28, 2025</p>
        </div>

        <div className="legal-page-content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              Welcome to Participium. By accessing or using our service, you
              agree to be bound by these Terms of Service. If you do not agree,
              you may not use the service.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              Participium is a civic engagement platform that allows citizens
              to:
            </p>
            <ul>
              <li>Report issues in their community</li>
              <li>Submit photos and location information</li>
              <li>Track the status of their reports</li>
              <li>Communicate with local authorities</li>
            </ul>
          </section>

          <section>
            <h2>3. User Eligibility</h2>
            <h3>3.1 Age Requirement</h3>
            <p>
              You must be <strong>at least 16 years old</strong> to use
              Participium (GDPR minimum age for Italy).
            </p>

            <h3>3.2 Account Registration</h3>
            <p>To use Participium, you must:</p>
            <ul>
              <li>Provide accurate, current, and complete information</li>
              <li>Verify your email address</li>
              <li>Use a valid, permanent email address</li>
              <li>Maintain the security of your account credentials</li>
            </ul>
          </section>

          <section>
            <h2>4. Acceptable Use</h2>
            <h3>4.1 Permitted Use</h3>
            <p>You may use Participium to:</p>
            <ul>
              <li>Report legitimate civic issues</li>
              <li>Upload relevant photos</li>
              <li>Track and manage your reports</li>
            </ul>

            <h3>4.2 Prohibited Conduct</h3>
            <p>You may NOT:</p>
            <ul>
              <li>Submit false, misleading, or malicious reports</li>
              <li>Harass, abuse, or threaten others</li>
              <li>Upload inappropriate or illegal content</li>
              <li>Use automated tools (bots) to create accounts</li>
              <li>Spam or abuse the reporting system</li>
              <li>Share explicit, violent, or discriminatory content</li>
            </ul>
          </section>

          <section>
            <h2>5. User Content</h2>
            <p>
              You retain ownership of content you submit. However, by submitting
              content, you grant Participium a license to display and share your
              content with local authorities for addressing reported issues.
            </p>
            <p>
              <strong>Important:</strong> Reports are visible to local
              authorities and are not confidential.
            </p>
          </section>

          <section>
            <h2>6. Email Verification</h2>
            <p>
              You must verify your email address to use Participium. We send a
              6-digit verification code that expires in 30 minutes.
            </p>
            <p>
              Temporary or disposable email addresses are not permitted. Use a
              permanent, valid email address.
            </p>
          </section>

          <section>
            <h2>7. Privacy and Data Protection</h2>
            <p>
              Your use of Participium is governed by our{" "}
              <Link to="/privacy">Privacy Policy</Link>, which complies with
              GDPR. We collect minimal necessary data and protect it securely.
            </p>
          </section>

          <section>
            <h2>8. Account Termination</h2>
            <p>
              You may close your account at any time. We may suspend or
              terminate your account if you violate these Terms.
            </p>
          </section>

          <section>
            <h2>9. Disclaimers</h2>
            <p>
              Participium is provided &quot;AS IS&quot; without warranties. We
              do not guarantee that reported issues will be resolved or that
              specific actions will be taken.
            </p>
          </section>

          <section>
            <h2>10. Governing Law</h2>
            <p>
              These Terms are governed by <strong>Italian law</strong>. Any
              disputes shall be resolved in Italian courts.
            </p>
            <p>
              As an EU consumer, you have rights under Consumer Rights Directive
              (2011/83/EU) and Italian Consumer Code.
            </p>
          </section>

          <section>
            <h2>11. Contact Information</h2>
            <p>
              For questions about these Terms:
              <br />
              <strong>Email:</strong> yusaerguven@gmail.com
            </p>
          </section>

          <section>
            <h2>12. Acknowledgment</h2>
            <p>
              By registering or using Participium, you acknowledge that you have
              read and understood these Terms and our Privacy Policy.
            </p>
          </section>
        </div>

        <div className="legal-page-footer">
          <p>
            <Link to="/privacy">View Privacy Policy</Link>
          </p>
          <p>
            <Link to="/">Back to Home</Link>
          </p>
        </div>
      </Container>
    </div>
  );
}

export default TermsOfService;
