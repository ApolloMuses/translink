# translink

The purpose of this project is to produce a near-real-time location reporting of Translink buses mapped on a responsive webapp.

The following tools were used:
1. [Translink api](https://developer.translink.ca)
2. [react-map-gl](https://github.com/uber/react-map-gl)
3. [superagent](https://github.com/visionmedia/superagent)
4. [lodash](https://lodash.com/)
5. [redux](https://redux.js.org/)
6. [redux-thunk](https://github.com/gaearon/redux-thunk)

### Screenshots

<p align="center">
	<img src="https://github.com/ApolloMuses/translink/master/screenshots/ss.png"/>
</p>

### Try it out

Clone or download the repository and run:
```ruby
npm install
```


### caveats

As of current, the Translink Api is an unsecured http call. Thus it will not pass 'Access-Control-Allow-Origin' issues (having unsecured http in https pages). Unfortunately simply changing the http -> https does not work for this case.

For development purposes you can bypass this by installing the Allow-Control-Allow-Origin Chrome extension [Link](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi).

To resolve this for production, you can build and host your own server that is https compliant that makes the http calls to Translink. Or you can contact Translink.

To see a failed deployment you can visit [here](https://translink-79b18.firebaseapp.com/).

### features

- self updating bus location
- scrolling and zooming capable map
- performant data load and rerendering of new data


### License
MIT
