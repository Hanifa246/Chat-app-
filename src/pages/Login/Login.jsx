// Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../../assets/assets';
import './Login.css';
import { signup, login ,resetPass} from '../../config/firebase';

const Login = () => {
    const [currState, setCurrState] = useState("Sign Up");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const navigate = useNavigate();

    const onSubmitHandler = async (event) => {
        event.preventDefault();

        if(currState === "Sign Up") {
            try {
                await signup(userName, email, password);
                navigate("/profile"); // Navigate to profile after signup
            } catch (error) {
                console.error(error.message);
                alert(error.message);
            }
        } else {
            try {
                await login(email, password);
                navigate("/chat"); // Navigate to chat after login
            } catch (error) {
                console.error(error.message);
                alert(error.message);
            }
        }
    };

    return (
        <div className='login'>
            <img src={assets.logo_big} alt="Logo" className="logo" />
            <form onSubmit={onSubmitHandler} className="login-form">
                <h2>{currState}</h2>

                {currState === "Sign Up" &&
                    <input
                        type="text"
                        placeholder="Username"
                        className="form-input"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                }

                <input
                    type="email"
                    placeholder="Email Address"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button type='submit'>
                    {currState === "Sign Up" ? "Create account" : "Login now"}
                </button>

                <div className="login-term">
                    <input type='checkbox'/>
                    <p>Agree to the terms of use and privacy policy</p>
                </div>

                <div className="login-forgot">

                    {
                    currState === "Sign Up" ? (
                        <p className="login-toggle">
                            Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span>
                        </p>
                    ) : 
                        <p className="login-toggle">
                            Create an account? <span onClick={() => setCurrState("Sign Up")}>Click here</span>
                        </p>
                    }
                    {currState === 'login' ?
                        <p className="login-toggle">
                            Forgot Password? <span onClick={() => resetPass(email)}>reset here </span>
                        </p>:null }
                </div>
            </form>
        </div>
    );
};

export default Login;
