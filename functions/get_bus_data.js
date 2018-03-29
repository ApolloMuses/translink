//Calls Translink api, store response to firebase database

const admin = require('firebase-admin');
const _ = require('lodash');
const moment = require('moment');
const request = require('superagent');

const TRANSLINK_API = 'http://api.translink.ca/rttiapi/v1/buses?apikey=M7cSDcbs72iJ5mFWFtdX';


//data clean up helper fn
const filteredResults = (data) => {
  const results = _.map(data, (value) => {
    const { VehicleNo, RouteNo, Latitude, Longitude } = value;

    return { VehicleNo, RouteNo, Latitude, Longitude };
  });

  return results;
}


module.exports = function(req, res) {
  //send api request to receive data
  const requestTranslink = request.get(TRANSLINK_API)
                                  .set({ accept: 'application/json' });

  return requestTranslink.then(result => {
    const { body, response, } = result;

    console.log('the body of the api request is', body);

    const results = filteredResults(body);
    const now = moment().unix();

    const writeResultToDb = admin.database().ref(`/translink/`)
      .update({
        status: { updateTime: now },
        busResults: results,
      });

    return writeResultToDb.then( () => { res.send({ success: true }) });
  })
  .catch((err) => {
    console.log('there was an error: ', err);
  })

};
