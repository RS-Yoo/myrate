import React from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import NewGoalForm from './NewGoalForm'

const GoalPopUp = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;
    return (
        <>
            <div>
                <Button aria-describedby={id} type="button" onClick={handleClick}>
                    Add New Goal
                </Button>
                <Popper id={id} open={open} anchorEl={anchorEl}>
                    <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                        <NewGoalForm />
                    </Box>
                </Popper>
            </div>
        </>
    );
}

export default GoalPopUp;