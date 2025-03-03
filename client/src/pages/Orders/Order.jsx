import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import PlantCard from '../../components/PlantCard/Plantcard';

const Order = () => {
    const [OrderPlants, setOrderPlants] = useState([]);
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/home');
    };

    
    useEffect(() => {
        const fetchOrderPlants = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/orders', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setOrderPlants(data);
                } else {
                    console.error('Expected an array of plants in the cart.');
                }
            } catch (error) {
                console.error('Error fetching cart plants:', error);
            }
        };

        fetchOrderPlants();
    }, []);

    return (
        <div className="container">
            <div className="header1">
                <div className="arrow1">
                    <FaArrowLeft onClick={goToHome} size={24} />
                </div>
                <div>
                    <h1>Your Orders</h1>
                </div>
                <div></div>
            </div>

            {OrderPlants.length > 0 ? (
                <div className="plant-list">
                    {OrderPlants.map(plant => (
                        <PlantCard key={plant._id} plant={plant} />
                    ))}
                </div>
            ) : (
                <p>No plants found in cart.</p>
            )}
        </div>
    );
};

export default Order;
