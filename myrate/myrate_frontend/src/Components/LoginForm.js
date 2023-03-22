import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import "./LoginForm.css";
import { userLogin } from '../store';
import axios from 'axios';

const LoginForm = () => {
    const bcrypt = require('bcryptjs');
    
    var dispatch = useDispatch();
    //const userProfile = useSelector((state) => { return state.userProfile; });

    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[loginError, setLoginError] = useState(false)
    const [incompleteForm, setIncompleteForm] = useState(false);

    const handleNameChange = (e) => {
        e.preventDefault();
        setUsername(e.target.value);
    }; 

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    };

    const loginOnSubmit = async (e) => {
        e.preventDefault();
        if (username === "" || password === "") {
            setLoginError(false);
            setIncompleteForm(true);
            return;
        }

        try {
            setIncompleteForm(false);
            let response = await axios.get(`http://localhost:5000/user/finduser/${username}`);

            if (response.data == null) {
                setLoginError(true);
            }
            else {
                const userCredentials = {
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    email: response.data.email,
                    username: response.data.username,
                    password: response.data.password,
                    day_joined: response.data.day_joined,
                };
                const PASSWORD_MATCH = bcrypt.compareSync(password, userCredentials.password);

                if (username !== userCredentials.username || !PASSWORD_MATCH) {
                    setLoginError(true);
                }
                else {
                    setLoginError(false);
                    dispatch(userLogin(userCredentials));
                }
            }
        }
        catch(err){
            console.log("Internal Server Error at userRoutes/user/finduser/:username");
        }
    };

    return (
        <>
            <div class="loginFormDiv">
                <h2>Account Login</h2>
                <form class="loginbox" autocomplete="off">
                    <input placeholder="Username" type="text" id="username" value={username} onChange={handleNameChange}></input>
                    <input placeholder="Password" type="password" id="password" value={password} onChange={handlePasswordChange}></input>
                    <button onClick={loginOnSubmit}>Login</button>
                    <p id="incompleteFormError" hidden={!incompleteForm}>Please Complete All Form Fields</p>
                    <p id="invalidLoginText" hidden={!loginError}>Cannot find an account that matches the provided credentials</p>
                </form>
            </div>
            <Link class="nav-link" to="/signup">
                <p id="createAccountLink">Create New Account</p>
            </Link>
        </>
    );
};

export default LoginForm;