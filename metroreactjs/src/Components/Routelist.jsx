import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Routes = () => {
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/routes/')
            .then(response => setRoutes(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div className="routes-container">
            <h1>Routes</h1>
            <ul className="routes-list">
                {routes.map(route => (
                    <li key={route.id} className="route-item">
                        <span className="route-source">{route.source.name}</span>
                        <span className="route-arrow">→</span>
                        <span className="route-destination">{route.destination.name}</span>
                        <span className="route-price">${route.price}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Routes;