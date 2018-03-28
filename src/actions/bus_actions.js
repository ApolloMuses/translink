import request from 'superagent';
import _ from 'lodash';

import {
  FETCH_BUSES,
  FETCH_BUS_ERROR,
} from './types';
//returns all active busses
//http://api.translink.ca/rttiapi/v1/buses?apikey=[APIKey]


//Again, the API keys should be excluded
const BUS_ROOT_URL = 'https://api.translink.ca/rttiapi/v1/buses';
const APIKEY = 'M7cSDcbs72iJ5mFWFtdX';

//url helper, separated to allow other types of requests
const API_URL = `${BUS_ROOT_URL}?apikey=${APIKEY}`;


//data clean up helper fn
const filteredResults = (data) => {
  const results = _.map(data, (value) => {
    const { VehicleNo, RouteNo, Latitude, Longitude } = value;

    return { VehicleNo, RouteNo, Latitude, Longitude };
  });

  return results;
}

//fetch buses
export const fetchBuses = () => async (dispatch) => {
  try {

    //request data
    let response = await request.get(API_URL)
                                .set({ accept: 'application/json' });

    //console.log(response);
    //clean up data
    const results = filteredResults(response.body);

    //update state
    dispatch({ type: FETCH_BUSES, payload: results });

  } catch (err) {
    console.log(err);
    dispatch({ type: FETCH_BUS_ERROR, error: err });
  }
}
