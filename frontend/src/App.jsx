import React, { useState, useContext } from 'react';
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from "./components/Footer/Footer";
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders';
import { StoreContext } from './context/StoreContext';  // Assuming StoreContext is set up for food items
import FoodItem from './components/FoodItem/FoodItem';
import AppDownload from './components/AppDownload/AppDownload';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);     // Control for showing the login popup
  const [searchQuery, setSearchQuery] = useState('');    // State for the search query
  const { food_list } = useContext(StoreContext);        // Food list from context

  // Filter food items based on search query
  const filteredFoods = food_list.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}   {/* Show login popup conditionally */}

      <div className='app'>
        {/* Navbar remains fixed */}
        <Navbar setShowLogin={setShowLogin} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {/* If user is searching, show filtered results, otherwise show normal routes */}
        {searchQuery ? (
          <div className="search-page">
            {filteredFoods.length > 0 ? (
              <div className="search-results">
                {filteredFoods.map((food) => (
                  <FoodItem
                    key={food._id}
                    id={food._id}
                    name={food.name}
                    description={food.description}
                    price={food.price}
                    image={food.image}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No food items found for "{searchQuery}".</p>
              </div>
            )}
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/myorders" element={<MyOrders />} />
  

          </Routes>
        )}
      </div>

      <Footer />
    </>
  );
};

export default App;
