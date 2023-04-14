import { React, useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import axios from "axios";

// used for adding comments
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CommentIcon from '@mui/icons-material/Comment';

import {
  MDBCard,
  MDBCardHeader,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBCardFooter
} from 'mdb-react-ui-kit';
import StarRating from "./StarRating";

const RatingCard = (rating) => {
  const userProfile = useSelector((state) => { return state.userProfile; });

  const [liked, setLiked] = useState(rating.rating?.likes?.includes(userProfile.username) | false);
  const [numLikes, setNumLikes] = useState(rating.rating?.likes?.length | false);


  const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
      color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
      color: '#ff3d47',
    },
  });

  const location = useLocation();
  const { review } = location.state;
  //console.log("Rating data: " + rating.rating.stars);
  //const { name, num, about } = review['r'];

  const [stars, setStars] = useState('stars');
  const [description, setDescription] = useState('description');
  const [username, setUsername] = useState('username');
  const [newComment, setNewComment] = useState('');

  const handleChange = () => {

    let likes = [];
    try {
      let name = rating.rating.likes.includes(userProfile.username);
      likes = rating.rating.likes;
      console.log("This rating has been liked");
    }
    catch {
      console.log("This rating has not been liked");
      //likes.push(userProfile.username);
    }
    // in the case that we are removing a like from a rating
    if(liked === 1)
    {
        let index = likes.indexOf(userProfile.username);
        likes.splice(index, 1);
    }
    else
    {
        likes.push(userProfile.username);
    }
    
    
    const reviewData = {
      stars: rating.rating.stars,
      review: rating.rating.review,
      media_type: rating.rating.media_type,
      media_id: rating.rating.media_id,
      user: rating.rating.user_username,
      likes: likes,
      comments: rating.rating?.comments,
    }
    
    console.log("rat: " + numLikes);
    // in the case that we are 'liking' the rating
    if(liked === 0)
    {
      setLiked(1);
      setNumLikes(numLikes+1);
    }
    // in the case that we are removing a like from a rating
    else
    {
      setLiked(0);
      setNumLikes(numLikes-1);
    }
    axios.post(`http://localhost:5000/rating/update/${rating.rating._id}`, reviewData
      ).then(response => {
        console.log("Updated rating");
      })
  }

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCloseCancel = () => {
    setOpen(false);
  };

  const handleCloseSubmit = () => {
    // this is where we will save comment to rating in db
    const comments = [];
    try {
      rating.rating.comments.map(c => {
        comments.push(c);
      })
    }
    catch {
      console.log("error setting comments");
    }
    comments.push({"user": userProfile.username, "comment" : newComment});
    
    const reviewData = {
      stars: rating.rating.stars,
      review: rating.rating.review,
      media_type: rating.rating.media_type,
      media_id: rating.rating.media_id,
      user: rating.rating.user_username,
      likes: rating.rating?.likes,
      comments: comments,
    }
    axios.post(`http://localhost:5000/rating/update/${rating.rating._id}`, reviewData
      ).then(response => {
        console.log("Updated rating");
      })

    setOpen(false);
    window.location.reload(false);
  };

  const getFooterComments = () => {
    let retVal = [];
    try {
      let comments = rating.rating.comments;
      if(comments.length > 0)
      {
        comments.map(c => {

          retVal.push (
            <div>
              <MDBCardFooter background='transparent' border='dark'>
                <h5>{c?.user}</h5>
                <div>
                  <a>{c?.comment}</a>
                </div>
            </MDBCardFooter>

            </div>
          );
        }
          
          )
      }
    }
    catch {

    }
    return retVal;
  }

  return (
    <MDBCard>
      <MDBCardHeader>
        <StarRating stars={rating.rating.stars} />
      </MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle>{rating.rating.user_username}</MDBCardTitle>
        <MDBCardText>{rating.rating.review}</MDBCardText>
        <div>
          <Checkbox checked={liked}
            onChange={handleChange} name="customized-color" icon={<FavoriteBorder />} color="secondary" checkedIcon={<Favorite />} />
          <a>{numLikes}</a>
          <IconButton onClick={handleClickOpen}>
            <CommentIcon/>
          </IconButton>
          <Dialog open={open} onClose={handleCloseCancel}>
            <DialogTitle>New Comment</DialogTitle>
            <DialogContent id="comment-box">
              <TextField
                autoFocus
                margin="dense"
                required
                id="outlined-required"
                label="Required"
                defaultValue=""
                multiline
                fullWidth
                variant="standard"
                onChange={e => setNewComment(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseCancel}>Cancel</Button>
              <Button onClick={handleCloseSubmit}>Submit Comment</Button>
            </DialogActions>
          </Dialog>
        </div>
        {getFooterComments()}
      </MDBCardBody>
    </MDBCard>
  );
};

export default RatingCard;