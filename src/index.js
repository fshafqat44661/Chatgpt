import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import { store } from "./store/store";
import MainRoutes from "./routes/MainRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Restored with simplified Redux store
root.render(
  <Provider store={store}>
    <MainRoutes />
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
    />
  </Provider>
);
