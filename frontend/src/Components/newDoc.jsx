import { useRecoilValue, useSetRecoilState } from "recoil";
import useFormHandlers from "../atoms and hooks/formHandler";
import "../styles/newDoc.css"
import { documentTitleSate, loginState } from "../atoms and hooks/formAtom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function NewDocumentOpener (){
    const { inputValue, error, handleInputChange, handleSubmit } = useFormHandlers();
    const setDocumentTitle = useSetRecoilState(documentTitleSate);
    const login = useRecoilValue(loginState);
    const navigate = useNavigate();

    useEffect(() => {
        if(login === false){
            navigate('login');
        }
    },[])

    return (
        <div className="hidden-container" >
            <input type="text"
            placeholder="Document name"
            onChange={handleInputChange}
            className="form-input"
            value={inputValue}
            style={{
                marginBottom:"4px"
                }}/>
                {error && <p className="input-error">{error}</p>}
        <button className="form-button" onClick={() => {
            setDocumentTitle(inputValue)
            handleSubmit();
        }} >Create new document</button>
            
        </div>
    )
}