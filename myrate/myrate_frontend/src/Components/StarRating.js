import * as React from 'react';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import StarIcon from '@mui/icons-material/Star';

const StarRating = (props) => {
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
        return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
      }

    console.log("props: " + JSON.stringify(props));
    const [value, setValue] = React.useState(2);
    const [hover, setHover] = React.useState(-1);

    return (
        <Box
        sx={{
          width: 200,
          display: 'flex',
          alignItems: 'center',
        }}
      >
<Rating name="read-only" value={props.stars} precision={0.5} readOnly />
        {props.stars !== null && (
          <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : props.stars]}</Box>
        )}
      </Box>
    )
}

export default StarRating;