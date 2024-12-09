import React, { useState, useEffect } from 'react';
import './login.css';
import aeroteachLogo from '/src/assets/aerotech-white.png';
const Login = () => {


    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log('Login attempted with:', { username, password });
    };


    return (
        <>
            <div className="wrapper">
                <div className="container">
                    {/* Fixed inline styles */}
                    <div className="wait" style={{ color: "white", fontSize: "45px", display: "none" }}>
                        Please wait ...
                    </div>
                    <div className="welcome yaxis" style={{ color: "white", fontSize: "45px", display: "none" }}>
                        Welcome
                    </div>
                    <form className="form">
                        <img src={aeroteachLogo} className="logo react" alt="React logo" style={{
                            height: "125px",
                            position: "relative",
                            left: "-13px",
                            marginTop: "40px"
                        }} />
                      
                        <h1
                            className="apptitle"
                            style={{
                                color: "#ffffff",
                                fontSize: "40px",
                                textAlign: "center",
                                marginTop: "20px",
                                marginBottom: "40px"
                            }}
                        >
                            Aviation Training Platform
                        </h1>

                        <input
                            type="text"
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" onClick={handleLogin}>
                            Login
                        </button>
                    </form>
                </div>

                <ul className="bg-bubbles">
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </>
    );
};

export default Login;
