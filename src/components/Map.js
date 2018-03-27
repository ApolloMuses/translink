import React, { Component } from 'react';
import ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

//should use dotenv to separateout the token but for the purpose of this app,
//but for the purposes of this app, we'll just use a const
const MAPBOX_TOKEN = 'pk.eyJ1IjoiYXBvbGxvbXVzZXMiLCJhIjoiY2pmOWg2c3VjMjFwaDJ3cGRrcDZyMDVsdyJ9.6ztyqo-fnkW1DNabN1HQWQ';

class Map extends Component {
  state = {
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      latitude: 49.252,
      longitude: -123.106,
      zoom: 12.3,
    }
  };

  componentDidUpdate() {

  }


  onRegionChangeComplete = (viewport) => {
    this.setState({ viewport });
    //TODO: then query translink via redux action creator
    //TODO: then update markers
  }

  render() {
    return (
      <div style={{ width: '100vw', height: '100vh' }}>
        <ReactMapGL
          //className="Map-Container"
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({viewport})}
          width={window.innerWidth}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          //reuseMaps={true}
          containerStyle={{ width: '100%', height: '100%' }}
          mapStyle='mapbox://styles/mapbox/streets-v10'
        >

        </ReactMapGL>
      </div>
    );
  }
}

export default Map;
