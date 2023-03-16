import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ReactDOM from 'react-dom'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CloseButton from 'react-bootstrap/CloseButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Tooltip from "@material-ui/core/Tooltip";
import Popup from 'reactjs-popup';

function HorizontalExample() {

    const userProfile = useSelector((state) => { return state.userProfile; });

    const [goalName, setGoalName] = useState('');
    const [media_Type, setMediaType] = useState('');
    const [time_Goal, setTimeGoal] = useState(''); // yearly, monthly, or daily
    const [t_postitive, setPositive] = useState(''); // true or false
    const [a_amount, setAmount] = useState('');
    const [m_measurement, setMeasurement] = useState('MCount'); // minutes, hours, count, etc.

    const handleSubmit = e => {
        e.preventDefault();
        if(!isNaN(a_amount))
        {
            toast("Amount must be a number.")
        }
        if(t_postitive === "on")
            setPositive(true);
        else
            setPositive(false);
        const data = {
            username: userProfile.username,
            goalTitle: goalName,
            mediaType: media_Type,
            daymonthyear: time_Goal,
            positive: t_postitive,
            amount: a_amount,
            measurement: m_measurement,
        };
        console.log(data);
        fetch("http://localhost:5000/goal/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(res => {
                console.log("response from add: " + res);
            })
            .catch(error => {
                console.log(error);
                //return;
            });
       };

    return (
        <>
        <Form onSubmit={handleSubmit}>
 <Form.Group className="mb-3" controlId="goalName" value={goalName} onChange={e => setGoalName(e.target.value)}>
        <Form.Control as="textarea" rows={1} placeholder="Goal Name" required/>
      </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword" value={media_Type} onChange={e => setMediaType(e.target.value)}>
                <Col sm={10}>
                    <Form.Select aria-label="Default select example">
                        <option>Media Type</option>
                        <option value="Books">Books</option>
                        <option value="Movies">Movies</option>
                        <option value="TV Shows">TV Shows</option>
                    </Form.Select>
                </Col>
            </Form.Group>
            <fieldset>
                <Form.Group as={Row} className="mb-3" value={time_Goal} onChange={e => setTimeGoal(e.target.value)}>
                    <Col sm={10}>
                        <Form.Check
                            type="radio"
                            label="Yearly"
                            name="formHorizontalRadios"
                            id="formHorizontalRadios1"
                            value="Yearly"
                        />
                        <Form.Check
                            type="radio"
                            label="Monthly"
                            name="formHorizontalRadios"
                            id="formHorizontalRadios2"
                            value="Monthly"
                        />
                        <Form.Check
                            type="radio"
                            label="Daily"
                            name="formHorizontalRadios"
                            id="formHorizontalRadios3"
                            value="Daily"
                        />
                    </Col>
                </Form.Group>
            </fieldset>
            <Tooltip title="Select if this a goal you WANT to achieve. If this is a goal you want to avoid do not select.">
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalCheck" value={t_postitive} onChange={e => setPositive(e.target.value)}>
                    <Col sm={10}>
                        <Form.Check label="Positive Goal" />
                    </Col>
                </Form.Group>
            </Tooltip>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail" value={a_amount} onChange={e => setAmount(e.target.value)}>        
            <Col sm={10}>
                <Form.Control type="textarea" rows={1} placeholder="Amount" />
            </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3">
                <Col sm={{ span: 10, offset: 2 }}>
                    <Button type="submit" onClick={handleSubmit}>Add</Button>
                </Col>
            </Form.Group>
        </Form>
        </>
    );
}

export default HorizontalExample;