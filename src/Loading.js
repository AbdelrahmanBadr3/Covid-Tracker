import "./Loading.css";
import logo from "./Assets/covid.png";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

function Loading() {
  const { isLocationAllowed } = useSelector((state) => state.users);
  const [loadingText, setLoadingText] = useState("Loading....");
  useEffect(() => {
    if (isLocationAllowed) {
      if (isLocationAllowed === "denied")
        setLoadingText(
          "Location is not allowed can you change it form the settings"
        );
      else if (isLocationAllowed === "granted") setLoadingText("Loading....");
      else setLoadingText("");
    }
  }, [isLocationAllowed]);
  return (
    <div>
      <div className="Load-container">
        <img src={logo} className="Load-logo" alt="logo" />
      </div>
      <div className="Load-text">{loadingText} </div>
    </div>
  );
}

export default Loading;
