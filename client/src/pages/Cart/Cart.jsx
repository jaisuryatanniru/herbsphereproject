import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import PlantCard from '../../components/PlantCard/Plantcard';

const Cart = () => {
    const [cartPlants, setCartPlants] = useState([]);
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/home');
    };

    
    useEffect(() => {
        const fetchCartPlants = async () => {
            try {
                const response = await fetch('https://herbsphereproject-3.onrender.com/api/cart', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setCartPlants(data);
                } else {
                    console.error('Expected an array of plants in the cart.');
                }
            } catch (error) {
                console.error('Error fetching cart plants:', error);
            }
        };

        fetchCartPlants();
    }, []);

    return (
        <div className="container">
            <div className="header1">
                <div className="arrow1">
                    <FaArrowLeft onClick={goToHome} size={24} />
                </div>
                <div>
                    <h1>Your Cart</h1>
                </div>
                <div></div>
            </div>

            {cartPlants.length > 0 ? (
                <div className="plant-list">
                    {cartPlants.map(plant => (
                        <PlantCard key={plant._id} plant={plant} />
                    ))}
                </div>
            ) : (
                <p>No plants found in cart.</p>
            )}
        </div>
    );
};

export default Cart;
