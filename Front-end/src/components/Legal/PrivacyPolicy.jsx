import { Container } from "react-bootstrap";
import { Link } from "react-router";
import "../styles/LegalPage.css";

function PrivacyPolicy() {
  return (
    <div className="legal-page-wrapper">
      <Container className="legal-page-container">
        <div className="legal-page-header">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: December 28, 2025</p>
        </div>

        <div className="legal-page-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to Participium. We respect your privacy and are committed
              to protecting your personal data. This privacy policy explains how
              we collect, use, and protect your information in compliance with
              the General Data Protection Regulation (GDPR) and Italian data
              protection laws.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            <h3>2.1 Personal Information You Provide</h3>
            <p>When you register for Participium, we collect:</p>
            <ul>
              <li>
                <strong>Email address</strong> (required for account creation
                and verification)
              </li>
              <li>
                <strong>Username</strong> (your chosen display name)
              </li>
              <li>
                <strong>First and last name</strong> (for personalization)
              </li>
              <li>
                <strong>Password</strong> (encrypted and securely stored)
              </li>
            </ul>

            <h3>2.2 Information From Your Use of the Service</h3>
            <p>When you use Participium, we automatically collect:</p>
            <ul>
              <li>
                <strong>Report data</strong>: Title, description, photos, and
                location of reported issues
              </li>
              <li>
                <strong>Geographic location</strong>: GPS coordinates when you
                submit a report
              </li>
              <li>
                <strong>Login history</strong>: Date and time of your logins
              </li>
            </ul>
          </section>

          <section>
            <h2>3. Legal Basis for Processing (GDPR Article 6)</h2>
            <p>We process your personal data based on:</p>
            <ul>
              <li>
                <strong>Contract</strong>: Processing necessary to provide the
                service you requested
              </li>
              <li>
                <strong>Consent</strong>: For optional features like email
                notifications
              </li>
              <li>
                <strong>Legitimate Interest</strong>: For security and fraud
                prevention
              </li>
            </ul>
          </section>

          <section>
            <h2>4. How We Use Your Information</h2>
            <p>We use your data to:</p>
            <ul>
              <li>Create and manage your account</li>
              <li>Allow you to submit and track reports</li>
              <li>Send verification emails and notifications</li>
              <li>Improve the service and fix issues</li>
              <li>Prevent fraud, abuse, and unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2>5. Email Verification</h2>
            <p>
              When you register, we send a verification email to confirm your
              email address. This email contains a 6-digit code valid for 30
              minutes. We do this to verify you own the email address and
              prevent spam.
            </p>
          </section>

          <section>
            <h2>6. Data Sharing and Disclosure</h2>
            <p>
              <strong>We DO NOT sell your personal data.</strong>
            </p>
            <p>We share your data only in these limited circumstances:</p>
            <ul>
              <li>
                <strong>Service Providers</strong>: Email delivery (Resend),
                file storage
              </li>
              <li>
                <strong>Public Information</strong>: Reports you submit are
                visible to local authorities
              </li>
              <li>
                <strong>Legal Requirements</strong>: When required by law or
                court order
              </li>
            </ul>
          </section>

          <section>
            <h2>7. Your Rights Under GDPR</h2>
            <p>As an EU citizen, you have the following rights:</p>
            <ul>
              <li>
                <strong>Right of Access</strong>: Request a copy of your
                personal data
              </li>
              <li>
                <strong>Right to Rectification</strong>: Correct inaccurate data
              </li>
              <li>
                <strong>Right to Erasure</strong>: Request deletion of your
                account
              </li>
              <li>
                <strong>Right to Data Portability</strong>: Receive your data in
                a machine-readable format
              </li>
              <li>
                <strong>Right to Object</strong>: Object to processing based on
                legitimate interests
              </li>
            </ul>
          </section>

          <section>
            <h2>8. Data Security</h2>
            <p>We implement appropriate security measures:</p>
            <ul>
              <li>All data transmitted over HTTPS</li>
              <li>Passwords encrypted with bcrypt</li>
              <li>Access controls and rate limiting</li>
              <li>Email verification for account creation</li>
            </ul>
          </section>

          <section>
            <h2>9. Contact Information</h2>
            <p>
              For privacy questions or to exercise your rights, contact us at:
              <br />
              <strong>Email:</strong> yusaerguven@gmail.com
            </p>
            <p>
              <strong>Italian Data Protection Authority (Garante)</strong>:
              <br />
              Website:{" "}
              <a
                href="https://www.gpdp.it"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.gpdp.it
              </a>
            </p>
          </section>

          <section>
            <h2>10. Changes to This Policy</h2>
            <p>
              We may update this privacy policy occasionally. We will notify you
              via email of significant changes.
            </p>
          </section>
        </div>

        <div className="legal-page-footer">
          <p>
            <Link to="/terms">View Terms of Service</Link>
          </p>
          <p>
            <Link to="/">Back to Home</Link>
          </p>
        </div>
      </Container>
    </div>
  );
}

export default PrivacyPolicy;
