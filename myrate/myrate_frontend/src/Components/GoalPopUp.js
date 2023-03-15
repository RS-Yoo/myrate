import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import NewGoalForm from './NewGoalForm'

export default () => (
  <Popup trigger={<button> Add New Goal</button>} position="left center" >
    <div>
        <NewGoalForm/>
    </div>
  </Popup>
);