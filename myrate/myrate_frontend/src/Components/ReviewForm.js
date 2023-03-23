import { React, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import "./ReviewForm.css";
import axios from "axios";

import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ReviewForm = (props) => {
    const mediaId = props.mediaId;

    const rate = props.currRate;
    const review = props.currReview;

    const userProfile = useSelector((state) => { return state.userProfile; });

    const [newRate, setNewRate] = useState(props.currRate);
    const [newReview, setNewReview] = useState(props.currReview);
    const [reviewId, setReviewId] = useState(props.reviewId);

    const [hover, setHover] = useState(-1);
    
    const labels = {
        0.5: 'Waste of time',
        1: 'Useless',
        1.5: 'Regret',
        2: 'Meh',
        2.5: 'Not bad',
        3: 'Average',
        3.5: 'Good',
        4: 'Great',
        4.5: 'Excellent',
        5: 'BEST EVER!',
      };
      
      function getLabelText(value) {
        return rate?.timestamp_day?rate:'';
//        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
      }
      toast.configure();

    useEffect(() => {
        setNewRate(props.currRate);
        setNewReview(props.currReview);
        setReviewId(props.reviewId);
    },[rate, review, props.reviewId])

    const movieReview = () => {
        // find the movie's id to store in review 
        axios.get(`http://localhost:5000/movie/findmovie`, {
            params: {
                title: (props.media.title),
                release_date: (props.media.release_date),
            },
        }).then((response) => {
            // check if review already exists
            const movie = ((response.data));
            axios.get(`http://localhost:5000/rating/findrating/${userProfile.username}`, {
                params: {
                    media_id: movie._id,
                },
            }).then((response) => {
                const review = ((response.data[0]));
                // create review
                const reviewData = {
                    stars: newRate,
                    review: newReview,
                    media_type: "movies",
                    media_id: mediaId,
                    user: userProfile.username
                }
                if(!review) {
                // adds rating to database
                axios.post(`http://localhost:5000/rating/add`, reviewData
                ).then(response => {
                    console.log("Posted rating");
                    
                    toast('Rating Saved!', {position: toast.POSITION.TOP_CENTER});
                }).catch(response => {
                    console.log("Error saving rating: " + response);
                })
                }
                else {
                    //update rating
                    axios.post(`http://localhost:5000/rating/update/${review._id}`, reviewData
                    ).then(response => {
                    console.log("Updated rating");
                    
                    toast('Rating Updated!', {position: toast.POSITION.TOP_CENTER});
                }).catch(response => {
                    console.log("Error saving rating: " + response);
                })
                }
            })

        }).catch(response => {
            console.log(response);
        })
    }

    const tvshowReview = () => {
        // find the show's id to store in review 
        axios.get(`http://localhost:5000/tvshow/findtvshow`, {
            params: {
                name: (props.media.name),
                first_air_date: (props.media.first_air_date),
            },
        }).then((response) => {
            // check if review already exists
            const tvshow = ((response.data));
            axios.get(`http://localhost:5000/rating/findrating/${userProfile.username}`, {
                params: {
                    media_id: tvshow._id,
                },
            }).then((response) => {
                const review = ((response.data[0]));
                console.log(review);
                // create review
                const reviewData = {
                    stars: newRate,
                    review: newReview,
                    media_type: "tvshows",
                    media_id: mediaId,
                    user: userProfile.username
                }
                if(!review) {
                    // adds rating to database
                    axios.post(`http://localhost:5000/rating/add`, reviewData
                    ).then(response => {
                        console.log("Posted rating");
                        toast('Rating Saved!', {position: toast.POSITION.TOP_CENTER});
                    }).catch(response => {
                        console.log("Error saving rating: " + response);
                    })
                    }
                    else {
                        //update rating
                        axios.post(`http://localhost:5000/rating/update/${review._id}`, reviewData
                        ).then(response => {
                        console.log("Updated rating");
                        toast('Rating Updated!', {position: toast.POSITION.TOP_CENTER});
                    }).catch(response => {
                        console.log("Error saving rating: " + response);
                    })
                    }
                })
        }).catch(response => {
            console.log(response);
        })

    }

    const submitReview = (e) => {
        e.preventDefault();

        if (props.mediaType === "movie") {
            movieReview();
        }
        else if (props.mediaType === "tvshow") {
            tvshowReview();
        }


    }

    const deleteReview = (e) => {
        e.preventDefault();

        axios.delete(`http://localhost:5000/ratings/delete/${reviewId}`)
        .then(function(response) {
            window.location.reload(false);
        })
    }

    const handleTextChange = (e) => {
        setNewReview(e.target.value);

    }

    const handleChangeSelect = (e) => {
        setNewRate(e.target.value);
        }
    

    return (
        <>
            <form>
                <div class="form-group" className="reviewDiv">
                    <div class="form-group col-md-4">
                        <label for="overallRating">Overall Rating*</label>
                        <Box
                            sx={{
                                width: 200,
                                display: 'flex',
                                alignItems: 'center',
                            }}
                        >
                            <Rating
                                name="hover-feedback"
                                value={newRate?newRate:''}
                                precision={0.5}
                                getLabelText={getLabelText}
                                onChange={(event, newValue) => {
                                    setNewRate(newValue);
                                    //setValue(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                }}
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                            {rate !== null && (
                                <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : newRate]}</Box>
                            )}
                        </Box>
                    </div>
                    <label for="userReview" className="userReviewLabel">Detailed Review For - {props.title}*</label>
                    <textarea class="form-control" id="userReview" rows="3" placeholder="Tell others what you thought!" onChange={handleTextChange} defaultValue={newReview}></textarea>
                    <button type="submit" class="btn btn-primary" onClick={submitReview}>Post Review</button>
                    <button type="submit" class="btn deleteButton btn-primary" onClick={deleteReview}>Delete Review</button>
                </div>
            </form>
        </>
    );
};

export default ReviewForm;
