import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import PlantCard from '../../components/PlantCard/Plantcard';
import { useNavigate } from 'react-router-dom';
import './Category.css';

const Category = () => {
  const { categoryName } = useParams();
  const [plants, setPlants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/home');
  };

  useEffect(() => {
    fetch(`https://herbsphereproject-3.onrender.com/api/plants/category/${categoryName}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched Data:', data); 
        setPlants(data);
      })
      .catch(error => console.error('Error fetching plants:', error));
  }, [categoryName]);

  const handleSearchClick = () => {
    setSearchOpen(!searchOpen);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filterPlants = (plants) => {
    return plants.filter((plant) =>
      (plant.name?.toLowerCase() || "").includes(searchQuery) ||
      (plant.scientific_name?.toLowerCase() || "").includes(searchQuery) ||
      (plant.medical_use?.toLowerCase() || "").includes(searchQuery)
    );
  };

  return (
    <div className="category-container">
      <div className="header1">
        <div className="arrow1">
          <FaArrowLeft onClick={goToHome} size={24}  />
        </div>
        <div>
          <h1>{categoryName} Plants</h1>
        </div>
        <div className="search-container">
          <FaSearch size={24} onClick={handleSearchClick} />
          {searchOpen && (
            <input
              type="text"
              className="search_bar1"
              placeholder="Search plants..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          )}
        </div>
      </div>
      <div className="plant-list">
        {filterPlants(plants).length > 0 ? (
          filterPlants(plants).map((plant) => (
            <PlantCard key={plant._id} plant={plant} />
          ))
        ) : (
          <p>No plants found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default Category;
