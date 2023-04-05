import React, { useState, useEffect } from "react";
import { animated, useSpring } from "react-spring";
import { useScroll } from "react-use-gesture";
import { useSelector } from 'react-redux';
import ScrollMenu from 'react-horizontal-scrolling-menu'
import axios from 'axios';
import "./CollectionList.css";
import CollectionItems from "./CollectionItems";
import LoginForm from "../Components/LoginForm";
import AddCollectionModal from "./Modals/AddCollectionModal";

const CollectionList = () => {

    const prePosterPath = "https://image.tmdb.org/t/p/original";

    const [style, set] = useSpring(() => ({
        transform: "perspective(500px) rotateY(0deg)"
      }));

    const bind = useScroll(event => {
        set({
            transform: `perspective(500px) rotateY(${
                event.scrolling ? event.delta[0] : 0
            }deg)`
        });
    });

    const userProfile = useSelector((state) => { return state.userProfile; });

    let [collections, setCollections] = useState([]);
    let [imgList, setImgList] = useState();
    let [items, setItems] = useState();
    let [selectedItems, setSelectedItems] = useState();
    let [selectedId, setSelectedId] = useState();
    const [modalOpen, setModalOpen] = useState(false); 

    const [title, setTitle] = useState();

    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    }

    const handleClickCollection = e => {
        let currId = e.target.id;
        let selected = null;
        collections.map(c => {
            if(c._id === currId) selected = c;
        })
        console.log(selected);
        setTitle(selected.title);
        setSelectedItems(items[currId]);
        setSelectedId(currId);
    };

    // Fetch collection data of this user from the backend

    useEffect(() => {
        axios.get(`http://localhost:5000/collection/getmedia/${userProfile.username}`)
            .then(function (response) {
                // setCollections with data in the response
                setCollections(response.data);
                let itemList = {};
                console.log("collections: ", response.data);
                response.data.map(d => {
                    itemList[d._id] = {"books": [], "movies": [], "tvshows": []}
                    d.book_list?.map(b => {
                        itemList[d._id]["books"].push(b);
                    });
                    d.movie_list?.map(m => {
                        itemList[d._id]["movies"].push(m);
                    });
                    d.tvshow_list?.map(t => {
                        itemList[d._id]["tvshows"].push(t);
                    });
                });
                setItems(itemList);

            });
    }, [userProfile]);

    // TODO: Display the first item in each collection as the cover
    useEffect(() => {
        imgList = [];
        collections.map(c => {
            // choose book as the cover
            if (c.book_list.length > 0) {
                imgList.push("url("+c.book_list[0].image+")");
            }
            // or movie
            else if (c.movie_list.length > 0) {
                imgList.push("url("+prePosterPath+c.movie_list[0].poster_path+")");
            }
            // or tvshow
            else if (c.tvshow_list.length > 0) {
                imgList.push("url("+prePosterPath+c.tvshow_list[0].poster_path+")");
            }
            // None if empty
            else {
                imgList.push("#000");
            }
        })
        setImgList(imgList);
        console.log("imgList", imgList);
    }, [collections])
    if(userProfile.username === null) {
        return (
            <LoginForm />
        )
    }

    else if(userProfile.username && collections.length === 0) {
        return (
            <>
            <div class="wrap">
            {"You don't have any collections yet..."}
                </div>
                {selectedItems && <CollectionItems title={title} items={selectedItems} />}
                <button class="btn btn-primary" onClick={openModal}>Add a collection</button>
            <AddCollectionModal open={modalOpen} close={closeModal} header="New Collection"></AddCollectionModal>
            </>
        )
    }
    else {
    return (
        <>
        <div class="wrap">
            <div className="list--container" {...bind()}>
                {  
                    collections.map((c, i) => (
                    <animated.div
                    className="collection--card"
                    id={c._id}
                    onClick={handleClickCollection}
                    style={{
                        ...style,
                        background: `${imgList[i]}`,
                    }}
                    >
                    <h3 className="collection--card__title">
                        {c.title}
                        </h3>
                    <div className="collection--card__description">
                        {c.description}
                    </div>
                    </animated.div>
                ))}
            </div>
            </div>
            <button class="btn btn-primary" onClick={openModal}>Add a collection</button>
            <AddCollectionModal open={modalOpen} close={closeModal} header="New Collection"></AddCollectionModal>
            {selectedItems && <CollectionItems id={selectedId} title={title} items={selectedItems} />}
        </>
        
    );
                }
 
};



export default CollectionList;
