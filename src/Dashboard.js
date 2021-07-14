import "./App.css";
import ReactMapGL, { Marker } from "react-map-gl";
import { useState } from "react";
import covidIcon from "./Assets/covid.png";
import * as mockdata from "./mockdata/skateboard-parks.json";
function Dashboard() {
  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "94vh",
    latitude: 29.8953512,
    longitude: 31.26738,
    zoom: 8,
  });
  return (
    <ReactMapGL
      {...viewport}
      mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {mockdata.features.map((user) => (
        <Marker
          key={user.properties.PARK_ID}
          longitude={user.geometry.coordinates[0]}
          latitude={user.geometry.coordinates[1]}
        >
          <button className="marker-icon">
            <img src={covidIcon} alt="Infected" />
          </button>
        </Marker>
      ))}
    </ReactMapGL>
  );
}

export default Dashboard;
