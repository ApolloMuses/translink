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
//updates of the db. Since once you have multiple users viewing the website
//simulatneously, you do not want every instance to be updating the database with
//the update tag. This update code would be normally simply be a intervaled request
//on a normal server, however, one of firebase cloud functions limitations is that
//it must be triggered by something, either db change or externally. You can use a cron job
//to trigger the get bus cloud function to keep semi up to date data.
//TBH, this status function would not be necessary if the web app reaches scale, since
//every time someone visits the website, the firebase database would be updated (if it is
//within certain seconds of the update time) so the db would
//realistically speaking always have real time data. 

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
