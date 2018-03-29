import request from 'superagent';
import moment from 'moment';
import fire from '../firebase';

import {
  FETCH_BUSES,
  FETCH_STATUS,
  UPDATE_NEEDED,
} from './types';


const API_URL = 'https://us-central1-translink-79b18.cloudfunctions.net/getBusData';

// Fetch bus results from firebase
// when busResults updates on firebase,
// the 'on' listener will update react automatically
export const getBuses = () => (dispatch) => {
  const rootRef = fire.database().ref('/translink/busResults/');

  rootRef.on('value', snapshot => {
    const results = snapshot.val();

    dispatch({ type: FETCH_BUSES, payload: results });
  });
}

//update buses
const updateBusHelper = (dispatch, updateTime) => {
  const now = moment().unix();
  const oldTime = updateTime + 15;

  if (oldTime < now) {

    const rootRef = fire.database().ref('/translink/status/');

    rootRef.update({ updateNeeded: true });
    dispatch({ type: UPDATE_NEEDED });
  }
}

//Fetch status along with the bus data
//since we only need this once at the begining, we only need to call it once
//it may seem excessive to separate the two, but this way it avoids unecessary
//updates of the db
export const getStatus = () => (dispatch) => {
  const rootRef = fire.database().ref('/translink/status/');

  rootRef.once('value', snapshot => {
    const results = snapshot.val();

    updateBusHelper(dispatch, results.updateTime);

    dispatch({ type: FETCH_STATUS, payload: results });
  });
}

export const updateBuses = (updateTime) => (dispatch) => {
  updateBusHelper(dispatch, updateTime);
}
