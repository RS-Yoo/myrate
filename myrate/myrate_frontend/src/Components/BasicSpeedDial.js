import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import FacebookIcon from '@mui/icons-material/Facebook';
import ShareIcon from '@mui/icons-material/Share';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <TwitterIcon />, name: 'Twitter' },
  { icon: <InstagramIcon />, name: 'Instagram' },
  { icon: <FacebookIcon />, name: 'Facebook' },
];

const handleClick = (name) => {
    if(name === "Twitter")
    {
        window.open("https://twitter.com/share?ref_src=twsrc%5Etfw");
    }
    else if(name === "Instagram")
    {
        window.open("https://www.instagram.com/#");
    }
    else if (name === "Facebook")
    {
        window.open("https://facebook.com/sharer/sharer.php?u=MyRate.com");
    }
}

export default function BasicSpeedDial() {
  return (
    <Box sx={{ height: 20, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<ShareIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick = {() => handleClick(action.name)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
