import React, { useState,useEffect } from 'react';
import './Plantcard.css';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa'; 

const PlantCard = ({ plant }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/check-favorite', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ plantId: plant._id })
        });
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavorite();
  }, [plant._id]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/toggle-favorite', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plantId: plant._id })
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  return (
    <div className="card">
      <div className="card-img-wrapper">
        <img src={plant.image_url} alt={plant.name} className="plant-image" />
        <FaHeart
          className="heart-icon"
          style={{ fill: isFavorite ? 'red' : 'white' }}
          onClick={toggleFavorite}
        />
      </div>
      <div className="card-content">
        <h3 className="plant-name">
          {plant.name}
          <FaHeart
            className="heart-icon-inline"
            style={{ fill: isFavorite ? 'red' : 'white' } }
            onClick={toggleFavorite}
          />
        </h3>
        <p className="plant-medical-use">{plant.medical_use}</p>
      </div>
      <Link to={`/details/${plant._id}`} className="details-link">
        View Details
      </Link>
    </div>
  );
};

export default PlantCard;
