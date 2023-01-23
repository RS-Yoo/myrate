import React, { useState, useEffect } from "react";
import ScrollMenu from 'react-horizontal-scrolling-menu'
import axios from 'axios';
import "./CollectionList.css";
import DummyCollectionData from "./DummyCollectionData";

const CollectionList = () => {

    let [collections, setCollections] = useState([]);

    const [detail, setDetail] = useState();

    const handleClickCollection = e => {
        setDetail(e.target.id);
    };

    // Fetch collection data of this user from the backend

    useEffect(() => {
        axios.get('http://localhost:5001/api/collections/getcollections/')
            .then(function (response) {
                console.log(response)
            });
    }, []);


    return (
        <>
        <div class="wrap">
            <div class="scroll__wrap">
                {collections.map(c => (
                    <button class="scroll--element" id={c.name} onClick={handleClickCollection}>
                        {c.name}
                    </button>
                ))}
            </div>
            </div>
            {detail && <DummyCollectionData name={detail} />}
        </>
        
    );
 
};



export default CollectionList;