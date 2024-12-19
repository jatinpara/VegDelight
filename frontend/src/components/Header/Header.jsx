import React from 'react';
import './Header.css';

const Header = () => {
  const scrollToFoodDisplay = () => {
    const foodDisplaySection = document.getElementById('food-display');
    if (foodDisplaySection) {
      foodDisplaySection.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll
    }
  };

  return (
    <div className='header'>
      <div className="header-contents">
        <h2>Your Favorite Food, Delivered Fast!</h2>
        <p>
          Delicious, fresh, and flavorful meals delivered straight to your door. 
          From hearty bowls to light bites, satisfy every craving in just a click!
        </p>
        <button onClick={scrollToFoodDisplay}>View Menu</button>
      </div>
    </div>
  );
};

export default Header;
