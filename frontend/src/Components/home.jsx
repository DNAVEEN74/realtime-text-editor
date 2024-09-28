import { Edit3, Users, Zap, MessageCircle } from "lucide-react";
import "../styles/home.css";
import { useState } from "react";
import NewDocumentOpener from "./newDoc";
import { useNavigate } from "react-router-dom";
import useFormHandlers from "../atoms and hooks/formHandler";
import { useRecoilValue } from "recoil";
import { loginState } from "../atoms and hooks/formAtom";

export default function HomePage() {
  const navigate = useNavigate();
  const [newDoc, setNewDoc] = useState(false);
  const login = useRecoilValue(loginState);
  const { inputValue, error, handleInputChange, handleSubmit } = useFormHandlers();

  const handleNewDocOpener = () => {
    setNewDoc(true);
  };

  return (
    <div className="main-container">
      <header className="header">
        <a href="/" className="header-logo">
          <Edit3 className="logo-icon" />
          <span className="logo-text">CollabEdit</span>
        </a>
        <nav className="header-nav">
          <a className="header-link" href="#">
            About
          </a>
          {!login && 
          <button className="login-button" onClick={()=> navigate('login')} >
          <a href="/login" style={{ color: "white", textDecoration: "none" }}>
            login
          </a>
        </button> }
        </nav>
      </header>
      <main className="main-content">
        <section className="section-one">
          <div className="container">
            <div className="section-one-content">
              <div className="title-container">
                <h1 className="main-title">Collaborate in Real-Time</h1>
                <p className="main-description">
                  Edit documents together, see changes instantly, and work
                  seamlessly with your team.
                </p>
              </div>
              {newDoc ? (
                <NewDocumentOpener />
              ) : (
                <div className="form-container">
                  <form className="form" onSubmit={handleSubmit} >
                    <input
                      className="form-input"
                      placeholder="Enter document ID"
                      type="text"
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                    <button type="submit" className="form-button" >
                      Join
                    </button>
                  </form>
                  {error && <p className="input-error">{error}</p>}
                  <p className="form-text">
                    Or{" "}
                    <a className="form-link" onClick={handleNewDocOpener}>
                      create a new document
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="section-two">
          <div className="container">
            <div className="section-two-content">
              <div className="title-container">
                <h2 className="section-title">
                  Features that Empower Collaboration
                </h2>
                <p className="section-description">
                  Our platform is designed to make teamwork seamless and
                  efficient.
                </p>
              </div>
            </div>
            <div className="feature-grid">
              {[
                {
                  icon: Zap,
                  title: "Real-Time Editing",
                  description:
                    "See changes as they happen, with instant updates across all connected devices.",
                },
                {
                  icon: Users,
                  title: "Multi-User Support",
                  description:
                    "Collaborate with unlimited team members on the same document simultaneously.",
                },
                {
                  icon: Edit3,
                  title: "Version History",
                  description:
                    "Track changes and revert to previous versions with our comprehensive history feature.",
                },
                {
                  icon: MessageCircle,
                  title: "Real-Time Chatting",
                  description:
                    "Communicate with your team in real-time while editing, enhancing collaboration and productivity.",
                },
              ].map((feature, index) => (
                <div key={index} className="feature-card">
                  <feature.icon className="feature-icon" />
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <p className="footer-text">© 2024 CollabEdit. All rights reserved.</p>
        <nav className="footer-nav">
          <a className="footer-link" href="#">
            Terms of Service
          </a>
          <a className="footer-link" href="#">
            Privacy
          </a>
        </nav>
      </footer>
    </div>
  );
}
