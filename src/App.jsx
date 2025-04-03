import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Travel from './components/Travel';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';
import { TravelProvider } from './context/TravelContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
const env = await import.meta.env;
const url = (env.VITE_API_URL);

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
      axios
      .get(`${url}/api/travels/valid`)
      .then((response) => {
        setItems(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });


  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Header />
      <TravelProvider items={items}>
      <CartProvider>
          <Cart />
          <hr />
          <Travel/>
      </CartProvider>
      </TravelProvider>

    </div>
  );
};

export default App;
