import { React, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import Checkbox from '@mui/material/Checkbox';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import Button from 'react-bootstrap/Button';

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

const RatingCard = (rating) =>
{
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


  return (
    <MDBCard>
      <MDBCardHeader>
        <StarRating stars = {rating.rating.stars}/>
      </MDBCardHeader>
      <MDBCardBody>
        <MDBCardTitle>{rating.rating.user_username}</MDBCardTitle>
        <MDBCardText>{rating.rating.review}</MDBCardText>
        <div>
      <Checkbox name="customized-color" icon={<FavoriteBorder />} checkedIcon={<Favorite />} />
      </div>
      </MDBCardBody>
    </MDBCard>
  );
};

export default RatingCard;