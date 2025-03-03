import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaSearch, FaGreaterThan, FaCartArrowDown } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from "../../assets/images/logo.png";
import ListIcon from '@mui/icons-material/List';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import DuoIcon from '@mui/icons-material/Duo';

const Navbar = ({ onSearch }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileCardOpen, setProfileCardOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); // Track sidebar state
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://herbsphereproject-3.onrender.com/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  const toggleCategoryDropdown = () => {
    setDropdownOpen(prev => !prev);
  };

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
    setDropdownOpen(false);
  };

  const goToBookmarkPage = () => {
    navigate('/bookmark');
  };

  const goToCartPage = () => {
    navigate('/cart');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value); // Pass search query to Home.jsx
  };

  const toggleProfileCard = () => {
    setProfileCardOpen(prev => !prev);
    if (!profileCardOpen) {
      navigate("/profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <nav className="navbar">
      {/* Hamburger Icon */}
      <ListIcon className='navbar-icon hamburger-icon' fontSize='large' sx={{ fontSize: 40, color: 'white' }} onClick={toggleSidebar} />

      {/* Logo and Title */}
      <div className="web-title">
        <img src={logo} alt="Herbsphere Logo" className="navbar-logo" />
        <h2>Herbsphere</h2>
      </div>

      {/* Search Bar (Visible on all screens) */}
      <div className="search-wrapper">
        <input
          type="text"
          className="search_bar"
          placeholder="Search plants..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <FaSearch className="navbar-icon search-icon" size={24} />
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
        <ul className="sidebar-links">
          <li><a href="/home">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/orders">Your Orders</a></li>
          <li className="category-dropdown" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <a href="#">Category</a>
            {dropdownOpen && (
              <div className="category-menu">
                <ul>
                  {categories.map((category, index) => (
                    <li key={index} onClick={() => handleCategoryClick(category)}>
                      <a>{category} <FaGreaterThan size={8} fill="white" /></a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
          <li><a href="#" onClick={goToBookmarkPage}>Bookmark</a></li>
          <li><a href="#" onClick={goToCartPage}>Cart</a></li>
          <li><a href="#" onClick={toggleProfileCard}>Profile</a></li>
          <li><a href="#" onClick={handleLogout}>Logout</a></li>
          {/* Add Video Call, Quiz, Cart, and Profile to the sidebar */}
          <li>
            <a href="#" onClick={() => navigate('/VideoCall')}>
              <DuoIcon sx={{ fontSize: 24, color: 'white' }} /> Video Call
            </a>
          </li>
          <li>
            <a href="#" onClick={() => navigate('/quiz')}>
              <PsychologyAltIcon sx={{ fontSize: 24, color: 'white' }} /> Quiz
            </a>
          </li>
          <li>
            <a href="#" onClick={goToCartPage}>
              <FaCartArrowDown size={24} /> Cart
            </a>
          </li>
          <li>
            <a href="#" onClick={toggleProfileCard}>
              <FaUserCircle size={24} /> Profile
            </a>
          </li>
        </ul>
      </div>

      {/* Navbar Right Icons (Hidden on mobile) */}
      <div className="navbar-icons">
        <DuoIcon
          className="navbar-icon"
          sx={{ fontSize: 40, color: 'white' }}
          onClick={() => navigate('/VideoCall')}
        />

        <PsychologyAltIcon
          className="navbar-icon"
          sx={{ fontSize: 40, color: 'white' }}
          onClick={() => navigate('/quiz')} // Navigate to the quiz page
        />

        <FaCartArrowDown className="navbar-icon" size={28} onClick={goToCartPage} />
        <FaUserCircle className="navbar-icon" size={36} onClick={toggleProfileCard} />
      </div>
    </nav>
  );
};

export default Navbar;