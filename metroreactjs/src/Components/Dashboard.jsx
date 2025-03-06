import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [routes, setRoutes] = useState([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/routes/', {
            headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` },
        })
        .then(response => setRoutes(response.data))
        .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Available Routes</h1>
            <ul>
                {routes.map(route => (
                    <li key={route.id}>
                        {route.source.name} to {route.destination.name} - ${route.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;