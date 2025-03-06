import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Stations from './Components/Stations';
import Routelist from './Components/Routelist';
import Login from './Components/Login';
import Register from './Components/Register';
import Booking from './Components/Booking';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {

  return (
    <Router>
            <Routes>
                <Route path="/stations" element={<Stations />} />
                <Route path="/routes" element={<Routelist />} />
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Booking />} />
                <Route path="/register" element={<Register />} />
                
            </Routes>
        </Router>
  )
}

export default App
