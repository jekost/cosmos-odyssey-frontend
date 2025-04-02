import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Travel from './components/Travel'; // Importing the PriceList component
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [travelsValid, setTravelsValid] = useState([]);

  // Fetch data from the API when the component mounts
  useEffect(() => {
      axios
      .get('http://localhost:5000/api/travels/valid')
      .then((response) => {
        setTravelsValid(response.data);  // Set the fetched data into state
        setLoading(false);         // Set loading to false once data is fetched
      })
      .catch((error) => {
        setError(error.message);   // Set the error message if an error occurs
        setLoading(false);         // Set loading to false if there's an error
      });


  }, []); // Empty dependency array, this runs only once when the component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 style={{ textAlign: 'center'}}>Space Travel Listings</h1>
      <CartProvider>
        <Cart />
        <Travel items={travelsValid} />

      </CartProvider>
    </div>
  );
};

export default App;
