import "./App.css";
import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector, useDispatch } from "react-redux";
import { createUser } from "./features/user/userSlice";
import * as data from "./static-data/user-data.json";
import { useFirestore } from "react-redux-firebase";

function UserForm(props) {
  const [validated, setValidated] = useState(false);
  const [userName, setUserName] = useState("");
  const [temperature, setTemperature] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const dispatch = useDispatch();
  const { currentUserLocation } = useSelector((state) => state.users);
  // TODO: redundant data
  const [location, setLocation] = useState({
    latitude: "",
    longitude: "",
    address: "",
  });

  const firestore = useFirestore();
  const userData = data.userStates;

  // TODO: redundant data
  useEffect(() => {
    setLocation(currentUserLocation);
  }, [currentUserLocation]);

  const handleChange = (event) => {
    if (event.target.id === "formUserName") setUserName(event.target.value);
    if (event.target.id === "formUserTemperature")
      setTemperature(event.target.value);
    if (event.target.id === "formUserAge") setAge(event.target.value);
    if (event.target.id === "formUserGender") setGender(event.target.value);
  };
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      // return;
    }
    event.preventDefault();
    let userState = userData[0];
    if (temperature >= 35 && temperature <= 37.6) userState = userData[1];
    else if (temperature > 37.6 && temperature <= 42) userState = userData[2];
    let userInfoObject = {
      userName,
      temperature,
      age,
      gender,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
      userState,
    };
    setValidated(true);

    dispatch(createUser(userInfoObject));
    firestore
      .collection("users")
      .add(userInfoObject)
      .then(() => {
        event.target.submit();
      });
  };
  return (
    <div
      style={{
        minHeight: "93vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Card
        style={{
          flexGrow: "0.5",
        }}
        border="dark"
      >
        <Card.Header
          style={{
            backgroundColor: "#007bff",
            color: "#ffff",
          }}
        >
          User Information
        </Card.Header>
        <Card.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            style={{
              padding: "10px",
            }}
          >
            <Form.Group as={Row} controlId="formUserName">
              <Form.Label column>User Name</Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  placeholder="UserName"
                  value={userName}
                  onChange={handleChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formUserTemperature">
              <Form.Label column>Temperature</Form.Label>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Temperature in celsius"
                  value={temperature}
                  onChange={handleChange}
                  required
                  min="35.0"
                  max="42.0"
                />
                <Form.Text id="TemperatureHelpBlock" muted>
                  Normal body temperature can have a range, from 36.1°C to
                  37.5°C. A temperature (37.6°C or greater) is more likely to
                  have a fever(coronavirus). Valid range from 35°C to 42°C
                </Form.Text>
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formUserAge">
              <Form.Label column>Age</Form.Label>
              <Col>
                <Form.Control
                  type="number"
                  placeholder="Age"
                  value={age}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formUserGender">
              <Form.Label column>Gender</Form.Label>
              <Col>
                <Form.Control as="select" size="lg" onChange={handleChange}>
                  <option default>Select Your Gender</option>
                  <option value="None">Not Specified</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <Form.Group as={Row} controlId="formUserLocation">
              <Form.Label column>Location</Form.Label>
              <Col>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={location.address}
                />
              </Col>
            </Form.Group>
            <Button variant="primary" type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default UserForm;
