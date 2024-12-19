import React, { useContext, useState, useEffect, useRef } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState('home');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredFoods, setFilteredFoods] = useState([]);
    const [searchActive, setSearchActive] = useState(false);
    const { food_list, token, setToken, getTotalCartAmount, addToCart, removeFromCart, cartItems } = useContext(StoreContext);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const searchInputRef = useRef(null);  // Added ref for search input field
    const navigate = useNavigate();
    const location = useLocation(); // Get the current 
    

    // Scroll to the top of the page on location change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    // Handle search filtering
    useEffect(() => {
        if (searchQuery.trim() !== "") {
            const filtered = food_list
                .filter((food) =>
                    food.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .sort((a, b) => {
                    const aIndex = a.name.toLowerCase().indexOf(searchQuery.toLowerCase());
                    const bIndex = b.name.toLowerCase().indexOf(searchQuery.toLowerCase());
                    return aIndex - bIndex;
                });
            setFilteredFoods(filtered);
        } else {
            setFilteredFoods([]);
        }
    }, [searchQuery, food_list]);

    // Handle logout
    const logout = () => {
        localStorage.removeItem('token'); // Clear token from storage
        setToken(''); // Clear token in context
        navigate('/'); // Navigate to the homepage
    
        // Optionally, force a page reload to re-render components correctly
        window.location.reload();
    };
    

    // Handle quantity in the cart
    const getQuantity = (foodId) => {
        return cartItems[foodId] || 0;
    };

    // Scroll to the top of the page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // Navigate to Orders page
    const goToOrders = () => {
        navigate('/myorders')
    };

    // Toggle profile dropdown visibility
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    // Close dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    // Toggle search input visibility
    const toggleSearch = () => {
        setSearchActive(!searchActive);
        if (!searchActive) setSearchQuery(''); // Clear query when activating
        if (!searchActive && searchInputRef.current) {
            searchInputRef.current.focus();  // Focus on input when search is activated
        }
    };

    // Check if the current path is the Cart page
    const isCartPage = location.pathname === '/cart';
    const isPlaceOrderPage = location.pathname === '/order';

    // Navigate to homepage and scroll to menu section
    const navigateToMenu = () => {
        navigate('/');
        document.getElementById('explore-menu');
    };

    const navigateToAppDl = () => {
        navigate('/');
        document.getElementById('app-download');
    };

    return (
        <div className='navbar'>
            <Link to='/' onClick={scrollToTop}><h1 src={assets.logo} alt="Logo" className='logo' >VegDelight</h1>
            </Link>
            <ul className='navbar-menu'>
                {!isCartPage && !isPlaceOrderPage && ( // Only render if not on Cart page
                    <>
                        <Link to="/" onClick={() => { setMenu("home"); scrollToTop(); }} className={menu === "home" ? "active" : ""}>Home</Link>
                        <a href="#explore-menu" onClick={() => { setMenu("menu"); navigateToMenu(); scrollToTop(); }} className={menu === "menu" ? "active" : ""}>Menu</a>
                        <a href="#app-download" onClick={() => { setMenu("mobile-app"); navigateToAppDl(); scrollToTop(); }} className={menu === "mobile-app" ? "active" : ""}>Mobile-App</a>
                        <a href="#footer" onClick={() => { setMenu("contact-us"); scrollToTop(); }} className={menu === "contact-us" ? "active" : ""}>Contact Us</a>
                    </>
                )}
            </ul>

            <div className="navbar-right">
                <div className={`navbar-search-container ${searchActive ? 'active' : ''}`}>
                    <input
                        ref={searchInputRef}  // Attach the ref to the input
                        type="text"
                        placeholder="Search food items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="navbar-search-input"
                    />
                    <img
                        src={assets.search_icon}
                        alt="Search"
                        className="navbar-search-icon"
                        onClick={toggleSearch} // Focus on input when clicked
                    />
                </div>

                <div className="navbar-icons">
                    <Link to='/cart' className="cart-icon-container">
                        <img src={assets.basket_icon} alt="Cart" className="cart-icon" />
                        {getTotalCartAmount() > 0 && <div className="dot"></div>}
                    </Link>
                    {!token
                        ? <button onClick={() => setShowLogin(true)}>Sign In</button>
                        : (
                            <div className="navbar-profile" ref={dropdownRef}>
                                <img
                                    src={assets.profile_icon}
                                    alt="Profile"
                                    onClick={toggleDropdown}
                                    className="profile-icon"
                                />
                                {showDropdown && (
                                    <ul className={`nav-profile-dropdown ${showDropdown ? 'show' : ''}`}>
                                        <li onClick={goToOrders}><img src={assets.bag_icon} alt="Orders" />Orders</li>
                                        <hr />
                                        <li onClick={logout}><img src={assets.logout_icon} alt="Logout" />Logout</li>
                                    </ul>
                                )}
                            </div>
                        )
                    }
                </div>
            </div>

            {searchQuery && (
                <div className="search-results-box" onClick={() => setSearchQuery('')}>
                    <div className="search-results" onClick={(e) => e.stopPropagation()}>
                        {filteredFoods.length > 0 ? (
                            filteredFoods.map((food) => (
                                <div className="food-item-card" key={food._id}>
                                    <img src={`http://localhost:4000/images/${food.image}`} alt={food.name} className="food-image" />
                                    <div className="food-details">
                                        <div className="food-name">{food.name}</div>
                                        <div className="food-add-remove">
                                            <img
                                                onClick={() => addToCart(food._id)}
                                                src={assets.add_icon_green}
                                                alt="Add to cart"
                                                style={{ cursor: 'pointer' }}  // Make it clear it's clickable
                                            />
                                            <span className="quantity">{getQuantity(food._id)}</span>
                                            <img
                                                onClick={() => removeFromCart(food._id)}
                                                src={assets.remove_icon_red}
                                                alt="Remove from cart"
                                                style={{ cursor: 'pointer' }}  // Make it clear it's clickable
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results">No food items found.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
