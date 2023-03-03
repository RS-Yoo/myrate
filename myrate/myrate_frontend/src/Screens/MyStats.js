import React from "react";
import Navbar from "../Components/Navbar";
import MyStats from "../Components/MyStats";
import { useSelector } from 'react-redux';


const Landing = () => {
    const userProfile = useSelector((state) => { return state.userProfile; });
    return (
        <>
            <Navbar />
            {userProfile.username ? <h2>Viewing Data For: {userProfile.username}</h2> : <h2>Please Login To View User Data</h2>}
            <MyStats />
        </>
    );
};

export default Landing;
