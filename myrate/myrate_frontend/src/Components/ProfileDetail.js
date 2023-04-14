import React,  { useState, useEffect } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import userImage from '../img/user.png';
import collection1 from '../img/collection1.jpg'
import collection2 from '../img/collection2.jpg'
import collection3 from '../img/collection3.jpeg'
import collection4 from '../img/collection4.jpg'
import { useSelector } from 'react-redux';
import CollectionList from "../Components/CollectionList";
import "./CollectionList.css";
import LoginForm from "../Components/LoginForm";
import { EditText, EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import Avatar from 'react-avatar';
import axios from "axios";
// Importing toastify module
import {toast} from 'react-toastify';
import Table from 'react-bootstrap/Table';
 
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';
import MyStats from './MyStats';
 

export default function ProfileDetail() {
  const userProfile = useSelector((state) => { return state.userProfile; });
  // toast-configuration method,
  // it is compulsory method.
  toast.configure()

  const [text, setText] = React.useState("");
// Fetch Ratings data of this user from the backend
useEffect(() => {
  axios.get(`http://localhost:5000/user/finduser`, {
      params: {
          username: userProfile.username
      },
  })
  .then(function (response) { 
    console.log(JSON.stringify(response.data));
          setText(response.data['about']);
      });
}, [userProfile]);


  async function handleSave ({ name, value, previousValue })  {
    setText(value);
    const userData = {
      about: value,
    }
    console.log("userdata: " + JSON.stringify(userData));

    //update rating
    axios.post(`http://localhost:5000/user/updateAbout/${userProfile.username}`, userData
    ).then(response => {
      toast('Saved About You!').catch(error => {
        window.alert(error);

      }).error(error => {
        setText("Click here to edit about you!");
      });
    })
  };

  const handleChange = (e, setFn) => {
    setText(e.target.value);
    setFn(e.target.value);
  };

  if (userProfile.username === null) {
    return (
      <LoginForm />
    )
  }
  console.log(JSON.stringify(userProfile));

  return (
    <div>
      <MDBContainer className="py-5">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol>
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                 <Avatar className="ms-3" style={{ marginTop: '50px' }} color={Avatar.getRandomColor('sitebase', ['red', 'green', 'cyan', 'pink', 'purple'])} name={userProfile.username} />
                </div>
                <div className="ms-3" style={{ marginTop: '130px' }}>
                  <MDBTypography tag="h5">{userProfile.username}</MDBTypography>
                  <MDBCardText>Joined on {new Date(userProfile.day_joined).toDateString()}</MDBCardText>
                </div>
              </div>
              <MDBCardBody className="text-black p-4">
                <div className="mb-5">
                  <p className="lead fw-normal mb-2">About</p>
                  <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>

                    <div>
                      <EditText showEditButton 
                        value={text}
                        onChange={(e) => handleChange(e, setText)}
                        onSave={handleSave}
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mb-0">My Collections</MDBCardText>
                </div>
                <MDBRow className="d-flex justify-content-center align-items-center">
                  <CollectionList />
                </MDBRow>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mb-2">
                    <MyStats />
                    </MDBCardText>
                </div>
                <MDBRow className="d-flex justify-content-center align-items-center">
                  <MDBCol className="mb-2">
                    <MDBCardText className="font-italic mb-1">To be implemented</MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}