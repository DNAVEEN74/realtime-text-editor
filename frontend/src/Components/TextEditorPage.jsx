import { useRef, useState } from 'react'
import '../styles/TextEditorPage.css'
import '../styles/Sidebar.css'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';

export default function TextEditor () {
    const quillRef = useRef(null)
    const [content, setContent] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const modules = {
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ 'list': 'ordered' }, { 'list': 'bullet' },
          { 'indent': '-1' }, { 'indent': '+1' }],
          ['link', 'image'],
          ['clean']
        ],
        clipboard: {
          matchVisual: false,
        },
        history: {
          delay: 1000,
          maxStack: 100,
        },
      };

      const handleChange = (content, delta, source, editor)=>{
        if(source === 'user'){
            ws.send(JSON.stringify(delta));
        }
      };

    const handleUndo = () => {
        const editor = quillRef.current.getEditor();
        editor.history.undo();
    };

    const handleRedo = () => {
        const editor = quillRef.current.getEditor();
        editor.history.redo();
    }; 

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };    

    return (
        <div className="mainPage">
            <div className="Nav">
                <div className="hamburger-menu" onClick={toggleSidebar}>
                    <div className="hamburger-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div className="nav-button">
                    <div className="share-button">
                        share
                    </div>
                    <div className="Download-button">
                        download
                    </div>
                </div>
            </div>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-content">
                    <h2>Menu</h2>
                    <ul>
                        <li>Option 1</li>
                        <li>Option 2</li>
                        <li>Option 3</li>
                    </ul>
                </div>
            </div>
            <ReactQuill
            ref={quillRef}
            theme='snow'
            formats={['header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'video']}
            modules={modules}
            value={content}
            onChange={handleChange}
            />
            <div className="footer-container">
                <div className="bottom-right-container">
                    <div className="undo-redo">
                        <button className='undo-button' onClick={handleUndo} >↺</button>
                        <button className='redo-button'  onClick={handleRedo} >↻</button>
                    </div>
                </div>
            </div>
        </div>
    )
}