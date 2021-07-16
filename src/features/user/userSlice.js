import { createSlice } from "@reduxjs/toolkit";
import Geocode from "react-geocode";

Geocode.setApiKey(process.env.REACT_APP_GEOCODE_TOKEN);
Geocode.setLanguage(process.env.REACT_APP_GEOCODE_LANGUAGE);
Geocode.setLocationType(process.env.REACT_APP_GEOCODE_LOCATION_TYPE);
const defualtState = {
  isLoading: false,
  error: false,
  currentUser: {
    userState: {
      type: "Viewer",
      variant: "primary",
    },
  },
  currentUserLocation: {
    latitude: 50.8953512,
    longitude: 50.26738,
    address: "",
  },
};

const userSlice = createSlice({
  name: "users",
  initialState: {
    isLoading: false,
    error: false,
    currentUser: {
      userState: {
        type: "Viewer",
        variant: "primary",
      },
    },
    currentUserLocation: {
      latitude: 50.8953512,
      longitude: 50.26738,
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
    userLocationSuccess: (state, action) => {
      state.currentUserLocation = action.payload;
      state.isLoading = false;
    },
    createUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
    },
    rest: (state) => {
      state = defualtState;
      console.log(state);
      state.isLoading = false;
    },
  },
});

const { userLocationSuccess, createUserSuccess, startLoading, hasError, rest } =
  userSlice.actions;

export const restUser = () => async (dispatch) => {
  dispatch(startLoading());
  dispatch(rest());
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
        dispatch(userLocationSuccess(location_));
      },
      (error) => {
        console.error(error);
        dispatch(hasError(error.message));
      }
    );
  });
};

export default userSlice.reducer;
