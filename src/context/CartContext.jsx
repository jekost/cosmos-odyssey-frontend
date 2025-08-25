import { createContext, useState, useContext, useEffect } from 'react';;
const CartContext = createContext();

export const CartProvider = ({ children}) => {
  const [cart, setCart] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalPrice, setTotalPrice] = useState(2);
  const [totalDurationMillis, setTotalDurationMillis] = useState(2);


  const addToCart = (item) => {
    try {
      setCart((prevCart) => {
        if (!item || !item.offerId) {
          throw new Error('Invalid item or missing offerId');
        }
  
        // check if an item with the same offerId already exists in the cart
        const existingItem = prevCart.find(cartItem => cartItem.offerId === item.offerId);
        if (existingItem) {
          return prevCart.map(cartItem =>
            cartItem.offerId === item.offerId
              ? { ...cartItem, amount: cartItem.amount + 1 }
              : cartItem
          );
        } else {
          // if it doesnt exist, create a new cart item
          const newCartItem = {
            offerId: item.offerId,
            priceListId: item.priceListId,
            company: item.company,
            planetFrom: item.planetFrom,
            planetTo: item.planetTo,
            price: item.price,
            flightDuration: item.flightDuration,
            amount: 1,
          };
          return [...prevCart, newCartItem];
        }

      });
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
    }
  };

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


  //on cart change compute new totalPrice and totalDuration of flights
  useEffect(() => {
    const newTotalPrice = cart.reduce((acc, item) => acc + item.amount * item.price, 0);
    const newTotalDurationMillis = cart.reduce((acc, item) => acc + item.amount * item.flightDuration, 0);

    setTotalPrice(newTotalPrice);
    setTotalDurationMillis(newTotalDurationMillis);
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, removeOne, totalPrice, totalDurationMillis, errorMessage, setErrorMessage }}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => {
  return useContext(CartContext);
};
