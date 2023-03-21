import React from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import userImage from '../img/user.png';
import collection1 from '../img/collection1.jpg'
import collection2 from '../img/collection2.jpg'
import collection3 from '../img/collection3.jpeg'
import collection4 from '../img/collection4.jpg'
import { useSelector } from 'react-redux';
import CollectionList from "../Components/CollectionList";

export default function ProfileDetail() {
  const userProfile = useSelector((state) => { return state.userProfile; });


  return (
    <div>
      <MDBContainer className="py-5">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol>
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row" style={{ backgroundColor: '#000', height: '200px' }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                  <MDBCardImage src={userImage}
                    alt="Generic placeholder image" className="mt-4 mb-2 img-thumbnail" fluid style={{ width: '150px', zIndex: '1' }} />
                </div>
                <div className="ms-3" style={{ marginTop: '130px' }}>
                  <MDBTypography tag="h5">{userProfile.username}</MDBTypography>
                  <MDBCardText>Joined on {new Date(userProfile.timestamp_day).toDateString()}</MDBCardText>
                </div>
              </div>
              <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-flex justify-content py-1">
                  <div>
                    <MDBCardText className="mb-1 h5">Genre</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Young Adult, Fantasy, Romance</MDBCardText>
                  </div>
                </div>
              </div>
              <MDBCardBody className="text-black p-4">
                <div className="mb-5">
                  <p className="lead fw-normal mb-1">About</p>
                  <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                    <MDBCardText className="font-italic mb-1">Hello there! I love books and movies.</MDBCardText>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mb-0">My Collections</MDBCardText>
                </div>
                <MDBRow className="d-flex justify-content-center align-items-center">
                <CollectionList />
                 
                </MDBRow>
                
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <MDBCardText className="lead fw-normal mb-0">MyStats</MDBCardText>
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