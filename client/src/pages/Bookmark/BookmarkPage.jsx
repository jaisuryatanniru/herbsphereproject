import React, { useEffect, useState } from 'react';
import PlantCard from '../../components/PlantCard/Plantcard';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Bookmark.css'; // Ensure this CSS file is imported

const BookmarkPage = () => {
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    const goToHome = () => {
        navigate('/home');
    };

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/favorites', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await response.json();
                if (Array.isArray(data)) {
                    setFavorites(data);
                } else {
                    console.error('Expected an array of favorites.');
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            }
        };

        fetchFavorites();
    }, []);

    return (
        <div className="bookmark-container">
            <div className="header1">
                <div className="arrow1">
                    <FaArrowLeft onClick={goToHome} size={24} />
                </div>
                <h1>Your Favorite Plants</h1> {/* Ensure h1 is here */}
            </div>

            {favorites.length > 0 ? (
                <div className="plant-list">
                    {favorites.map(plant => (
                        <PlantCard key={plant._id} plant={plant} />
                    ))}
                </div>
            ) : (
                <p className="no-favorites">No favorites found.</p>
            )}
        </div>
    );
};

export default BookmarkPage;