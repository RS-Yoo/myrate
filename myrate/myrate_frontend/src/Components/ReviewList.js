import { React, useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";
import "./ReviewList.css";
import RatingCard from "./RatingCard";

const ReviewList = (props) => {
    const [reviews, setReviews] = useState();

    const userProfile = useSelector((state) => { return state.userProfile;})

    useEffect(() => {
        axios.get(`http://localhost:5000/rating/findothers`, {
                params: {
                    media_id: props.mediaId,
                },
            }).then((response) => {
                console.log("found reviews", response);
                const res = ((response.data));
                setReviews(res);
            }).catch(response => {
                console.log("Error getting ratings: " + response);
            })
    }, [props.mediaId])



    return (
        <>
        <div className="reviewList">
                <div class="form-group" className="reviewDiv">
                    <h4>Reviews from others</h4>
                    {reviews ? reviews.map(r => (
                        <>
                        <RatingCard rating = {r}/>
                        <div className="reviewItem">
                         </div>
                        </>
                    ))
                    : null }
                </div>
                </div>
        </>
    )
}

export default ReviewList;