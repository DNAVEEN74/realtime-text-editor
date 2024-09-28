import useFormHandlers from "../atoms and hooks/formHandler";
import "../styles/newDoc.css"

export default function NewDocumentOpener (){
    const { inputValue, error, handleInputChange, handleSubmit } = useFormHandlers();

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
            <button className="form-button" onClick={handleSubmit} >Create new document</button>
            
        </div>
    )
}