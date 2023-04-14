import React from "react";
import Navbar from "../Components/Navbar";
import MyStats from "../Components/MyStats";
import { useSelector } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';


const Landing = () => {
    const userProfile = useSelector((state) => { return state.userProfile; });
    return (
        <>
            <Navbar />
                <Card body>{userProfile.username ? 
                    <h2> <Badge bg="primary">Viewing Data For: {userProfile.username}</Badge> </h2>  
                    : 
                    <h2><Badge bg="danger">Please Login To View User Data</Badge></h2>} 
                </Card>
            <MyStats />
        </>
    );
};

export default Landing;
