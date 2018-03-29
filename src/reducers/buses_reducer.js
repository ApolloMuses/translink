
import {
  FETCH_BUSES,
  FETCH_STATUS,
} from '../actions/types';

const INITIAL_STATE = {
  fetchStatus: null,
  fetchResults: [],
  statusResults: [],
  error: null,
}

export default function(state = INITIAL_STATE, action) {
  console.log(action);
  switch (action.type) {

    case FETCH_BUSES:
      return { ...state, fetchResults: action.payload };

    case FETCH_STATUS:
      return { ...state, statusResults: action.payload };

    default:
      return state;
  }
}
