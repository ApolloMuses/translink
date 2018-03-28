//handles individual of bus with custom marker
import React from "react";
import { Marker } from "react-map-gl";
import _ from 'lodash';
import FaBus from 'react-icons/lib/fa/bus';

//TODO: convert into class component and add in animations

//for night buses
const typeCheck = (RouteNo) => {
  if (RouteNo.startsWith('N')) return RouteNo;

  return _.parseInt(RouteNo).toString();
}

const Bus = ({ bus }) => (
  <Marker latitude={bus.Latitude} longitude={bus.Longitude}>

    <div className="busNumber" style={styles.titleStyle}>{typeCheck(bus.RouteNo)}</div>
    <FaBus size={10} style={styles.iconStyle} />

  </Marker>
);

const styles = {
  titleStyle: {
    color: '#0080ff',
    fontSize: 8,
    textAlign: 'center',
    marginBottom: -6,
  },

  iconStyle: {
    color: '#0080ff',
  }
}

export default Bus;
