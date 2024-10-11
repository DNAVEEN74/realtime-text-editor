import { useRecoilValue } from "recoil";
import { documentIdState, loginState } from "./formAtom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

export default function useCheckSessionExpiry() {
    const documentId = useRecoilValue(documentIdState);
    const navigate = useNavigate();
    const login = useRecoilValue(loginState);

    useEffect(() => {
        if (login === true) return;
        
        const intervalId = setInterval(async () => {
            try {
                const response = await axios.post("https://collabedit-backend.onrender.com/generate-sessionId?type=checkSessionIdExpiry", {
                    docId: documentId
                });
                const data = response.data;
                console.log(data);

                if (data.shouldStop === true) {
                    clearInterval(intervalId);
                    navigate('/');
                }
            } catch (error) {
                console.error("Error while checking session ID expiry:", error);
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [documentId]);

    return {};
}
