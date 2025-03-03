import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './ImageSlider.css';
import displayImage from '../../assets/images/display.bmp'

const ImageSlider = () => {
  const images = [
    displayImage,
    'https://images.unsplash.com/photo-1564505676257-57af8f7e43ab?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://media.istockphoto.com/id/964582260/de/foto/nahaufnahme-andrographis-paniculata-pflanzenbl%C3%A4ttern-ayurveda-kr%C3%A4utermedizin.jpg?s=1024x1024&w=is&k=20&c=dKwXJlG2FV2jb-A6Qb2jCl-y6Qk5RO0SF6oI_s5Sb2A=',
    'https://images.unsplash.com/photo-1665479754958-1a8bdc47cc0d?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'https://static.wixstatic.com/media/bc3465_ffe924d1cb6c4c469ede2058df593198~mv2.jpeg/v1/fill/w_600,h_600,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/bc3465_ffe924d1cb6c4c469ede2058df593198~mv2.jpeg',
  ];

  const NextArrow = ({ onClick }) => {
    return (
      <div className="arrow next" onClick={onClick}>
        &#10095;
      </div>
    );
  };

  const PrevArrow = ({ onClick }) => {
    return (
      <div className="arrow prev" onClick={onClick}>
        &#10094;
      </div>
    );
  };


  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
    <div className="image-slider">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ImageSlider;
