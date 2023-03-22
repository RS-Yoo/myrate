import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import "./LoginForm.css";
import { userLogin } from '../store';
import axios from 'axios';
import "./SignupForm.css";

const LoginForm = () => {
    const bcrypt = require('bcryptjs');
    const saltRounds = 10;

    var dispatch = useDispatch();
    //const userProfile = useSelector((state) => { return state.userProfile; });
    const[firstname, setFirstname] = useState("");
    const[lastname, setLastname] = useState("");
    const[username, setUsername] = useState("");
    const[password, setPassword] = useState("");
    const[email, setEmail] = useState("");
    const[duplicateUsername, setDuplicatUsername] = useState(false);
    const [incompleteForm, setIncompleteForm] = useState(false);

    const handleUsernameChange = (e) => {
        e.preventDefault();
        setUsername(e.target.value);
    }; 

    const handleFirstnameChange = (e) => {
        e.preventDefault();
        setFirstname(e.target.value);
    };

    const handleLastnameChange = (e) => {
        e.preventDefault();
        setLastname(e.target.value);
    };

    const handleEmailChange = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    };

    const signupOnSubmit = async (e) => {
        e.preventDefault();

        if (firstname === "" || lastname === "" || email === "" || username === "" || password === "") {
            setIncompleteForm(true);
            return;
        }

        try {
            setIncompleteForm(false);
            // null if username does not already exist in system, non-null otherwise
            let response = await axios.get(`http://localhost:5000/user/finduser/${username}`);

            if (response.data == null) {
                setDuplicatUsername(false);
                
                const hashedPassword = bcrypt.hashSync(password, saltRounds);
                let day = new Date();
                const userCredentials = {
                    firstname: firstname,
                    lastname: lastname,
                    email: email,
                    username: username,
                    password: hashedPassword,
                    day_joined: day,
                };

                try { 
                    await axios.post(`http://localhost:5000/user/add`, userCredentials);
                    dispatch(userLogin(userCredentials));
                }
                catch(err) {
                    console.log("Internal Server Error at POST user/add")
                }
            }
            else {
                setDuplicatUsername(true);
            }
        }
        catch(err){
            console.log("Internal Server Error at GET userRoutes/user/finduser/:username");
        }
    };

    return (
        <>
            <div class="loginFormDiv">
                <h2>Create Account</h2>
                <form class="signupbox" autocomplete="off">
                    <input placeholder="First Name" type="text" id="firstname" value={firstname} onChange={handleFirstnameChange}></input>
                    <input placeholder="Last Name" type="text" id="lastname" value={lastname} onChange={handleLastnameChange}></input>
                    <input placeholder="Email" type="text" id="email" value={email} onChange={handleEmailChange}></input>
                    <input placeholder="Username" type="text" id="username" value={username} onChange={handleUsernameChange}></input>
                    <input placeholder="Password" type="password" id="password" value={password} onChange={handlePasswordChange}></input>
                    <button onClick={signupOnSubmit}>Create Account</button>
                    <p id="incompleteFormError" hidden={!incompleteForm}>Please Complete All Form Fields</p>
                    <p id="duplicateUsernameError" hidden={!duplicateUsername}>Please Select a Different Username, That One is Already Active</p>
                </form>
            </div>
        </>
    );
};

export default LoginForm;