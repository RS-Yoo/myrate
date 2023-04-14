import { React, useState, useEffect } from "react";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSelector } from 'react-redux';
import {Button} from '@mui/material'
import {toast} from 'react-toastify';
import { Dayjs } from 'dayjs';
import axios from "axios";

const CompletionDate = (props) => {

    const [compDates, setCompDates] = useState();
    const [value, setValue] = useState();
    const [date, setDate] = useState();

    const userProfile = useSelector((state) => { return state.userProfile;})

    useEffect(() => {
        axios.get(`http://localhost:5000/completed/findothers`, {
                params: {
                    media_id: props.mediaId,
                    username: userProfile.username,
                },
            }).then((response) => {
                console.log("found completed dates", response.data);
                const res = ((response.data));
                setCompDates(res);
            }).catch(response => {
                console.log("Error getting completed dates: " + response);
            })
    }, [props.mediaId])

    const returnCompletions = () => {
        console.log("in return completions for user " + userProfile.username);
        let res = [];
        compDates?.map(r => (
                    res.push (
                    <><div>
                        <a>{new Date(r.date).toDateString()}</a><Button onClick={() => removeDate(r._id)}> Remove Date </Button>
                        </div></>
                    )
                ))
        return res;
    }

    const removeDate = (e) => {
        console.log(e);

        axios.delete(`http://localhost:5000/completeds/delete/${e}`)
        .then(function(response) {
            window.location.reload(false);
        })
    }

    const saveDate = (d) => {
        if(d != null)
        {
            let day = new Date(d);
            let today = new Date();
            if(day <= today)
            {        
                let compData = {
                    date: day,
                    media_id: props.mediaId,
                    user: userProfile.username
                }
                axios.post(`http://localhost:5000/add`, compData
                ).then(response => {
                    console.log("Posted completiondate");
                    toast('Completion Date Saved!', {position: toast.POSITION.TOP_CENTER});
                }).catch(response => {
                    console.log("Error saving rating: " + response);
                    toast('Error updating. Please try again.', {position: toast.POSITION.TOP_CENTER});
                });
            }
            else
            {
                toast('Please select date prior to today and then try again.', {position: toast.POSITION.TOP_CENTER});
            }
        }
    }

    return (
        <>
        <div>
            <h3> Previous completion dates:</h3>
        </div>
        <div>
            {returnCompletions()}
        </div>
        <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Add new completion date"
                    value={value}
                    onChange={(newValue) => {
                      setDate(newValue);
                    }}
                    slotProps={{
                        textField: {
                            helperText: 'MM / DD / YYYY',
                        },
                    }} />
            </LocalizationProvider>
        </div>
            <Button onClick={() => saveDate(date)}> Save New Date</Button>
            </>
    );
}

export default CompletionDate;