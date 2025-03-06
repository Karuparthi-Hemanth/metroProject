import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Stations = () => {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/stations/')
            .then(response => setStations(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="stations-container">
            <h1>Stations</h1>
            <ul className="stations-list">
                {stations.map(station => (
                    <li key={station.id} className="station-item">
                        <span className="station-name">{station.name}</span>
                        <span className="station-code">{station.code}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Stations;