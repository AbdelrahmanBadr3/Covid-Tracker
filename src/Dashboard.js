import "./App.css";
import ReactMapGL, { Marker } from "react-map-gl";
import { useState, useEffect } from "react";
import covidIcon from "./Assets/covid.png";
import safeIcon from "./Assets/safe.png";
import viewerIcon from "./Assets/viewer.png";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker"; // Load worker code separately with worker-loade
import mapboxgl from "mapbox-gl";
import Button from "react-bootstrap/Button";

mapboxgl.workerClass = MapboxWorker;
function DashboardFire() {
  useFirestoreConnect(["users"]);
  const { currentUserLocation, currentUser } = useSelector(
    (state) => state.users
  );
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
    const userIcons = {
      Negative: safeIcon,
      Postive: covidIcon,
      Viewer: viewerIcon,
    };
    let users_ = [];

    for (var key in users) {
      if (users.hasOwnProperty(key)) {
        let user = users[key];
        if (user.userState) {
          users_.push(
            <Marker
              key={key}
              longitude={user.longitude}
              latitude={user.latitude}
            >
              <button className="marker-icon">
                <img src={userIcons[user.userState.type]} alt="Safe" />
              </button>
            </Marker>
          );
        }
      }
    }
    if (
      currentUserLocation != null &&
      currentUserLocation.address &&
      currentUser.userState.type === "Viewer"
    ) {
      users_.push(
        <Marker
          key="current_user"
          longitude={currentUserLocation.longitude}
          latitude={currentUserLocation.latitude}
        >
          <button className="marker-icon">
            <img src={userIcons["Viewer"]} alt="Safe" />
          </button>
        </Marker>
      );
    }
    setUsersData(users_);
  }, [users, currentUserLocation, currentUser.userState.type]);
  const onClick = () => {
    if (currentUserLocation != null) {
      setViewport({
        width: "100vw",
        height: "94vh",
        latitude: currentUserLocation.latitude,
        longitude: currentUserLocation.longitude,
        zoom: 8,
      });
    }
  };
  return (
    <div>
      <ReactMapGL
        {...viewport}
        mapStyle={process.env.REACT_APP_MAPBOX_STYLE}
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
      >
        {usersData}
      </ReactMapGL>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 1030,
        }}
      >
        <Button onClick={onClick}>Center</Button>
      </div>
    </div>
  );
}

export default DashboardFire;
