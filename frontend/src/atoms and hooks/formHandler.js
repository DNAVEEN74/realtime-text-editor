import { useRecoilState } from "recoil";
import { errorState, inputValueState } from "./formAtom";
import { useNavigate } from "react-router-dom";


export default function useFormHandlers (){
    const [inputValue, setInputValue] = useRecoilState(inputValueState);
    const [error, setError] = useRecoilState(errorState);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        setError('');
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
    
        if (!inputValue) {
          setError("Input is required");
        } else {
          navigate('TextEditor');
        }
      };

    return {
        inputValue,
        error,
        handleInputChange,
        handleSubmit
    };
}