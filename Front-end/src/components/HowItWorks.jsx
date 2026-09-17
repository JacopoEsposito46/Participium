import "./styles/HowItWorks.css";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import { MapPin, FileText, CheckCircle, MessageSquare } from "lucide-react";

function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: <MapPin size={64} />,
      number: "1",
      title: "Locate the Issue",
      description:
        "Use the interactive map to pinpoint the exact location of the urban problem you want to report",
    },
    {
      icon: <FileText size={64} />,
      number: "2",
      title: "Fill the Form",
      description:
        "Provide a detailed description of the issue, select the category, and attach photos if needed",
    },
    {
      icon: <MessageSquare size={64} />,
      number: "3",
      title: "Submit Report",
      description:
        "Submit your report and it will be sent to the municipal administration for review",
    },
    {
      icon: <CheckCircle size={64} />,
      number: "4",
      title: "Track Progress",
      description:
        "Monitor the status of your report as it gets processed and resolved by the municipal staff",
    },
  ];

  return (
    <div className="how-it-works-page">
      <Container className="how-it-works-content">
        <div className="how-it-works-header">
          <h1 className="how-it-works-title">Welcome to PARTICIPIUM!</h1>
          <p className="how-it-works-subtitle">
            Here&apos;s how you can start making a difference in your city
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step) => (
            <div key={step.title} className="step-item">
              <div className="step-icon-wrapper">
                <div className="step-icon">{step.icon}</div>
                <div className="step-number-badge">{step.number}</div>
              </div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="how-it-works-footer">
          <Button className="start-button" onClick={() => navigate("/map")}>
            Start Reporting
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default HowItWorks;
