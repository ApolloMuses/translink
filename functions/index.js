const functions = require('firebase-functions'),
          admin = require('firebase-admin');
const getBusData = require('./get_bus_data');
const request = require('superagent');


admin.initializeApp(functions.config().firebase);

const URL = 'https://us-central1-translink-79b18.cloudfunctions.net/getBusData';
//exporting functions

//http api request
exports.getBusData = functions.https.onRequest(getBusData);

//update data trigger
exports.updateBusData = functions.database.ref('/translink/status/updateNeeded')
  .onUpdate(event => {
    const updateNeeded = event.data.val();

    if (!updateNeeded || updateNeeded === false ) return null;

    //call firebase api
    const triggerUpdate = request.get(URL);

    return triggerUpdate.then(result => {
      //remove update tag
      const updateTag = admin.database().ref('/translink/status/')
                                        .update({ updateNeeded: false });

      return updateTag.then(() => { console.log('update tag removed')});
    });
});
