import { useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { errorState, loginState, signUpState, tokenState, userLoginState, UserSignUpState } from "./formAtom";
import { loginSchema, signUpSchema } from "../zod/loginSchema";
import { fetchDataSelector, fetchParamsState, userIdState } from "./registerAtom";
import { useNavigate } from "react-router-dom";

export default function useLoginHandler() {
    const [userLoginInfo, setUserLoginInfo] = useRecoilState(userLoginState);
    const [userSignUpInfo, setUserSignUpInfo] = useRecoilState(UserSignUpState);
    const setError = useSetRecoilState(errorState);
    const signUpValue = useRecoilValue(signUpState);
    const navigate = useNavigate();
    const setLoginState = useSetRecoilState(loginState);

    const handleInputChange = (e, actionType) => {
        const { value } = e.target;

        if (signUpValue === false && actionType === 'email') {
            setUserLoginInfo((prevUserLoginInfo) => ({
                ...prevUserLoginInfo,
                email: value
            }));
        }

        if (signUpValue === true) {
            if (actionType === 'fullName') {
                setUserSignUpInfo((prevUserSignUpInfo) => ({
                    ...prevUserSignUpInfo,
                    fullName: value
                }));
            } else if (actionType === 'email') {
                setUserSignUpInfo((prevUserSignUpInfo) => ({
                    ...prevUserSignUpInfo,
                    email: value
                }));
            }
        }
        setError('');
    };

    const handlePasswordChange = (e) => {
        const { value } = e.target;

        if (signUpValue === false) {
            setUserLoginInfo((prevUserInfo) => ({
                ...prevUserInfo,
                password: value
            }));
        } else if (signUpValue === true) {
            setUserSignUpInfo((prevUserSignUpInfo) => ({
                ...prevUserSignUpInfo,
                password: value
            }));
        }

        setError('');
    };

    const handleButtonClick = useRecoilCallback(({ snapshot, set }) => async (e) => {
        e.preventDefault();
        let result;

        if (signUpValue === false) {
            result = loginSchema.safeParse(userLoginInfo);
            if (!result.success) {
                return result.error.errors.forEach((err) => setError(err.message));
            }

            set(fetchParamsState, {
                route: 'auth/login',
                body: userLoginInfo,
            });
        } else {
            result = signUpSchema.safeParse(userSignUpInfo);
            if (!result.success) {
                return result.error.errors.forEach((err) => setError(err.message));
            }

            set(fetchParamsState, {
                route: 'auth/signup',
                body: userSignUpInfo,
            });
        }

        const fetchParams = await snapshot.getPromise(fetchParamsState);
        const response = await snapshot.getPromise(fetchDataSelector(fetchParams));

        if (response.token) {
            set(tokenState, response.token);
            set(userIdState, response.userId);
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            navigate('/');
            setLoginState(true);
        }
    });

    return {
        handleInputChange,
        handlePasswordChange,
        handleButtonClick,
    };
}