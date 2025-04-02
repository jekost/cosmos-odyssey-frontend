import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the CartContext
const CartContext = createContext();


// CartProvider component to provide the context to children
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [totalPrice, setTotalPrice] = useState(2);
  const [totalDurationMillis, setTotalDurationMillis] = useState(2);


  const buyCart = async () => {


    setErrorMessage(''); // Clear previous errors
    if (!firstName.trim() || !lastName.trim()) {
        setErrorMessage("First Name and Last Name are required for booking.");
        return;
    }

    if (!cart || cart.length === 0) {
        console.log("Your cart is empty. Add some items before buying.");
        return;
    }

    console.log("Processing your purchase...");

    const bookings = cart.map(item => ({
        priceListId: item.priceListId,
        offerId: item.offerId,
        companyName: item.companyName,
        fromName: item.fromName,
        toName: item.toName,
        amount: item.amount
    }));

    try {


        const responseGetPricelists = await axios.get('http://localhost:5000/api/pricelists');
        
        // Sort manually by 'createdAt' in descending order
        const priceLists = responseGetPricelists.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        const oldestMatchingPriceListId = priceLists.find(priceList => 
            bookings.some(booking => booking.priceListId === priceList.id)
        )?.id;
      
        console.log("oldest matching id:",oldestMatchingPriceListId);


        const responsePostReservations = await axios.post('http://localhost:5000/api/reservations', {
            firstName: firstName, // Replace with dynamic user input
            lastName: lastName,  // Replace with dynamic user input
            totalPrice: totalPrice,
            totalDurationMillis: totalDurationMillis, // Convert ms to hours
            oldestPriceListId: oldestMatchingPriceListId,
            bookings
        });

        console.log("Purchase successful!", responsePostReservations.data);
        setFirstName('');
        setLastName('');
        setCart([]); // Clear the cart after purchase
    } catch (error) {
        console.error("Error during purchase:", error.responsePostReservations?.data || error.message);
    }
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
            priceListId: item.priceListId,
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

  const removeOne = (offerId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.offerId === offerId) {
            return item.amount > 1 ? { ...item, amount: item.amount - 1 } : null;
          }
          return item;
        })
        .filter((item) => item !== null)
    );
  };

  useEffect(() => {
    const newTotalPrice = cart.reduce((acc, item) => acc + item.amount * item.price, 0);
    const newTotalDurationMillis = cart.reduce((acc, item) => acc + item.amount * item.flightDuration, 0);

    setTotalPrice(newTotalPrice);
    setTotalDurationMillis(newTotalDurationMillis);
  }, [cart]); // Runs whenever the cart changes

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, removeOne, buyCart, totalPrice, totalDurationMillis, setFirstName, setLastName, errorMessage }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to access CartContext
export const useCart = () => {
  return useContext(CartContext);
};
