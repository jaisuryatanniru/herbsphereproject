import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PlantCard from '../PlantCard/Plantcard';

const PlantList = () => {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/plants')
      .then(response => {
        setPlants(response.data);
      })
      .catch(error => {
        console.error('Error fetching plants:', error);
      });
  }, []);

  return (
    <div className="plant-list">
      {plants.map(plant => (
        <PlantCard key={plant._id} plant={plant} />
      ))}
    </div>
  );
};

export default PlantList;
