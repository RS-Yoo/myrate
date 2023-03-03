import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import ScrollMenu from 'react-horizontal-scrolling-menu'
import axios from 'axios';
import CollectionItems from "./CollectionItems";
import LoginForm from "../Components/LoginForm";
import AddCollectionModal from "./Modals/AddCollectionModal";
//import { param } from "../../../myrate_backend/server/routes/ratings";

const MyStats = () => {
    const [BookStat, setBookStat] = useState();
    const [MovieStat, setMovieStat] = useState();
    const [TVStat, setTVStat] = useState();
    const [modalOpen, setModalOpen] = useState(false); 
    const userProfile = useSelector((state) => { return state.userProfile; });

    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    }

    // Fetch Ratings data of this user from the backend
    useEffect(() => {
        axios.get(`http://localhost:5000/rating/findstatrating`, {
            params: {
                username: userProfile.username
            },
        })
        .then(function (response) {
                // set stats with user data with data in the response
                console.log("response: " + JSON.stringify(response.data));
            });
    }, [userProfile]);
}


export default MyStats;