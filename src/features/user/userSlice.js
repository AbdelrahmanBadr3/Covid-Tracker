import { createSlice } from "@reduxjs/toolkit";
import Geocode from "react-geocode";

Geocode.setApiKey(process.env.REACT_APP_GEOCODE_TOKEN);
Geocode.setLanguage(process.env.REACT_APP_GEOCODE_LANGUAGE);
Geocode.setLocationType(process.env.REACT_APP_GEOCODE_LOCATION_TYPE);

const userSlice = createSlice({
  name: "users",
  initialState: {
    usersData: [],
    isLoading: false,
    error: false,
    currentUser: null,
    currentUserLocation: {
      latitude: "",
      longitude: "",
      address: "",
    },
  },
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    hasError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    usersSuccess: (state, action) => {
      state.usersData = action.payload;
      state.isLoading = false;
    },
    // userSuccess: (state, action) => {
    //   state.currentUser = action.payload[0];
    //   state.isLoading = false;
    // },
    userLocationSuccess: (state, action) => {
      state.currentUserLocation = action.payload;
      state.isLoading = false;
    },
    createUserSuccess: (state, action) => {
      console.log(action.payload);
      state.currentUser = action.payload;
      state.isLoading = false;
    },
  },
});

const {
  usersSuccess,
  //   userSuccess,
  userLocationSuccess,
  createUserSuccess,
  startLoading,
  hasError,
} = userSlice.actions;

export const fetchUsers = () => async (dispatch) => {
  dispatch(startLoading());
};

export const createUser = (userData) => async (dispatch) => {
  dispatch(startLoading());
  dispatch(createUserSuccess(userData));
};
export const fetchUserLocation = () => async (dispatch) => {
  dispatch(startLoading());
  let latitude, longitude, address;
  navigator.geolocation.getCurrentPosition(function (position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    Geocode.fromLatLng(latitude, longitude).then(
      (response) => {
        let state, country;
        const addressComponents = response.results[0].address_components;
        for (let i = 0; i < addressComponents.length; i++) {
          const addressComponentsI = addressComponents[i];
          for (let j = 0; j < addressComponentsI.types.length; j++) {
            switch (response.results[0].address_components[i].types[j]) {
              case "administrative_area_level_1":
                state = response.results[0].address_components[i].long_name;
                break;
              case "country":
                country = response.results[0].address_components[i].long_name;
                break;
              default:
                break;
            }
          }
        }
        address = state + ", " + country;
        let location_ = {
          latitude,
          longitude,
          address,
        };
        console.log(location_);
        dispatch(userLocationSuccess(location_));
      },
      (error) => {
        console.error(error);
      }
    );
  });
};
// export const fetchUserByID = (id) => async (dispatch) => {
//   dispatch(startLoading());

//   //   try {
//   //     await api
//   //       .get("/categories/" + id)
//   //       .then((response) => dispatch(categorySuccess(response.data)));
//   //   } catch (e) {
//   //     dispatch(hasError(e.message));
//   //   }
// };
export default userSlice.reducer;
