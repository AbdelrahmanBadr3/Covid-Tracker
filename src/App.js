import "./App.css";
import Nav from "react-bootstrap/Nav";
import Badge from "react-bootstrap/Badge";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserLocation } from "./features/user/userSlice";
import { useState, useEffect } from "react";
import Dashboard from "./Dashboard";
import UserForm from "./UserForm";
// TODO To add loading page uncommet the following lines
// import Loading from "./Loading";
function App() {
  const dispatch = useDispatch();
  const { currentUserLocation, currentUser } = useSelector(
    (state) => state.users
  );
  const [navValue, setNavValue] = useState(1);
  const [currentPage, setCurrentPage] = useState(<Dashboard />);
  // TODO To add loading page un commet the following lines                                               
//   const [loadedPage, setLoadedPage] = useState(<Loading />);

  useEffect(() => {
    dispatch(fetchUserLocation());
  }, [dispatch]);

  useEffect(() => {}, [
    currentPage,
    navValue,
    currentUserLocation,
    currentUser,
  ]);
// TODO To add loading page uncommet the following lines
//   useEffect(() => {
//     if (currentUserLocation != null && currentUserLocation.address!="") {
//       setLoadedPage(
//         <div>
//           <Nav
//             justify
//             fill
//             variant="tabs"
//             defaultActiveKey={navValue}
//             onSelect={onSelect}
//           >
//             <Nav.Item>
//               <Nav.Link eventKey={1}>Dashboard</Nav.Link>
//             </Nav.Item>
//             <Nav.Item>
//               <Nav.Link eventKey={2}>
//                 User Information{" "}
//                 <Badge variant={currentUser.userState.variant}>
//                   {currentUser.userState.type}
//                 </Badge>
//               </Nav.Link>
//             </Nav.Item>
//           </Nav>
//           {currentPage}
//         </div>
//       );
//     }
//   }, [
//     currentUserLocation,
//     currentPage,
//     currentUser.userState.type,
//     currentUser.userState.variant,
//     navValue,
//   ]);

  const onSelect = (key) => {
    if (key === "1") setCurrentPage(<Dashboard />);
    else setCurrentPage(<UserForm />);
    setNavValue(key);
  };

  return <div className="App">
    // TODO To add loading page uncommet the following lines
     {/*loadedPage*/}
    // TODO To add loading page commet the following lines
     <div>
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
                User Information{" "}
                <Badge variant={currentUser.userState.variant}>
                  {currentUser.userState.type}
                </Badge>
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {currentPage}
        </div>
  </div>;
}

export default App;
