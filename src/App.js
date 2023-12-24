import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./components/Form";
import Main from "./Pages/Main";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Booked from "./components/Booked";
import FailurePayment from "./components/FailurePayment";

export const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/user/:id" element={<Form />}></Route>
        <Route path="/invitee/:time" element={<Booked />}></Route>
        <Route path="/failure" element={<FailurePayment />}></Route>
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
