import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactMapGL, { Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import _ from 'lodash';
import moment from 'moment';
import request from 'superagent';

import Bus from './Bus';
import * as actions from '../actions';

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
    },
  };

  componentWillMount() {
    //fetching for the first time
    this.props.getBuses();
    this.props.getStatus();
  }

  componentDidMount() {
    //resolves map resizing bug; allows responsize map resizing when window changes
    window.addEventListener('resize', () => {
      this.setState({
        viewport: {
          ...this.state.viewport,
          width: window.innerWidth,
          height: window.innerHeight
          }
        });
    });

    const updateTime = this.props.status.updateTime;

    //fetching new bus locations on a interval
    const now = moment().unix();
    setInterval(() => this.props.updateBuses(updateTime ? updateTime : now), 8000);
  }


  componentWillUnmount() {
    //remove listener
    window.removeEventListener('resize', this.resize);
  }

  //handling panning the viewPort
  onRegionChangeComplete = (viewport) => {
    this.setState({ viewport });
  }

  //helper method for getting map boundary
  getMapBoundary = () => {
    //reference the mapGL instance
    const mapBounds = this.map.getMap().getBounds();

    //declare bounds
    const bounds = {
      north: mapBounds._ne.lat,
      south: mapBounds._sw.lat,
      west: mapBounds._sw.lng,
      east: mapBounds._ne.lng,
    };

    return bounds;
  }

  //helper method for checking if bus is within map boundary
  isWithInBounds = bus => {
    const { north, south, west, east } = this.getMapBoundary();
    return (
        bus.Latitude >= south &&
        bus.Latitude <= north &&
        bus.Longitude >= west &&
        bus.Longitude <= east
    );
  }

  //render buses...can be further refactored
  renderBus() {
    const { latitude, longitude } = this.state.viewport;

    //show loading msg if api call is incomplete
    if (_.isEmpty(this.props.buses)) {
      return (
        <Popup latitude={latitude} longitude={longitude - 0.015 }>
          <div className="errorMsg" style={{ color: '#0080ff', fontSize: 30 }}>Sorry, no buses yet... Loading...</div>
        </Popup>
      );
    }

    //error handing
    if (this.props.error) {
      console.log('the error was', this.props.error);
      return (
        <Popup latitude={latitude} longitude={longitude - 0.025 }>
          <div className="errorMsg" style={{ color: 'red', fontSize: 30 }}>Ops...something went wrong, try refresh the page</div>
        </Popup>
      );
    }

    //could use async instead of doing a prop check
    if (this.props.buses) {

      //filtering buses not within bounds
      const filteredBuses = _.filter(this.props.buses, this.isWithInBounds);

      return (
        _.map(filteredBuses, (bus, index) => {
          return (
            <Bus
              bus={bus}
              key={index}
            />
          );
        })
      )
    }
  };

  render() {
    return (
      <div className="Map-Container">
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={this.onRegionChangeComplete}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          ref={map => {this.map = map}}
          reuseMaps={true}
          mapStyle='mapbox://styles/mapbox/streets-v10'
        >
          {this.renderBus()}
        </ReactMapGL>

      </div>
    );
  }
}

function mapStateToProps({ buses }) {
  return { buses: buses.fetchResults, error: buses.error, status: buses.statusResults };
};

export default connect(mapStateToProps, actions)(Map);
