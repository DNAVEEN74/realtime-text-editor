import { Edit3, Users, Zap, MessageCircle, ChevronDown, ChevronUp, User } from "lucide-react";
import "../styles/home.css";
import { useState } from "react";
import NewDocumentOpener from "./newDoc";
import { useNavigate } from "react-router-dom";
import useFormHandlers from "../atoms and hooks/formHandler";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { documentIdState, givenIdState, loginState } from "../atoms and hooks/formAtom";
import useTokenCheck from "../atoms and hooks/VerifyTokenHandler";
import usePrevProjects from "../atoms and hooks/prevProjectsHook";
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [newDoc, setNewDoc] = useState(false);
  const login = useRecoilValue(loginState);
  const { inputValue, error, handleInputChange, handleSubmit } = useFormHandlers();
  const setGivenDocId = useSetRecoilState(givenIdState);
  const [showPrevProjects, setShowPrevProjects] = useState(false);
  const [ projectsList, setProjectsList ] = useState([]);
  const { fetchProjects } = usePrevProjects();
  const setDocumentId = useSetRecoilState(documentIdState);
  const [showLogOutCard, setShowLogOutCard] = useState(false);

  useTokenCheck();

  const handleProjectsHistory = async () => {
    if (!showPrevProjects) {
      const titles = await fetchProjects();
      setProjectsList(titles);
    }
    setShowPrevProjects((prev) => !prev);
  };

  const handleProjectSelect = async ( selectedProjectTitle ) => {
    const userId = localStorage.getItem('userId');

    const response = await axios.get(`http://localhost:3000/projectsHistory?type=retrieveDocumentId&docTitle=${selectedProjectTitle}&userId=${userId}`);
    const data = await response.data;

    setDocumentId(data.documentId);
    navigate('TextEditor');
  }

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  return (
    <div className="main-container">
      <header className="header">
        <a href="/" className="header-logo">
          <Edit3 className="logo-icon" />
          <span className="logo-text">CollabEdit</span>
        </a>
        <nav className="header-nav">
        {login && (
            <button onClick={handleProjectsHistory} className="Document-Button">
              Select a Document
              {showPrevProjects ? (
                <ChevronUp className="arrow-icon" />
              ) : (
                <ChevronDown className="arrow-icon" />
              )}
            </button>
          )}
          {login && <div className="profile-logo" onClick={() => setShowLogOutCard((prev) => !prev)}><User className="user-logo"/></div>}
          {!login && 
          <button className="login-button" onClick={()=> navigate('login')} >
          <a href="/login" style={{ color: "white", textDecoration: "none" }}>
            login
          </a>
        </button> }
        </nav>
      </header>
      {showPrevProjects && (
        <div className="dropdown-container appear-animation">
          {projectsList.map((projectTitle, index) => (
            <button key={index} className="dropdown-menu" onClick={() => handleProjectSelect(projectTitle)} >
              {projectTitle}
            </button>
          ))}
        </div>
      )}
      { showLogOutCard && (
        <div className="logOut-card">
          <button className="log-out" onClick={handleLogOut}>
            Logout
          </button>
        </div>
      )}
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
                  <form className="form" onSubmit={(e) => {
                    setGivenDocId(inputValue);
                    handleSubmit(e, 'CheckId');
                  }} >
                    <input
                      className="form-input"
                      placeholder="Enter document ID"
                      type="text"
                      value={inputValue}
                      onChange={(e) => {
                        handleInputChange(e, 'inputId')
                      }}
                    />
                    <button type="submit" className="form-button" >
                      Join
                    </button>
                  </form>
                  {error && <p className="input-error">{error}</p>}
                  <p className="form-text">
                    Or{" "}
                    <a className="form-link" onClick={() => setNewDoc(true)}>
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