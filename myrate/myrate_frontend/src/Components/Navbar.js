import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { userLogout } from '../store';
import SearchBox from "./SearchBox";
import "./Navbar.css";

const Navbar = () => {
    var dispatch = useDispatch();
    const userProfile = useSelector((state) => { return state.userProfile; });

    const handleLogout = (e) => {
        e.preventDefault();
        const userLogoutPayload = {
            firstName: null,
            lastName: null,
            email: null,
            username: null,
            password: null,
        };
        dispatch(userLogout(userLogoutPayload)); 
    };

    const renderUserWidget = () => {
        if (userProfile.username) {
            return (
                <><Link class="nav-link" to="/profile">
                    <button className="navbarLoginButton">Profile</button>
                </Link>
                <button className="navbarLoginButton" onClick={handleLogout}>Logout {userProfile.username}</button></>
            );
        }
        else {
            return (
                <>

                <Link class="nav-link" to="/login">
                        <button className="navbarLoginButton">Log In</button>
                    </Link></>
            );
        }
    };
    return (
        <div id="navbarID">
            <nav class="navbar navbar-expand navbar-light bg-light">
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <Link class="nav-link" to="/">Home <span class="sr-only"></span></Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/discover">Discover</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/collections">Collections</Link>
                        </li>
                        <li class="nav-item">
                            <Link class="nav-link" to="/mystats">MyStats</Link>
                        </li>
                        <li class="nav-item">
                            < SearchBox />
                        </li>
                    </ul>
                </div>
                <div class="collapse navbar-collapse">

                </div>
                {renderUserWidget()}
            </nav>
        </div>
    );
};

export default Navbar;
