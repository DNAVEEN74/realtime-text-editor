import { useEffect, useRef, useState } from "react";
import "../styles/TextEditorPage.css";
import "../styles/Sidebar.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { documentIdState, generatedIdState, loginState } from "../atoms and hooks/formAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { saveAs } from 'file-saver';
import { Save, Download, Users } from "lucide-react";
import usePrevProjects from "../atoms and hooks/prevProjectsHook";
import { useNavigate } from "react-router-dom";
import useCheckSessionExpiry from "../atoms and hooks/checkSessionExpiry";

export default function TextEditor() {
    const quillRef = useRef(null);
    const [content, setContent] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [socket, setSocket] = useState(null);
    const [collaborate, setCollaborate] = useState(false);
    const [generatedId, setGeneratedId] = useRecoilState(generatedIdState);
    const login = useRecoilValue(loginState);
    const [documentId, setDocumentId] = useRecoilState(documentIdState);
    const [copied, setCopied] = useState(false);
    const [documentsList, setDocumentsList] = useState([]);
    const { fetchProjects } = usePrevProjects();
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(true);
     
    useCheckSessionExpiry()

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


    useEffect(() => {
        const fetchDocumentsTitles = async () => {
            const titles = await fetchProjects();
            setDocumentsList(titles);
        }

        fetchDocumentsTitles();
        
    },[]);

    useEffect(() => {
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

            if (data.type === "initialContent") {
                if (quill.getContents().ops.length || !content.trim()) {
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
                newSocket.close();
                setSocket(null);
        };
    }, [documentId]);

    const handleChange = (content, delta, source, editor) => {
        if ( source === "user" && socket && socket.readyState === WebSocket.OPEN ) {
            socket.send(JSON.stringify(delta));
        }
        setContent(content);
        setIsSaved(false);
    };

    const handleUndo = () => {
        const editor = quillRef.current.getEditor();
        editor.history.undo();
    };

    const handleRedo = () => {
        const editor = quillRef.current.getEditor();
        editor.history.redo();
    };

    useEffect(() => {
        const fetchSessionId = async () => {
            const response = await axios.post(
                `http://localhost:3000/generate-sessionId?type=CreateSession`,
                {
                    docId: documentId,
                }
            );
            const data = await response.data;
            setGeneratedId(data.sessionId);
        }

        fetchSessionId();
    },[documentId]);

    const handleCollaborate = async () => {
        if (generatedId) {
            setCollaborate(true);
            return;
        }

        setCollaborate(true);
    };

    const handleSave = async () => {

         const response = await axios.put('http://localhost:3000/saveContent',{
            docId: documentId,
            newContent: content
        });
        console.log(response.data);
        setIsSaved(true);
    }

    const handleDownload = async () => {
        try {
            const response = await axios.post('http://localhost:3000/download-pdf', {
                docId: documentId,
                content: content
            }, {
                responseType: 'blob',
            });

            const data = response.data;

            if(data.error === 'Document is not Saved or Something went wrong'){
                alert('Document is not Saved or Something went wrong')
            }else if (data.error === 'Document not found'){
                alert('Document not found');
            }
    
            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
    
            const contentDisposition = response.headers['content-disposition'];
            const title = contentDisposition
                ? contentDisposition.split('filename=')[1].replace(/"/g, '')
                : 'document.pdf';
    
            saveAs(pdfBlob, title);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };
    
    const handleProjectSelect = async (selectedDocument) => {
        if(!isSaved){
             const confirmSwitch = window.confirm("You have unsaved changes. Do you want to save before switching?");
            if (confirmSwitch) {
                await handleSave();
            } else {
                return;
            }
        }

        const userId = localStorage.getItem('userId');

        const response = await axios.get(`http://localhost:3000/projectsHistory?type=retrieveDocumentId&docTitle=${selectedDocument}&userId=${userId}`);
        const data = await response.data;

        setDocumentId(data.documentId);
    };

    return (
        <div className="mainPage">
            <div className="Nav">
            <div className="hamburger-menu"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} >
                <div className="hamburger-icon">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
            <div className="nav-button">
                <button onClick={handleSave} className="Save-button">
                    <Save className="button-icon" /> Save
                </button>
                {login && (
                    <button
                        className="collaborate-button"
                        onClick={handleCollaborate}
                    >
                        <Users className="button-icon" /> Collaborate
                    </button>
                )}
                <button
                    className="Download-button"
                    onClick={handleDownload}
                >
                    <Download className="button-icon" /> Download
                </button>
            </div>
            {collaborate && (
                <div className="collab-container">
                    <h3 className="collab-header">
                        {generatedId || <p>Loading...</p>}
                    </h3>
                    <button
                        onClick={() => {
                            setCopied(true);
                            navigator.clipboard.writeText(generatedId);
                            setCollaborate(false);
                        }}
                        className="copy-button"
                    >
                        {copied ? <p>Copied</p> : <p>Copy</p>}
                    </button>
                </div>
            )}
            <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="sidebar-content">
                    <button onClick={() => navigate('/')} className="sideBar-HomeButton" >Home</button>
                    <h4 style={{fontFamily:"sans-serif", fontSize:'20px', margin:'20px', marginLeft:'4px'}}>Open</h4>
                    {login && <ul>
                        {documentsList.map((docTitle, index) => <li key={index} className="documents-list" onClick={() => handleProjectSelect(docTitle)} > {docTitle} </li>)}
                    </ul> }
                </div>
            </div>
        </div>
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
                value={content}
                onChange={handleChange}
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