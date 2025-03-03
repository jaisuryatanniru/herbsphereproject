import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import './PlantDetails.css';

const PlantDetails = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [isInOrders, setIsInOrders] = useState(false);  
  const [showPopup, setShowPopup] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [username, setUsername] = useState(''); 

  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/home');
  };

  
  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await axios.get(`https://herbsphereproject-3.onrender.com/api/plants/${id}`);
        setPlant(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plant details:', error);
        setLoading(false);
      }
    };

    const checkCartStatus = async () => {
      try {
        const response = await axios.post(
          'https://herbsphereproject-3.onrender.com/api/check-cart',
          { plantId: id },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setIsInCart(response.data.isInCart);
      } catch (error) {
        console.error('Error checking cart:', error);
      }
    };

    const checkOrdersStatus = async () => {
      try {
        const response = await axios.post(
          'https://herbsphereproject-3.onrender.com/api/check-orders',
          { plantId: id },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setIsInOrders(response.data.isInOrders);
      } catch (error) {
        console.error('Error checking orders:', error);
      }
    };

    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          'https://herbsphereproject-3.onrender.com/api/userinfo',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setUsername(response.data.name);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchPlantDetails();
    checkOrdersStatus();
    checkCartStatus();
    fetchUserInfo();
  }, [id]);

  
  const addToCart = () => {
    axios.post(
      'https://herbsphereproject-3.onrender.com/api/cart/add',
      { plantId: id },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    .then(response => {
      setIsInCart(true);
      setShowPopup(true);
    })
    .catch(error => {
      console.error('Error adding plant to cart:', error);
    });
  };

  
  const addToOrders = () => {
    axios.post(
      'https://herbsphereproject-3.onrender.com/api/orders/add',
      { plantId: id },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    .then(response => {
      setIsInOrders(true);
      setShowBuyModal(true);
    })
    .catch(error => {
      console.error('Error adding plant to orders:', error);
    });
  };

  
  const removeFromCart = () => {
    axios.post(
      'https://herbsphereproject-3.onrender.com/api/cart/remove',
      { plantId: id },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    )
    .then(response => {
      setIsInCart(false);
    })
    .catch(error => {
      console.error('Error removing plant from cart:', error);
    });
  };

  
  const handleGoToOrders = () => {
    setShowBuyModal(true);
    navigate('/orders');
  };

  
  const handleGoToCart = () => {
    setShowPopup(false);
    navigate('/cart');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!plant) {
    return <div>Plant not found</div>;
  }

  return (
    <div className="plant-details">
      <div className="header1">
        <div className="arrow1">
          <FaArrowLeft onClick={goToHome} size={24} />
        </div>
        <div>
          <h1>{plant.name}</h1>
        </div>
        <div></div>
      </div>

      <div className="image-slider">
        <img src={plant.new_url} alt={plant.name} className="new-image" />
      </div>

      <div className="plant-details-section">
        <div className="plant-details-section-left">
          <div style={{ position: "relative", width: "100%", height: "500px" }}>
            <iframe
              width="100%"
              height="400"
              src="https://sketchfab.com/models/c604e8f52c234f2e9259d895fe028819/embed"
              frameBorder="0"
              allowFullScreen
              title={plant.name}
              className="detail-video"
            />
            <div className="watermark-overlay"></div>
          </div>

          <div className="plant-details-section-left-bottom">
          {plant.images?.map((image, index) => (
    <div key={index}>
      <img src={image} alt={plant.name} />
    </div>
  ))}
            <div>
              <iframe 
                width="560" 
                height="315" 
                src={plant.video}
                title="YouTube video" 
                frameBorder="0" 
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
          </div>
        </div>

        <div className="plant-details-content">
          <p><strong>Scientific Name:</strong> {plant.scientific_name}</p>
          <p><strong>Medical Use:</strong> {plant.medical_use}</p>
          <p><strong>Availability:</strong> {plant.availability.join(', ')}</p>
          <p><strong>Category:</strong> {plant.category}</p>
          <h2>Method of Cultivation</h2>
          <div className="cultivation-info">
            <p><strong>Climate:</strong> {plant["Method of Cultivation"].Climate}</p>
            <p><strong>Soil:</strong> {plant["Method of Cultivation"].Soil}</p>
            <p><strong>Propagation:</strong> {plant["Method of Cultivation"].Propagation}</p>
          </div>
          <h2>Habitat</h2>
          <div className="habitat-info">
            <p><strong>Native Region:</strong> {plant['Habitat']['Native Region']}</p>
            <p><strong>Growth Regions:</strong> {plant['Habitat']['Growth Regions']}</p>
          </div>
          <div className="action-buttons">
            {isInCart ? (
              <button className="remove-button" onClick={removeFromCart}>Remove from Cart</button>
            ) : (
              <button className="add-button" onClick={addToCart}>Add to Cart</button>
            )}
            <button className="buy-now-button" onClick={addToOrders}>Buy Now</button>
          </div>

          {showPopup && (
            <div className="popup">
              <div className="popup-content">
                <p>Plant added to cart successfully!</p>
                <button onClick={handleGoToCart}>Go to Cart</button>
                <button onClick={() => setShowPopup(false)}>Close</button>
              </div>
            </div>
          )}

          {showBuyModal && (
            <div className="buy-modal">
              <div className="buy-modal-content">
                <h2>Confirm Purchase</h2>
                <p><strong>Username:</strong> {username}</p> 
                <p><strong>Plant Name:</strong> {plant.name}</p>
                <p><strong>Total Price:</strong> Rs:200</p>
                <button className='btn1' onClick={handleGoToOrders}>Buy Now</button>
                <button className='btn2' onClick={() => setShowBuyModal(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
