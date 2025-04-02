import MainLayout from './layout/MainLayout';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>
      {/* <ToastContainer /> */}
    </>
  );
}

export default App;
