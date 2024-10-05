import { useRecoilState, useRecoilValue } from "recoil";
import {
    documentIdState,
    errorState,
    generatedIdState,
    givenIdState,
    givenTitleSate,
    inputValueState,
} from "./formAtom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function useFormHandlers() {
    const [inputValue, setInputValue] = useRecoilState(inputValueState);
    const [error, setError] = useRecoilState(errorState);
    const [givenId, setGivenId] = useRecoilState(givenIdState);
    const [givenTitle, setGivenTitle] = useRecoilState(givenTitleSate);
    const [documentId, setDocumentId] = useRecoilState(documentIdState);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const handleInputChange = (e, type) => {
        setInputValue(e.target.value);
        if(type === 'inputId'){
            setGivenId(e.target.value)
        }else if(type === 'inputTitle'){
            setGivenTitle(e.target.value);
        }
        setError("");
    };

    const handleSubmit = (e, type) => {
        if (e) e.preventDefault();
    
        if (!inputValue) {
            setError("Input is required");
            return;
        }
    
        if (type === "CheckId") {
            const verifyGivenId = async (sessionId) => {
                try {
                    const response = await axios.post(
                        `http://localhost:3000/verify-sessionId`,
                        {
                            sessionId: sessionId,
                        }
                    );
                    console.log(response)
                    const data = await response.data;
                    console.log(data);
    
                    if (data.message === "sessionId verified") {
                        setDocumentId(data.docId);
                        navigate("TextEditor");
                    } else if (data.message === "Invalid sessionId or document not found") {
                        setError("Invalid sessionId or document not found");
                    }

                } catch (error) {
                    setError("Invalid sessionId or try again later");
                }
            };
    
            verifyGivenId(givenId);
        }
    
        if (type === "newDocTitle") {
            setGivenTitle(inputValue);
    
            const createNewDocument = async (title) => {
                try {
                    const response = await axios.post(
                        "http://localhost:3000/create-document",
                        {
                            title: title,
                        },
                        {
                            headers: {
                                Authorization: `${token}`,
                            }
                        }
                    );
    
                    const data = response.data;
    
                    if (data.message === "New document created") {
                        setDocumentId(data.docId);
                        navigate("TextEditor");
                    } else if (data.message === "Given document title already exists") {
                        setError("Given document title already exists");
                    }
                } catch (error) {
                    setError("Server error: Please check your connection or try again later");
                    console.log(error);
                }
            };
    
            createNewDocument(inputValue);
        }
    };        

    return {
        inputValue,
        error,
        handleInputChange,
        handleSubmit,
    };
}