import { useState } from "react"
import "../styles/loginpage.css"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { errorState, signUpState } from "../atoms and hooks/formAtom";
import useLoginHandler from "../atoms and hooks/loginHandle";

export default function LoginPage(){
    const signUp = useRecoilValue(signUpState);

    return(
        <>
        {signUp ? <SignupForm /> : <LoginForm /> }
        </>
    )
}

function LoginForm () {
    const setSignUpState = useSetRecoilState(signUpState);
    const { handleInputChange, handlePasswordChange, handleButtonClick } = useLoginHandler();
    const error = useRecoilValue(errorState);

    return(
        <div className="body">
            <div className="login-container">
                <h1 className="title">Welcome back</h1>
                <p className="description">Please enter your details to login</p>
                
                <form action="" className="form-container">
                    <label htmlFor="" className="label">Email 
                   
                    </label>
                    <input
                    type="text" 
                    className="input-one" 
                    placeholder="hello@gmail.com" 
                    required 
                    onChange={(e) => {
                        handleInputChange(e, 'email')
                    }} />
                    <label htmlFor="" className="label">Password</label>
                    <input 
                    type="password" 
                    className="input-one" 
                    placeholder="password" 
                    required 
                    onChange={handlePasswordChange}/>
                    <label htmlFor="" ><a href="#" className="forgot-label" >Forgot password?</a></label>
                    {error && <p className="error-message" >{error}</p> }
                    <button 
                    type="submit" 
                    className="submit-button" onClick={handleButtonClick}>login</button>
                    <p className="bottom-text" >Don't have an account? <a href="#" onClick={() => { setSignUpState(true) }} style={{color:'blue'}} >Signup</a></p>
                </form>
            </div>
        </div>
    )
}


function SignupForm (){
    const [isChecked, setIsChecked] = useState(false);
    const { handleInputChange, handlePasswordChange, handleButtonClick } = useLoginHandler();
    const error = useRecoilValue(errorState);

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    }

    return(
        <div className="body">
            <div className="login-container">
                <h1 className="title" style={{marginBottom:"50px"}} >Create an account</h1>
                
                <form action="" className="form-container">
                    <label htmlFor="" className="label">Full name </label>
                    <input 
                    type="text" 
                    className="input-one" 
                    placeholder="Your full name"
                    required
                    onChange={(e) => {
                        handleInputChange(e, 'fullName')
                    }} />
                    <label htmlFor="" className="label">Email </label>
                    <input 
                    type="text" 
                    className="input-one" 
                    placeholder="hello@gmail.com" 
                    required 
                    onChange={(e) => {
                        handleInputChange(e, 'email')
                    }} />
                    <label htmlFor="" className="label">Password</label>
                    <input 
                    type="password" 
                    className="input-one" 
                    placeholder="password" 
                    required 
                    onChange={handlePasswordChange} />
                    {error && <p className="error-message" >{error}</p> }
                    <label className="label" >
                        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />I accept <a href="#" style={{color:"black"}} >Terms and Conditions</a>
                    </label>
                    <button type="submit" className="submit-button" onClick={handleButtonClick} >Create an account</button>
                </form>
            </div>
        </div>
    )
}