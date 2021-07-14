import "./App.css";
import Nav from "react-bootstrap/Nav";
import Badge from "react-bootstrap/Badge";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserLocation } from "./features/user/userSlice";
import { useState, useEffect } from "react";

import Dashboard from "./Dashboard";
import UserForm from "./UserForm";
function App() {
  const dispatch = useDispatch();
  const { currentUserLocation } = useSelector((state) => state.users);

  const [navValue, setNavValue] = useState(1);
  const [currentPage, setCurrentPage] = useState(<Dashboard />);
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
    address: "",
  });
  const [user, setUser] = useState({
    type: "Viewer",
    variant: "primary",
  });

  useEffect(() => {
    dispatch(fetchUserLocation());
  }, [dispatch]);

  useEffect(() => {}, [currentPage, navValue]);
  useEffect(() => {
    if (currentUserLocation != null) setLocation(currentUserLocation);
  }, [currentUserLocation]);

  const onSelect = (key) => {
    if (key === "1") setCurrentPage(<Dashboard />);
    else setCurrentPage(<UserForm setUserInfo={setUser} />);
    setNavValue(key);
  };

  return (
    <div className="App">
      <Nav
        justify
        fill
        variant="tabs"
        defaultActiveKey={navValue}
        onSelect={onSelect}
      >
        <Nav.Item>
          <Nav.Link eventKey={1}>Dashboard</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey={2}>
            User Information <Badge variant={user.variant}>{user.type}</Badge>
          </Nav.Link>
        </Nav.Item>
      </Nav>
      {currentPage}
    </div>
  );
}

export default App;
