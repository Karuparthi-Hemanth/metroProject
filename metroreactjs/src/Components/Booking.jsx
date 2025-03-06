import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Booking.css';
import Button from 'react-bootstrap/Button';
const Booking = () => {
    const [stations, setStations] = useState([]); 
    const [startStation, setStartStation] = useState(''); 
    const [endStation, setEndStation] = useState(''); 
    const [ticketCost, setTicketCost] = useState(null); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(''); 
    const navigate = useNavigate();

    // Fetch all stations on component mount
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/stations/')
            .then(response => setStations(response.data))
            .catch(error => console.error(error));
    }, []);

    // Handle ticket cost calculation
    const calculateTicketCost = () => {
        if (!startStation || !endStation) {
            setError('Please select both start and end stations.');
            return;
        }

        setLoading(true);
        setError('');

        axios.get(`http://127.0.0.1:8000/api/calculate-ticket-cost/?start=${startStation}&end=${endStation}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
            .then(response => {
                setTicketCost(response.data.total_cost);
                setLoading(false);
            })
            .catch(error => {
                setError('Failed to calculate ticket cost. Please try again.');
                setLoading(false);
            });
    };

    // Handle ticket booking
    const handleBookTicket = () => {
        if (!ticketCost) {
            setError('Please calculate the ticket cost first.');
            return;
        }

        // Send  request to book the ticket
        axios.post('http://127.0.0.1:8000/api/tickets/', {
            start_station: startStation,
            end_station: endStation,
            cost: ticketCost,
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
        })
            .then(response => {
                alert('Ticket booked successfully!');
                navigate('/dashboard'); // Redirect to dashboard 
            })
            .catch(error => {
                setError('Failed to book ticket. Please try again.');
            });
    };

    return (
        <div className='bookingpage'>
            <div className="booking-container">
            <h1 className='head1'>Book a Ticket</h1>
            {error && <p className="error-message">{error}</p>}

            <div className="station-selectors">
                <label className='stationlabel'>
                    Boarding Point:
                    <select className='stationselect' value={startStation} onChange={(e) => setStartStation(e.target.value)}>
                        <option value="">Select a station</option>
                        {stations.map(station => (
                            station.id!=endStation &&
                            <option key={station.id} value={station.id}>
                                {station.name} 
                            </option>
                        ))}
                    </select>
                </label>

                <label className='stationlabel'>
                    Destination :
                    <select className='stationselect' value={endStation} onChange={(e) => setEndStation(e.target.value)}>
                        <option value="">Select a station</option>
                        {stations.map(station => (
                            station.id!=startStation &&
                            <option key={station.id} value={station.id}>
                                {station.name} 
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <button onClick={calculateTicketCost} disabled={loading}>
                {loading ? 'Calculating...' : 'Calculate Ticket Cost'}
            </button>

            {ticketCost !== null && (
                <div className="ticket-details">
                    <h2>Ticket Details</h2>
                    <p>Start Station: {stations.find(s => s.id === parseInt(startStation))?.name}</p>
                    <p>End Station: {stations.find(s => s.id === parseInt(endStation))?.name}</p>
                    <p>Total Cost: Rs {ticketCost}</p>
                    <button onClick={handleBookTicket}>Book Ticket</button>
                </div>
            )}
            
        </div>
        <img src="metromap.png" height={'600px'} alt="" />

        </div>
        
        

    );
};

export default Booking;