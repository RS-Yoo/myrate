import { React, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Navbar from "../Components/Navbar";
import { useLocation } from 'react-router-dom'
import axios from "axios";
import useAxiosTMDB from "../Hooks/useAxiosTMDB";
import RelatedTitlesSliderList from "../Components/RelatedTitlesSliderList";
import ReviewForm from "../Components/ReviewForm";
import CollectionModal from "../Components/Modals/CollectionModal"
import ReviewList from "../Components/ReviewList";

const SecondaryTV = () => {

    const [rate, setRate] = useState();
    const [review, setReview] = useState();
    const [mediaId, setMediaId] = useState();
    const [reviewId, setReviewId] = useState();
    const [modalOpen, setModalOpen] = useState(false); 

    const userProfile = useSelector((state) => { return state.userProfile; });

    const location = useLocation();
    const { tvDetails } = location.state;
    const { name, overview, poster_path, first_air_date, _id } = tvDetails['tvshow'];

    // Saves movie to database
    const newTVShow = {
        name: name,
        overview: overview,
        poster_path: poster_path,
        first_air_date: first_air_date,
        api_id: tvDetails['tvshow'].id,
    };

    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    }


    // store movie's ID for creating ratings/reviews
    let dbTVId = 0;
    let ratingsList = null;

    useEffect(() => {
        axios.get(`http://localhost:5000/tvshow/findtvshow`, {
            params: {
                name: (newTVShow.name),
                first_air_date: (newTVShow.first_air_date),
            },
        }).then((response) => {
          console.log(response.data);
          const tvshow = ((response.data));
          if (!tvshow) {
            console.log(`TV Show with name ${JSON.stringify(newTVShow.name)} and air date ${JSON.stringify(newTVShow.first_air_date)} not found`);
            console.log("adding TV Show");
            fetch("http://localhost:5000/tvshow/add", {
              method: "POST",
                   headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newTVShow),
            })
            .catch(error => {
              window.alert(error);
              return;
            });

            axios.get(`http://localhost:5000/tvshow/findtvshow`, {
            params: {
                name: (newTVShow.name),
                first_air_date: (newTVShow.first_air_date),
            },
        }).then((response) => {
            const tvshow = ((response.data));
            dbTVId = tvshow._id;
            setMediaId(tvshow._id);

            axios.get(`http://localhost:5000/rating/findrating/${userProfile.username}`, {
                params: {
                    media_type: "tvshow",
                    media_id: dbTVId,
                },
        })
        .then(response => {
            ratingsList = (response.data);
            console.log(response.data);
        // set current rating and review to the first value of this list
        // In the future, set it to current user's rating and review
        console.log("Rate here?");
        setRate(ratingsList[0]?.stars);
        setReview(ratingsList[0]?.review);
        setReviewId(ratingsList[0]?._id);
        }).catch((response) => {
            console.log("Error finding ratings: " + response);
        })

        })
          }
          else
          {
            console.log(`TV Show with name ${JSON.stringify(newTVShow.name)} aired on ${JSON.stringify(newTVShow.first_air_date)} with id ${JSON.stringify(tvshow._id)} was found`);
            dbTVId = tvshow._id;
            setMediaId(dbTVId);
            axios.get(`http://localhost:5000/rating/findrating/${userProfile.username}`, {
                    params: {
                        media_type: "tvshow",
                        media_id: dbTVId,
                    },
                })
                .then(response => {
                    ratingsList = (response.data);
                    console.log(response.data);
                // set current rating and review to the first value of this list
                // In the future, set it to current user's rating and review
                setRate(ratingsList[0]?.stars);
                setReview(ratingsList[0]?.review);
                setReviewId(ratingsList[0]?._id);
                }).catch((response) => {
                    console.log("Error finding ratings: " + response);
                })
          }
        })
        .catch((response) => {
            console.log("error with axios: " + response);
        });
      }, [userProfile]);

    // Base URL that needs to be pre-pended to 'poster_path'
    const prePosterPath = "https://image.tmdb.org/t/p/original";

    // Disclaimer that needs to be included when using TMDB API data
    const disclaimer = "This product uses the TMDB API but is not endorsed or certified by TMDB.";

    //console.log(tvDetails);


    useEffect(() => {
        const element = document.getElementById('navbarID');
        element.scrollIntoView({ behavior: "smooth" });
    }, [tvDetails]);

    return (
        <>
            <Navbar />

            <div className="bookDiv">
                <div className="bookImageDiv">
                    <img src={`${prePosterPath}${poster_path}`} height="275" width="175" />
                </div>
                <div className="purchaseLinkDiv">
                    <button className="purchaseButton" onClick={openModal}>Add to collection</button>
                    <CollectionModal open={modalOpen} close={closeModal} header="Your collections" mediaType={"tvshow"} mediaId={mediaId}></CollectionModal>
                </div>
            </div>
            <div className="productDetailsDiv">
                <h5 className="productDetailsHeader">Product Details</h5>
                <hr class="solid" />
                <div className="titleInfoDiv">
                    <p><strong>Title: </strong>{name}</p>
                </div>
                <div className="releaseDateInfoDiv">
                    <p><strong>First Aired: </strong>{first_air_date}</p>
                </div>
                <div className="overviewInfoDiv">
                    <p><strong>Overview: </strong>{overview}</p>
                </div>
                <hr class="solid" />
            </div>

            <ReviewForm title={name} currRate={rate?rate:''} currReview={review?review:''} media={newTVShow} mediaId={mediaId} mediaType={"tvshow"} reviewId={reviewId} />
            {/* <RelatedTitlesSliderList apiId={apiId} isMovie={false} /> */}
            <ReviewList mediaId={mediaId}></ReviewList>
        </>
    );
};

export default SecondaryTV;
