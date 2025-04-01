import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Duration } from 'luxon';

// Create the CartContext
const CartContext = createContext();

// CartProvider component to provide the context to children
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const [totalPrice, setTotalPrice] = useState(2);
  const [totalDurationMillis, setTotalDurationMillis] = useState(2);


  const buyCart = async () => {
    if (!cart || cart.length === 0) {
      console.log("Your cart is empty. Add some items before buying.");
      return;
    }
  
    console.log("Processing your purchase...");
  
    cart.forEach(item => {
      console.log(`Purchasing ${item.amount}x ${item.companyName} flight from ${item.fromName} to ${item.toName} for $${(item.amount * item.price).toFixed(2)}`);
    });
  
    console.log(`Total cost: $${totalPrice.toFixed(2)}`);
    console.log(`Total flight duration: ${Duration.fromMillis(totalDurationMillis).toFormat('hh:mm:ss')}`);
  
  
    // Clear the cart after purchase

    try {
      const response = await axios.post('http://localhost:5000/api/reservations', {
        totalPrice,
        totalDurationMillis,
      });
  
      console.log("Purchase successful!", response.data);
      setCart([]); // Clear the cart after purchase
    } catch (error) {
      console.error("Error during purchase:", error.response?.data || error.message);
    }
    setCart([]);
  };

  // Function to add an item to the cart
  const addToCart = (item) => {
    try {
      setCart((prevCart) => {
        // Check if item is valid
        if (!item || !item.offerId) {
          throw new Error('Invalid item or missing offerId');
        }
  
        // Check if an item with the same offerId already exists in the cart
        const existingItem = prevCart.find(cartItem => cartItem.offerId === item.offerId);
        if (existingItem) {
          // If it exists, increment the amount
          return prevCart.map(cartItem =>
            cartItem.offerId === item.offerId
              ? { ...cartItem, amount: cartItem.amount + 1 } // Increment the amount
              : cartItem
          );
        } else {
          // If it doesn't exist, create a new cart item
          const newCartItem = {
            offerId: item.offerId,
            companyName: item.companyName,
            fromName: item.fromName,
            toName: item.toName,
            price: item.price,
            flightDuration: item.flightDuration,
            amount: 1, // Initialize amount to 1
          };
  
          // Add the new cart item to the cart
          return [...prevCart, newCartItem];
        }

      });
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
      // Optionally show a user-friendly message (e.g., set an error state)
    }
  };

  // Function to remove an item from the cart
  const removeFromCart = (offerId) => {
    setCart((prevCart) =>
      prevCart.filter(item => item.offerId !== offerId)
    );
  };

  useEffect(() => {
    const newTotalPrice = cart.reduce((acc, item) => acc + item.amount * item.price, 0);
    const newTotalDurationMillis = cart.reduce((acc, item) => acc + item.amount * item.flightDuration, 0);

    setTotalPrice(newTotalPrice);
    setTotalDurationMillis(newTotalDurationMillis);
  }, [cart]); // Runs whenever the cart changes

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, buyCart, totalPrice, totalDurationMillis }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to access CartContext
export const useCart = () => {
  return useContext(CartContext);
};
