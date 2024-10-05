import { useEffect, useRef, useState } from "react";
import "../styles/TextEditorPage.css";
import "../styles/Sidebar.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import {
    documentIdState,
    generatedIdState,
    loginState,
} from "../atoms and hooks/formAtom";
import { useRecoilState, useRecoilValue } from "recoil";

export default function TextEditor() {
    const quillRef = useRef(null);
    const [content, setContent] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [socket, setSocket] = useState(null);
    const [collaborate, setCollaborate] = useState(false);
    const [generatedId, setGeneratedId] = useRecoilState(generatedIdState);
    const login = useRecoilValue(loginState);
    const documentId = useRecoilValue(documentIdState);
    const [copied, setCopied] = useState(false);

    const modules = {
        toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [
                { list: "ordered" },
                { list: "bullet" },
                { indent: "-1" },
                { indent: "+1" },
            ],
            ["link", "image"],
            ["clean"],
        ],
        clipboard: {
            matchVisual: false,
        },
        history: {
            delay: 1000,
            maxStack: 100,
        },
    };

    // Initialize the WebSocket connection only once for the current documentId
    useEffect(() => {
        if (socket || !documentId) return; // Prevent multiple connections

        const newSocket = new WebSocket(
            `ws://localhost:3000?docId=${documentId}`
        );
        setSocket(newSocket);

        newSocket.onopen = () => {
            console.log("WebSocket connection established");
        };

        newSocket.onmessage = (message) => {
            const data = JSON.parse(message.data);
            const quill = quillRef.current.getEditor();

            // If initial content comes from the server, only set it if the current content is empty
            if (data.type === "initialContent") {
                if (!quill.getContents().ops.length || !content.trim()) {
                    setContent(data.content);
                }
            } else if (data.type === "delta") {
                quill.updateContents(data.delta);
            }
        };

        newSocket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            if (newSocket) {
                newSocket.close();
                setSocket(null);
            }
        };
    }, [documentId]); // The WebSocket only depends on documentId

    const handleChange = (content, delta, source, editor) => {
        if (
            source === "user" &&
            socket &&
            socket.readyState === WebSocket.OPEN
        ) {
            socket.send(JSON.stringify(delta));
            console.log(delta);
        }
        setContent(content);  // Always keep the latest content in state
    };

    // Undo and Redo Handlers
    const handleUndo = () => {
        const editor = quillRef.current.getEditor();
        editor.history.undo();
    };

    const handleRedo = () => {
        const editor = quillRef.current.getEditor();
        editor.history.redo();
    };

    // Collaborate button logic, don't reset content when collaborating
    const handleCollaborate = async () => {
        if (generatedId) {
            setCollaborate(true);
            return;
        }

        setCollaborate(true);

        try {
            const response = await axios.post(
                `http://localhost:3000/generate-sessionId`,
                {
                    docId: documentId,
                }
            );
            const data = await response.data;
            setGeneratedId(data.sessionId);
        } catch (error) {
            console.error("Error generating session ID:", error);
        }
    };

    const handleDownload = async () => {
        console.log("download");
    };

    return (
        <div className="mainPage">
            <div className="Nav">
                <div
                    className="hamburger-menu"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                    <div className="hamburger-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div className="nav-button">
                    {login && (
                        <button
                            className="collaborate-button"
                            onClick={handleCollaborate}
                        >
                            collaborate
                        </button>
                    )}
                    <button
                        className="Download-button"
                        onClick={handleDownload}
                    >
                        download
                    </button>
                </div>
            </div>
            <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="sidebar-content">
                    <h2>Menu</h2>
                    <ul>
                        <li>Option 1</li>
                        <li>Option 2</li>
                        <li>Option 3</li>
                    </ul>
                </div>
            </div>
            {collaborate && (
                <div className="collab-container">
                    <h3
                        style={{
                            backgroundColor: "#95B9C7",
                            marginTop: "0",
                            marginBottom: "0",
                            height: "40px",
                            paddingTop: "10px",
                            boxSizing: "border-box",
                        }}
                    >
                        {generatedId || <p>loading...</p>}
                    </h3>
                    <button
                        onClick={() => {
                            setCopied(true);
                            navigator.clipboard.writeText(generatedId);
                            setCollaborate(false);
                        }}
                        style={{
                            border: "none",
                            color: "white",
                            backgroundColor: "black",
                            margin: "0",
                            width: "100%",
                            height: "25px",
                        }}
                    >
                        {copied ? (
                            <p style={{ margin: "0", padding: "0" }}>copied</p>
                        ) : (
                            <p style={{ margin: "0", padding: "0" }}>copy</p>
                        )}
                    </button>
                </div>
            )}
            <ReactQuill
                ref={quillRef}
                theme="snow"
                formats={[
                    "header",
                    "font",
                    "size",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "indent",
                    "link",
                    "image",
                    "video",
                ]}
                modules={modules}
                value={content}  // Preserve current content
                onChange={handleChange}  // Update content on change
            />
            <div className="footer-container">
                <div className="bottom-right-container">
                    <div className="undo-redo">
                        <button className="undo-button" onClick={handleUndo}>
                            ↺
                        </button>
                        <button className="redo-button" onClick={handleRedo}>
                            ↻
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
