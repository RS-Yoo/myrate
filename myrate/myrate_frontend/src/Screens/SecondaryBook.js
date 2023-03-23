import { React, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Navbar from "../Components/Navbar";
import { useLocation } from 'react-router-dom'
import "./SecondaryBook.css";
import axios from "axios";
import CollectionModal from "../Components/Modals/CollectionModal"
import ReviewList from "../Components/ReviewList";
import ReviewForm from "../Components/ReviewForm";
import StarRating from "../Components/StarRating";
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SecondaryBook = () => {
    const [rate, setRate] = useState();
    const [review, setReview] = useState();
    const [reviewId, setReviewId] = useState();
    const [mediaId, setMediaId] = useState();
    const [modalOpen, setModalOpen] = useState(false); 
    //const [value, setValue] = useState(2);
    const [hover, setHover] = useState(-1);

    const userProfile = useSelector((state) => { return state.userProfile; });

    const location = useLocation();
    const { bookDetails } = location.state;
    console.log("secondarybook: " + JSON.stringify(bookDetails['book']));//.i);
    const { image, bookTitle, bookAuthor, publisher, isbn_10, isbn_13, description, purchaseLinks } = bookDetails['book'];
    const newBook = {
        image: image,
        bookTitle: bookTitle,
        bookAuthor: bookAuthor,
        publisher: publisher,
        isbn_10: isbn_10,
        isbn_13: isbn_13,
        description: description,
        purchaseLinks: purchaseLinks,
    };

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




    const openModal = () => {
        setModalOpen(true);
    };
    const closeModal = () => {
        setModalOpen(false);
    }

    // store book's ID for creating ratings/reviews
    let ratingsList = null;
    
    toast.configure();


    useEffect(() => {
        axios.get(`http://localhost:5000/book/findbook`, {
            params: {
                bookTitle: (newBook.bookTitle),
                bookAuthor: (newBook.bookAuthor),
            },
        }).then((response) => {
            console.log(response.data);
            const book = ((response.data));
            if (!book) {
                console.log(`Book with title ${JSON.stringify(newBook.bookTitle)} and author ${JSON.stringify(newBook.bookAuthor)} not found`);
                console.log("adding book");
                fetch("http://localhost:5000/book/add", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newBook),
                })
                    .then(res => {
                        console.log("response from add: " + res);
                    })
                    .catch(error => {
                        console.log(error);
                        //return;
                    });
            }
            else {
                console.log(`Book with title ${JSON.stringify(newBook.bookTitle)} by ${JSON.stringify(newBook.bookAuthor)} with id ${JSON.stringify(book._id)} was found`);
                setMediaId(book._id);

                axios.get(`http://localhost:5000/rating/findrating/${userProfile.username}`, {
                    params: {
                        media_type: "books",
                        media_id: book._id,
                    },
                })
                .then(response => {
                    ratingsList = (response.data);
                    console.log("ratings", response.data);
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


    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    const handleChangeSelect = (e) => {
        console.log(e.target.value);
        setRate(e.target.value);
    }

    const handleTextChange = (e) => {
        setReview(e.target.value);

    }

    const submitReview = (e) => {
        e.preventDefault();
        if (userProfile.username === null) {
            alert("Please login to submit your review");
        }
        else {
        // find the book's id to store in review 
        axios.get(`http://localhost:5000/book/findbook`, {
            params: {
                bookTitle: (newBook.bookTitle),
                bookAuthor: (newBook.bookAuthor),
            },
        }).then(response => {
            const b = ((response.data));
            // check if review exists
            axios.get(`http://localhost:5000/rating/findrating/${userProfile.username}`, {
                params: {
                    media_id: b._id,
                },
            }).then((response) => {
                const currReview = ((response.data[0]));

                // create review
                const reviewData = {
                    stars: rate,
                    review: review,
                    media_type: "books",
                    media_id: mediaId,
                    user: userProfile.username
                }
                if(!currReview) {
                    // adds rating to database
                    axios.post(`http://localhost:5000/rating/add`, reviewData
                    ).then(response => {
                        console.log("Posted rating");
                    }).catch(response => {
                        console.log("Error saving rating: " + response);
                        toast('Error updating. Please try again.', {position: toast.POSITION.TOP_CENTER});
                    })
                }
                else {
                    //update rating
                    axios.post(`http://localhost:5000/rating/update/${currReview._id}`, reviewData
                    ).then(response => {
                    console.log("Updated rating");
                    window.location.reload(false);
                    toast('Rating Updated!', {position: toast.POSITION.TOP_CENTER});
                })
                }
            })
            
        }).catch(response => {
            console.log(response);
        })
    }

    }

    const deleteReview = (e) => {
        e.preventDefault();

        axios.delete(`http://localhost:5000/ratings/delete/${reviewId}`)
        .then(function(response) {
            window.location.reload(false);
        })
    }
    /*
    // get list of ratings for this book
    ratingsList = axios.get(`http://localhost:5000/rating/findrating`, {
            params: {
                media_type: "books",
                media_id: dbBookId,
            },
        }).catch((response) => {
            console.log("Error finding ratings: " + response);
        })
    ratingsList.foreach(element => console.log(element));
*/
    return (
        <>
            <Navbar />
            <div className="bookDiv">
                <div className="bookImageDiv">
                    <img src={image} height="325" width="200" />
                </div>
                {purchaseLinks.map(link => (
                    <div className="purchaseLinkDiv">
                        <a href={link.url} target="_blank">
                            <button className="purchaseButton">Buy from {link.name}</button>
                        </a>
                    </div>
                ))}
                <div className="purchaseLinkDiv">
                    <button className="purchaseButton" onClick={openModal}>Add to collection</button>
                    <CollectionModal open={modalOpen} close={closeModal} header="Your collections" mediaType={"book"} mediaId={mediaId}></CollectionModal>
                </div>
            </div>
            <div className="productDetailsDiv">
                <h5 className="productDetailsHeader">Product Details</h5>
                <hr class="solid" />
                <div className="titleInfoDiv">
                    {bookTitle && <p><strong>Title: </strong>{toTitleCase(bookTitle)}</p>}
                </div>
                <div className="authorInfoDiv">
                    {bookAuthor && <p><strong>Author: </strong>{bookAuthor}</p>}
                </div>
                <div className="publisherInfoDiv">
                    {publisher && <p><strong>Publisher: </strong>{publisher}</p>}
                </div>
                <div className="isbn-10-InfoDiv">
                    {isbn_10 && <p><strong>ISBN-10: </strong>{isbn_10}</p>}
                </div>
                <div className="isbn-13-InfoDiv">
                    {isbn_13 && <p><strong>ISBN-13: </strong>{isbn_13}</p>}
                </div>
                <div className="descriptionInfoDiv">
                    {description && <p><strong>Description: </strong>{description}</p>}
                </div>
                <hr class="solid" />
            </div>
            <div>
               
            </div>

            <form>
                <div class="form-group" className="userReviewDiv">
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
                                value={rate?rate:''}
                                precision={0.5}
                                getLabelText={getLabelText}
                                onChange={(event, newValue) => {
                                    setRate(newValue);
                                    //setValue(newValue);
                                }}
                                onChangeActive={(event, newHover) => {
                                    setHover(newHover);
                                }}
                                emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                            />
                            {rate !== null && (
                                <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : rate]}</Box>
                            )}
                        </Box>
                    </div>
                    <label for="userReview" className="userReviewLabel">Detailed Review For - {toTitleCase(bookTitle)}*</label>
                    <textarea class="form-control" id="userReview" rows="3" placeholder="Tell others what you thought!" onChange={handleTextChange} value={review?review:""}></textarea>
                    <button type="submit" class="btn btn-primary" onClick={submitReview}>Post Review</button>
                    <button type="submit" class="btn btn-primary deleteButton" onClick={deleteReview}>Delete Review</button>
                </div>
            </form>
            <ReviewList mediaId={mediaId}></ReviewList>
        </>
    );
};

export default SecondaryBook;
