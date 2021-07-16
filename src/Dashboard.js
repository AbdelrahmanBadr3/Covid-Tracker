import "./App.css";
import ReactMapGL, { Marker } from "react-map-gl";
import { useState, useEffect } from "react";
import covidIcon from "./Assets/covid.png";
import safeIcon from "./Assets/safe.png";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"; // Load worker code separately with worker-loade
import mapboxgl from "mapbox-gl";

mapboxgl.workerClass = MapboxWorker;
function DashboardFire() {
  const { currentUserLocation } = useSelector((state) => state.users);
  useFirestoreConnect(["users"]);
  const { currentUserLocation } = useSelector((state) => state.users);

  const [viewport, setViewport] = useState({
    width: "100vw",
    height: "94vh",
    latitude: 50.8953512,
    longitude: 50.26738,
    zoom: 8,
  });
  useEffect(() => {

    if (currentUserLocation != null) {
      setViewport({
        width: "100vw",
        height: "94vh",
        latitude: currentUserLocation.latitude,
        longitude: currentUserLocation.longitude,
        zoom: 8,
      });
    }
  }, [currentUserLocation]);

  const users = useSelector((state) => state.firestore.data.users);
  const [usersData, setUsersData] = useState([]);
  useEffect(() => {
    let users_ = [];

    for (var key in users) {
      if (users.hasOwnProperty(key)) {
        let user = users[key];
        if (user.userState) {
          if (user.userState.type === "Negative") {
            users_.push(
              <Marker
                key={key}
                longitude={user.longitude}
                latitude={user.latitude}
              >
                <button className="marker-icon">
                  <img src={safeIcon} alt="Safe" />
                </button>
              </Marker>
            );
          } else {
            users_.push(
              <Marker
                key={key}
                longitude={user.longitude}
                latitude={user.latitude}
              >
                <button className="marker-icon">
                  <img src={covidIcon} alt="Infected" />
                </button>
              </Marker>
            );
          }
        } else {
          users_.push(
            <Marker
              key={key}
              longitude={user.longitude}
              latitude={user.latitude}
            >
              <button className="marker-icon">
                <img src={covidIcon} alt="Infected" />
              </button>
            </Marker>
          );
        }
      }
    }
    setUsersData(users_);
  }, [users]);
  return (
    <ReactMapGL
      {...viewport}
      mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
    >
      {usersData}
    </ReactMapGL>
  );
}

export default DashboardFire;
