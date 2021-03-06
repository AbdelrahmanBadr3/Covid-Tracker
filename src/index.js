import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as config from "./config";
import store from "./store";

firebase.initializeApp(config.fbConfig);

let persistor = persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider
      firebase={firebase}
      config={config.rfConfig}
      dispatch={store.dispatch}
      createFirestoreInstance={createFirestoreInstance}
    >
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);
