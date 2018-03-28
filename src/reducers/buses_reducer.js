
import {
  FETCH_BUSES,
  FETCH_BUS_ERROR
} from '../actions/types';

const INITIAL_STATE = {
  fetchResults: [],
  error: null,
}

export default function(state = INITIAL_STATE, action) {
  console.log(action);
  switch (action.type) {
    //replace data with each call.
    //Can be more performant if only added to exisiting list
    //by using _.uniqBy with the lodash library

    case FETCH_BUSES:
      return { fetchResults: action.payload };

    case FETCH_BUS_ERROR:
      return { error: action.payload };

    default:
      return state;
  }
}
