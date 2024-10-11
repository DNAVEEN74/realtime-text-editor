import { useEffect } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { loginState } from "../atoms and hooks/formAtom";

export default function useTokenCheck() {
  const setLogin = useSetRecoilState(loginState);

  useEffect(() => {
    const retriveToken = localStorage.getItem("token");

    if (!retriveToken) {
        console.error("No token found in localStorage");
        setLogin(false);
        return;
      }

    const askNewTokenForLogin = async () => {
      try {
        const response = await axios.post('https://collabedit-backend.onrender.com/verify-token',{token: retriveToken});
        const data = response.data;

        if (data.message === 'Invalid or expired token'|| data.message === 'Token is expired') {
          setLogin(false);
          console.log('Token is expired')
        } else if (data.message === 'token is verified') {
          setLogin(true);
        } else {
          const token = data.token;
          localStorage.setItem('token', token);
          setLogin(true);
        }

      } catch (error) {
        console.error("Error verifying token", error);
        setLogin(false);
      }
    };

    askNewTokenForLogin();

    return () => {
      console.log('verify token is un mounted')
    }
  }, [setLogin]);
}
