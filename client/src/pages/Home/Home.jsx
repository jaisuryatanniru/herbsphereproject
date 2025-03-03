import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar/Navbar';
import PlantCard from '../../components/PlantCard/Plantcard';
import ImageSlider from '../../components/Slider/ImageSlider';
import Footer from '../../components/Footer/Footer';
import './Home.css';

function NewHome() {
  const [plantsByCategory, setPlantsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://herbsphereproject-3.onrender.com/api/plants')
      .then((response) => response.json())
      .then((data) => {
        const categorizedPlants = data.reduce((acc, plant) => {
          const { category } = plant;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(plant);
          return acc;
        }, {});

        setPlantsByCategory(categorizedPlants);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching plants:', error);
        setLoading(false);
      });

    // Load Jotform Bot script
    const script = document.createElement('script');
    script.src = 'https://cdn.jotfor.ms/s/umd/latest/for-embedded-agent.js';
    script.async = true;
    script.onload = () => {
      window.AgentInitializer?.init({
        agentRenderURL: 'https://agent.jotform.com/0195565108af7428bafdbc3afecf931f0239',
        rootId: 'JotformAgent-0195565108af7428bafdbc3afecf931f0239',
        formID: '0195565108af7428bafdbc3afecf931f0239',
        queryParams: ['skipWelcome=1', 'maximizable=1'],
        domain: 'https://www.jotform.com',
        isDraggable: false,
        background: 'linear-gradient(180deg, #6C73A8 0%, #6C73A8 100%)',
        buttonBackgroundColor: '#0066C3',
        buttonIconColor: '#FFFFFF',
        variant: false,
       
        
        customizations: {
          greeting: 'Yes',
          greetingMessage: 'Hi! How can I assist you?',
          openByDefault: 'No',
          pulse: 'Yes',
          position: 'right',
          autoOpenChatIn: '0',
        },
        isVoice: undefined,
      });
    };
    document.body.appendChild(script);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query.toLowerCase());
  };

  if (loading) {
    return <div>Loading plants...</div>;
  }

  return (
    <div>
      <Navbar onSearch={handleSearch} />
      <ImageSlider />

      <div className="set12">
        {Object.keys(plantsByCategory).map((category, index) => {
          const filteredPlants = plantsByCategory[category].filter(plant =>
            plant.name.toLowerCase().includes(searchQuery)
          );

          if (filteredPlants.length === 0) return null;

          return (
            <div key={index} className="category-section">
              <div className="category-header">
                <h2>{category}</h2>
              </div>
              <div className="plant-cards-row">
                {filteredPlants.slice(0, 4).map((plant, i) => (
                  <PlantCard key={i} plant={plant} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}

export default NewHome;